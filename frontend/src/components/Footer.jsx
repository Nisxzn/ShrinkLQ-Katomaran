import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component for the ShrinkLQ landing page.
 * Light-themed footer matching the overall landing page design.
 */
const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="bg-white text-slate-500 border-t border-slate-200 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8">

          {/* Brand */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <a href="#" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span
                className="text-2xl font-black text-black uppercase"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                ShrinkLQ
              </span>
            </a>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              The premium URL shortener and click‑intelligence platform for modern link management.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <span>Designed with love by</span>
              <a
                href="https://nisxzn.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-[#E8357C] transition-colors font-medium underline decoration-slate-300 underline-offset-4"
              >
                Nisxzn
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="w-full text-left text-slate-500 hover:text-[#E8357C] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowTerms(true)}
                  className="w-full text-left text-slate-500 hover:text-[#E8357C] transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Product & Connect */}
          <div className="md:col-span-5 grid md:grid-cols-2 gap-8">
            {/* Product */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-slate-500 hover:text-[#E8357C] transition-colors">Features</a></li>
                <li><a href="#analytics" className="text-slate-500 hover:text-[#E8357C] transition-colors">Analytics</a></li>
                <li><a href="#qr-codes" className="text-slate-500 hover:text-[#E8357C] transition-colors">QR Codes</a></li>
                <li><a href="#custom-aliases" className="text-slate-500 hover:text-[#E8357C] transition-colors">Custom Aliases</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com/nisxzn" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#E8357C] transition-colors">GitHub</a></li>
                <li><a href="https://www.linkedin.com/in/nithishparameswaran" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#E8357C] transition-colors">LinkedIn</a></li>
                <li><a href="mailto:nithishparameswaran2005@gmail.com" className="text-slate-500 hover:text-[#E8357C] transition-colors">Email</a></li>
                <li><a href="https://nisxzn.vercel.app" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#E8357C] transition-colors">Portfolio</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 my-4" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} ShrinkLQ. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted by</span>
            <a
              href="https://nisxzn.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-[#E8357C] transition-colors font-medium"
            >
              Nisxzn
            </a>
          </p>
        </div>

        {/* Privacy Policy Modal */}
        {showPrivacy && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-8">
              <h2 className="text-lg font-bold mb-4 text-slate-900">Privacy Policy</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Your privacy is important to us. We collect minimal data needed to provide the service, never share personal information with third parties without consent, and keep all data securely stored.
              </p>
              <button
                onClick={() => setShowPrivacy(false)}
                className="mt-6 px-5 py-2 bg-[#E8357C] text-white rounded-full text-sm font-semibold hover:bg-[#E8357C]/90 transition-all duration-200 hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Terms of Service Modal */}
        {showTerms && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-8">
              <h2 className="text-lg font-bold mb-4 text-slate-900">Terms of Service</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                By using ShrinkLQ, you agree to our terms of service. You may not misuse the platform, and you accept that we reserve the right to modify or discontinue the service at any time.
              </p>
              <button
                onClick={() => setShowTerms(false)}
                className="mt-6 px-5 py-2 bg-[#E8357C] text-white rounded-full text-sm font-semibold hover:bg-[#E8357C]/90 transition-all duration-200 hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </footer>
  );
};

export default Footer;
