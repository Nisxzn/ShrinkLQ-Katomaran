import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Link as LinkIcon,
  Copy,
  BarChart3,
  Trash2,
  Edit2,
  Loader2,
  TrendingUp,
  Link2,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus,
  Wand2,
  AlertCircle,
  QrCode,
  Download,
  X,
  Layers
} from 'lucide-react';
import { getAllUrls, createUrl, deleteUrl, updateUrl } from '../services/api';
import toast from 'react-hot-toast';
import BulkShortener from '../components/BulkShortener';

/* ─── Tiny primitive UI helpers ──────────────────────────── */

const cn = (...cls) => cls.filter(Boolean).join(' ');

const StatCard = ({ icon: Icon, label, value, sub, color = 'pink', delay = 0 }) => {
  const colorMap = {
    pink: { icon: 'text-[#E8357C]', bg: 'bg-[#E8357C]/10', border: 'border-[#E8357C]/15', glow: 'from-[#E8357C]/5' },
    violet: { icon: 'text-[#E8357C]', bg: 'bg-[#E8357C]/10', border: 'border-[#E8357C]/15', glow: 'from-[#E8357C]/5' },
    emerald: { icon: 'text-[#E8357C]', bg: 'bg-[#E8357C]/10', border: 'border-[#E8357C]/15', glow: 'from-[#E8357C]/5' },
    rose: { icon: 'text-[#E8357C]', bg: 'bg-[#E8357C]/10', border: 'border-[#E8357C]/15', glow: 'from-[#E8357C]/5' },
  };
  const c = colorMap[color] || colorMap.pink;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={cn(
        'relative rounded-xl border p-5 bg-card shadow-sm overflow-hidden group',
        c.border
      )}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} to-transparent opacity-60 pointer-events-none`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">{label}</p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {value}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">{sub}</p>
        </div>
        <div className={cn('p-2.5 rounded-lg border', c.bg, c.border)}>
          <Icon className={cn('h-5 w-5', c.icon)} />
        </div>
      </div>
    </motion.div>
  );
};

const Badge = ({ active }) => (
  <span className={cn(
    'inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider',
    active
      ? 'bg-[#E8357C]/10 text-[#E8357C] border border-[#E8357C]/20'
      : 'bg-slate-100 text-slate-500 border border-slate-200'
  )}>
    <span className={cn('w-1.5 h-1.5 rounded-full', active ? 'bg-[#E8357C]' : 'bg-slate-400')} />
    <span>{active ? 'Active' : 'Expired'}</span>
  </span>
);

const IconBtn = ({ icon: Icon, onClick, title, danger = false }) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      'p-2 rounded-lg border transition-all duration-200',
      danger
        ? 'text-slate-400 border-transparent hover:text-[#E8357C] hover:bg-[#E8357C]/10 hover:border-[#E8357C]/20'
        : 'text-slate-400 border-transparent hover:text-[#E8357C] hover:bg-[#E8357C]/10 hover:border-[#E8357C]/20'
    )}
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

/* ─── Dashboard ───────────────────────────────────────────── */

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ originalUrl: '', customAlias: '', expiryDate: '' });
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, activeLinks: 0, expiredLinks: 0 });
  const [qrModal, setQrModal] = useState({ open: false, qrCode: null, shortUrl: '' });
  const [editModal, setEditModal] = useState({ open: false, url: null });
  const [editFormData, setEditFormData] = useState({ originalUrl: '', customAlias: '', expiryDate: '' });
  const [editErrors, setEditErrors] = useState({});
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const navigate = useNavigate();

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = async () => {
    try {
      const response = await getAllUrls();
      const data = response.data;
      setUrls(data);
      setStats({
        totalLinks: data.length,
        totalClicks: data.reduce((s, u) => s + (u.clickCount || 0), 0),
        activeLinks: data.filter(u => !isExpired(u.expiryDate)).length,
        expiredLinks: data.filter(u => isExpired(u.expiryDate)).length,
      });
    } catch (error) {
      toast.error('Failed to fetch URLs');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.originalUrl) {
      errs.originalUrl = 'URL is required';
    } else {
      try { new URL(formData.originalUrl); }
      catch { errs.originalUrl = 'Invalid URL format'; }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setCreating(true);
    try {
      await createUrl(formData.originalUrl, formData.customAlias, formData.expiryDate);
      toast.success('Short URL created!');
      setFormData({ originalUrl: '', customAlias: '', expiryDate: '' });
      fetchUrls();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUrl(id);
      toast.success('URL deleted');
      fetchUrls();
    } catch { toast.error('Failed to delete URL'); }
  };

  const handleUpdate = (url) => {
    setEditModal({ open: true, url });
    setEditFormData({
      originalUrl: url.originalUrl,
      customAlias: url.customAlias || '',
      expiryDate: url.expiryDate ? new Date(url.expiryDate).toISOString().split('T')[0] : ''
    });
    setEditErrors({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const errs = {};
    if (!editFormData.originalUrl) {
      errs.originalUrl = 'URL is required';
    } else {
      try { new URL(editFormData.originalUrl); }
      catch { errs.originalUrl = 'Invalid URL format'; }
    }
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setUpdating(true);
    try {
      await updateUrl(
        editModal.url.id,
        editFormData.originalUrl,
        editFormData.customAlias || undefined,
        editFormData.expiryDate || undefined
      );
      toast.success('URL updated successfully');
      setEditModal({ open: false, url: null });
      fetchUrls();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update URL');
    } finally {
      setUpdating(false);
    }
  };

  const handleTerminate = async () => {
    if (!editModal.url) return;
    
    // Set expiry date to today to terminate
    const today = new Date().toISOString().split('T')[0];
    console.log('Terminating URL with expiry date:', today);
    setUpdating(true);
    try {
      const response = await updateUrl(
        editModal.url.id,
        editFormData.originalUrl,
        editFormData.customAlias || undefined,
        today
      );
      console.log('Terminate response:', response);
      toast.success('URL terminated successfully');
      setEditModal({ open: false, url: null });
      await fetchUrls();
    } catch (error) {
      console.error('Terminate error:', error);
      toast.error(error.response?.data?.message || 'Failed to terminate URL');
    } finally {
      setUpdating(false);
    }
  };

  const handleActivate = async () => {
    if (!editModal.url) return;
    
    // Remove expiry date to activate
    console.log('Activating URL - removing expiry date');
    setUpdating(true);
    try {
      const response = await updateUrl(
        editModal.url.id,
        editFormData.originalUrl,
        editFormData.customAlias || undefined,
        undefined
      );
      console.log('Activate response:', response);
      toast.success('URL activated successfully');
      setEditModal({ open: false, url: null });
      await fetchUrls();
    } catch (error) {
      console.error('Activate error:', error);
      toast.error(error.response?.data?.message || 'Failed to activate URL');
    } finally {
      setUpdating(false);
    }
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  const handleUrlClick = (urlId) => {
    // Refresh dashboard data after a short delay to allow the redirect to happen
    setTimeout(() => {
      fetchUrls();
    }, 1000);
  };

  const handleQrPreview = (qrCode, shortUrl) => {
    setQrModal({ open: true, qrCode, shortUrl });
  };

  const handleDownloadQr = (qrCode, shortUrl) => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${shortUrl.split('/').pop()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code downloaded!');
  };

  const isExpired = (d) => {
    if (!d) return false;
    const expiryDate = new Date(d);
    const now = new Date();
    // Consider expired if expiry date is today or in the past
    return expiryDate <= now;
  };

  const inputCls = (hasErr) => cn(
    'w-full rounded-lg bg-white border text-sm text-slate-900 placeholder-slate-400',
    'px-3.5 py-2.5 outline-none transition-all duration-200',
    'focus:ring-2 focus:ring-[#E8357C]/30 focus:border-[#E8357C]/50',
    hasErr ? 'border-[#E8357C]/40 focus:ring-[#E8357C]/20' : 'border-border hover:border-slate-300'
  );

  const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2';

  return (
    <div className="space-y-8 max-w-7xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Manage and monitor all your shortened links</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Link2} label="Total Links" value={stats.totalLinks} sub="All time" color="pink" delay={0} />
        <StatCard icon={TrendingUp} label="Total Clicks" value={stats.totalClicks} sub="Cumulative" color="pink" delay={0.07} />
        <StatCard icon={CheckCircle2} label="Active Links" value={stats.activeLinks} sub="Currently live" color="pink" delay={0.14} />
        <StatCard icon={Clock} label="Expired Links" value={stats.expiredLinks} sub="No longer active" color="pink" delay={0.21} />
      </div>

      {/* Create URL Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-xl border border-[#E8357C]/15 bg-card shadow-sm overflow-hidden"
      >
        {/* Card header with tabs */}
        <div className="px-6 py-4 border-b border-border bg-[#E8357C]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#E8357C]/10 border border-[#E8357C]/20">
                <Wand2 className="h-4 w-4 text-[#E8357C]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  URL Shortener
                </h2>
                <p className="text-xs text-slate-500">Create short links individually or in bulk</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('single')}
                className={cn(
                  'flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  activeTab === 'single'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <Link2 className="h-3.5 w-3.5" />
                <span>Single</span>
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className={cn(
                  'flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  activeTab === 'bulk'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Bulk</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'single' ? (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Long URL */}
              <div>
                <label className={labelCls}>Long URL</label>
                <input
                  id="originalUrl"
                  type="url"
                  value={formData.originalUrl}
                  onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                  placeholder="https://example.com/your-very-long-url"
                  className={inputCls(errors.originalUrl)}
                />
                {errors.originalUrl && (
                  <p className="flex items-center space-x-1.5 text-xs text-[#E8357C] mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{errors.originalUrl}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Custom Alias */}
                <div>
                  <label className={labelCls}>
                    Custom Alias <span className="normal-case tracking-normal text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="customAlias"
                    type="text"
                    value={formData.customAlias}
                    onChange={(e) => setFormData({ ...formData, customAlias: e.target.value })}
                    placeholder="my-branded-link"
                    className={inputCls(false)}
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className={labelCls}>
                    Expiry Date <span className="normal-case tracking-normal text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className={inputCls(false)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className={cn(
                  'flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                  'bg-[#E8357C] hover:bg-[#E8357C]/90',
                  'text-white shadow-lg shadow-[#E8357C]/20',
                  'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none'
                )}
              >
                {creating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /><span>Generating…</span></>
                ) : (
                  <><Plus className="h-4 w-4" /><span>Generate Short URL</span></>
                )}
              </button>
            </form>
          </>
        ) : (
          <BulkShortener onRefresh={fetchUrls} />
        )}
      </motion.div>

      {/* URL Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Your Links
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {loading ? 'Loading…' : `${urls.length} link${urls.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#E8357C] animate-pulse" />
        </div>

        {/* Body */}
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-slate-50 border border-border animate-pulse" />
            ))}
          </div>
        ) : urls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-[#E8357C]/10 border border-[#E8357C]/20 flex items-center justify-center mb-4">
              <LinkIcon className="h-6 w-6 text-[#E8357C]" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              No links yet
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Create your first short URL above to start tracking clicks and analytics.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  {['Original URL', 'Short URL', 'Clicks', 'Created', 'Expiry', 'Status', 'QR Code', ''].map((h, i) => (
                    <th
                      key={i}
                      className={cn(
                        'px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500',
                        i === 7 ? 'text-right' : 'text-left'
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {urls.map((url, idx) => {
                  const expired = isExpired(url.expiryDate);
                  return (
                    <motion.tr
                      key={url.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      {/* Original URL */}
                      <td className="px-5 py-3.5 max-w-[200px]">
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="h-3 w-3 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-700 text-xs truncate font-mono">{url.originalUrl}</span>
                        </div>
                      </td>

                      {/* Short URL */}
                      <td className="px-5 py-3.5">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleUrlClick(url.id)}
                          className="text-[#E8357C] text-xs font-mono font-semibold hover:underline cursor-pointer"
                        >
                          {url.shortUrl}
                        </a>
                      </td>

                      {/* Clicks */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-1.5">
                          <TrendingUp className="h-3.5 w-3.5 text-[#E8357C]" />
                          <span className="font-semibold text-slate-900">{url.clickCount || 0}</span>
                        </div>
                      </td>

                      {/* Created */}
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {new Date(url.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Expiry */}
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {url.expiryDate ? new Date(url.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <Badge active={!expired} />
                      </td>

                      {/* QR Code */}
                      <td className="px-5 py-3.5">
                        {url.qrCode ? (
                          <div className="flex items-center space-x-2">
                            <img
                              src={url.qrCode}
                              alt="QR"
                              className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => handleQrPreview(url.qrCode, url.shortUrl)}
                            />
                            <IconBtn icon={Download} onClick={() => handleDownloadQr(url.qrCode, url.shortUrl)} title="Download QR" />
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end space-x-1">
                          <IconBtn icon={Copy} onClick={() => handleCopy(url.shortUrl)} title="Copy short URL" />
                          <IconBtn icon={BarChart3} onClick={() => navigate(`/analytics/${url.id}`)} title="View analytics" />
                          <IconBtn icon={Edit2} onClick={() => handleUpdate(url)} title="Edit URL" />
                          <IconBtn icon={Trash2} onClick={() => handleDelete(url.id)} title="Delete URL" danger />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* QR Code Modal */}
      {qrModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">QR Code Preview</h3>
              <button
                onClick={() => setQrModal({ open: false, qrCode: null, shortUrl: '' })}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <img
                src={qrModal.qrCode}
                alt="QR Code"
                className="w-48 h-48 border border-slate-200 rounded-lg p-2"
              />
              <p className="text-xs text-slate-500 text-center font-mono break-all">{qrModal.shortUrl}</p>
              <button
                onClick={() => handleDownloadQr(qrModal.qrCode, qrModal.shortUrl)}
                className="flex items-center space-x-2 w-full py-2.5 rounded-lg text-sm font-semibold bg-[#E8357C] hover:bg-[#E8357C]/90 text-white transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download QR Code</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit URL Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Edit URL</h3>
              <button
                onClick={() => setEditModal({ open: false, url: null })}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Original URL */}
              <div>
                <label className={labelCls}>Original URL</label>
                <input
                  type="url"
                  value={editFormData.originalUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, originalUrl: e.target.value })}
                  className={inputCls(editErrors.originalUrl)}
                />
                {editErrors.originalUrl && (
                  <p className="flex items-center space-x-1.5 text-xs text-[#E8357C] mt-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{editErrors.originalUrl}</span>
                  </p>
                )}
              </div>

              {/* Custom Alias */}
              <div>
                <label className={labelCls}>
                  Custom Alias <span className="normal-case tracking-normal text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={editFormData.customAlias}
                  onChange={(e) => setEditFormData({ ...editFormData, customAlias: e.target.value })}
                  placeholder="Leave empty to remove custom alias"
                  className={inputCls(false)}
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className={labelCls}>
                  Expiry Date <span className="normal-case tracking-normal text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  value={editFormData.expiryDate}
                  onChange={(e) => setEditFormData({ ...editFormData, expiryDate: e.target.value })}
                  className={inputCls(false)}
                />
                <p className="text-xs text-slate-400 mt-1">Leave empty to keep URL active indefinitely</p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleActivate}
                  disabled={updating}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Activate
                </button>
                <button
                  type="button"
                  onClick={handleTerminate}
                  disabled={updating}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Terminate
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={updating}
                className={cn(
                  'flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                  'bg-[#E8357C] hover:bg-[#E8357C]/90',
                  'text-white shadow-lg shadow-[#E8357C]/20',
                  'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none'
                )}
              >
                {updating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /><span>Updating…</span></>
                ) : (
                  <><Plus className="h-4 w-4" /><span>Update URL</span></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
