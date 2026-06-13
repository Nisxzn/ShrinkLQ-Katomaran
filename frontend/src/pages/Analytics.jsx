import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Users,
  Monitor,
  Smartphone,
  Globe,
  Loader2,
  BarChart3,
  MapPin,
  Activity
} from 'lucide-react';
import { getAnalytics, getAllUrls } from '../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';

/* ─── Helpers ─────────────────────────────────────────────── */
const cn = (...cls) => cls.filter(Boolean).join(' ');

const CHART_COLORS = ['#E8357C', '#ff6b9d', '#ff8fab', '#ffb3c6', '#ffd1dc'];

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(232, 53, 124, 0.15)',
  borderRadius: '10px',
  color: '#0f172a',
  fontSize: '12px',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
};

/* ─── Sub-components ──────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color = 'pink', delay = 0 }) => {
  const colorMap = {
    pink:    { icon: 'text-[#E8357C]',  bg: 'bg-[#E8357C]/10',  border: 'border-[#E8357C]/15',  glow: 'from-[#E8357C]/5'  },
    violet:  { icon: 'text-[#E8357C]',  bg: 'bg-[#E8357C]/10',  border: 'border-[#E8357C]/15',  glow: 'from-[#E8357C]/5'  },
    emerald: { icon: 'text-[#E8357C]', bg: 'bg-[#E8357C]/10', border: 'border-[#E8357C]/15', glow: 'from-[#E8357C]/5' },
  };
  const c = colorMap[color] || colorMap.pink;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={cn('relative rounded-xl border p-5 bg-card shadow-sm overflow-hidden', c.border)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} to-transparent opacity-60 pointer-events-none`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">{label}</p>
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {value}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">{sub}</p>
        </div>
        <div className={cn('p-2.5 rounded-lg border flex-shrink-0', c.bg, c.border)}>
          <Icon className={cn('h-5 w-5', c.icon)} />
        </div>
      </div>
    </motion.div>
  );
};

const PanelCard = ({ title, subtitle, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
  >
    <div className="flex items-center space-x-3 px-6 py-4 border-b border-border">
      {Icon && (
        <div className="p-2 rounded-lg bg-[#E8357C]/10 border border-[#E8357C]/20">
          <Icon className="h-4 w-4 text-[#E8357C]" />
        </div>
      )}
      <div>
        <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

/* Custom recharts tooltip */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle} className="px-3 py-2">
      <p className="text-slate-500 text-[11px] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold text-slate-900 text-sm">
          {p.value} <span className="text-slate-400 font-normal text-[11px]">clicks</span>
        </p>
      ))}
    </div>
  );
};

/* ─── Analytics Page ──────────────────────────────────────── */
const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAnalytics();
    } else {
      fetchAllUrlsAnalytics();
    }
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAnalytics(id);
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to fetch analytics');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUrlsAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAllUrls();
      setUrls(response.data);
    } catch (error) {
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlClick = (urlId) => {
    // Refresh data after a short delay to allow the redirect to happen
    setTimeout(() => {
      fetchAllUrlsAnalytics();
    }, 1000);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const deviceData  = analytics?.deviceBreakdown  || [];
  const browserData = analytics?.browserBreakdown || [];

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div className="h-8 w-40 rounded-lg bg-slate-100 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-100 animate-pulse border border-border" />
          ))}
        </div>
        <div className="h-72 rounded-xl bg-slate-100 animate-pulse border border-border" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 rounded-xl bg-slate-100 animate-pulse border border-border" />
          <div className="h-64 rounded-xl bg-slate-100 animate-pulse border border-border" />
        </div>
      </div>
    );
  }

  /* ── Overall Links Analytics overview (No specific ID supplied) ── */
  if (!id) {
    return (
      <div className="space-y-8 max-w-7xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Overall Link Analysis
          </h1>
          <p className="text-sm text-slate-500 mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Select any link below to view granular tracking statistics</p>
        </motion.div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Total Clicks"
            value={urls.reduce((sum, u) => sum + (u.clickCount || 0), 0)}
            sub="Across all campaigns"
            color="pink"
            delay={0}
          />
          <StatCard
            icon={Users}
            label="Total Shortened Links"
            value={urls.length}
            sub="Active and expired"
            color="pink"
            delay={0.07}
          />
          <StatCard
            icon={Activity}
            label="Average Click Rate"
            value={urls.length ? Math.round(urls.reduce((sum, u) => sum + (u.clickCount || 0), 0) / urls.length) : 0}
            sub="Clicks per shortened URL"
            color="pink"
            delay={0.14}
          />
        </div>

        {/* URLs List Table */}
        <PanelCard title="Shortened URLs List" subtitle="Overview of your link performance metrics" icon={BarChart3} delay={0.2}>
          {!urls.length ? (
            <div className="flex flex-col items-center py-12 text-center">
              <p className="text-sm font-medium text-slate-500 mb-1">No links created yet</p>
              <p className="text-xs text-slate-400 mb-4">Go to your dashboard to shorten your first link</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-[#E8357C] text-white rounded-lg text-sm font-semibold hover:bg-[#E8357C]/90 transition-colors border-0"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500">Short Link</th>
                    <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500">Original Destination</th>
                    <th className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500">Clicks</th>
                    <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {urls.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pr-4 text-xs font-mono font-semibold text-[#E8357C]">
                        <a
                          href={u.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleUrlClick(u.id)}
                          className="hover:underline cursor-pointer"
                        >
                          {u.shortUrl}
                        </a>
                      </td>
                      <td className="py-3.5 pr-4 text-xs font-mono text-slate-500 max-w-[300px] truncate">
                        {u.originalUrl}
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-slate-900">
                        {u.clickCount || 0}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => navigate(`/analytics/${u.id}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E8357C]/10 text-[#E8357C] hover:bg-[#E8357C]/20 transition-colors border-0"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelCard>
      </div>
    );
  }

  /* ── No data state ── */
  if (!analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center max-w-7xl">
        <div className="w-16 h-16 rounded-full bg-[#E8357C]/10 border border-[#E8357C]/20 flex items-center justify-center mb-5">
          <BarChart3 className="h-7 w-7 text-[#E8357C]" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          No analytics data
        </h3>
        <p className="text-sm text-slate-500 mb-6 max-w-xs">
          Share your shortened link and visits will start appearing here automatically.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#E8357C]/10 border border-[#E8357C]/20 text-[#E8357C] hover:bg-[#E8357C]/20 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Link Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Detailed performance data for your shortened link</p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 border border-border rounded-md px-3 py-1.5">
          <Activity className="h-3.5 w-3.5 text-[#E8357C]" />
          <span>Live tracking</span>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Clicks"
          value={analytics.totalClicks || 0}
          sub="All time"
          color="pink"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Last Visited"
          value={analytics.lastVisited ? formatDate(analytics.lastVisited).split(',')[0] : '—'}
          sub={analytics.lastVisited ? formatDate(analytics.lastVisited) : 'No visits yet'}
          color="pink"
          delay={0.07}
        />
        <StatCard
          icon={Users}
          label="Recent Visits"
          value={analytics.recentVisits?.length || 0}
          sub="Last 30 days"
          color="pink"
          delay={0.14}
        />
      </div>

      {/* Daily Clicks Chart */}
      {analytics.dailyClicks?.length > 0 && (
        <PanelCard
          title="Daily Click Trend"
          subtitle="Click volume over the last 30 days"
          icon={TrendingUp}
          delay={0.2}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.dailyClicks} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E8357C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#E8357C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(15,23,42,0.05)" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#E8357C"
                strokeWidth={2.5}
                dot={{ fill: '#E8357C', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#ff6b9d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </PanelCard>
      )}

      {/* Device & Browser Charts */}
      {(deviceData.length > 0 || browserData.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          {deviceData.length > 0 && (
            <PanelCard title="Device Breakdown" subtitle="Clicks by device type" icon={Monitor} delay={0.28}>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {deviceData.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', color: '#475569' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </PanelCard>
          )}

          {/* Browser Breakdown */}
          {browserData.length > 0 && (
            <PanelCard title="Browser Breakdown" subtitle="Clicks by browser" icon={Globe} delay={0.35}>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={browserData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid stroke="rgba(15,23,42,0.05)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {browserData.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </PanelCard>
          )}
        </div>
      )}

      {/* Recent Visits Table */}
      <PanelCard
        title="Recent Visit History"
        subtitle="Latest clicks on your shortened link"
        icon={Activity}
        delay={0.42}
      >
        {!analytics.recentVisits?.length ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-border flex items-center justify-center mb-4">
              <Clock className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">No visits recorded yet</p>
            <p className="text-xs text-slate-400">Share your link to start tracking visits</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Visited At', 'Browser', 'Device', 'Location'].map((h, i) => (
                    <th key={i} className="pb-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {analytics.recentVisits.map((visit, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 pr-4 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(visit.visitedAt)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-3.5 w-3.5 text-[#E8357C] flex-shrink-0" />
                        <span className="text-slate-800 text-xs">{visit.browser || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center space-x-2">
                        {visit.device?.toLowerCase() === 'mobile' || visit.device?.toLowerCase() === 'phone'
                          ? <Smartphone className="h-3.5 w-3.5 text-[#E8357C] flex-shrink-0" />
                          : <Monitor className="h-3.5 w-3.5 text-[#E8357C] flex-shrink-0" />
                        }
                        <span className="text-slate-800 text-xs">{visit.device || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3.5 w-3.5 text-[#E8357C] flex-shrink-0" />
                        <span className="text-slate-500 text-xs">{visit.location || 'Unknown'}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>
    </div>
  );
};

export default Analytics;
