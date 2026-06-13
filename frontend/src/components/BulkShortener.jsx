import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {
  Upload,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Copy,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { bulkCreateUrls } from '../services/api';
import toast from 'react-hot-toast';

const cn = (...cls) => cls.filter(Boolean).join(' ');

const BulkShortener = ({ onRefresh }) => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({ success: [], errors: [] });
  const [defaultExpiryDate, setDefaultExpiryDate] = useState('');
  const [customAliasPrefix, setCustomAliasPrefix] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResults({ success: [], errors: [] });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            resolve([]);
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          const urls = [];
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const urlObj = {};
            headers.forEach((header, index) => {
              urlObj[header] = values[index]?.trim() || '';
            });
            
            // Find the original URL from any possible header name
            const originalUrl = urlObj.originalurl || urlObj['originalurl'] || urlObj.original_url || urlObj.url;
            
            if (originalUrl) {
              // Add http:// if missing
              let formattedUrl = originalUrl;
              if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
                formattedUrl = `https://${originalUrl}`;
              }
              
              // Use CSV values or defaults
              let finalCustomAlias = urlObj.customalias || urlObj.custom_alias || undefined;
              let finalExpiryDate = urlObj.expirydate || urlObj.expiry_date || undefined;
              
              // Apply defaults if not specified in CSV
              if (!finalCustomAlias && customAliasPrefix) {
                finalCustomAlias = `${customAliasPrefix}-${urls.length + 1}`;
              }
              if (!finalExpiryDate && defaultExpiryDate) {
                finalExpiryDate = defaultExpiryDate;
              }
              
              urls.push({
                originalUrl: formattedUrl,
                customAlias: finalCustomAlias,
                expiryDate: finalExpiryDate
              });
            }
          }
          console.log('Parsed URLs:', urls);
          resolve(urls);
        } catch (error) {
          console.error('CSV parsing error:', error);
          reject(error);
        }
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const handleProcess = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);

    try {
      const urls = await parseCSV(file);
      console.log('URLs to process:', urls);
      
      if (urls.length === 0) {
        toast.error('No valid URLs found in CSV');
        setProcessing(false);
        return;
      }

      setProgress(50);
      const response = await bulkCreateUrls(urls);
      console.log('API response:', response);
      
      if (response.success) {
        setResults(response.data);
        setProgress(100);
        
        if (response.data.successCount > 0) {
          toast.success(`${response.data.successCount} URLs shortened successfully!`);
        }
        if (response.data.errorCount > 0) {
          toast.error(`${response.data.errorCount} URLs failed to process`);
        }
        
        onRefresh();
      } else {
        toast.error(response.message || 'Failed to process URLs');
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to process CSV');
    } finally {
      setProcessing(false);
      setFile(null);
    }
  };

  const downloadExampleCSV = () => {
    const csvContent = 'originalUrl,customAlias,expiryDate\nhttps://google.com,my-google,2025-12-31\nhttps://github.com,my-github,\nhttps://youtube.com,,2025-06-30';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example-urls.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadResultsCSV = () => {
    const headers = ['Original URL', 'Short URL', 'Custom Alias', 'Expiry Date', 'Status'];
    const rows = [
      ...results.success.map(r => [
        r.originalUrl, 
        r.shortUrl, 
        r.shortCode || '', 
        r.expiryDate ? new Date(r.expiryDate).toLocaleDateString('en-GB') : '', 
        'Success'
      ]),
      ...results.errors.map(e => [e.originalUrl, '', '', '', e.error])
    ];
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Results exported!');
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Bulk URL Shortener
        </h2>
        <p className="text-sm text-slate-500 mt-1">Upload a CSV file to shorten multiple URLs at once</p>
      </motion.div> */} 

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-[#E8357C]/15 bg-card shadow-sm overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Upload CSV</h3>
            <button
              onClick={downloadExampleCSV}
              className="flex items-center space-x-2 text-xs text-[#E8357C] hover:text-[#E8357C]/80 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Example CSV</span>
            </button>
          </div>

          {/* Default Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Custom Alias <span className="normal-case tracking-normal text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={customAliasPrefix}
                onChange={(e) => setCustomAliasPrefix(e.target.value)}
                placeholder="my-campaign"
                className="w-full rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 px-3.5 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#E8357C]/30 focus:border-[#E8357C]/50 hover:border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Expiry Date <span className="normal-case tracking-normal text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={defaultExpiryDate}
                onChange={(e) => setDefaultExpiryDate(e.target.value)}
                className="w-full rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 px-3.5 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#E8357C]/30 focus:border-[#E8357C]/50 hover:border-slate-300"
              />
            </div>
          </div>

          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
              isDragActive
                ? 'border-[#E8357C] bg-[#E8357C]/5'
                : 'border-slate-300 hover:border-[#E8357C]/50 hover:bg-slate-50'
            )}
          >
            <input {...getInputProps()} />
            <Upload className={cn('h-8 w-8 mx-auto mb-3', isDragActive ? 'text-[#E8357C]' : 'text-slate-400')} />
            <p className="text-sm text-slate-600 mb-1">
              {isDragActive ? 'Drop the CSV file here' : 'Drag & drop a CSV file, or click to select'}
            </p>
            <p className="text-xs text-slate-400">Supports CSV format with originalUrl column</p>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          {processing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-600">Processing...</span>
                <span className="text-xs font-semibold text-[#E8357C]">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  className="bg-[#E8357C] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleProcess}
            disabled={!file || processing}
            className={cn(
              'flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 mt-4',
              'bg-[#E8357C] hover:bg-[#E8357C]/90',
              'text-white shadow-lg shadow-[#E8357C]/20',
              'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none'
            )}
          >
            {processing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /><span>Processing...</span></>
            ) : (
              <><Upload className="h-4 w-4" /><span>Process URLs</span></>
            )}
          </button>
        </div>
      </motion.div>

      {/* Results */}
      {(results.success.length > 0 || results.errors.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Results</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {results.success.length} successful, {results.errors.length} failed
              </p>
            </div>
            <button
              onClick={downloadResultsCSV}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  {['Original URL', 'Short URL', 'Custom Alias', 'Expiry Date', 'Status', 'Actions'].map((h, i) => (
                    <th
                      key={i}
                      className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 text-left"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results.success.map((url, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-5 py-3 max-w-[200px]">
                      <span className="text-slate-700 text-xs truncate font-mono block">{url.originalUrl}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[#E8357C] text-xs font-mono font-semibold">{url.shortUrl}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-600 text-xs font-mono">{url.shortCode || '-'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-600 text-xs">
                        {url.expiryDate ? new Date(url.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center space-x-1 text-xs text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Success</span>
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleCopy(url.shortUrl)}
                        className="text-slate-400 hover:text-[#E8357C] transition-colors"
                        title="Copy"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {results.errors.map((error, idx) => (
                  <tr key={`error-${idx}`} className="hover:bg-slate-50">
                    <td className="px-5 py-3 max-w-[200px]">
                      <span className="text-slate-700 text-xs truncate font-mono block">{error.originalUrl}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-400 text-xs">-</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-400 text-xs">-</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-400 text-xs">-</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center space-x-1 text-xs text-red-600">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>{error.error}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-400 text-xs">-</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BulkShortener;
