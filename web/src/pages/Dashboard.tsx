import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useEntryContext } from '../context/EntryContext';
import Modal from '../components/ui/Modal';
import AddEntryForm from '../components/dashboard/AddEntryForm';
import HeroCarousel from '../components/home/HeroCarousel';
import HorizontalScrollSection from '../components/home/HorizontalScrollSection';
import { WatchStatus } from '../types';

const Dashboard: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { entries } = useEntryContext();

  // Filter entries for different sections
  const trendingEntries = entries
    .filter(entry => entry.rating >= 4)
    .slice(0, 10);

  const recentlyAddedEntries = entries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const topRatedEntries = entries
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  const continueWatchingEntries = entries
    .filter(entry => entry.status === WatchStatus.WATCHING)
    .slice(0, 10);

  const movieEntries = entries
    .filter(entry => entry.type === 'movie')
    .slice(0, 10);

  const tvShowEntries = entries
    .filter(entry => entry.type === 'tv')
    .slice(0, 10);

  return (
    <div className="min-h-screen pb-12">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-neutral-400">
            Discover and track your favorite movies and TV shows
          </p>
        </div>
        <button
          className="btn btn-primary gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Add Entry</span>
        </button>
      </div>

      {/* Hero Carousel */}
      <div className="mb-12">
        <HeroCarousel />
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {continueWatchingEntries.length > 0 && (
          <HorizontalScrollSection
            title="Continue Watching ▶️"
            entries={continueWatchingEntries}
            showMoreLink="/watchlist"
          />
        )}

        <HorizontalScrollSection
          title="Trending Now 🔥"
          entries={trendingEntries}
          showMoreLink="/search"
        />

        <HorizontalScrollSection
          title="Recently Added"
          entries={recentlyAddedEntries}
        />

        <HorizontalScrollSection
          title="Top Rated ⭐"
          entries={topRatedEntries}
        />

        {movieEntries.length > 0 && (
          <HorizontalScrollSection
            title="Movies"
            entries={movieEntries}
            showMoreLink="/movies"
          />
        )}

        {tvShowEntries.length > 0 && (
          <HorizontalScrollSection
            title="TV Shows"
            entries={tvShowEntries}
            showMoreLink="/tv-shows"
          />
        )}
      </div>

      {/* Add Entry Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Entry"
      >
        <AddEntryForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;