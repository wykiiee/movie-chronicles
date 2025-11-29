import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import { useEntryContext } from '../../context/EntryContext';
import { Link } from 'react-router-dom';

const HeroCarousel: React.FC = () => {
    const { entries } = useEntryContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Get featured entries (highest rated)
    const featuredEntries = entries
        .filter(entry => entry.rating >= 4)
        .slice(0, 5);

    useEffect(() => {
        if (!isAutoPlaying || featuredEntries.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredEntries.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, featuredEntries.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + featuredEntries.length) % featuredEntries.length);
        setIsAutoPlaying(false);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % featuredEntries.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    if (featuredEntries.length === 0) {
        return null;
    }

    const currentEntry = featuredEntries[currentIndex];

    return (
        <div
            className="relative h-[60vh] lg:h-[70vh] rounded-2xl overflow-hidden group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                    backgroundImage: `url(${currentEntry.backdrop || currentEntry.poster})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-end p-8 lg:p-12">
                <div className="max-w-2xl">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        {currentEntry.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-6 text-sm lg:text-base">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/20">
                            {new Date(currentEntry.createdAt).getFullYear()}
                        </span>
                        <span className="px-3 py-1 bg-primary-500/20 backdrop-blur-sm rounded-full text-primary-300 border border-primary-500/30">
                            {currentEntry.type === 'movie' ? 'Movie' : 'TV Show'}
                        </span>
                        <div className="flex items-center gap-1 text-accent-400">
                            <span className="text-2xl">⭐</span>
                            <span className="font-bold">{currentEntry.rating.toFixed(1)}</span>
                        </div>
                    </div>

                    {currentEntry.review && (
                        <p className="text-neutral-300 text-lg mb-6 line-clamp-2 lg:line-clamp-3">
                            {currentEntry.review}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to={`/${currentEntry.type === 'movie' ? 'movie' : 'tv'}/${currentEntry.id}`}
                            className="btn btn-primary gap-2"
                        >
                            <Play className="h-5 w-5 fill-current" />
                            Watch Now
                        </Link>
                        <Link
                            to={`/${currentEntry.type === 'movie' ? 'movie' : 'tv'}/${currentEntry.id}`}
                            className="btn btn-ghost gap-2"
                        >
                            <Info className="h-5 w-5" />
                            More Info
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {featuredEntries.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentIndex
                                ? 'w-8 h-2 bg-primary-500'
                                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
