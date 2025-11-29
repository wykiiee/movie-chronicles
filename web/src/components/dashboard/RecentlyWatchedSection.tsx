import React from 'react';
import { Link } from 'react-router-dom';
import { Rewind as ClockRewind, ArrowRight } from 'lucide-react';
import { useEntryContext } from '../../context/EntryContext';
import MediaCard from '../media/MediaCard';

const RecentlyWatchedSection: React.FC = () => {
  const { recentlyWatched } = useEntryContext();

  if (recentlyWatched.length === 0) {
    return null;
  }

  return (
    <section className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ClockRewind className="h-6 w-6 text-accent-400" />
          Recently Watched
        </h2>
        <Link to="/history" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentlyWatched.map((entry) => (
          <MediaCard key={entry.id} media={entry} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyWatchedSection;