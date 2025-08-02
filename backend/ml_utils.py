import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import pickle
import json
from typing import List, Dict, Any, Tuple
import logging

logger = logging.getLogger(__name__)

class AdvancedMusicRecommender:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=2000,
            stop_words='english',
            ngram_range=(1, 3)
        )
        self.scaler = StandardScaler()
        self.pca = PCA(n_components=50)
        self.kmeans = KMeans(n_clusters=8, random_state=42)
        self.song_features_matrix = None
        self.song_ids = []
        
    def extract_audio_features(self, songs: List[Dict]) -> np.ndarray:
        """Extract audio features from songs"""
        features = []
        
        for song in songs:
            song_features = []
            
            # Basic features
            song_features.extend([
                song.get('popularity', 50) / 100.0,  # Normalize popularity
                song.get('duration', 180000) / 300000.0,  # Normalize duration (5 min max)
            ])
            
            # Audio features (if available)
            if 'features' in song and song['features']:
                audio_features = song['features']
                song_features.extend([
                    audio_features.get('danceability', 0.5),
                    audio_features.get('energy', 0.5),
                    audio_features.get('valence', 0.5),
                    audio_features.get('acousticness', 0.5),
                    audio_features.get('instrumentalness', 0.5),
                    audio_features.get('tempo', 120) / 200.0,  # Normalize tempo
                ])
            else:
                # Default values for songs without audio features
                song_features.extend([0.5, 0.5, 0.5, 0.5, 0.5, 0.6])
            
            features.append(song_features)
        
        return np.array(features)
    
    def extract_text_features(self, songs: List[Dict]) -> np.ndarray:
        """Extract text features from song titles, artists, and genres"""
        texts = []
        
        for song in songs:
            text_parts = [
                song.get('title', ''),
                song.get('artist', ''),
                song.get('album', '')
            ]
            
            # Add genres if available
            if 'features' in song and song['features'] and 'genres' in song['features']:
                text_parts.extend(song['features']['genres'])
            
            texts.append(' '.join(text_parts))
        
        return self.tfidf_vectorizer.fit_transform(texts).toarray()
    
    def create_hybrid_features(self, songs: List[Dict]) -> np.ndarray:
        """Create hybrid features combining audio and text features"""
        audio_features = self.extract_audio_features(songs)
        text_features = self.extract_text_features(songs)
        
        # Combine features
        hybrid_features = np.hstack([audio_features, text_features])
        
        # Normalize features
        hybrid_features = self.scaler.fit_transform(hybrid_features)
        
        # Apply PCA for dimensionality reduction
        hybrid_features = self.pca.fit_transform(hybrid_features)
        
        return hybrid_features
    
    def collaborative_filtering(self, user_songs: List[Dict], all_songs: List[Dict]) -> List[Dict]:
        """Collaborative filtering based on user preferences"""
        if not user_songs:
            return []
        
        # Create user profile
        user_profile = self.create_user_profile(user_songs)
        
        # Calculate similarity scores
        similarities = []
        for song in all_songs:
            score = self.calculate_similarity(user_profile, song)
            similarities.append((score, song))
        
        # Sort by similarity and return top songs
        similarities.sort(key=lambda x: x[0], reverse=True)
        return [song for score, song in similarities[:20]]
    
    def content_based_filtering(self, user_songs: List[Dict], all_songs: List[Dict]) -> List[Dict]:
        """Content-based filtering based on song features"""
        if not user_songs:
            return []
        
        # Extract features for all songs
        all_features = self.create_hybrid_features(all_songs)
        user_features = self.create_hybrid_features(user_songs)
        
        # Calculate average user profile
        user_profile = np.mean(user_features, axis=0)
        
        # Calculate similarities
        similarities = cosine_similarity([user_profile], all_features)[0]
        
        # Get top similar songs
        top_indices = np.argsort(similarities)[::-1][:20]
        return [all_songs[i] for i in top_indices]
    
    def create_user_profile(self, user_songs: List[Dict]) -> Dict[str, Any]:
        """Create comprehensive user profile"""
        if not user_songs:
            return {}
        
        # Extract features
        features = self.create_hybrid_features(user_songs)
        
        # Cluster analysis
        if len(features) > 1:
            clusters = self.kmeans.fit_predict(features)
            dominant_cluster = np.bincount(clusters).argmax()
        else:
            dominant_cluster = 0
        
        # Analyze preferences
        genres = []
        artists = []
        sources = []
        popularities = []
        durations = []
        
        for song in user_songs:
            artists.append(song.get('artist', ''))
            sources.append(song.get('source', 'youtube'))
            popularities.append(song.get('popularity', 50))
            durations.append(song.get('duration', 180000))
            
            if 'features' in song and song['features'] and 'genres' in song['features']:
                genres.extend(song['features']['genres'])
        
        # Calculate preferences
        genre_preferences = pd.Series(genres).value_counts().to_dict()
        artist_preferences = pd.Series(artists).value_counts().to_dict()
        source_preferences = pd.Series(sources).value_counts().to_dict()
        
        return {
            'dominant_cluster': int(dominant_cluster),
            'genre_preferences': genre_preferences,
            'artist_preferences': artist_preferences,
            'source_preferences': source_preferences,
            'total_liked': len(user_songs),
            'avg_popularity': np.mean(popularities),
            'avg_duration': np.mean(durations),
            'feature_vector': np.mean(features, axis=0).tolist()
        }
    
    def calculate_similarity(self, user_profile: Dict[str, Any], song: Dict) -> float:
        """Calculate similarity between user profile and song"""
        score = 0.0
        
        # Genre matching
        if 'features' in song and song['features'] and 'genres' in song['features']:
            for genre in song['features']['genres']:
                score += user_profile.get('genre_preferences', {}).get(genre, 0) * 2
        
        # Artist matching
        score += user_profile.get('artist_preferences', {}).get(song.get('artist', ''), 0) * 3
        
        # Source preference
        score += user_profile.get('source_preferences', {}).get(song.get('source', 'youtube'), 0)
        
        # Popularity matching
        song_popularity = song.get('popularity', 50)
        avg_popularity = user_profile.get('avg_popularity', 50)
        popularity_diff = abs(song_popularity - avg_popularity)
        score += max(0, 100 - popularity_diff)
        
        # Duration matching
        song_duration = song.get('duration', 180000)
        avg_duration = user_profile.get('avg_duration', 180000)
        duration_diff = abs(song_duration - avg_duration)
        score += max(0, 100 - duration_diff / 1000)  # Convert to seconds
        
        # Feature vector similarity (if available)
        if 'feature_vector' in user_profile:
            song_features = self.create_hybrid_features([song])
            if len(song_features) > 0:
                feature_similarity = cosine_similarity(
                    [user_profile['feature_vector']], 
                    song_features
                )[0][0]
                score += feature_similarity * 100
        
        return score
    
    def hybrid_recommendation(self, user_songs: List[Dict], all_songs: List[Dict], 
                            collaborative_weight: float = 0.6) -> List[Dict]:
        """Hybrid recommendation combining collaborative and content-based filtering"""
        if not user_songs:
            return []
        
        # Get recommendations from both methods
        collaborative_recs = self.collaborative_filtering(user_songs, all_songs)
        content_recs = self.content_based_filtering(user_songs, all_songs)
        
        # Combine recommendations with weights
        combined_scores = {}
        
        # Add collaborative filtering scores
        for i, song in enumerate(collaborative_recs):
            song_id = song.get('id', '')
            combined_scores[song_id] = (20 - i) * collaborative_weight
        
        # Add content-based filtering scores
        for i, song in enumerate(content_recs):
            song_id = song.get('id', '')
            if song_id in combined_scores:
                combined_scores[song_id] += (20 - i) * (1 - collaborative_weight)
            else:
                combined_scores[song_id] = (20 - i) * (1 - collaborative_weight)
        
        # Create song lookup
        song_lookup = {song.get('id', ''): song for song in all_songs}
        
        # Sort by combined scores
        sorted_songs = sorted(
            combined_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Return top recommendations
        recommended_songs = []
        for song_id, score in sorted_songs[:20]:
            if song_id in song_lookup:
                song = song_lookup[song_id]
                song['recommendation_score'] = score
                recommended_songs.append(song)
        
        return recommended_songs
    
    def get_diverse_recommendations(self, user_songs: List[Dict], all_songs: List[Dict], 
                                  num_recommendations: int = 20) -> List[Dict]:
        """Get diverse recommendations using clustering"""
        if not user_songs:
            return []
        
        # Create hybrid features for all songs
        all_features = self.create_hybrid_features(all_songs)
        
        # Cluster all songs
        clusters = self.kmeans.fit_predict(all_features)
        
        # Get user's preferred clusters
        user_features = self.create_hybrid_features(user_songs)
        user_clusters = self.kmeans.predict(user_features)
        preferred_clusters = np.bincount(user_clusters).argsort()[::-1]
        
        # Select diverse recommendations
        recommendations = []
        songs_per_cluster = max(1, num_recommendations // len(preferred_clusters))
        
        for cluster_id in preferred_clusters:
            cluster_songs = [all_songs[i] for i in range(len(all_songs)) if clusters[i] == cluster_id]
            
            # Sort cluster songs by similarity to user profile
            user_profile = self.create_user_profile(user_songs)
            cluster_scores = [(self.calculate_similarity(user_profile, song), song) for song in cluster_songs]
            cluster_scores.sort(key=lambda x: x[0], reverse=True)
            
            # Add top songs from this cluster
            recommendations.extend([song for score, song in cluster_scores[:songs_per_cluster]])
            
            if len(recommendations) >= num_recommendations:
                break
        
        return recommendations[:num_recommendations]

class ModelManager:
    def __init__(self, model_path: str = "./ml_models"):
        self.model_path = model_path
        self.models = {}
    
    def save_model(self, model_name: str, model_data: Dict[str, Any]):
        """Save a model to disk"""
        import os
        os.makedirs(self.model_path, exist_ok=True)
        
        file_path = os.path.join(self.model_path, f"{model_name}.pkl")
        with open(file_path, 'wb') as f:
            pickle.dump(model_data, f)
        
        logger.info(f"Model {model_name} saved to {file_path}")
    
    def load_model(self, model_name: str) -> Dict[str, Any]:
        """Load a model from disk"""
        import os
        file_path = os.path.join(self.model_path, f"{model_name}.pkl")
        
        if os.path.exists(file_path):
            with open(file_path, 'rb') as f:
                model_data = pickle.load(f)
            logger.info(f"Model {model_name} loaded from {file_path}")
            return model_data
        else:
            logger.warning(f"Model {model_name} not found at {file_path}")
            return {}
    
    def update_model(self, model_name: str, model_data: Dict[str, Any]):
        """Update an existing model"""
        self.save_model(model_name, model_data)
        logger.info(f"Model {model_name} updated")

# Initialize global recommender
recommender = AdvancedMusicRecommender()
model_manager = ModelManager() 