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

- **Your Personal Mixtape 💾**
  Every song you swipe right on is saved to your "Liked Songs" list. When you're done, you can easily download your new mixtape as a simple text file, ready to be added to your favorite streaming service.

---

## Tech Stack

TuneSwipe is a modern, full-stack web application built with a powerful and fast tech stack, combining a sleek frontend with an intelligent backend.

### Frontend
- **Framework**: **[Next.js](https://nextjs.org/)** (React) for a fast, server-rendered user experience.
- **Language**: **[TypeScript](https://www.typescriptlang.org/)** for robust, type-safe code.
- **Styling**: **[Tailwind CSS](https://tailwindcss.com/)** for a utility-first styling workflow.
- **UI Components**: **[ShadCN UI](https://ui.shadcn.com/)** for a beautiful, accessible, and modern component library.

### Backend & Services
- **Primary API**: **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** to handle initial song fetching and server-side logic.
- **AI Recommendations**: A **[Python](https://www.python.org/)** microservice built with **[FastAPI](https://fastapi.tiangolo.com/)** that takes a user's liked songs and returns personalized recommendations.
- **Music Data Source**: **[YouTube Data API](https://developers.google.com/youtube/v3)** to source an endless stream of individual music videos for swiping.

- <img width="1397" height="897" alt="image" src="https://github.com/user-attachments/assets/0671b80d-2462-4597-8ee0-5a7b1671d129" />

changes in TuneTrace 2.0

<img width="1474" height="839" alt="image" src="https://github.com/user-attachments/assets/154675ab-0a0e-40e8-9d10-3951022e6ad3" />

<img  width="1397" height="897" alt="image" src="https://raw.githubusercontent.com/Agrannya-Singh/TuneTrace/refs/heads/Version-2/diagram-export-7-30-2025-9_05_36-PM.png">

<img src="https://raw.githubusercontent.com/Agrannya-Singh/Tune_Trace_backend/f233e2b00fbcf72475e853e0dbe2db9b8e49e48b/mermaid.svg" width="1397" height="897">


---

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



 
---

## Contact

Have questions or want to connect? Feel free to reach out!

- **Email**: singh.agrannya@gmail.com
