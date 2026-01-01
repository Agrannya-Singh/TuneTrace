'use client';

import { useTuneSwipe } from '@/hooks/useTuneSwipe';
import { MoodSelection } from '@/components/tuneswipe/MoodSelection';
import { SwipeDeck } from '@/components/tuneswipe/SwipeDeck';
import { SwipeControls } from '@/components/tuneswipe/SwipeControls';
import { LoadingView, ErrorView, OutOfCardsView } from '@/components/tuneswipe/StatusViews';

export default function TuneSwipeClient() {
  const {
    appState,
    songs,
    childRefs,
    currentIndex,
    selectedGenres,
    selectedMoods,
    likedSongsHistory,
    isFetchingRecommendations,
    handlers: {
      handleCheckboxChange,
      handleFindSongs,
      handleRestart,
      fetchLikedSongs,
      swiped,
      outOfFrame,
      swipe,
    },
    flags: {
      canSwipe
    }
  } = useTuneSwipe();

  const renderContent = () => {
    switch (appState) {
      case 'moodSelection':
        return (
          <MoodSelection
            selectedGenres={selectedGenres}
            selectedMoods={selectedMoods}
            onCheckboxChange={handleCheckboxChange}
            onSubmit={handleFindSongs}
          />
        );
      case 'loading':
        return <LoadingView />;
      case 'ready':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <SwipeDeck
              songs={songs}
              childRefs={childRefs}
              currentIndex={currentIndex}
              onSwipe={swiped}
              onCardLeftScreen={outOfFrame}
            />
            <SwipeControls
              canSwipe={!!canSwipe}
              onSwipeLeft={() => swipe('left')}
              onSwipeRight={() => swipe('right')}
              onRestart={handleRestart}
              isFetchingRecommendations={isFetchingRecommendations}
              likedSongsHistory={likedSongsHistory}
              fetchLikedSongs={fetchLikedSongs}
            />
          </div>
        );
      case 'outOfCards':
        return <OutOfCardsView onRestart={handleRestart} />;
      case 'error':
        return <ErrorView onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-neutral-950 text-white relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="absolute top-4 right-4 z-50">

        </div>
        {renderContent()}
      </div>
    </main>
  );
}
