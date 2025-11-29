import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Star, MessageSquare, Heart, Plus, CheckCircle, Edit, ArrowLeft, Play, Tv } from 'lucide-react';
import { useEntryContext } from '../context/EntryContext';
import { MediaEntry, WatchStatus } from '../types';
import AddReviewModal from '../components/media/AddReviewModal';
import RatingStars from '../components/ui/RatingStars';

const TvShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, updateEntry } = useEntryContext();
  const [tvShow, setTvShow] = useState<MediaEntry | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes'>('overview');

  useEffect(() => {
    if (id) {
      const foundShow = entries.find(e => e.id === id && e.type === 'tv');
      setTvShow(foundShow || null);
    }
  }, [id, entries]);

  const toggleFavorite = () => {
    if (tvShow) {
      updateEntry(tvShow.id, { favorite: !tvShow.favorite });
    }
  };

  if (!tvShow) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">TV Show not found</h2>
          <p className="text-neutral-400 mt-2">The TV show you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary mt-4">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isInWatchlist = tvShow.status === WatchStatus.PLANNING;

  return (
    <>
      {/* Hero section with backdrop */}
      <div
        className="relative h-[60vh] bg-center bg-cover"
        style={{
          backgroundImage: `url(${tvShow.backdrop || tvShow.poster})`
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
                src={tvShow.poster}
                alt={tvShow.title}
                className="w-40 md:w-64 rounded-xl shadow-2xl border border-white/10 object-cover"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{tvShow.title}</h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm md:text-base text-neutral-300 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-400" />
                  <span>{new Date(tvShow.createdAt).getFullYear()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent-400 fill-current" />
                  <span className="font-semibold text-white">{tvShow.rating.toFixed(1)}</span>
                  <span className="text-neutral-500">/ 5</span>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${tvShow.status === WatchStatus.COMPLETED ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  tvShow.status === WatchStatus.WATCHING ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                    'bg-neutral-700/50 text-neutral-300 border-neutral-600/50'
                  }`}>
                  {tvShow.status}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className={`btn ${isInWatchlist ? 'btn-secondary' : 'btn-primary'} gap-2`}
                  onClick={() => updateEntry(tvShow.id, { status: WatchStatus.PLANNING })}
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
                  className={`btn ${tvShow.favorite ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'btn-outline'} gap-2`}
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${tvShow.favorite ? 'fill-current' : ''}`} />
                  {tvShow.favorite ? 'Favorited' : 'Favorite'}
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
            <div className="card overflow-hidden">
              <div className="flex border-b border-white/10">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'overview'
                    ? 'bg-white/10 text-white border-b-2 border-primary-500'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'episodes'
                    ? 'bg-white/10 text-white border-b-2 border-primary-500'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    }`}
                  onClick={() => setActiveTab('episodes')}
                >
                  Episodes
                </button>
              </div>

              {activeTab === 'overview' ? (
                <div className="p-6 md:p-8">
                  {/* Review Section */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary-400" />
                        Your Review
                      </h2>
                      {tvShow.review && (
                        <button
                          className="btn btn-sm btn-ghost gap-2"
                          onClick={() => setShowReviewModal(true)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                      )}
                    </div>

                    {tvShow.review ? (
                      <div className="glass-light rounded-xl p-6 relative">
                        <div className="absolute -top-3 -left-2 text-6xl text-primary-500/20 font-serif leading-none">"</div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-4">
                            <RatingStars rating={tvShow.rating} readonly />
                            <span className="text-neutral-400 text-sm ml-2">Rated on {new Date().toLocaleDateString()}</span>
                          </div>
                          <p className="text-lg text-neutral-200 leading-relaxed italic">{tvShow.review}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 glass-light rounded-xl border-dashed border-2 border-neutral-700">
                        <MessageSquare className="h-10 w-10 mx-auto mb-3 text-neutral-600" />
                        <p className="text-neutral-400 mb-4">You haven't reviewed this show yet</p>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setShowReviewModal(true)}
                        >
                          Write a Review
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Show Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-light p-4 rounded-xl space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Status</span>
                          <span className="text-white font-medium">{tvShow.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Progress</span>
                          <span className="text-white font-medium">{tvShow.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-neutral-800/50 rounded-full h-2 mt-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                            style={{ width: `${tvShow.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="glass-light p-4 rounded-xl space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Rewatches</span>
                          <span className="text-white font-medium">{tvShow.rewatches}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Type</span>
                          <span className="text-white font-medium uppercase">{tvShow.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Tv className="h-16 w-16 mx-auto mb-4 text-neutral-700" />
                  <h3 className="text-xl font-bold text-white mb-2">Episodes Coming Soon</h3>
                  <p className="text-neutral-400">Episode tracking is not yet available for this entry.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Watch Status</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-neutral-400 block mb-2">Current Status</label>
                  <select
                    value={tvShow.status}
                    onChange={(e) => updateEntry(tvShow.id, { status: e.target.value as WatchStatus })}
                    className="input w-full bg-neutral-900/50"
                  >
                    {Object.values(WatchStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-neutral-400 block mb-2">Progress</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tvShow.progress || 0}
                      onChange={(e) => updateEntry(tvShow.id, { progress: parseInt(e.target.value) })}
                      className="w-full accent-primary-500"
                    />
                    <span className="text-white font-mono w-12 text-right">{tvShow.progress || 0}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  className="btn btn-outline w-full justify-start gap-3"
                  onClick={() => updateEntry(tvShow.id, { rewatches: (tvShow.rewatches || 0) + 1 })}
                >
                  <Plus className="h-4 w-4" />
                  Log Rewatch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <AddReviewModal
          media={tvShow}
          onClose={() => setShowReviewModal(false)}
          onSubmit={(rating, review) => {
            updateEntry(tvShow.id, { rating, review });
            setShowReviewModal(false);
          }}
          initialRating={tvShow.rating}
        />
      )}
    </>
  );
};

export default TvShowDetails;