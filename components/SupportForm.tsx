'use client';

import { useEffect, useState } from 'react';
import { Mail, RefreshCcw, Send, AlertCircle, UploadCloud, ChevronDown, X } from 'lucide-react';

type Screenshot = { file: File; previewUrl: string } | null;

const MAX_FILE_BYTES = 2.5 * 1024 * 1024;

const ISSUE_OPTIONS = [
  { value: 'login_after_sub', label: 'Cannot access premium after subscribing' },
  { value: 'billing', label: 'Billing / Double Charge' },
  { value: 'technical', label: 'Technical Error / Bug' },
  { value: 'other', label: 'Other Inquiry' },
];

const INITIAL = { name: '', email: '', issueType: 'login_after_sub', message: '' };

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const inputCls =
  'w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all';

function UploadBox({
  label,
  hint,
  hintClass,
  prompt,
  value,
  onChange,
  onError,
}: {
  label: string;
  hint: string;
  hintClass: string;
  prompt: string;
  value: Screenshot;
  onChange: (v: Screenshot) => void;
  onError: (msg: string) => void;
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return onError('Please upload an image file.');
    if (file.size > MAX_FILE_BYTES) return onError('Each screenshot must be under 2.5 MB.');
    onError('');
    onChange({ file, previewUrl: URL.createObjectURL(file) });
  };

  const clear = () => {
    if (value) URL.revokeObjectURL(value.previewUrl);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium text-slate-300">
        <span>{label}</span>
        <span className={`text-xs ${hintClass}`}>{hint}</span>
      </div>
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors h-48 ${
          value ? 'border-gold/40 bg-[#121212]' : 'border-white/10 hover:border-white/30 bg-[#121212]/50'
        }`}
      >
        {value ? (
          <div className="relative w-full h-full flex justify-center items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.previewUrl} alt={`${label} preview`} className="max-h-full max-w-full rounded object-contain" />
            <button
              type="button"
              onClick={clear}
              aria-label={`Remove ${label}`}
              className="absolute -top-3 -right-3 p-1.5 bg-black border border-white/10 text-white rounded-full hover:bg-red-900/80 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="w-8 h-8 text-slate-500 mb-3" />
            <span className="text-sm text-slate-300 font-medium text-center">{prompt}</span>
            <span className="text-xs text-slate-500 mt-1">PNG or JPG, up to 2.5 MB</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              aria-label={label}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function SupportForm() {
  const [formData, setFormData] = useState(INITIAL);
  const [payment, setPayment] = useState<Screenshot>(null);
  const [loginError, setLoginError] = useState<Screenshot>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Free object URLs on unmount
  useEffect(
    () => () => {
      if (payment) URL.revokeObjectURL(payment.previewUrl);
      if (loginError) URL.revokeObjectURL(loginError.previewUrl);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const [paymentScreenshot, errorScreenshot] = await Promise.all([
        payment ? fileToBase64(payment.file) : null,
        loginError ? fileToBase64(loginError.file) : null,
      ]);

      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          issue: formData.issueType,
          description: formData.message,
          paymentScreenshot,
          errorScreenshot,
        }),
      });
      const result = await res.json();

      if (!res.ok || result.status !== 'success') {
        throw new Error(result.message || 'Submission failed');
      }

      setSubmitSuccess(true);
      setFormData(INITIAL);
      setPayment(null);
      setLoginError(null);
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMsg('We could not send your ticket. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="ticket"
      className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative"
    >
      <div className="mb-8 border-b border-white/10 pb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-serif flex items-center gap-2">
          <Mail className="w-5 h-5 text-gold" />
          Open a Support Ticket
        </h2>
        <p className="text-slate-400 text-sm">
          Fill out the form below. Our support team will assist you within 24 hours.
        </p>
      </div>

      {errorMsg && (
        <div role="alert" className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-200 font-medium">Submission failed</h3>
            <p className="text-red-400/80 text-sm mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {submitSuccess ? (
        <div className="text-center py-12 px-4 bg-[#0F0F0F] rounded-xl border border-white/5" role="status">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 border border-gold/30 text-gold mb-6">
            <Send className="w-8 h-8 ml-1" />
          </div>
          <h3 className="text-2xl text-white font-bold mb-3 font-serif">Ticket submitted</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm">
            We received your request and will email you at the address you gave us.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="text-gold font-medium hover:text-amber-300 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCcw className="w-4 h-4" />
            Submit another ticket
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">Your Name *</label>
              <input id="name" type="text" name="name" required autoComplete="name" value={formData.name}
                onChange={handleInputChange} className={inputCls} placeholder="E.g., Jane Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Registered Email *</label>
              <input id="email" type="email" name="email" required autoComplete="email" value={formData.email}
                onChange={handleInputChange} className={inputCls} placeholder="email@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="issueType" className="block text-sm font-medium text-slate-300">Issue Type *</label>
            <div className="relative">
              <select id="issueType" name="issueType" value={formData.issueType} onChange={handleInputChange}
                className={`${inputCls} appearance-none`}>
                {ISSUE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UploadBox label="Payment Screenshot" hint="Recommended" hintClass="text-gold/70"
              prompt="Click to upload payment proof" value={payment} onChange={setPayment} onError={setErrorMsg} />
            <UploadBox label="Error Screenshot" hint="Optional" hintClass="text-slate-500"
              prompt="Click to upload error message" value={loginError} onChange={setLoginError} onError={setErrorMsg} />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-slate-300">Message Details *</label>
            <textarea id="message" name="message" required rows={4} value={formData.message}
              onChange={handleInputChange} className={`${inputCls} resize-y`}
              placeholder="Describe what happens when you try to access your reading…" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-black text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              isSubmitting
                ? 'bg-gold/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-coral to-gold hover:scale-[1.01] hover:shadow-lg hover:shadow-gold/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCcw className="w-5 h-5 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Support Ticket
              </>
            )}
          </button>
        </form>
      )}
    </section>
  );
}
