import React, { useState } from 'react';
import toast from 'react-hot-toast';

const UrlCard = ({ url, onDelete, onAnalytics, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(url.originalUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      toast.success('URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      onDelete(url.id);
    }
  };

  const handleUpdate = () => {
    onUpdate(url.id, editedUrl);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Original URL</p>
          {isEditing ? (
            <input
              type="text"
              value={editedUrl}
              onChange={(e) => setEditedUrl(e.target.value)}
              className="w-full p-2 border border-border rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E8357C]/30 focus:border-[#E8357C]/50 text-sm"
            />
          ) : (
            <p className="text-slate-800 break-all text-sm font-mono">{url.originalUrl}</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Short URL</p>
          <div className="flex items-center space-x-2">
            <p className="text-[#E8357C] font-semibold break-all text-sm font-mono">{url.shortUrl}</p>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-[#E8357C] transition-colors"
              title="Copy"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {url.qrCode && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">QR Code</p>
            <img src={url.qrCode} alt="QR Code" className="w-32 h-32 object-contain border border-border rounded-lg p-2 bg-white" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold text-slate-400 uppercase tracking-wider">Created</p>
            <p className="text-slate-700 font-medium">{formatDate(url.createdAt)}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-400 uppercase tracking-wider">Clicks</p>
            <p className="text-slate-900 font-bold">{url.clickCount}</p>
          </div>
        </div>

        {url.expiryDate && (
          <div className="text-xs">
            <p className="font-semibold text-slate-400 uppercase tracking-wider">Expires</p>
            <p className="text-slate-700 font-medium">{formatDate(url.expiryDate)}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors text-xs font-semibold shadow-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedUrl(url.originalUrl);
                }}
                className="bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors text-xs font-semibold"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors text-xs font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => onAnalytics(url.id)}
                className="bg-[#E8357C] hover:bg-[#E8357C]/90 text-white px-3.5 py-1.5 rounded-lg transition-all text-xs font-semibold shadow-sm shadow-[#E8357C]/15"
              >
                Analytics
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-3.5 py-1.5 rounded-lg hover:bg-red-600 transition-colors text-xs font-semibold shadow-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlCard;
