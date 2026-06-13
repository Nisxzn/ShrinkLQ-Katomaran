import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Eye, EyeOff, Loader2, User, Mail, Lock, Check } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { register, googleLogin } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Enhanced email validation with provider-specific checks
  const getEmailError = (email) => {
    if (!email) return '';
    
    if (!isValidEmail(email)) {
      return 'Please enter a valid email address (e.g., user@example.com)';
    }

    const [localPart, domain] = email.split('@');
    const lowerDomain = domain.toLowerCase();

    // Catch common domain typos for popular providers
    const domainTypos = {
      'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gamil.com': 'gmail.com',
      'gnail.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gmail.co': 'gmail.com',
      'gmil.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamail.com': 'gmail.com',
      'gmail.con': 'gmail.com', 'gmail.om': 'gmail.com', 'gmail.cm': 'gmail.com',
      'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yhaoo.com': 'yahoo.com',
      'yahoo.co': 'yahoo.com', 'yahoo.con': 'yahoo.com',
      'outlok.com': 'outlook.com', 'outllook.com': 'outlook.com', 'outlook.co': 'outlook.com',
      'hotmal.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmial.com': 'hotmail.com',
      'hotmail.co': 'hotmail.com', 'hotmail.con': 'hotmail.com',
    };
    if (domainTypos[lowerDomain]) {
      return `Did you mean ${localPart}@${domainTypos[lowerDomain]}?`;
    }

    // For popular providers, reject local parts that are too short (likely invalid)
    const strictProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'yahoo.co.in', 'outlook.in'];
    if (strictProviders.includes(lowerDomain)) {
      // Gmail requires minimum 6 characters, others generally 3+
      const minLength = lowerDomain === 'gmail.com' ? 6 : 3;
      const cleanLocal = localPart.replace(/[.]/g, ''); // dots don't count in gmail
      if (cleanLocal.length < minLength) {
        return `${domain} requires at least ${minLength} characters before the @`;
      }
    }

    return '';
  };

  // Password strength check criteria
  const checks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const getStrengthScore = () => {
    return Object.values(checks).filter(Boolean).length;
  };

  const getStrengthLabel = (score) => {
    if (!formData.password) return '';
    if (score < 3) return 'Weak';
    if (score < 5) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = (score) => {
    if (score < 3) return 'bg-rose-500';
    if (score < 5) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailErr = getEmailError(formData.email);
      if (emailErr) {
        newErrors.email = emailErr;
      }
    }

    const score = getStrengthScore();
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (score < 5) {
      newErrors.password = 'Password does not meet strength requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    // Real-time email validation with provider-specific checks
    if (name === 'email' && value) {
      const emailErr = getEmailError(value);
      if (emailErr) {
        setErrors(prev => ({
          ...prev,
          email: emailErr
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await register(formData.name, formData.email, formData.password);
      toast.success(response.message || 'Registration successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed';
      // Map email-related errors to the inline email input error message
      if (
        errMsg.toLowerCase().includes('email') ||
        errMsg.toLowerCase().includes('domain') ||
        errMsg.toLowerCase().includes('mailbox') ||
        errMsg.toLowerCase().includes('address does not exist') ||
        errMsg.toLowerCase().includes('did you mean')
      ) {
        setErrors(prev => ({
          ...prev,
          email: errMsg
        }));
      }
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Callback
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await googleLogin(credentialResponse.credential);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Google registration & login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign In failed');
  };

  const score = getStrengthScore();

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
            <CardTitle className="text-3xl font-bold text-slate-900">Create an account</CardTitle>
            <CardDescription className="text-slate-500">Sign up to get started with ShrinkLQ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={errors.name ? 'border-[#E8357C] pl-10 bg-white' : 'pl-10 bg-white border-border text-slate-900 placeholder-slate-400'}
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                {errors.name && <p className="text-[#E8357C] text-sm">{errors.name}</p>}
              </div>

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
                <Label htmlFor="password" className="text-slate-700">Password</Label>
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

              {/* Password Strength Checklist & Bar */}
              {formData.password && (
                <div className="space-y-2.5 p-3 rounded-lg bg-slate-50 border border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className={`font-bold ${
                      score < 3 ? 'text-rose-500' : score < 5 ? 'text-yellow-500' : 'text-emerald-500'
                    }`}>
                      {getStrengthLabel(score)}
                    </span>
                  </div>
                  {/* Strength Bar */}
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor(score)} transition-all duration-300`}
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                  {/* Checklist */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1 text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        checks.length ? 'bg-emerald-550/10 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Check className="h-2 w-2" />
                      </span>
                      <span className={checks.length ? 'text-slate-700' : 'text-slate-400'}>8+ Characters</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        checks.uppercase ? 'bg-emerald-555/10 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Check className="h-2 w-2" />
                      </span>
                      <span className={checks.uppercase ? 'text-slate-700' : 'text-slate-400'}>Uppercase Letter</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        checks.lowercase ? 'bg-emerald-555/10 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Check className="h-2 w-2" />
                      </span>
                      <span className={checks.lowercase ? 'text-slate-700' : 'text-slate-400'}>Lowercase Letter</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        checks.number ? 'bg-emerald-555/10 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Check className="h-2 w-2" />
                      </span>
                      <span className={checks.number ? 'text-slate-700' : 'text-slate-400'}>One Number</span>
                    </div>
                    <div className="flex items-center space-x-1.5 col-span-2">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                        checks.special ? 'bg-emerald-555/10 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Check className="h-2 w-2" />
                      </span>
                      <span className={checks.special ? 'text-slate-700' : 'text-slate-400'}>One Special Character</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={errors.confirmPassword ? 'border-[#E8357C] pl-10 pr-10 bg-white' : 'pl-10 pr-10 bg-white border-border text-slate-900 placeholder-slate-400'}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all duration-200 rounded-full p-1 hover:bg-slate-100"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[#E8357C] text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-[#E8357C] hover:bg-[#E8357C]/95 text-white border-0 transition-all duration-200 hover:shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Sign up'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-slate-500">Or sign up with</span>
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

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-500">Already have an account? </span>
              <Link to="/login" className="text-[#E8357C] hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
