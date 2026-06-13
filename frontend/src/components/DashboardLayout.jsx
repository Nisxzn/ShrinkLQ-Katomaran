import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight
} from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', email: '' };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analysis', href: '/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const Sidebar = ({ mobile = false }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-[#E8357C]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ShrinkLQ
          </span>
        </Link>
        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 pt-6">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Main Menu
        </div>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${isActive
                ? 'bg-[#E8357C]/10 text-[#E8357C] border border-[#E8357C]/20 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
            >
              <item.icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? 'text-[#E8357C]' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span>{item.name}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto text-[#E8357C]/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-border p-4">

        <button
          onClick={handleLogout}
          className="flex items-center w-full space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-[#E8357C] hover:bg-[#E8357C]/5 border border-transparent hover:border-[#E8357C]/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.01em' }}>
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-64 right-0 h-px bg-gradient-to-r from-[#E8357C]/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-b from-[#E8357C]/3 via-transparent to-transparent" />
      </div>

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed left-0 top-0 z-50 h-full w-64 bg-card border-r border-border lg:hidden"
          >
            <Sidebar mobile />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar — always visible */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:h-full lg:w-64 lg:flex lg:flex-col bg-card border-r border-border">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page breadcrumb */}
          <div className="hidden lg:flex items-center space-x-2 text-sm">
            <span className="text-slate-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ShrinkLQ</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 border border-border rounded-md px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8357C] animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
