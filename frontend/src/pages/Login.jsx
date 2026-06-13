import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Eye, EyeOff, Loader2, Mail, Lock, ShieldAlert } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { login, googleLogin, resendVerification } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., user@example.com)';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for the field being edited
    setErrors({
      ...errors,
      [name]: ''
    });

    // Real-time email validation
    if (name === 'email' && value) {
      if (!isValidEmail(value)) {
        setErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address (e.g., user@example.com)'
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setShowResend(false);
    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      
      // If user is unverified, show resend verification button
      if (error.response?.status === 403 && error.response?.data?.unverified) {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Login callbacks
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await googleLogin(credentialResponse.credential);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Google Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign In failed');
  };

  // Resend Verification callback
  const handleResendVerification = async () => {
    setResending(true);
    try {
      const response = await resendVerification(formData.email);
      toast.success(response.message || 'Verification email sent! Please check your inbox.');
      setShowResend(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
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
          <CardHeader className="space-y-1 text-center pt-8">
            <CardTitle className="text-3xl font-bold text-slate-900">Welcome back</CardTitle>
            <CardDescription className="text-slate-500">Sign in to your ShrinkLQ account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={errors.email ? 'border-[#E8357C] pl-10 bg-white' : 'pl-10 bg-white border-border text-slate-900 placeholder-slate-400'}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                {errors.email && <p className="text-[#E8357C] text-sm">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-[#E8357C] hover:underline font-medium">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={errors.password ? 'border-[#E8357C] pl-10 pr-10 bg-white' : 'pl-10 pr-10 bg-white border-border text-slate-900 placeholder-slate-400'}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all duration-200 rounded-full p-1 hover:bg-slate-100"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[#E8357C] text-sm">{errors.password}</p>}
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-[#E8357C] hover:bg-[#E8357C]/95 text-white border-0 transition-all duration-200 hover:shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Unverified Email Resend Notice */}
            {showResend && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm space-y-2.5 flex flex-col items-center"
              >
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0 text-amber-600" />
                  <span className="font-semibold text-amber-900">Verification Needed</span>
                </div>
                <p className="text-xs text-center text-amber-700">
                  Please click the link in your email to verify your account. If you didn't receive it, we can resend it.
                </p>
                <Button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="w-full h-9 bg-amber-100 hover:bg-amber-200 text-amber-900 hover:text-amber-950 border border-amber-300 rounded-full transition-all duration-200 hover:shadow-sm"
                >
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
              </motion.div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth Login */}
            <div className="flex justify-center w-full">
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  shape="pill"
                  width="384px"
                />
              </div>
            </div>

            <div className="text-center text-sm">
              <span className="text-slate-500">Don't have an account? </span>
              <Link to="/signup" className="text-[#E8357C] hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
