'use client';

import { ArrowRight, ArrowUpRight, Check, ShoppingBag, X } from 'lucide-react';
import type { RefObject } from 'react';
import SneakerAsset from './SneakerAsset';
import type { SneakerVariant } from './config';

export type SavedPair = { size: number; color: SneakerVariant };
export type ProductModal = 'product' | 'bag' | 'story' | number | null;
export const productDetails = [
  { title: 'A thread of home.', tag: '01 / THE TEXTILE', text: 'The woven side panel takes its rhythm from Indian textiles. Geometric lines, earthy colours, and a texture with a story of its own.', note: 'Design direction · handloom-inspired weave' },
  { title: 'Soft spot. Strong character.', tag: '02 / THE MATERIAL', text: 'Deep oxblood meets warm, chalk-toned panels. A flash of cobalt breaks the rules. Red earth, old walls, and electric city nights, in one silhouette.', note: 'Design direction · suede, canvas & leather' },
  { title: 'Grounded. Never ordinary.', tag: '03 / THE SOLE', text: 'A generous cream cupsole gives the BT—01 its grounded stance. Contrast stitching and a textured edge finish a silhouette made for everyday expression.', note: 'Design direction · textured court cupsole' },
];

type Props = {
  modal: ProductModal;
  overlayRef: RefObject<HTMLDivElement | null>;
  close: () => void;
  color: SneakerVariant;
  setColor: (color: SneakerVariant) => void;
  size: number | null;
  setSize: (size: number) => void;
  sizeError: boolean;
  saved: SavedPair | null;
  explored: number[];
  openDetail: (index: number) => void;
  savePair: () => void;
  removePair: () => void;
  editPair: () => void;
  goToWorkshop: () => void;
};

export function ProductDialogs(props: Props) {
  const { modal, overlayRef, close, color, setColor, size, setSize, sizeError, saved, explored, openDetail, savePair, removePair, editPair, goToWorkshop } = props;
  if (modal === null) return null;
  const label = typeof modal === 'number' ? productDetails[modal].title : modal === 'product' ? 'Explore the BT—01' : modal === 'bag' ? 'Your saved bag' : 'Our story';
  return <div className="modal-backdrop" onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div ref={overlayRef} className={`modal ${modal === 'bag' ? 'bag-modal' : ''} ${modal === 'story' ? 'story-modal' : ''}`} role="dialog" aria-modal="true" aria-label={label}>
      <button className="modal-close" onClick={close} aria-label="Close dialog"><X size={22} /></button>
      {modal === 'product' && <>
        <div className="modal-product-image"><span className="eyebrow">BEASTTOUCH / EXPRESSION 001</span><SneakerAsset variant={color} alt={`BT—01 concept sneaker in ${color} and chalk`} /><div><span>अपना रास्ता।</span><span className="dialog-brand">BT.</span></div></div>
        <div className="product-config">
          <p className="eyebrow">THE FIRST EXPRESSION</p><h2>BT—01<span>Everyday. Your way.</span></h2><p>A court silhouette with a distinctly Indian soul. Woven details, bold contrasts, and an attitude all its own.</p>
          <div className="config-label">COLOUR <span>{color.toUpperCase()} / CHALK</span></div>
          <div className="color-options">{(['Oxblood', 'Forest', 'Indigo'] as const).map(variant => <button key={variant} aria-label={`${variant} colour concept`} aria-pressed={variant === color} className={`color-option ${variant.toLowerCase()} ${variant === color ? 'selected' : ''}`} onClick={() => setColor(variant)}>{variant === color && <Check size={16} />}</button>)}</div>
          <div className="config-label">SELECT SIZE <span>UK / INDIA</span></div><div className="size-options">{[5, 6, 7, 8, 9, 10, 11, 12].map(value => <button key={value} className={size === value ? 'selected' : ''} aria-pressed={size === value} onClick={() => setSize(value)}>{value}</button>)}</div>
          {sizeError && <p className="size-error" role="alert">Choose a size to save your pair.</p>}
          <button className="primary-button" onClick={savePair}>SAVE YOUR PAIR <ArrowUpRight size={19} /></button><p className="concept-note">An original design concept, not currently for sale. Your selection is saved on this device. Colourways are visual studies.</p>
        </div>
      </>}
      {typeof modal === 'number' && <>
        <div className={`detail-image detail-${modal}`}><SneakerAsset variant={color} alt={`BT—01 detail: ${productDetails[modal].title}`} /><span className="detail-counter">0{modal + 1} / 03</span></div>
        <div className="detail-copy"><p className="eyebrow">{productDetails[modal].tag}</p><h2>{productDetails[modal].title}</h2><p>{productDetails[modal].text}</p><span className="material-note">{productDetails[modal].note}</span><button className="primary-button" onClick={() => openDetail((modal + 1) % 3)}>NEXT DETAIL <ArrowRight size={18} /></button><span className="explored-count">{explored.length} OF 3 DETAILS EXPLORED</span></div>
      </>}
      {modal === 'bag' && <div className="bag-content">
        <p className="eyebrow">A LITTLE PIECE OF YOUR PERSONALITY.</p><h2>Your bag<span>({saved ? '01' : '00'})</span></h2>
        {saved ? <>
          <div className="bag-item"><SneakerAsset variant={saved.color} alt={`Saved BT—01 in ${saved.color} and chalk`} /><div><h3>BT—01</h3><p>{saved.color} / Chalk<br />UK {saved.size} · Concept edition</p><button onClick={removePair}>REMOVE <X size={11} /></button></div></div>
          <div className="saved-notice"><Check size={20} /><p>Your expression, saved.<span>This concept pair stays in your bag on this device. No order or payment has been placed.</span></p></div><button className="primary-button" onClick={editPair}>EDIT YOUR PAIR <ArrowRight size={18} /></button>
        </> : <div className="empty-bag"><ShoppingBag size={40} strokeWidth={1} /><h3>Make it yours.</h3><p>Your next expression is waiting.<br />Find a colour. Pick a size. Save your pair.</p><button className="primary-button" onClick={editPair}>EXPLORE BT—01 <ArrowUpRight size={18} /></button></div>}
      </div>}
      {modal === 'story' && <div className="story-content"><p className="eyebrow">THE BEASTTOUCH STATE OF MIND</p><h2>FROM OUR<br />STREETS.<br /><em>TO YOUR STORY.</em></h2><div className="story-columns"><p>The last game before the streetlights come on. A chai break that turns into a plan. The colour of a city that never asks permission.</p><p>BeastTouch is an independent sneaker concept inspired by that spirit. Familiar textures. Unfamiliar combinations. Completely our own.</p></div><span className="hindi-story">अपना रास्ता। अपना खेल।</span><button className="primary-button" onClick={goToWorkshop}>STEP INTO THE WORKSHOP <ArrowUpRight size={20} /></button></div>}
    </div>
  </div>;
}
