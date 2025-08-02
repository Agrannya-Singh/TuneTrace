'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Music, Search, Plus, ExternalLink, Loader2 } from 'lucide-react';
import type { Song } from '@/lib/spotify';

interface SpotifyIntegrationProps {
  likedSongs: Song[];
  onPlaylistCreated?: () => void;
}

export function SpotifyIntegration({ likedSongs, onPlaylistCreated }: SpotifyIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState('TuneTrace Favorites');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  // Check if user is connected to Spotify
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/spotify/auth');
        if (response.ok) {
          // Check if we have access token in cookies
          const hasToken = document.cookie.includes('spotify_access_token');
          setIsConnected(hasToken);
        }
      } catch (error) {
        console.error('Error checking Spotify connection:', error);
      }
    };

    checkConnection();
  }, []);

  const connectSpotify = async () => {
    try {
      const response = await fetch('/api/spotify/auth');
      if (response.ok) {
        const { authUrl } = await response.json();
        window.location.href = authUrl;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Spotify. Please try again.",
        variant: "destructive",
      });
    }
  };

  const searchSpotifyTracks = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}&limit=20`);
      if (response.ok) {
        const tracks = await response.json();
        setSearchResults(tracks);
      } else {
        toast({
          title: "Error",
          description: "Failed to search Spotify tracks.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search Spotify tracks.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const createPlaylist = async () => {
    if (!playlistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a playlist name.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingPlaylist(true);
    try {
      // Filter liked songs that have Spotify URIs
      const spotifySongs = likedSongs.filter(song => song.spotifyUri);
      const trackUris = spotifySongs.map(song => song.spotifyUri!);

      if (trackUris.length === 0) {
        toast({
          title: "No Spotify tracks",
          description: "You need to like some Spotify tracks first to create a playlist.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/spotify/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName,
          description: 'Created with TuneTrace',
          trackUris,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success!",
          description: "Playlist created successfully on Spotify!",
        });
        setShowCreateDialog(false);
        onPlaylistCreated?.();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create playlist.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create playlist.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Spotify Integration
          </CardTitle>
          <CardDescription>
            Connect your Spotify account to search tracks and create playlists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Connect your Spotify account to unlock additional features
              </p>
              <Button onClick={connectSpotify} className="w-full">
                <Music className="h-4 w-4 mr-2" />
                Connect Spotify Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected to Spotify</span>
              </div>

              {/* Search Section */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Spotify Tracks</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="Search for songs, artists, or albums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchSpotifyTracks()}
                  />
                  <Button 
                    onClick={searchSpotifyTracks} 
                    disabled={isSearching || !searchQuery.trim()}
                    size="sm"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Search Results</Label>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {searchResults.map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50"
                        >
                          <img
                            src={track.albumArtUrl}
                            alt={track.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{track.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {track.artist}
                            </p>
                            {track.album && (
                              <p className="text-xs text-muted-foreground truncate">
                                {track.album}
                              </p>
                            )}
                          </div>
                          {track.duration && (
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(track.duration)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Create Playlist Section */}
              {likedSongs.length > 0 && (
                <div className="space-y-2">
                  <Label>Create Spotify Playlist</Label>
                  <p className="text-sm text-muted-foreground">
                    Create a playlist with your {likedSongs.length} liked songs
                  </p>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Spotify Playlist
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Spotify Playlist</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="playlist-name">Playlist Name</Label>
                          <Input
                            id="playlist-name"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            placeholder="Enter playlist name"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          This will create a playlist with {likedSongs.filter(s => s.spotifyUri).length} Spotify tracks
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={createPlaylist}
                            disabled={isCreatingPlaylist}
                            className="flex-1"
                          >
                            {isCreatingPlaylist ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Plus className="h-4 w-4 mr-2" />
                            )}
                            Create Playlist
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                            disabled={isCreatingPlaylist}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 