import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Star, MessageSquare, Heart, Plus, CheckCircle, Edit, ArrowLeft, Play } from 'lucide-react';
import { useEntryContext } from '../context/EntryContext';
import { MediaEntry, WatchStatus } from '../types';
import AddReviewModal from '../components/media/AddReviewModal';
import RatingStars from '../components/ui/RatingStars';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, updateEntry } = useEntryContext();
  const [movie, setMovie] = useState<MediaEntry | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (id) {
      const foundMovie = entries.find(e => e.id === id && e.type === 'movie');
      setMovie(foundMovie || null);
    }
  }, [id, entries]);

  const toggleFavorite = () => {
    if (movie) {
      updateEntry(movie.id, { favorite: !movie.favorite });
    }
  };

  if (!movie) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Movie not found</h2>
          <p className="text-neutral-400 mt-2">The movie you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary mt-4">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isInWatchlist = movie.status === WatchStatus.PLANNING;

  return (
    <>
      {/* Hero section with backdrop */}
      <div
        className="relative h-[60vh] bg-center bg-cover"
        style={{
          backgroundImage: `url(${movie.backdrop || movie.poster})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-neutral-950/60 to-neutral-950"></div>

        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
          <button onClick={() => navigate(-1)} className="btn btn-ghost p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white">
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="container-custom h-full flex items-end relative z-10">
          <div className="pb-8 md:pb-12 flex flex-col md:flex-row items-start md:items-end gap-8 w-full">
            <div className="relative group shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-40 md:w-64 rounded-xl shadow-2xl border border-white/10 object-cover"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm md:text-base text-neutral-300 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-400" />
                  <span>{new Date(movie.createdAt).getFullYear()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent-400 fill-current" />
                  <span className="font-semibold text-white">{movie.rating.toFixed(1)}</span>
                  <span className="text-neutral-500">/ 5</span>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${movie.status === WatchStatus.COMPLETED ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    movie.status === WatchStatus.WATCHING ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      'bg-neutral-700/50 text-neutral-300 border-neutral-600/50'
                  }`}>
                  {movie.status}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className={`btn ${isInWatchlist ? 'btn-secondary' : 'btn-primary'} gap-2`}
                  onClick={() => updateEntry(movie.id, { status: WatchStatus.PLANNING })}
                  disabled={isInWatchlist}
                >
                  {isInWatchlist ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add to Watchlist
                    </>
                  )}
                </button>

                <button
                  className={`btn ${movie.favorite ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'btn-outline'} gap-2`}
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${movie.favorite ? 'fill-current' : ''}`} />
                  {movie.favorite ? 'Favorited' : 'Favorite'}
                </button>

                <button className="btn btn-ghost gap-2">
                  <Play className="h-5 w-5" />
                  Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Review Section */}
            <section className="card p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary-400" />
                  Your Review
                </h2>
                {movie.review && (
                  <button
                    className="btn btn-sm btn-ghost gap-2"
                    onClick={() => setShowReviewModal(true)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Review
                  </button>
                )}
              </div>

              {movie.review ? (
                <div className="glass-light rounded-xl p-6 relative">
                  <div className="absolute -top-3 -left-2 text-6xl text-primary-500/20 font-serif leading-none">"</div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <RatingStars rating={movie.rating} readonly />
                      <span className="text-neutral-400 text-sm ml-2">Rated on {new Date().toLocaleDateString()}</span>
                    </div>
                    <p className="text-lg text-neutral-200 leading-relaxed italic">{movie.review}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 glass-light rounded-xl border-dashed border-2 border-neutral-700">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-600" />
                  <h3 className="text-lg font-medium text-white mb-2">No review yet</h3>
                  <p className="text-neutral-400 mb-6 max-w-md mx-auto">Share your thoughts on this movie with your future self.</p>
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Write a Review
                  </button>
                </div>
              )}
            </section>

            {/* Details Placeholder */}
            <section className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <p className="text-neutral-400 leading-relaxed">
                Additional details like cast, director, and overview are not available for this entry. In a real application, this section would contain the movie plot, cast members, and production details fetched from an external API.
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Watch Status</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">Current Status</label>
                  <select
                    value={movie.status}
                    onChange={(e) => updateEntry(movie.id, { status: e.target.value as WatchStatus })}
                    className="input w-full bg-neutral-900/50"
                  >
                    {Object.values(WatchStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-neutral-400 block mb-2">Date Watched</label>
                  <input
                    type="date"
                    value={movie.dateWatched || ''}
                    onChange={(e) => updateEntry(movie.id, { dateWatched: e.target.value })}
                    className="input w-full bg-neutral-900/50"
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-400">Original Title</span>
                  <span className="text-white font-medium">{movie.title}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-400">Status</span>
                  <span className="text-white font-medium">{movie.status}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-neutral-400">Rewatches</span>
                  <span className="text-white font-medium">{movie.rewatches}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <AddReviewModal
          media={movie}
          onClose={() => setShowReviewModal(false)}
          onSubmit={(rating, review) => {
            updateEntry(movie.id, { rating, review });
            setShowReviewModal(false);
          }}
          initialRating={movie.rating}
        />
      )}
    </>
  );
};

export default MovieDetails;