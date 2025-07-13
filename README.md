# TuneTrace 🎶

Tired of the same old playlists on repeat? Wish you could discover new music that perfectly matches your vibe, right now? 

**Welcome to TuneSwipe.**

## Discover Your Next Obsession, One Swipe at a Time

TuneSwipe is a fresh, interactive way to find your next favorite song. We've thrown out the boring algorithms and put you in control. Using a fun, Tinder-style swiping interface, you become the DJ of your own discovery journey.



## Features That Rock

- **Vibe Check! ✅**
  Tell us what you're feeling. Whether you need "Chill" "Indie" tracks for a study session or "Energetic" "Rap" for a workout, select your mood and genre, and we'll curate a list of potential bangers just for you.

- **Swipe, Listen, Repeat 🎧**
  Dive into a stack of song cards, each featuring album art and artist info.
  - **SWIPE RIGHT** to like a song and add it to your personal collection.
  - **SWIPE LEFT** to skip and move on to the next discovery.

- **Instant Previews, Powered by YouTube ▶️**
  Hear something you like? Just click on the card to get an instant preview directly from YouTube. No more guessing—know if it's a hit before you commit.

- **Your Personal Mixtape 💾**
  Every song you swipe right on is saved to your "Liked Songs" list. When you're done, you can easily download your new mixtape as a simple text file, ready to be added to your favorite streaming service.

## How It's Built

TuneSwipe is a modern web application built with a powerful and fast tech stack:

- **[Next.js](https://nextjs.org/)** - For a lightning-fast and smooth React frontend.
- **[Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)** - For a beautiful, responsive, and modern design.
- **[YouTube Data API](https://developers.google.com/youtube/v3)** - To source an endless stream of individual music videos.
- **[Genkit by Firebase](https://firebase.google.com/docs/genkit)** - Powering the AI for future smart recommendations.

## How to Get Started

Ready to run your own TuneSwipe locally? It's easy!

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Agrannya-Singh/TuneTrace
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment:**
    Create a `.env` file in the root of the project and add your YouTube API Key:
    ```
    YOUTUBE_API_KEY=your_super_secret_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) in your browser and start swiping!
