import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Film, Tv, Search, BarChart3, User, Menu, X, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const navLinks = [
		{ path: '/', label: 'Dashboard', icon: <Film className='w-5 h-5 mr-2' /> },
		{
			path: '/search',
			label: 'Discover',
			icon: <Search className='w-5 h-5 mr-2' />,
		},
		{
			path: '/stats',
			label: 'Stats',
			icon: <BarChart3 className='w-5 h-5 mr-2' />,
		},
		{
			path: '/profile',
			label: 'Profile',
			icon: <User className='w-5 h-5 mr-2' />,
		},
	];

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
					? 'glass backdrop-blur-xl shadow-lg'
					: 'bg-transparent'
				}`}
		>
			<div className='container-custom'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						<Link to='/' className='flex items-center group'>
							<div className='relative'>
								<Tv className='h-8 w-8 text-primary-500 transition-transform duration-300 group-hover:scale-110' />
								<Sparkles className='h-4 w-4 text-accent-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
							</div>
							<span className='ml-3 text-xl font-bold text-gradient-primary'>
								Movie Chronicles
							</span>
						</Link>
					</div>

					{/* Desktop menu */}
					<div className='hidden md:block'>
						<div className='ml-10 flex items-center space-x-2'>
							{navLinks.map((link) => (
								<NavLink
									key={link.path}
									to={link.path}
									className={`flex items-center nav-link ${isActive(link.path)
											? 'nav-link-active'
											: 'nav-link-inactive'
										}`}
								>
									{link.icon}
									{link.label}
								</NavLink>
							))}
						</div>
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden'>
						<button
							onClick={toggleMenu}
							className='inline-flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-200'
						>
							{isMenuOpen ? (
								<X className='block h-6 w-6' aria-hidden='true' />
							) : (
								<Menu className='block h-6 w-6' aria-hidden='true' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className='md:hidden glass backdrop-blur-xl border-t border-white/10'>
					<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
						{navLinks.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								className={`flex items-center py-3 px-3 nav-link ${isActive(link.path) ? 'nav-link-active' : 'nav-link-inactive'
									}`}
								onClick={() => setIsMenuOpen(false)}
							>
								{link.icon}
								{link.label}
							</NavLink>
						))}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
