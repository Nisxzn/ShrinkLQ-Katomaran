import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Eye, EyeOff, Loader2, Check, AlertCircle } from 'lucide-react';
import { resetPassword } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength checks
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const getStrengthScore = () => {
    return Object.values(checks).filter(Boolean).length;
  };

  const getStrengthLabel = (score) => {
    if (!password) return '';
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
    const errs = {};
    const score = getStrengthScore();

    if (score < 5) {
      errs.password = 'Password does not meet all strength requirements';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!token) {
      toast.error('Missing password reset token.');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      toast.success(response.message || 'Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed. Token may be expired.');
    } finally {
      setLoading(false);
    }
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
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#E8357C]/10 flex items-center justify-center">
                <LinkIcon className="h-8 w-8 text-[#E8357C]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">Reset Password</CardTitle>
            <CardDescription className="text-slate-500">
              Create a new secure password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={errors.password ? 'border-[#E8357C] pr-10 bg-white' : 'pr-10 bg-white border-border text-slate-900 placeholder-slate-400'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all duration-200 rounded-full p-1 hover:bg-slate-100"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[#E8357C] text-sm flex items-center space-x-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2.5 p-3 rounded-lg bg-slate-50 border border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Password Strength:</span>
                    <span className={`font-bold ${
                      score < 3 ? 'text-rose-500' : score < 5 ? 'text-yellow-600' : 'text-emerald-500'
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
                        checks.length ? 'bg-emerald-555/10 text-emerald-600' : 'bg-slate-100 text-slate-400'
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={errors.confirmPassword ? 'border-[#E8357C] pr-10 bg-white' : 'pr-10 bg-white border-border text-slate-900 placeholder-slate-400'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all duration-200 rounded-full p-1 hover:bg-slate-100"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[#E8357C] text-sm flex items-center space-x-1 mt-1">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#E8357C] hover:bg-[#E8357C]/95 text-white border-0 flex items-center justify-center transition-all duration-200 hover:shadow-md"
                disabled={loading || score < 5}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
