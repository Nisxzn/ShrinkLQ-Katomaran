import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  Loader2,
  Activity
} from 'lucide-react';
import { getProfile } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data);
      } catch (error) {
        toast.error('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4 text-[#E8357C]" />;
      case 'tablet':
        return <Tablet className="h-4 w-4 text-[#E8357C]" />;
      default:
        return <Monitor className="h-4 w-4 text-[#E8357C]" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 text-[#E8357C] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-slate-400">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <p className="text-lg font-semibold text-slate-800">Profile not found</p>
        <p className="text-sm mt-1">Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Account Security
        </h1>
        <p className="text-sm text-slate-500 mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Manage your user profile details and monitor recent login activities</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 rounded-xl border border-[#E8357C]/15 bg-card shadow-sm overflow-hidden"
        >
          <div className="flex items-center space-x-3 px-6 py-4 border-b border-border bg-[#E8357C]/5">
            <div className="p-2 rounded-lg bg-[#E8357C]/10 border border-[#E8357C]/20">
              <User className="h-4 w-4 text-[#E8357C]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                User Details
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center pb-4 border-b border-border">
              <div className="w-20 h-20 rounded-full bg-[#E8357C]/10 border-2 border-[#E8357C]/30 flex items-center justify-center mb-3">
                <span className="text-2xl font-extrabold text-[#E8357C]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{profile.name}</h3>
              <p className="text-xs text-slate-500 break-all text-center px-2">{profile.email}</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start justify-between space-x-4">
                <span className="text-slate-500 flex items-center space-x-2 flex-shrink-0">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>Email:</span>
                </span>
                <span className="text-slate-800 font-medium break-all text-right">{profile.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-2 flex-shrink-0">
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                  <span>Status:</span>
                </span>
                {profile.isVerified ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    Unverified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-2 flex-shrink-0">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Since:</span>
                </span>
                <span className="text-slate-800 font-medium">
                  {new Date(profile.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Login History */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7 rounded-xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#E8357C]/10 border border-[#E8357C]/20">
                <Activity className="h-4 w-4 text-[#E8357C]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Recent Logins
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Recent authentication events on your account</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {profile.loginHistory?.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">
                No recent logins recorded.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-slate-50 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    <th className="px-5 py-3 text-left">Device</th>
                    <th className="px-5 py-3 text-left">Browser</th>
                    <th className="px-5 py-3 text-left">IP Address</th>
                    <th className="px-5 py-3 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs text-slate-700">
                  {profile.loginHistory.map((login, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      {/* Device */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded bg-slate-50 border border-border">
                            {getDeviceIcon(login.device)}
                          </div>
                          <span className="font-semibold text-slate-800">{login.device || 'Desktop'}</span>
                        </div>
                      </td>

                      {/* Browser */}
                      <td className="px-5 py-3.5 font-medium text-slate-800">{login.browser || 'Chrome'}</td>

                      {/* IP */}
                      <td className="px-5 py-3.5 font-mono text-slate-605 flex items-center space-x-1.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{login.ip || '127.0.0.1'}</span>
                      </td>

                      {/* Timestamp */}
                      <td className="px-5 py-3.5 text-slate-500 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{formatDate(login.timestamp)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
