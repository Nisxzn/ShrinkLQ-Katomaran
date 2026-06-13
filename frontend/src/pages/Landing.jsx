import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Link as LinkIcon,
  BarChart3,
  QrCode,
  Clock,
  Shield,
  ArrowRight,
  Star,
  Mail,
  Globe,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

const Github = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: LinkIcon,
      title: 'Branded Links',
      description: 'Build authority with your own custom domains and custom path aliases.',
      colorClass: 'text-[#E8357C] bg-[#E8357C]/10'
    },
    {
      icon: BarChart3,
      title: 'Granular Analytics',
      description: 'Monitor traffic in real-time, tracking geography, referral sources, and browsers.',
      colorClass: 'text-[#E8357C] bg-[#E8357C]/10'
    },
    {
      icon: QrCode,
      title: 'Dynamic QRs',
      description: 'Generate custom, trackable QR codes that sync instantly with your redirects.',
      colorClass: 'text-[#E8357C] bg-[#E8357C]/10'
    },
    {
      icon: Clock,
      title: 'Campaign Expiry',
      description: 'Configure custom expiration dates and automatic redirect fallback plans.',
      colorClass: 'text-[#E8357C] bg-[#E8357C]/10'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Keep redirects secure with HTTPS routing, MFA, and SSO integrations.',
      colorClass: 'text-[#E8357C] bg-[#E8357C]/10'
    },
    {
      icon: Globe,
      title: 'Geo-Routing',
      description: 'Redirect users to different URLs depending on their country or device type.',
      colorClass: 'text-[#E8357C] bg-[#E8357C]/10'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Director of Growth',
      content: 'ShrinkLQ has transformed how we manage our campaigns. The analytics are incredibly granular and the loading speeds are instant.',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Founder & CEO',
      content: 'The dynamic QR codes and custom domain routing allowed us to build custom onboarding flows in seconds. Superb developer experience.',
      avatar: 'MC'
    },
    {
      name: 'Emily Davis',
      role: 'Social Media Lead',
      content: 'Clean dashboard, highly reliable infrastructure, and fantastic support. Our click rates went up by 18% just by using branded domains.',
      avatar: 'ED'
    }
  ];

  return (
    <div className="min-h-screen bg-page text-foreground relative overflow-hidden">

      {/* Navbar */}
      <div className={`fixed transition-all duration-500 ease-in-out z-50 ${isScrolled
        ? 'top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl'
        : 'top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4'
        }`}>
        <nav className={`transition-all duration-500 ease-in-out ${isScrolled
          ? 'navbar-dynamic-island shadow-xl px-6 py-1 border border-white/20'
          : 'bg-transparent px-4 py-2 border-b border-transparent'
          }`}>
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-black text-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                ShrinkLQ
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-6 text-sm font-medium">
                <a href="#features" className="text-slate-600 hover:text-[#E8357C] transition-colors">FEATURES</a>
                <a href="#analytics" className="text-slate-600 hover:text-[#E8357C] transition-colors">ANALYTICS</a>
              </div>
              <div className="h-4 w-px bg-slate-200" /> {/* subtle divider */}
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 h-9 px-4 rounded-full text-xs">
                    SIGN IN
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#E8357C] hover:bg-[#E8357C]/95 text-white font-semibold h-9 px-5 shadow-md shadow-[#E8357C]/15 border-0 rounded-full text-xs transition-all duration-200 hover:shadow-lg">
                    GET STARTED
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-slate-950 rounded-full w-9 h-9"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-3 border border-slate-200/50 bg-white/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-3 rounded-2xl shadow-xl"
            >
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:text-[#E8357C] hover:bg-slate-50"
              >
                FEATURES
              </a>
              <a
                href="#analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:text-[#E8357C] hover:bg-slate-50"
              >
                ANALYTICS
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-600 hover:text-[#E8357C] hover:bg-slate-50"
              >
                TESTIMONIALS
              </a>
              <div className="pt-4 flex flex-col gap-3 border-t border-slate-100">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:text-slate-900 rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#E8357C] hover:bg-[#E8357C]/95 text-white border-0 rounded-full transition-all duration-200 hover:shadow-md">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-56 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-8 leading-none">
            <span className="block mb-2 font-citadel text-[#E8357C] font-normal">
              Shorten Links.
            </span>
            <span className="text-6xl md:text-52px block font-helvetica text-slate-950 font-bold">
              Amplify Engagement.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-helvetica">
            The premium platform for creating custom branded URLs, generating dynamic QR codes, and tracking real-time click intelligence. Build trust with every connection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link to="/signup">
              <Button size="lg" className="h-14 px-8 text-base bg-[#E8357C] hover:bg-[#E8357C]/95 text-white font-bold shadow-lg shadow-[#E8357C]/15 border-0 transition-all duration-200 hover:shadow-xl">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-border hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm backdrop-blur-md transition-all duration-200 hover:shadow-md">
                Explore Features
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Dashboard Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <div className="relative mx-auto max-w-5xl rounded-xl border border-border bg-slate-50/50 p-1.5 shadow-2xl backdrop-blur-xl">
            {/* Spotlight behind mockup */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#E8357C]/10 via-pink-500/5 to-[#E8357C]/10 blur-xl opacity-70 pointer-events-none -z-10" />

            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white/50 backdrop-blur-md rounded-t-lg">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="w-1/3 bg-white/40 backdrop-blur-sm text-[10px] tracking-wider text-center text-slate-700 py-1.5 rounded border border-white/20 truncate font-mono">
                shrt.ly/analytics
              </div>
              <div className="w-6" />
            </div>

            {/* Inner Dashboard */}
            <div className="p-4 sm:p-6 bg-white/40 backdrop-blur-md rounded-b-lg text-left shadow-sm">
              {/* Top stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Redirect Clicks', val: '142,853', diff: '+14.2%', col: 'text-[#E8357C]' },
                  { label: 'QR Scan Rate', val: '8.2%', diff: '+4.1%', col: 'text-[#E8357C]' },
                  { label: 'Active Dynamic Slugs', val: '24', diff: 'Optimal', col: 'text-[#E8357C]' }
                ].map((st, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/50 border border-white/30 shadow-sm backdrop-blur-sm">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{st.label}</div>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-bold text-slate-900">{st.val}</div>
                      <div className="text-[10px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">{st.diff}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Mockup */}
              <div className="p-4 rounded-lg bg-white/50 border border-white/30 shadow-sm backdrop-blur-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-semibold text-slate-800">Click Volume Trend</div>
                  <div className="text-[10px] text-slate-500">Real-Time Sync</div>
                </div>
                <div className="w-full">
                  <svg viewBox="0 0 500 120" className="w-full h-28 overflow-visible">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E8357C" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#E8357C" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(15,23,42,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(15,23,42,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(15,23,42,0.05)" strokeDasharray="3 3" />

                    <path d="M 0 100 Q 80 40 160 85 T 320 30 T 480 15 L 500 12 L 500 120 L 0 120 Z" fill="url(#chartGrad)" />
                    <path d="M 0 100 Q 80 40 160 85 T 320 30 T 480 15 L 500 12" fill="none" stroke="#E8357C" strokeWidth="2.5" />

                    <circle cx="160" cy="85" r="4.5" fill="#E8357C" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="320" cy="30" r="4.5" fill="#E8357C" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="480" cy="15" r="4.5" fill="#E8357C" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Table / List Mockup */}
              <div className="rounded-lg bg-white/50 border border-white/30 shadow-sm backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-white/20">
                  <div className="text-xs font-semibold text-slate-800">Branded Campaign Links</div>
                </div>
                <div className="divide-y divide-white/20 text-xs">
                  {[
                    { short: 'shrt.ly/winter-sale', target: 'https://myshop.com/promo/winter-2026', clicks: '12,893', status: 'Active' },
                    { short: 'shrt.ly/career-dev', target: 'https://company.com/careers/openings', clicks: '4,210', status: 'Active' },
                    { short: 'shrt.ly/vip-rsvp', target: 'https://vip.events.org/rsvp-form-page', clicks: '853', status: 'Active' }
                  ].map((ln, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between hover:bg-white/40">
                      <div className="font-mono text-slate-850 font-semibold">{ln.short}</div>
                      <div className="hidden md:block text-slate-600 font-mono max-w-xs truncate">{ln.target}</div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <span className="font-semibold text-slate-800">{ln.clicks}</span>
                          <span className="text-[10px] text-slate-400 ml-1">clicks</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#E8357C]/10 text-[#E8357C]">
                          {ln.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>


      </section>

      {/* Features Section */}
      <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Engineered for Growth
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Unlock the metrics and custom redirect infrastructure needed to scale your branded touchpoints.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full glass-card overflow-hidden text-left shadow-sm">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-lg ${feature.colorClass} flex items-center justify-center mb-4 border border-[#E8357C]/10`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-slate-500 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Analytics Spotlight Section */}
      <section id="analytics" className="py-28 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8357C]/10 border border-[#E8357C]/20 text-xs font-semibold text-[#E8357C] mb-6">
              <span>Traffic Analysis</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
              Granular analytics at your fingertips
            </h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Track geolocation coordinates, browser variations, referrer sites, and device breakdowns. Understand your users instantly with clean visual representation.
            </p>
            <ul className="space-y-4 text-slate-700 text-sm">
              {[
                'Real-time redirection audit logs',
                'IP geolocating down to cities and regions',
                'Referral path detection and UTM campaign mapping'
              ].map((li, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#E8357C] flex-shrink-0" />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full relative"
          >
            {/* Visual breakdown panel mockup */}
            <div className="glass-panel border-border rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E8357C]/5 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <span className="text-xs font-bold text-slate-605 uppercase tracking-wider">Device Breakdown</span>
                <span className="text-[10px] text-slate-400">Live Traffic Share</span>
              </div>

              <div className="space-y-6">
                {[
                  { device: 'Desktop / Laptop', pct: 64, count: '91,425 clicks', icon: Laptop, col: 'bg-[#E8357C]' },
                  { device: 'Mobile Devices', pct: 32, count: '45,712 clicks', icon: Smartphone, col: 'bg-[#E8357C]' },
                  { device: 'Other Platforms', pct: 4, count: '5,716 clicks', icon: Globe, col: 'bg-slate-400' }
                ].map((dev, idx) => (
                  <div key={idx} className="space-y-2 text-left">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-slate-655">
                        <dev.icon className="w-4 h-4 text-slate-500" />
                        <span className="font-semibold">{dev.device}</span>
                      </div>
                      <div className="text-slate-500">
                        <span className="font-bold text-slate-800">{dev.pct}%</span>
                        <span className="text-[10px] text-slate-400 ml-1">({dev.count})</span>
                      </div>
                    </div>
                    {/* Bar */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${dev.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full rounded-full ${dev.col}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 border-t border-border relative">
        {/* Glow spotlight under CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E8357C]/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-12 sm:p-16 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8357C]/5 to-pink-500/5 pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900">
              Control your link routing today
            </h2>
            <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join growth teams worldwide deploying ShrinkLQ redirect systems. Instant setup, zero maintenance, complete control.
            </p>
            <Link to="/signup">
              <Button size="lg" className="h-14 px-8 text-base bg-[#E8357C] hover:bg-[#E8357C]/95 text-white font-bold shadow-lg shadow-[#E8357C]/15 border-0 transition-all duration-200 hover:shadow-xl">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
