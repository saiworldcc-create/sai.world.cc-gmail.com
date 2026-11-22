import React from 'react';

/**
 * Authentic Apple iOS 18 Squircle Icon System
 * Crafted with Apple's 22.5% continuous curvature superellipse,
 * dual specular highlights, 3D gradient bevel, and colored glow shadows.
 */

export const APPLE_PALETTES = {
  blue: {
    bg: 'linear-gradient(180deg, #2997FF 0%, #0071E3 100%)',
    shadow: '0 8px 22px rgba(0, 113, 227, 0.45)',
    border: 'rgba(255, 255, 255, 0.35)'
  },
  green: {
    bg: 'linear-gradient(180deg, #34C759 0%, #248A3D 100%)',
    shadow: '0 8px 22px rgba(52, 199, 89, 0.45)',
    border: 'rgba(255, 255, 255, 0.35)'
  },
  orange: {
    bg: 'linear-gradient(180deg, #FF9500 0%, #E06C00 100%)',
    shadow: '0 8px 22px rgba(255, 149, 0, 0.45)',
    border: 'rgba(255, 255, 255, 0.35)'
  },
  purple: {
    bg: 'linear-gradient(180deg, #AF52DE 0%, #5E5CE6 100%)',
    shadow: '0 8px 22px rgba(175, 82, 222, 0.45)',
    border: 'rgba(255, 255, 255, 0.35)'
  },
  red: {
    bg: 'linear-gradient(180deg, #FF453A 0%, #D70015 100%)',
    shadow: '0 8px 22px rgba(255, 69, 58, 0.45)',
    border: 'rgba(255, 255, 255, 0.35)'
  },
  teal: {
    bg: 'linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%)',
    shadow: '0 8px 22px rgba(90, 200, 250, 0.45)',
    border: 'rgba(255, 255, 255, 0.35)'
  },
  gold: {
    bg: 'linear-gradient(180deg, #FFD60A 0%, #D49B00 100%)',
    shadow: '0 8px 22px rgba(255, 214, 10, 0.45)',
    border: 'rgba(255, 255, 255, 0.35)'
  },
  cyan: {
    bg: 'linear-gradient(180deg, #32D74B 0%, #00A699 100%)',
    shadow: '0 8px 22px rgba(0, 166, 153, 0.45)',
    border: 'rgba(255, 255, 255, 0.35)'
  },
  dark: {
    bg: 'linear-gradient(180deg, #3A3A3C 0%, #1C1C1E 100%)',
    shadow: '0 8px 22px rgba(0, 0, 0, 0.6)',
    border: 'rgba(255, 255, 255, 0.2)'
  }
};

export function AppleSquircleBadge({ 
  palette = 'blue', 
  size = 46, 
  iconSize = 22, 
  children,
  className = '',
  style = {}
}) {
  const p = APPLE_PALETTES[palette] || APPLE_PALETTES.blue;
  const radius = Math.round(size * 0.24); // Apple continuous curvature squircle

  return (
    <div 
      className={`apple-squircle-icon-badge ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: `${radius}px`,
        background: p.bg,
        boxShadow: `${p.shadow}, inset 0 1.2px 1.2px rgba(255, 255, 255, 0.5), inset 0 -1.5px 2px rgba(0, 0, 0, 0.3)`,
        border: `1px solid ${p.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        position: 'relative',
        flexShrink: 0,
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
        ...style
      }}
    >
      {/* Specular Top Shimmer */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '40%',
          borderRadius: `${radius}px ${radius}px 50% 50%`,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none'
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Authentic Apple Face ID Biometric Glyph
 */
export function AppleFaceIDIcon({ size = 24, color = '#38bdf8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 4 Corner Brackets */}
      <path d="M7 3H5C3.89543 3 3 3.89543 3 5V7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 21H19C20.1046 21 21 20.1046 21 19V17" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Biometric Eyes */}
      <circle cx="9" cy="9.5" r="1.3" fill={color} />
      <circle cx="15" cy="9.5" r="1.3" fill={color} />
      {/* Biometric Nose & Smile */}
      <path d="M12 11V13.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M8.5 16C9.5 17.5 14.5 17.5 15.5 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Official Apple App Store Style Sai Logistics Icon
 */
export function AppleSaiAppIcon({ size = 52 }) {
  const radius = Math.round(size * 0.24);
  return (
    <div 
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${radius}px`,
        background: 'linear-gradient(145deg, #0284c7 0%, #0369a1 50%, #070f1e 100%)',
        boxShadow: '0 10px 25px rgba(2, 132, 199, 0.5), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.4)',
        border: '1.2px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0
      }}
    >
      {/* Specular Shimmer */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '45%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none'
        }}
      />
      {/* Supersonic Jet & Cargo Emblem */}
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 32 32" fill="none">
        <path 
          d="M29 3L17 15M29 3L20 29L15 17L3 12L29 3Z" 
          stroke="#ffffff" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <circle cx="29" cy="3" r="2.5" fill="#38bdf8" />
      </svg>
    </div>
  );
}
