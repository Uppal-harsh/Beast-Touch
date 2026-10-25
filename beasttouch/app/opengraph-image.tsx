import { ImageResponse } from 'next/og';

export const alt = 'BeastTouch — Made of the streets';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#131411', color: '#f3f0e7', padding: 72, flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#dc815b', fontSize: 30, fontWeight: 700, letterSpacing: 4 }}>✳ BEASTTOUCH</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 900, letterSpacing: -5 }}>MADE OF</div>
        <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 900, letterSpacing: -5, color: '#dc815b' }}>THE STREETS.</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #5d5a4e', paddingTop: 26, fontSize: 24, letterSpacing: 2 }}><span>INDIAN SOUL. UNAPOLOGETIC SOLES.</span><span>BT—01</span></div>
    </div>,
    size,
  );
}
