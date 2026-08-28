import React, { useState } from 'react';
import { UserProfile } from '../../types/sleep';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string, avatar: string, targetHours: number, rhr: number) => void;
  onDeleteProfile: (profileId: string) => void;
}

const EMOJI_OPTIONS = ['⚡', '🌙', '⭐', '🦉', '🛌', '🦊', '🐱', '🐼', '🚀', '👑'];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('⚡');
  const [newTargetHours, setNewTargetHours] = useState(8.0);
  const [newRHR, setNewRHR] = useState(65);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProfile(newName.trim(), newAvatar, newTargetHours, newRHR);
    setNewName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-oled-card border border-white/15 rounded-[24px] max-w-md w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👥</span>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Switch User Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-text-secondary">
          Each profile maintains independent sleep logs, 14-day sleep bank debt, ratings, and custom goals.
        </p>

        {/* Existing Profiles List */}
        {!isCreating ? (
          <div className="space-y-2.5">
            <div className="space-y-2">
              {profiles.map(p => {
                const isActive = p.id === activeProfileId;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-stage-light/15 border-stage-light shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                        : 'bg-oled-darker/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectProfile(p.id);
                        onClose();
                      }}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-oled-card border border-white/15 flex items-center justify-center text-xl shadow-inner">
                        {p.avatarEmoji || '👤'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{p.name}</span>
                          {isActive && (
                            <span className="bg-stage-light text-black text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-text-secondary">
                          Goal: {p.targetSleepHours}h sleep • RHR: {p.baselineRHR} bpm
                        </span>
                      </div>
                    </button>

                    {profiles.length > 1 && !isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete profile "${p.name}" and all its saved sleep logs?`)) {
                            onDeleteProfile(p.id);
                          }
                        }}
                        className="text-text-secondary hover:text-stage-hr p-1.5 rounded-lg transition-colors text-xs ml-2"
                        title="Delete Profile"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-3 bg-oled-darker hover:bg-oled-subtle border border-dashed border-white/25 hover:border-stage-light text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 mt-3"
            >
              <span>➕</span> Add New User Profile
            </button>
          </div>
        ) : (
          /* Create New Profile Form */
          <form onSubmit={handleCreate} className="space-y-3.5 bg-oled-darker/60 p-3.5 rounded-2xl border border-white/10">
            <h3 className="text-sm font-bold text-white">Create New Profile</h3>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">User Name</label>
              <input
                type="text"
                placeholder="e.g. John, Sarah, Kids, Guest"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
                className="w-full bg-oled-card border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-stage-light font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary block mb-1">Avatar Emoji</label>
              <div className="flex gap-1.5 flex-wrap">
                {EMOJI_OPTIONS.map(em => (
                  <button
                    type="button"
                    key={em}
                    onClick={() => setNewAvatar(em)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg border transition-all ${
                      newAvatar === em
                        ? 'bg-stage-light/30 border-stage-light scale-110'
                        : 'bg-oled-card border-white/10 text-white'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Target Sleep</label>
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="12"
                  value={newTargetHours}
                  onChange={e => setNewTargetHours(parseFloat(e.target.value))}
                  className="w-full bg-oled-card border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Baseline RHR</label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={newRHR}
                  onChange={e => setNewRHR(parseInt(e.target.value, 10))}
                  className="w-full bg-oled-card border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 bg-oled-card hover:bg-oled-subtle border border-white/10 text-text-secondary font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-stage-light hover:bg-white text-black font-bold rounded-xl text-xs transition-all shadow-md"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

