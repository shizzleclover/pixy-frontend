'use client';

import { useEffect, useState } from 'react';
import { getBrowserName, getPlatform, isInAppBrowser } from '@/lib/utils/browser';

/**
 * Instagram, WhatsApp and friends open links in their own browser, where the
 * camera and uploads are unreliable. Ask the guest to switch first.
 */
export default function InAppBrowserModal() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [browser, setBrowser] = useState('your browser');

  useEffect(() => {
    if (isInAppBrowser()) {
      setShow(true);
      setPlatform(getPlatform());
      setBrowser(getBrowserName());
    }
  }, []);

  if (!show) return null;

  const copy = async () => {
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
      ? ['Tap ••• or the share icon', 'Choose “Open in Safari”']
      : platform === 'android'
        ? ['Tap ⋮ at the top right', 'Choose “Open in browser” or “Open in Chrome”']
        : ['Open the menu', `Choose “Open in ${browser}”`];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inapp-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center"
    >
      <div className="safe-bottom w-full max-w-md rounded-t-card bg-paper px-6 pt-6 sm:rounded-card sm:pb-6">
        <h2 id="inapp-title" className="font-serif text-[30px] leading-tight">
          Open this in your browser
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          You’re inside another app’s browser, where the camera and uploads often fail.
        </p>
        <ol className="mt-5 space-y-3">
          {steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3 text-[15px]">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-ink text-sm font-semibold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-6 space-y-1">
          <button onClick={copy} className="btn btn-primary w-full">
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <button onClick={() => setShow(false)} className="btn btn-text w-full text-muted">
            Continue here anyway
          </button>
        </div>
      </div>
    </div>
  );
}
