'use client';

import { useEffect, useState } from 'react';
import { isInAppBrowser, getBrowserName, getPlatform } from '@/lib/utils/browser';
import { LogoMark } from '@/components/shared/logo';

export default function InAppBrowserModal() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    if (isInAppBrowser()) {
      setShow(true);
      setPlatform(getPlatform());
    }
  }, []);

  if (!show) return null;

  const browser = getBrowserName();

  const handleOpenInBrowser = () => {
    const url = window.location.href;
    // Android in-app webviews usually honour an intent-style target.
    window.open(url, '_system');
    window.location.href = url;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const steps =
    platform === 'ios'
      ? ['Tap the ••• menu at the top right', 'Choose “Open in Safari”', 'Come back and join the room']
      : platform === 'android'
        ? ['Tap the ⋮ menu at the top right', 'Choose “Open in browser”', 'Come back and join the room']
        : ['Open your browser menu', `Choose “Open in ${browser}”`, 'Come back and join the room'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/85 p-4 backdrop-blur-md sm:items-center">
      <div className="w-full max-w-md animate-scale-in rounded-4xl border border-white/10 bg-ink-900/95 p-7 shadow-card">
        <div className="flex items-center gap-3">
          <LogoMark className="h-11 w-11" />
          <div>
            <p className="font-display text-lg font-bold text-white">Open in your browser</p>
            <p className="text-xs text-slate-400">One tap and you’re in</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-400">
          You’re viewing Pixy inside another app’s browser. Cameras and uploads only work properly in{' '}
          <span className="font-semibold text-white">{browser}</span>, so open the page there to keep shooting.
        </p>

        <ol className="mt-5 space-y-2.5">
          {steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-semibold text-brand-200">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-6 space-y-2.5">
          <button onClick={handleOpenInBrowser} className="btn btn-primary w-full btn-lg">
            Open in {browser}
          </button>
          <button onClick={handleCopy} className="btn btn-secondary w-full">
            {copied ? '✓ Link copied' : 'Copy link instead'}
          </button>
          <button onClick={() => setShow(false)} className="btn btn-ghost w-full text-xs text-slate-500">
            Continue anyway — camera may not work
          </button>
        </div>
      </div>
    </div>
  );
}
