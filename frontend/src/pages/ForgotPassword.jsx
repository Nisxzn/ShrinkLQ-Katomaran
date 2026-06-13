import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import { forgotPassword } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Strict email validation function matching backend
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return false;
    }
    
    if (email.includes('..')) {
      return false;
    }
    
    const [localPart, domain] = email.split('@');
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return false;
    }
    
    if (domain.startsWith('.') || domain.endsWith('.')) {
      return false;
    }
    
    if (!domain.includes('.')) {
      return false;
    }
    
    const tld = domain.split('.').pop();
    if (tld.length < 2) {
      return false;
    }
    
    const disposableDomains = ['tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com'];
    if (disposableDomains.some(d => domain.toLowerCase().endsWith(d))) {
      return false;
    }
    
    return true;
  };

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address (e.g., user@example.com)');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast.success('Password reset link sent (if account exists).');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-lg bg-card border border-border shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#E8357C]/10 flex items-center justify-center">
                <LinkIcon className="h-8 w-8 text-[#E8357C]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">Forgot Password</CardTitle>
            <CardDescription className="text-slate-500">
              Recover your ShrinkLQ account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        setError('');
                        
                        // Real-time email validation
                        if (value && !isValidEmail(value)) {
                          setError('Please enter a valid email address (e.g., user@example.com)');
                        }
                      }}
                      placeholder="you@example.com"
                      className={error ? 'border-[#E8357C] pl-10 bg-white' : 'pl-10 bg-white border-border text-slate-900 placeholder-slate-400'}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  {error && <p className="text-[#E8357C] text-sm">{error}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 bg-[#E8357C] hover:bg-[#E8357C]/95 text-white border-0 flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm">
                  We've sent a password reset link to <strong className="text-emerald-950">{email}</strong> if it is registered with ShrinkLQ. Please check your inbox and spam folder.
                </div>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="w-full border-border hover:bg-slate-100 hover:text-slate-900"
                >
                  Change email address
                </Button>
              </div>
            )}
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center space-x-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
