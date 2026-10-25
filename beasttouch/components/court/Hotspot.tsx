'use client';

import { Html } from '@react-three/drei';
import { courtConfig, type SneakerId } from './config';

type HotspotProps = {
  id: SneakerId;
  focusedSneaker: SneakerId | null;
  onSelect: (id: SneakerId) => void;
  onHover: (id: SneakerId | null) => void;
};

export default function Hotspot({ id, focusedSneaker, onSelect, onHover }: HotspotProps) {
  const sneaker = courtConfig.sneakers.find((item) => item.id === id);
  if (!sneaker || focusedSneaker !== null) return null;

  return <Html
    position={courtConfig.hotspot.offset}
    center
    distanceFactor={courtConfig.hotspot.distanceFactor}
    zIndexRange={courtConfig.hotspot.zIndexRange}
    style={{ pointerEvents: 'auto' }}
  >
    <button
      className="court-hotspot-button"
      type="button"
      aria-label={`Explore ${sneaker.name}`}
      aria-describedby={`court-hotspot-tooltip-${id}`}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => { event.stopPropagation(); onSelect(id); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
        padding: '8px 11px', border: `1px solid ${courtConfig.colors.paper}bb`, borderRadius: 2,
        background: `${courtConfig.colors.background}db`, color: courtConfig.colors.paper, fontSize: 9, fontWeight: 700,
        letterSpacing: 1.2, cursor: 'pointer', boxShadow: '0 7px 18px #0008',
      }}
    >
      <span aria-hidden="true" style={{ color: courtConfig.colors.accent, fontSize: 19, lineHeight: 0.8 }}>+</span>
      {sneaker.name}
    </button>
    <span className="court-hotspot-tooltip" id={`court-hotspot-tooltip-${id}`} role="tooltip">{sneaker.label}</span>
  </Html>;
}
