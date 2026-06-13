import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { verifyEmail } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const triggerVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token in the URL. Please verify you clicked the correct link.');
        return;
      }

      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        toast.success('Email verified successfully! You can now log in.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may have expired or is invalid.');
        toast.error(error.response?.data?.message || 'Verification failed.');
      }
    };

    triggerVerification();
  }, [token]);

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
            <CardTitle className="text-3xl font-bold text-slate-900">Email Verification</CardTitle>
            <CardDescription className="text-slate-500">Verifying your ShrinkLQ account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center py-6">
            {status === 'verifying' && (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-[#E8357C] animate-spin mx-auto" />
                <p className="text-slate-600">Checking verification token...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-6 w-full">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                <div className="space-y-2">
                  <p className="text-slate-900 font-semibold text-lg">Verification Successful!</p>
                  <p className="text-slate-500 text-sm">{message}</p>
                </div>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full h-11 bg-[#E8357C] hover:bg-[#E8357C]/95 text-white border-0 flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-md"
                >
                  <span>Proceed to Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6 w-full">
                <XCircle className="h-16 w-16 text-rose-500 mx-auto" />
                <div className="space-y-2">
                  <p className="text-slate-900 font-semibold text-lg">Verification Failed</p>
                  <p className="text-slate-500 text-sm px-4">{message}</p>
                </div>
                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => navigate('/login')}
                    className="w-full h-11 bg-[#E8357C] hover:bg-[#E8357C]/95 text-white border-0 transition-all duration-200 hover:shadow-md"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
