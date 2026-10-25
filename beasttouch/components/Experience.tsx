'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowUpRight, Check, Menu, ShoppingBag, Volume2, VolumeX, X } from 'lucide-react';
import { CourtBoundary } from './court/CourtBoundary';
import { courtConfig, type SneakerId, type SneakerVariant } from './court/config';
import { ProductDialogs, productDetails, type ProductModal, type SavedPair } from './court/ProductDialogs';
import { useScrollProgress } from './court/useScrollProgress';
import './court/experience.css';

const CourtCanvas = dynamic(() => import('./court/CourtCanvas'), {
  ssr: false,
  loading: () => <div className="arena-loading" aria-hidden="true"><span />PREPARING THE COURT</div>,
});
const stops = [
  { id: 'arena', name: 'The Court', note: 'Where it all begins.' },
  { id: 'craft', name: 'The Craft', note: 'Get into the details.' },
  { id: 'collection', name: 'The Lineup', note: 'Three moods. One silhouette.' },
  { id: 'your-pair', name: 'Your Pair', note: 'Find your expression.' },
];
const isVariant = (value: unknown): value is SneakerVariant => value === 'Oxblood' || value === 'Forest' || value === 'Indigo';
function isSavedPair(value: unknown): value is SavedPair {
  return typeof value === 'object' && value !== null && 'size' in value && 'color' in value && typeof value.size === 'number' && Number.isInteger(value.size) && value.size >= 5 && value.size <= 12 && isVariant(value.color);
}

export default function Experience() {
  const scrollRoot = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const returnSneaker = useRef<SneakerId | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingId = useRef<SneakerId | null>(null);
  const progress = useScrollProgress(scrollRoot);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [focusedSneaker, setFocusedSneaker] = useState<SneakerId | null>(null);
  const [focusing, setFocusing] = useState(false);
  const [modal, setModal] = useState<ProductModal>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [color, setColor] = useState<SneakerVariant>('Oxblood');
  const [size, setSize] = useState<number | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [saved, setSaved] = useState<SavedPair | null>(null);
  const [explored, setExplored] = useState<number[]>([]);
  const [toast, setToast] = useState('');
  const [audioOn, setAudioOn] = useState(false);
  const overlayOpen = modal !== null || mapOpen;
  const currentStop = Math.min(3, Math.floor(progress * 3 + 0.28));

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReducedMotion(media.matches);
    motion();
    media.addEventListener('change', motion);
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setWebgl(!!context);
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { setWebgl(false); }
    try {
      const pair: unknown = JSON.parse(localStorage.getItem('beasttouch-pair') ?? 'null');
      if (isSavedPair(pair)) { setSaved(pair); setSize(pair.size); setColor(pair.color); }
      const variant = localStorage.getItem('beasttouch-variant');
      if (isVariant(variant)) setColor(variant);
    } catch { /* Invalid persisted data is ignored. */ }
    try {
      const details: unknown = JSON.parse(localStorage.getItem('beasttouch-explored') ?? '[]');
      if (Array.isArray(details) && details.every(value => Number.isInteger(value) && value >= 0 && value < 3)) setExplored([...new Set(details as number[])]);
    } catch { /* Keep the empty collection. */ }
    return () => { media.removeEventListener('change', motion); void audio.current?.close(); if (focusTimer.current) clearTimeout(focusTimer.current); };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const close = useCallback(() => {
    setModal(null); setMapOpen(false); setFocusedSneaker(null); setFocusing(false); pendingId.current = null;
    if (focusTimer.current) clearTimeout(focusTimer.current);
  }, []);

  useEffect(() => {
    if (!overlayOpen) return;
    if (!returnSneaker.current) previousFocus.current = document.activeElement as HTMLElement;
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const timer = setTimeout(() => overlay.current?.querySelector<HTMLElement>('button,a,input')?.focus(), 0);
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key !== 'Tab') return;
      const elements = overlay.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input,textarea,[tabindex="0"]');
      if (!elements?.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => {
      clearTimeout(timer); document.documentElement.style.overflow = overflow; document.removeEventListener('keydown', keyboard);
      const id = returnSneaker.current;
      requestAnimationFrame(() => {
        if (previousFocus.current?.isConnected) previousFocus.current.focus({ preventScroll: true });
        else if (id) {
          const sneaker = courtConfig.sneakers.find(item => item.id === id);
          const hotspot = [...document.querySelectorAll<HTMLElement>('.court-hotspot-button')].find(element => element.getAttribute('aria-label') === `Explore ${sneaker?.name}`);
          (hotspot ?? document.querySelector<HTMLElement>(`[data-sneaker-id="${id}"]`))?.focus({ preventScroll: true });
        }
        returnSneaker.current = null;
      });
    };
  }, [overlayOpen, close]);

  useEffect(() => {
    if (modal === null) return;
    const timer = setTimeout(() => overlay.current?.querySelector<HTMLElement>('button')?.focus(), 0);
    return () => clearTimeout(timer);
  }, [modal]);

  useEffect(() => {
    if (!focusing) return;
    const cancel = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    document.addEventListener('keydown', cancel);
    return () => document.removeEventListener('keydown', cancel);
  }, [focusing, close]);

  const go = (index: number) => {
    setMapOpen(false);
    document.getElementById(stops[index].id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };
  const changeColor = (variant: SneakerVariant) => {
    setColor(variant);
    try { localStorage.setItem('beasttouch-variant', variant); } catch { /* The choice still works in memory. */ }
  };
  const finishFocus = useCallback((id: SneakerId) => {
    if (pendingId.current !== id) return;
    if (focusTimer.current) clearTimeout(focusTimer.current);
    pendingId.current = null; setFocusing(false); setModal('product');
  }, []);
  const selectSneaker = (id: SneakerId) => {
    if (overlayOpen || focusing) return;
    previousFocus.current = document.activeElement as HTMLElement;
    returnSneaker.current = id;
    const sneaker = courtConfig.sneakers.find(item => item.id === id);
    if (sneaker) changeColor(sneaker.variant);
    setSizeError(false); setFocusedSneaker(id); pendingId.current = id;
    if (webgl === false || !sceneReady || reducedMotion) { finishFocus(id); return; }
    setFocusing(true);
    focusTimer.current = setTimeout(() => finishFocus(id), 1600);
  };
  const openDetail = (index: number) => {
    setModal(index);
    const next = [...new Set([...explored, index])]; setExplored(next);
    try { localStorage.setItem('beasttouch-explored', JSON.stringify(next)); } catch { /* Device storage is optional. */ }
  };
  const editPair = () => { if (saved) { setSize(saved.size); changeColor(saved.color); } setSizeError(false); setModal('product'); };
  const savePair = () => {
    if (!size) { setSizeError(true); return; }
    const pair = { size, color }; setSaved(pair);
    try { localStorage.setItem('beasttouch-pair', JSON.stringify(pair)); } catch { /* Device storage is optional. */ }
    close(); setToast('Your BT—01 is saved to your bag.');
  };
  const removePair = () => { setSaved(null); setSize(null); try { localStorage.removeItem('beasttouch-pair'); } catch { /* Keep the in-memory state. */ } };
  const toggleAudio = async () => {
    try {
      if (audioOn) { await audio.current?.suspend(); setAudioOn(false); return; }
      if (!audio.current) {
        const context = new AudioContext(); audio.current = context;
        const gain = context.createGain(); gain.gain.value = 0.012; gain.connect(context.destination);
        [110, 164.81, 220].forEach(frequency => { const oscillator = context.createOscillator(); oscillator.type = 'sine'; oscillator.frequency.value = frequency; oscillator.connect(gain); oscillator.start(); });
      }
      await audio.current.resume(); setAudioOn(true);
    } catch { setToast('Sound is unavailable in this browser.'); }
  };
  const sceneFailed = useCallback(() => { setWebgl(false); setSceneReady(false); }, []);
  const sceneLoaded = useCallback(() => setSceneReady(true), []);

  return <div className="court-experience" style={{ '--arena-accent': courtConfig.colors.accent, '--arena-blue': courtConfig.colors.secondary, '--arena-paper': courtConfig.colors.paper } as CSSProperties}>
    <header className="arena-header" inert={overlayOpen}>
      <a href="#arena" className="arena-wordmark" aria-label="BeastTouch home">BEASTTOUCH<span>®</span></a>
      <span className="arena-header-note">INDEPENDENT SPIRIT.<br />INDIAN SOUL.</span>
      <nav aria-label="Primary navigation"><Link href="/about" className="arena-about">Our story <ArrowUpRight size={12} /></Link><button onClick={() => setModal('bag')} aria-label={`Open bag, ${saved ? '1 saved pair' : 'empty'}`}><ShoppingBag size={17} /><span className="arena-bag-count">{saved ? '01' : '00'}</span></button><button onClick={() => setMapOpen(true)} aria-label="Open exploration menu"><Menu size={21} /></button></nav>
    </header>

    <main ref={scrollRoot} className="arena-scroll" inert={overlayOpen}>
      <div className={`arena-stage ${sceneReady ? 'is-ready' : ''}`} aria-label="Interactive BeastTouch basketball court">
        <div className="arena-poster"><Image src="/images/court-poster.svg" alt="" fill priority unoptimized sizes="100vw" /></div>
        {webgl && <CourtBoundary onError={sceneFailed}><CourtCanvas progress={progress} reducedMotion={reducedMotion} focusedSneaker={focusedSneaker} variant={color} onSelectSneaker={selectSneaker} onFocusComplete={finishFocus} onReady={sceneLoaded} onError={sceneFailed} suspended={overlayOpen} /></CourtBoundary>}
        <div className="arena-stage-shade" />
        {webgl === false && <p className="arena-fallback-note">Court preview · Explore every design below</p>}
      </div>

      <section id="arena" className="arena-section arena-hero" aria-label="The Court">
        <div className="arena-hero-copy"><p className="arena-eyebrow"><span /> THE STREETS HAVE A NEW HOME</p><h1>MADE OF<br />THE <em>STREETS.</em></h1><p className="arena-intro">Indian soul. Unapologetic soles.<br /><span>For the places that made you. And the places you’ll go.</span></p><a href="#collection" className="arena-outline-link">MEET THE BT—01 <ArrowUpRight size={18} /></a></div>
        <div className="arena-hero-bottom"><span className="arena-coordinate">28°36′ N / 77°12′ E<br /><strong>NEW DELHI. EVERYWHERE.</strong></span><a href="#craft" className="arena-scroll-cue"><ArrowDown size={15} /><span>SCROLL TO<br />FEEL THE DIFFERENCE</span></a><span className="arena-edition">EXPRESSION 001<br /><strong>THE COURT COLLECTION</strong></span></div>
        <span className="arena-hindi" aria-hidden="true">अपना रास्ता। अपना खेल।</span>
      </section>

      <section id="craft" className="arena-section arena-craft" aria-labelledby="craft-title">
        <div className="arena-glass-card"><p className="arena-eyebrow">01 / ROOTS IN EVERY THREAD</p><h2 id="craft-title">OLD SOUL.<br /><em>NEW EXPRESSION.</em></h2><p>Handloom-inspired texture. Court-born attitude. Every layer of the BT—01 carries a little of where we’re from.</p><div className="arena-material-links">{productDetails.map((detail, index) => <button key={detail.tag} onClick={() => openDetail(index)}><span>0{index + 1}</span>{['The textile', 'The material', 'The sole'][index]}<ArrowUpRight size={15} /><span className="arena-visited">{explored.includes(index) ? <Check size={13} /> : '+'}</span></button>)}</div></div>
        <span className="arena-section-watermark" aria-hidden="true">CRAFT / CULTURE</span>
      </section>

      <section id="collection" className="arena-section arena-collection" aria-labelledby="collection-title">
        <div className="arena-collection-heading"><p className="arena-eyebrow">02 / FIND YOUR EXPRESSION</p><h2 id="collection-title">THREE MOODS.<br /><em>ONE SILHOUETTE.</em></h2><p>Tap a sneaker on the court, or choose your colour below.</p></div>
        <div className="arena-sneaker-cards">{courtConfig.sneakers.map((sneaker, index) => <button key={sneaker.id} data-sneaker-id={sneaker.id} className={`arena-sneaker-card variant-${sneaker.variant.toLowerCase()}`} onClick={() => selectSneaker(sneaker.id)} disabled={focusing} aria-label={`Explore ${sneaker.name}, ${sneaker.variant} colourway`}><span className="arena-card-index">0{index + 1}<ArrowUpRight size={19} /></span><span className="arena-card-swatch" /><strong>{sneaker.variant}</strong><span>BT—01 / CHALK</span><small>{sneaker.label}</small></button>)}</div>
      </section>

      <section id="your-pair" className="arena-section arena-finale" aria-labelledby="pair-title"><div><p className="arena-eyebrow">03 / THE NEXT CHAPTER IS YOURS</p><h2 id="pair-title">LEAVE<br /><em>YOUR MARK.</em></h2><p>A little tradition. A lot of rebellion.<br />Choose a colour. Find your size. Make it yours.</p><button className="arena-primary-link" onClick={() => selectSneaker('origin')}>FIND YOUR PAIR <ArrowUpRight size={21} /></button><span className="arena-concept-note">An independent design concept. Not currently for sale.</span></div><Link href="/contact" className="arena-collab-link">SOMETHING IN MIND?<br /><span>LET’S MAKE IT HAPPEN <ArrowUpRight size={13} /></span></Link></section>
    </main>

    <nav className="arena-wayfinding" aria-label="Explore court sections" inert={overlayOpen}>{stops.map((stop, index) => <a href={`#${stop.id}`} key={stop.id} aria-current={currentStop === index ? 'location' : undefined}><span>0{index + 1}</span><i /><span className="arena-stop-label">{stop.name}</span></a>)}</nav>
    <button className="arena-audio" onClick={() => void toggleAudio()} aria-label={audioOn ? 'Mute ambient sound' : 'Play ambient sound'} aria-pressed={audioOn} inert={overlayOpen}>{audioOn ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>SOUND {audioOn ? 'ON' : 'OFF'}</span></button>
    <footer className="arena-footer" inert={overlayOpen}><Link href="/" className="arena-footer-brand">BEASTTOUCH.</Link><span>MADE OF THE STREETS.</span><nav aria-label="Footer"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link></nav></footer>

    {focusing && <div className="arena-focusing" role="status">A CLOSER LOOK <span /></div>}
    {mapOpen && <div className="overlay map-overlay" ref={overlay} role="dialog" aria-modal="true" aria-label="Explore BeastTouch"><div className="overlay-heading"><span>THE BEASTTOUCH WORLD</span><button className="close-button" onClick={close}>CLOSE <X size={19} /></button></div><div className="map-content"><p className="eyebrow">FOUR MOMENTS. ONE STATE OF MIND.</p>{stops.map((stop, index) => <button key={stop.id} className={`map-item ${index === currentStop ? 'selected' : ''}`} onClick={() => go(index)}><span className="map-number">0{index + 1}</span><span>{stop.name}</span><ArrowUpRight /><small>{stop.note}</small></button>)}</div><div className="map-footer"><span>अपना रास्ता। अपना खेल।</span><span>DESIGNED TO BE DIFFERENT.</span></div></div>}
    <ProductDialogs modal={modal} overlayRef={overlay} close={close} color={color} setColor={changeColor} size={size} setSize={value => { setSize(value); setSizeError(false); }} sizeError={sizeError} saved={saved} explored={explored} openDetail={openDetail} savePair={savePair} removePair={removePair} editPair={editPair} goToWorkshop={() => { close(); go(1); }} />
    {toast && <div className="toast" role="status"><Check size={17} />{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15} /></button></div>}
  </div>;
}
