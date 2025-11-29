import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { MediaEntry } from '../../types';

interface CompactMediaCardProps {
    media: MediaEntry;
}

const CompactMediaCard: React.FC<CompactMediaCardProps> = ({ media }) => {
    return (
        <Link
            to={`/${media.type === 'movie' ? 'movie' : 'tv'}/${media.id}`}
            className="group flex-shrink-0 w-44"
        >
            <div className="relative rounded-xl overflow-hidden mb-2">
                {/* Poster Image */}
                <img
                    src={media.poster}
                    alt={media.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary-500/90 backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="h-6 w-6 text-white fill-current ml-0.5" />
                    </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/20">
                    <Star className="h-3 w-3 text-accent-400 fill-current" />
                    {media.rating.toFixed(1)}
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary-500/80 backdrop-blur-sm rounded text-xs font-medium text-white">
                    {media.type === 'movie' ? 'Movie' : 'TV'}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-primary-400 transition-colors">
                {media.title}
            </h3>

            {/* Year */}
            <p className="text-neutral-500 text-xs mt-0.5">
                {new Date(media.createdAt).getFullYear()}
            </p>
        </Link>
    );
};

export default CompactMediaCard;
