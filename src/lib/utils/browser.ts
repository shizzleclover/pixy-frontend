export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  
  const inAppPatterns = [
    /Instagram/i,
    /FBAN/i,
    /FBAV/i,
    /Twitter/i,
    /Line/i,
    /Snapchat/i,
    /WhatsApp/i,
    /LinkedIn/i,
    /TikTok/i,
    /WeChat/i,
    /Pinterest/i,
  ];
  
  return inAppPatterns.some(pattern => pattern.test(ua));
}

export function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (/Edg/i.test(ua)) return 'Edge';
  if (/Chrome/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua)) return 'Safari';
  if (/Firefox/i.test(ua)) return 'Firefox';
  return 'your browser';
}

export function getPlatform(): 'ios' | 'android' | 'other' {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}
