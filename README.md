# TuneSwipe 🎶

## Discover Your Next Obsession, One Swipe at a Time

Tired of the same old playlists on repeat? Wish you could discover new music that perfectly matches your vibe, right now? **Welcome to TuneSwipe.**

TuneSwipe is a fresh, interactive way to find your next favorite song. We've thrown out the boring algorithms and put you in control. Using a fun, Tinder-style swiping interface, you become the DJ of your own discovery journey.

---

## Features That Rock

- **Vibe Check! ✅**
  Tell us what you're feeling. Whether you need "Chill" "Indie" tracks for a study session or "Energetic" "Rap" for a workout, select your mood and genre, and we'll curate a list of potential bangers just for you.

- **AI-Powered Recommendations 🧠**
  As you like songs, our AI-powered Python backend learns your taste and suggests new tracks that you're likely to love, keeping the discoveries fresh and relevant.

- **Swipe, Listen, Repeat 🎧**
  Dive into a stack of song cards, each featuring album art and artist info.
  - **SWIPE RIGHT** to like a song and add it to your personal collection.
  - **SWIPE LEFT** to skip and move on to the next discovery.

- **Instant Previews, Powered by YouTube ▶️**
  Hear something you like? Just click on the card to get an instant preview directly from YouTube. No more guessing—know if it's a hit before you commit.

- **Spotify Integration 🎵**
  Connect your Spotify account to unlock powerful features:
  - Search and discover tracks directly from Spotify's vast library
  - Create Spotify playlists with your liked songs
  - Get personalized recommendations from Spotify's algorithm
  - Choose between YouTube Music and Spotify as your music source

- **Your Personal Mixtape 💾**
  Every song you swipe right on is saved to your "Liked Songs" list. When you're done, you can easily download your new mixtape as a simple text file or create a Spotify playlist, ready to be added to your favorite streaming service.

---

## Tech Stack

TuneSwipe is a modern, full-stack web application built with a powerful and fast tech stack, combining a sleek frontend with an intelligent backend.

### Frontend
- **Framework**: **[Next.js](https://nextjs.org/)** (React) for a fast, server-rendered user experience.
- **Language**: **[TypeScript](https://www.typescriptlang.org/)** for robust, type-safe code.
- **Styling**: **[Tailwind CSS](https://tailwindcss.com/)** for a utility-first styling workflow.
- **UI Components**: **[ShadCN UI](https://ui.shadcn.com/)** for a beautiful, accessible, and modern component library.

### Backend & Services
- **Frontend API**: **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** for Spotify authentication and playlist management.
- **ML Recommendation Engine**: **[Python FastAPI](https://fastapi.tiangolo.com/)** backend with advanced ML algorithms:
  - **Collaborative Filtering**: User-based similarity recommendations
  - **Content-Based Filtering**: Audio feature analysis
  - **Hybrid Recommendations**: Combined ML approaches
  - **Real-time Learning**: Models improve with user interactions
- **Music Data Sources**: 
  - **[YouTube Data API](https://developers.google.com/youtube/v3)** for music videos
  - **[Spotify Web API](https://developer.spotify.com/documentation/web-api)** for audio features and playlists
- **Database**: SQLite with SQLAlchemy ORM for user data and ML model storage

- <img width="1397" height="897" alt="image" src="https://github.com/user-attachments/assets/0671b80d-2462-4597-8ee0-5a7b1671d129" />

changes in TuneTrace 2.0

<img width="1474" height="839" alt="image" src="https://github.com/user-attachments/assets/154675ab-0a0e-40e8-9d10-3951022e6ad3" />

<img  width="1397" height="897" alt="image" src="https://raw.githubusercontent.com/Agrannya-Singh/TuneTrace/refs/heads/Version-2/diagram-export-7-30-2025-9_05_36-PM.png">





---

## How to Get Started

Ready to run your own TuneSwipe locally? It's easy!

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Agrannya-Singh/TuneTrace
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment:**
    Create a `.env.local` file in the root of the project and add your API keys:
    ```
    # YouTube API Configuration
    YOUTUBE_API_KEY=your_super_secret_api_key_here
    
    # Spotify API Configuration (optional)
    SPOTIFY_CLIENT_ID=your_spotify_client_id_here
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
    SPOTIFY_REDIRECT_URI=http://localhost:9002/api/spotify/callback
    
    # App Configuration
    NEXT_PUBLIC_APP_URL=http://localhost:9002
    NEXT_PUBLIC_PYTHON_BACKEND_URL=http://localhost:8000
    ```
    
    **Note**: For Spotify integration, you'll need to create a Spotify app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard). See [SPOTIFY_SETUP.md](./SPOTIFY_SETUP.md) for detailed setup instructions.

4.  **Install dependencies and start the development servers:**
    
    **Frontend (Next.js):**
    ```bash
    npm install
    npm run dev
    ```
    
    **Backend (Python FastAPI):**
    ```bash
    cd backend
    pip install -r requirements.txt
    python start.py
    ```
    
    The frontend will run on `http://localhost:9002` and the Python backend on `http://localhost:8000`.
    
    Open [http://localhost:9002](http://localhost:9002) in your browser and start swiping!

### Docker Development

For a containerized development environment:

```bash
# Build and run both services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

### Production Deployment

For production deployment on Render or other platforms, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy Options:**
- **Render**: Follow the deployment guide in [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Docker**: Use the provided Dockerfiles for containerized deployment
- **Vercel**: Deploy the frontend to Vercel and backend separately

---

## Contributing

We welcome contributions to TuneSwipe! If you have an idea for a new feature, a bug fix, or an improvement, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or fix (`git checkout -b feature/your-feature-name`).
3.  **Make your changes** and commit them with clear, descriptive messages.
4.  **Push your branch** to your forked repository.
5.  **Open a pull request** to the main repository, detailing the changes you've made.

---

## Reporting Bugs

If you encounter a bug, please help us by reporting it!

- **Search existing issues** to see if someone has already reported the bug.
- If not, **open a new issue**, providing a clear title and a detailed description of the problem. Include steps to reproduce the bug, what you expected to happen, and what actually happened.

---



This project showcases my ability to architect and build a full-stack application from the ground up, integrating multiple external APIs and leveraging AI to create a dynamic and personalized user experience. 
---

## Contact

Have questions or want to connect? Feel free to reach out!

- **Email**: singh.agrannya@gmail.com
