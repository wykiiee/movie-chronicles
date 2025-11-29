import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Tv, Clock, Eye, Heart, Star, Play } from 'lucide-react';
import { MediaEntry } from '../../types';
import RatingStars from '../ui/RatingStars';

interface MediaCardProps {
	media: MediaEntry;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
	const [isHovered, setIsHovered] = useState(false);
	const detailsPath =
		media.type === 'movie' ? `/movie/${media.id}` : `/tv/${media.id}`;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Currently Watching':
				return 'badge-primary';
			case 'Completed':
				return 'badge-success';
			case 'Planning to Watch':
				return 'badge-secondary';
			case 'Paused':
				return 'badge-warning';
			default:
				return 'badge-error';
		}
	};

	return (
		<div
			className='card group h-full flex flex-col relative overflow-hidden'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Poster Section */}
			<div className='relative overflow-hidden'>
				<Link to={detailsPath}>
					<img
						src={media.poster}
						alt={media.title}
						className='w-full aspect-[2/3] object-cover transition-all duration-500 group-hover:scale-110'
					/>

					{/* Gradient Overlay */}
					<div className='absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300'></div>

					{/* Glassmorphic Hover Overlay */}
					<div className={`absolute inset-0 glass backdrop-blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
						}`}>
						<div className='absolute inset-0 flex items-center justify-center'>
							<div className='glass-light rounded-full p-4 transform transition-all duration-300 hover:scale-110'>
								<Play className='h-8 w-8 text-white' fill='white' />
							</div>
						</div>
					</div>

					{/* Media Type Badge */}
					<div className='absolute top-3 left-3 glass-light rounded-lg p-2 backdrop-blur-md'>
						{media.type === 'movie' ? (
							<Film className='h-4 w-4 text-primary-400' />
						) : (
							<Tv className='h-4 w-4 text-secondary-400' />
						)}
					</div>

					{/* Favorite Badge */}
					{media.favorite && (
						<div className='absolute top-3 right-3 glass-light rounded-lg p-2 backdrop-blur-md animate-scale-in'>
							<Heart className='h-4 w-4 text-accent-400' fill='currentColor' />
						</div>
					)}

					{/* Progress Bar */}
					{media.progress !== undefined && media.progress < 100 && (
						<div className='absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800/50 backdrop-blur-sm'>
							<div
								className='h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300'
								style={{ width: `${media.progress}%` }}
							></div>
						</div>
					)}
				</Link>
			</div>

			{/* Content Section */}
			<div className='p-4 flex-grow flex flex-col'>
				<Link to={detailsPath}>
					<h3 className='font-semibold text-lg line-clamp-2 text-white group-hover:text-gradient-primary transition-all duration-200'>
						{media.title}
					</h3>
				</Link>

				{/* Meta Information */}
				<div className='flex items-center text-sm text-neutral-400 mt-2 space-x-3'>
					<div className='flex items-center'>
						{media.type === 'movie' ? (
							<Film className='h-3.5 w-3.5 mr-1.5' />
						) : (
							<Tv className='h-3.5 w-3.5 mr-1.5' />
						)}
						<span className='text-xs'>{media.type === 'movie' ? 'Movie' : 'TV Show'}</span>
					</div>

					{media.dateWatched && (
						<div className='flex items-center'>
							<Clock className='h-3.5 w-3.5 mr-1.5' />
							<span className='text-xs'>{new Date(media.dateWatched).toLocaleDateString()}</span>
						</div>
					)}
				</div>

				{/* Rating */}
				<div className='mt-3'>
					<RatingStars rating={media.rating} readonly size='small' />
				</div>

				{/* Status Badge */}
				{media.status && (
					<div className='mt-3'>
						<span className={`badge ${getStatusColor(media.status)} text-xs`}>
							{media.status}
						</span>
					</div>
				)}

				{/* Footer */}
				<div className='mt-auto pt-4 flex justify-between items-center text-sm border-t border-white/5'>
					{media.rewatches > 0 && (
						<div className='flex items-center text-neutral-400'>
							<Eye className='h-3.5 w-3.5 mr-1.5' />
							<span className='text-xs'>
								{media.rewatches === 1
									? 'Watched once'
									: `${media.rewatches}x`}
							</span>
						</div>
					)}

					{media.rating > 0 && (
						<div className='flex items-center text-accent-400'>
							<Star className='h-3.5 w-3.5 mr-1 fill-current' />
							<span className='text-xs font-medium'>{media.rating.toFixed(1)}</span>
						</div>
					)}
				</div>
			</div>

			{/* Gradient Border Effect on Hover */}
			<div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'
				}`} style={{
					background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)',
					padding: '2px',
					WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
					WebkitMaskComposite: 'xor',
					maskComposite: 'exclude'
				}}></div>
		</div>
	);
};

export default MediaCard;
