import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Tv, Film, Sparkles, TrendingUp, Clock, Heart, Download, Menu, X, ChevronRight } from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/tv-shows', label: 'TV Show', icon: Tv },
        { path: '/movies', label: 'Movie', icon: Film },
        { path: '/trending', label: 'Trending', icon: TrendingUp },
        { path: '/search', label: 'Animation', icon: Sparkles },
        { path: '/watchlist', label: 'My List', icon: Heart },
        { path: '/history', label: 'Watch History', icon: Clock },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onToggle}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-neutral-900/95 backdrop-blur-xl border-r border-white/10 z-50 transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } w-64`}
            >
                {/* Logo & Toggle */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                                <Film className="h-6 w-6 text-white" />
                            </div>
                            <Sparkles className="h-4 w-4 text-accent-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xl font-bold text-gradient-primary">MovieBox</span>
                    </Link>

                    {/* Mobile close button */}
                    <button
                        onClick={onToggle}
                        className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white border border-primary-500/30'
                                            : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                        }`
                                    }
                                    onClick={() => {
                                        if (window.innerWidth < 1024 && onToggle) {
                                            onToggle();
                                        }
                                    }}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium flex-1">{item.label}</span>
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* Download App Button */}
                <div className="p-4 border-t border-white/10">
                    <button className="w-full btn btn-primary gap-2 justify-center">
                        <Download className="h-5 w-5" />
                        Download App
                    </button>
                    <p className="text-xs text-neutral-500 text-center mt-2">
                        Available on iOS & Android
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
