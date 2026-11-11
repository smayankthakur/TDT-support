import { NextResponse, type NextRequest } from 'next/server';

// Short link for invites and share images: support.thedivinetarotonline.com/app
// The Android app is not on Google Play yet: Android phones get the APK straight from the website's download link
// (GitHub release `android-app` on devthedivinetarot/new-updated — always the latest version). Set PLAY_STORE_URL
// once the Play listing is live, and APP_STORE_URL once the iPhone app is on the App Store.
const APK = 'https://github.com/devthedivinetarot/new-updated/releases/download/android-app/The-Divine-Tarot.apk';
const PLAY = process.env.PLAY_STORE_URL || '';
const APP_STORE = process.env.APP_STORE_URL || '';
const WEBSITE = 'https://thedivinetarotonline.com/';

export function GET(req: NextRequest) {
  const ua = req.headers.get('user-agent') || '';
  let to = WEBSITE;
  if (/android/i.test(ua)) to = PLAY || APK;
  else if (/iphone|ipad|ipod/i.test(ua)) to = APP_STORE || WEBSITE;
  else to = PLAY || WEBSITE; // desktop: the website (its footer has the Android download button)
  const res = NextResponse.redirect(to, 302);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}
