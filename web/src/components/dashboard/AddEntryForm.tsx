import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useEntryContext } from '../../context/EntryContext';
import { WatchStatus } from '../../types';
import { Film, Tv, Star, Save } from 'lucide-react';

interface AddEntryFormProps {
    onClose: () => void;
}

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onClose }) => {
    const { addEntry } = useEntryContext();
    const [formData, setFormData] = useState({
        title: '',
        type: 'movie' as 'movie' | 'tv',
        status: WatchStatus.PLANNING,
        rating: 0,
        poster: '',
        review: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newEntry = {
            id: uuidv4(),
            ...formData,
            backdrop: '', // Placeholder
            rewatches: 0,
            private: false,
            favorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        addEntry(newEntry);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Title</label>
                <input
                    type="text"
                    required
                    className="input w-full"
                    placeholder="Enter movie or TV show title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
            </div>

            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.type === 'movie'
                            ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                        }`}
                    onClick={() => setFormData({ ...formData, type: 'movie' })}
                >
                    <Film className="h-6 w-6" />
                    <span className="font-medium">Movie</span>
                </button>
                <button
                    type="button"
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.type === 'tv'
                            ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                        }`}
                    onClick={() => setFormData({ ...formData, type: 'tv' })}
                >
                    <Tv className="h-6 w-6" />
                    <span className="font-medium">TV Show</span>
                </button>
            </div>

            {/* Status & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Status</label>
                    <select
                        className="input w-full appearance-none"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as WatchStatus })}
                    >
                        {Object.values(WatchStatus).map((status) => (
                            <option key={status} value={status} className="bg-neutral-900">
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Rating (0-5)</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.5"
                            className="input w-full"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                        />
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Poster URL */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Poster URL (Optional)</label>
                <input
                    type="url"
                    className="input w-full"
                    placeholder="https://example.com/poster.jpg"
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                />
                <p className="text-xs text-neutral-500">Leave empty for default placeholder</p>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
                <Save className="h-5 w-5" />
                Save Entry
            </button>
        </form>
    );
};

export default AddEntryForm;
