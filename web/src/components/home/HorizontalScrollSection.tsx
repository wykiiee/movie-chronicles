import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaEntry } from '../../types';
import CompactMediaCard from '../media/CompactMediaCard';

interface HorizontalScrollSectionProps {
    title: string;
    entries: MediaEntry[];
    showMoreLink?: string;
}

const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
    title,
    entries,
    showMoreLink,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollPosition =
                scrollContainerRef.current.scrollLeft +
                (direction === 'left' ? -scrollAmount : scrollAmount);

            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth',
            });
        }
    };

    if (entries.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                {showMoreLink && (
                    <a
                        href={showMoreLink}
                        className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                        More
                        <ChevronRight className="h-4 w-4" />
                    </a>
                )}
            </div>

            {/* Scrollable Container */}
            <div className="relative group">
                {/* Scroll Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 border border-white/10 -ml-4"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 border border-white/10 -mr-4"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>

                {/* Cards Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {entries.map((entry) => (
                        <CompactMediaCard key={entry.id} media={entry} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HorizontalScrollSection;
