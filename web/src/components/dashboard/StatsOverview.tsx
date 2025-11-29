import React from 'react';
import { BarChart3, Clock, Film, Tv, Star, TrendingUp } from 'lucide-react';
import { mockGetUserStats } from '../../utils/mockData';

const StatsOverview: React.FC = () => {
  const stats = mockGetUserStats();

  // Calculate hours and minutes from total minutes
  const hours = Math.floor(stats.totalWatchTime / 60);
  const minutes = stats.totalWatchTime % 60;

  // Format time string
  const timeString = `${hours}h ${minutes}m`;

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary-400" />
          Your Stats
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-light p-4 rounded-xl">
          <div className="flex items-center text-neutral-400 mb-2">
            <Clock className="h-4 w-4 mr-2 text-secondary-400" />
            <span className="text-xs font-medium">Watch Time</span>
          </div>
          <p className="text-2xl font-bold text-white">{timeString}</p>
        </div>

        <div className="glass-light p-4 rounded-xl">
          <div className="flex items-center text-neutral-400 mb-2">
            <Star className="h-4 w-4 mr-2 text-accent-400" />
            <span className="text-xs font-medium">Avg Rating</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.averageRating.toFixed(1)}/5</p>
        </div>

        <div className="glass-light p-4 rounded-xl">
          <div className="flex items-center text-neutral-400 mb-2">
            <Film className="h-4 w-4 mr-2 text-primary-400" />
            <span className="text-xs font-medium">Movies</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.moviesWatched}</p>
        </div>

        <div className="glass-light p-4 rounded-xl">
          <div className="flex items-center text-neutral-400 mb-2">
            <Tv className="h-4 w-4 mr-2 text-secondary-400" />
            <span className="text-xs font-medium">Episodes</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.episodesWatched}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent-400" />
          Favorite Genres
        </h3>
        <div className="space-y-3">
          {stats.favoriteGenres.map((genre, index) => (
            <div key={genre.genre} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">{genre.genre}</span>
                <span className="text-neutral-400">{genre.count}</span>
              </div>
              <div className="w-full bg-neutral-800/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${index === 0 ? 'bg-gradient-to-r from-primary-500 to-primary-600' :
                      index === 1 ? 'bg-gradient-to-r from-secondary-500 to-secondary-600' :
                        'bg-gradient-to-r from-accent-500 to-accent-600'
                    }`}
                  style={{ width: `${(genre.count / stats.favoriteGenres[0].count) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Weekly Activity</h3>
        <div className="flex items-end h-20 gap-2">
          {stats.weeklyActivity.map((week, index) => {
            const maxMinutes = Math.max(...stats.weeklyActivity.map(w => w.minutes));
            const height = (week.minutes / maxMinutes) * 100;

            return (
              <div
                key={week.week}
                className="flex-1 bg-gradient-to-t from-secondary-600 to-secondary-500 rounded-t group relative transition-all duration-300 hover:from-secondary-500 hover:to-secondary-400"
                style={{ height: `${height}%`, minHeight: '8px' }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 glass-light text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mb-2 whitespace-nowrap">
                  {week.minutes} min
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex text-xs text-neutral-500 mt-2 justify-between">
          <span>Week 1</span>
          <span>Week 4</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;