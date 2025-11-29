import React from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, Film, Tv, Clock, ArrowRight } from 'lucide-react';
import { useEntryContext } from '../../context/EntryContext';

const WatchlistSection: React.FC = () => {
  const { watchlist } = useEntryContext();

  if (watchlist.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-primary-400" />
          Your Watchlist
        </h2>
        <div className="text-center py-8 text-neutral-400">
          <ListChecks className="h-16 w-16 text-neutral-700 mx-auto mb-4" />
          <p className="text-lg">Your watchlist is empty</p>
          <p className="text-sm mt-2 text-neutral-500">Add movies and TV shows you plan to watch</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-primary-400" />
          Watchlist
        </h2>
        <Link to="/watchlist" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {watchlist.slice(0, 5).map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 glass-light rounded-xl hover:bg-white/10 transition-all duration-200 group">
            <img
              src={item.poster}
              alt={item.title}
              className="w-14 h-20 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <Link
                to={item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                className="font-semibold text-white hover:text-gradient-primary transition-all duration-200 line-clamp-2 block"
              >
                {item.title}
              </Link>
              <div className="flex items-center text-xs text-neutral-400 mt-1.5 gap-3">
                <span className="flex items-center gap-1">
                  {item.type === 'movie' ? (
                    <Film className="h-3.5 w-3.5 text-primary-400" />
                  ) : (
                    <Tv className="h-3.5 w-3.5 text-secondary-400" />
                  )}
                  {item.type === 'movie' ? 'Movie' : 'TV Show'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistSection;