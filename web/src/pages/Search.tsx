import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, Filter, SlidersHorizontal, Sparkles, TrendingUp, Star } from 'lucide-react';
import MediaCard from '../components/media/MediaCard';
import { useEntryContext } from '../context/EntryContext';
import { WatchStatus } from '../types';

const Search: React.FC = () => {
  const { entries } = useEntryContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [activeType, setActiveType] = useState<'all' | 'movie' | 'tv'>('all');
  const [activeStatus, setActiveStatus] = useState<WatchStatus | 'all'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'newest'>('relevance');

  const filteredResults = useMemo(() => {
    let results = entries;

    // 1. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(entry =>
        entry.title.toLowerCase().includes(query)
      );
    }

    // 2. Type Filter
    if (activeType !== 'all') {
      results = results.filter(entry => entry.type === activeType);
    }

    // 3. Status Filter
    if (activeStatus !== 'all') {
      results = results.filter(entry => entry.status === activeStatus);
    }

    // 4. Rating Filter
    if (minRating > 0) {
      results = results.filter(entry => entry.rating >= minRating);
    }

    // 5. Sorting
    return results.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0; // Relevance (default) - usually relies on search match score, but here just keeps order
    });
  }, [entries, searchQuery, activeType, activeStatus, minRating, sortBy]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container-custom py-8 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <SearchIcon className="h-6 w-6 text-secondary-400" />
            <h1 className="text-5xl font-bold text-gradient-secondary">
              Discover Movies & TV Shows
            </h1>
            <Sparkles className="h-6 w-6 text-accent-400 animate-pulse" />
          </div>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Search and explore your personal collection
          </p>
        </div>

        {/* Search Section */}
        <div className="card p-6 mb-8">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your collection..."
                  className="input w-full pl-12"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-neutral-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`btn ${showFilters ? 'btn-secondary' : 'btn-ghost'}`}
                  onClick={toggleFilters}
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="glass-light p-6 rounded-xl mb-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Type Filter */}
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary-400" />
                    Type
                  </h3>
                  <div className="flex gap-2">
                    <button
                      className={`btn btn-sm ${activeType === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setActiveType('all')}
                    >
                      All
                    </button>
                    <button
                      className={`btn btn-sm ${activeType === 'movie' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setActiveType('movie')}
                    >
                      Movies
                    </button>
                    <button
                      className={`btn btn-sm ${activeType === 'tv' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setActiveType('tv')}
                    >
                      TV
                    </button>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Status</h3>
                  <select
                    value={activeStatus}
                    onChange={(e) => setActiveStatus(e.target.value as WatchStatus | 'all')}
                    className="input w-full"
                  >
                    <option value="all">All Statuses</option>
                    {Object.values(WatchStatus).map((status) => (
                      <option key={status} value={status} className="bg-neutral-900">
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Min Rating: {minRating}
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-semibold text-white mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="input w-full"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <SearchIcon className="h-6 w-6 text-primary-400" />
              Results
              <span className="text-sm font-normal text-neutral-400">({filteredResults.length} found)</span>
            </h2>

            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredResults.map((result) => (
                  <MediaCard key={result.id} media={result} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-400 text-lg">No results found.</p>
                <p className="text-neutral-500 text-sm mt-2">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>

        {/* Trending Sections (Static for now, could be dynamic later) */}
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-accent-400" />
              <span className="text-gradient-accent">Top Rated in Collection</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {entries
                .filter(e => e.rating >= 4.5)
                .slice(0, 4)
                .map((entry) => (
                  <MediaCard key={entry.id} media={entry} />
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Search;