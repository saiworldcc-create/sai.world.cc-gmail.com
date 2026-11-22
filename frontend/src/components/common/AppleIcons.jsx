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
 * ==============================================================================
 * ULTRA LUXURY 3D APPLE-GRADE ILLUSTRATED ICONS
 * Engineered with multi-stop gradients, specular reflections, 3D drop-shadows,
 * and authentic isometric cargo & logistics depth.
 * ==============================================================================
 */

/** 1. 3D Isometric Parcel Box (Book Doorstep Pickup) */
export function Apple3DParcelBox({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boxTop" x1="16" y1="12" x2="48" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="boxLeft" x1="10" y1="28" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C47E3D" />
          <stop offset="1" stopColor="#8C4B18" />
        </linearGradient>
        <linearGradient id="boxRight" x1="32" y1="28" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="blueTape" x1="28" y1="14" x2="36" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#0284C7" />
          <stop offset="1" stopColor="#0369A1" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="20" ry="5.5" fill="#000000" opacity="0.35" />

      {/* Top Face */}
      <polygon points="32,10 54,22 32,34 10,22" fill="url(#boxTop)" stroke="#FFFBEB" strokeWidth="0.8" />

      {/* Left Face */}
      <polygon points="10,22 32,34 32,56 10,44" fill="url(#boxLeft)" />

      {/* Right Face */}
      <polygon points="32,34 54,22 54,44 32,56" fill="url(#boxRight)" />

      {/* Priority Air Cargo Sealing Tape */}
      <polygon points="29,11.5 35,14.8 35,35.5 29,32.2" fill="url(#blueTape)" />
      <polygon points="29,32.2 35,35.5 35,56 29,54.5" fill="url(#blueTape)" opacity="0.95" />

      {/* White Shipping Label & Barcode */}
      <polygon points="37,36 49,29.5 49,39.5 37,46" fill="#FFFFFF" opacity="0.95" />
      <line x1="39" y1="36" x2="39" y2="43.5" stroke="#0F172A" strokeWidth="1.2" />
      <line x1="42" y1="34.5" x2="42" y2="42" stroke="#0F172A" strokeWidth="0.8" />
      <line x1="44" y1="33.5" x2="44" y2="41" stroke="#0284C7" strokeWidth="1.5" />
      <line x1="47" y1="32" x2="47" y2="39.5" stroke="#0F172A" strokeWidth="1.2" />

      {/* Edge Highlights */}
      <line x1="32" y1="34" x2="32" y2="56" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
      <line x1="10" y1="22" x2="32" y2="34" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <line x1="32" y1="34" x2="54" y2="22" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    </svg>
  );
}

/** 2. 3D Supersonic Jet & Radar Waves (Live Flight Tracking) */
export function Apple3DFlightRadar({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="planeBody" x1="16" y1="14" x2="48" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#E0F2FE" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="planeWing" x1="12" y1="28" x2="38" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BAE6FD" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Radar sweep pulse rings */}
      <circle cx="32" cy="32" r="26" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="32" cy="32" r="18" stroke="#7DD3FC" strokeWidth="1.4" opacity="0.4" />
      <circle cx="32" cy="32" r="10" stroke="#BAE6FD" strokeWidth="1.2" opacity="0.3" />

      {/* Supersonic Flight Path Trail */}
      <path d="M12 50 C 18 42, 24 36, 32 30" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />

      {/* 3D Modern Air Cargo Jet */}
      <g transform="translate(1, -1)">
        <ellipse cx="33" cy="36" rx="14" ry="5" fill="#000000" opacity="0.3" transform="rotate(-30 33 36)" />
        {/* Left Wing */}
        <polygon points="32,28 14,38 18,42 33,33" fill="url(#planeWing)" />
        {/* Right Wing */}
        <polygon points="32,26 44,12 47,15 35,28" fill="url(#planeWing)" />
        {/* Tail Fins */}
        <polygon points="20,44 14,48 16,52 23,47" fill="#0284C7" />
        <polygon points="21,43 27,47 25,50 19,46" fill="#0369A1" />
        {/* Fuselage */}
        <path 
          d="M48 14 C 50 16, 44 26, 34 34 C 26 40, 18 46, 17 46 C 16 46, 16 44, 18 42 C 22 36, 34 22, 44 14 C 46 12, 47 13, 48 14 Z" 
          fill="url(#planeBody)" 
          stroke="#FFFFFF" 
          strokeWidth="0.9"
        />
        {/* Cockpit Visor */}
        <ellipse cx="44" cy="16" rx="2.5" ry="1.4" fill="#0F172A" transform="rotate(-35 44 16)" />
        {/* Wingtip Navigation Lights */}
        <circle cx="46" cy="13" r="1.5" fill="#10B981" />
        <circle cx="15" cy="40" r="1.5" fill="#EF4444" />
      </g>
    </svg>
  );
}

/** 3. 3D Titanium Calculator & Golden Currency Coin (Rate Calculator) */
export function Apple3DRateCalculator({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="calcBody" x1="12" y1="8" x2="44" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#334155" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="18" y1="14" x2="38" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0C4A6E" />
          <stop offset="1" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="coinGold" x1="38" y1="36" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#EAB308" />
          <stop offset="1" stopColor="#A16207" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <rect x="14" y="10" width="34" height="46" rx="10" fill="#000000" opacity="0.35" transform="translate(0, 3)" />

      {/* Body */}
      <rect x="13" y="9" width="34" height="46" rx="9" fill="url(#calcBody)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />

      {/* LCD Screen */}
      <rect x="17" y="14" width="26" height="11" rx="4" fill="url(#screenGrad)" stroke="#38BDF8" strokeWidth="0.8" />
      <text x="39" y="22.5" fill="#38BDF8" fontSize="6.5" fontWeight="900" textAnchor="end" fontFamily="-apple-system, sans-serif">₹ 780</text>

      {/* Keypad */}
      <rect x="17" y="29" width="5.5" height="4.5" rx="1.5" fill="#475569" />
      <rect x="24" y="29" width="5.5" height="4.5" rx="1.5" fill="#475569" />
      <rect x="31" y="29" width="5.5" height="4.5" rx="1.5" fill="#475569" />
      <rect x="38" y="29" width="5" height="4.5" rx="1.5" fill="#F59E0B" />

      <rect x="17" y="36" width="5.5" height="4.5" rx="1.5" fill="#475569" />
      <rect x="24" y="36" width="5.5" height="4.5" rx="1.5" fill="#475569" />
      <rect x="31" y="36" width="5.5" height="4.5" rx="1.5" fill="#475569" />
      <rect x="38" y="36" width="5" height="4.5" rx="1.5" fill="#F59E0B" />

      <rect x="17" y="43" width="5.5" height="4.5" rx="1.5" fill="#475569" />
      <rect x="24" y="43" width="5.5" height="4.5" rx="1.5" fill="#475569" />
      <rect x="31" y="43" width="12" height="4.5" rx="1.5" fill="#0284C7" />

      {/* 3D Gold Coin */}
      <circle cx="47" cy="45" r="9.5" fill="url(#coinGold)" stroke="#FEF08A" strokeWidth="1" />
      <circle cx="47" cy="45" r="7.2" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
      <text x="47" y="48.2" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="-apple-system, sans-serif">₹</text>
    </svg>
  );
}

/** 4. 3D Vacuum-Sealed NRI Food Jar & Pickles (NRI Food Vacuum Pack) */
export function Apple3DNRIFoodJar({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jarBody" x1="16" y1="20" x2="48" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.4" stopColor="#D97706" />
          <stop offset="1" stopColor="#9A3412" />
        </linearGradient>
        <linearGradient id="jarGlass" x1="14" y1="18" x2="50" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="0.8" stopColor="#F59E0B" stopOpacity="0.2" />
          <stop offset="1" stopColor="#B45309" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="jarLid" x1="18" y1="8" x2="46" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="40" y1="8" x2="52" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ADE80" />
          <stop offset="1" stopColor="#15803D" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="16" ry="5" fill="#000000" opacity="0.35" />

      {/* Jar Body Container */}
      <rect x="17" y="19" width="30" height="34" rx="8" fill="url(#jarBody)" />

      {/* Pickles & Ghee Sweets Texture */}
      <circle cx="24" cy="30" r="3.5" fill="#B45309" opacity="0.75" />
      <circle cx="34" cy="36" r="4.5" fill="#7C2D12" opacity="0.65" />
      <circle cx="28" cy="44" r="3.8" fill="#B45309" opacity="0.8" />
      <circle cx="39" cy="44" r="3" fill="#7C2D12" opacity="0.7" />
      <circle cx="24" cy="38" r="2.2" fill="#FDE047" opacity="0.7" />

      {/* 5-Layer Vacuum Seal Ribs */}
      <line x1="17" y1="26" x2="47" y2="26" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="17" y1="34" x2="47" y2="34" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="2 2" />
      <line x1="17" y1="42" x2="47" y2="42" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="2 2" />

      {/* Glass Body Wall */}
      <rect x="17" y="19" width="30" height="34" rx="8" fill="url(#jarGlass)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" />

      {/* Specular Curved Reflection (Left Wall) */}
      <path d="M21 23 C 21 23, 21 34, 21 48" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />

      {/* Jar Neck */}
      <rect x="22" y="15" width="20" height="5" rx="1.5" fill="#D97706" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

      {/* Airtight Gold Vacuum Lid */}
      <rect x="19" y="10" width="26" height="7" rx="3.5" fill="url(#jarLid)" stroke="#FEF08A" strokeWidth="1" />
      <line x1="21" y1="12.5" x2="43" y2="12.5" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />

      {/* Fresh Spice / Curry Leaf Garnish */}
      <path 
        d="M42 12 C 48 8, 52 10, 52 14 C 52 19, 46 20, 42 17 Z" 
        fill="url(#leafGrad)" 
        stroke="#FFFFFF" 
        strokeWidth="0.8"
      />
      <path d="M43 14 Q 48 13 50 15" stroke="#BBF7D0" strokeWidth="0.8" />

      {/* Export Quality Certified Emblem */}
      <circle cx="32" cy="34" r="6" fill="#FFFFFF" opacity="0.95" />
      <polygon points="32,29 33.5,32.5 37,33 34.5,35.5 35,39 32,37 29,39 29.5,35.5 27,33 30.5,32.5" fill="#D97706" />
    </svg>
  );
}

/** 5. 3D Executive Gold ID Pass & Profile (My Account) */
export function Apple3DUserPass({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad" x1="10" y1="12" x2="54" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7" />
          <stop offset="0.5" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="goldCrown" x1="38" y1="8" x2="52" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="avatarHead" x1="26" y1="18" x2="38" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E9D5FF" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <rect x="12" y="16" width="40" height="36" rx="8" fill="#000000" opacity="0.35" transform="translate(0, 3)" />

      {/* Member ID Card */}
      <rect x="12" y="14" width="40" height="38" rx="8" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />

      {/* 3D User Silhouette */}
      <circle cx="32" cy="27" r="7" fill="url(#avatarHead)" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M20 44 C 20 37, 25 35, 32 35 C 39 35, 44 37, 44 44 Z" fill="url(#avatarHead)" stroke="#FFFFFF" strokeWidth="1" />

      {/* VIP Gold Star Badge */}
      <circle cx="45" cy="17" r="5" fill="url(#goldCrown)" stroke="#FFFFFF" strokeWidth="0.8" />
      <polygon points="45,13.5 46.2,16 49,16.3 47,18.2 47.5,21 45,19.5 42.5,21 43,18.2 41,16.3 43.8,16" fill="#FFFFFF" />

      {/* Smart Security Chip */}
      <rect x="17" y="19" width="6" height="5" rx="1" fill="#FCD34D" stroke="#B45309" strokeWidth="0.6" />
    </svg>
  );
}

/** 6. 3D WhatsApp VIP Emerald Sphere (24/7 Helpline) */
export function Apple3DWhatsAppVIP({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="waGreen" cx="35%" cy="30%" r="70%">
          <stop stopColor="#4ADE80" />
          <stop offset="0.45" stopColor="#22C55E" />
          <stop offset="0.85" stopColor="#16A34A" />
          <stop offset="1" stopColor="#14532D" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="32" cy="54" rx="18" ry="5" fill="#000000" opacity="0.35" />

      {/* Outer 3D Emerald Sphere */}
      <circle cx="32" cy="31" r="22" fill="url(#waGreen)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />

      {/* Specular Curved Reflection */}
      <path d="M17 22 C 20 14, 30 11, 41 12 C 34 14, 24 18, 19 26 Z" fill="#FFFFFF" opacity="0.65" />

      {/* White Chat Speech Bubble */}
      <path 
        d="M32 18 C 23.7 18, 17 24.3, 17 32 C 17 34.8, 17.8 37.4, 19.3 39.6 L 17.5 45.5 L 23.7 43.9 C 26.1 45.2, 28.9 46, 32 46 C 40.3 46, 47 39.7, 47 32 C 47 24.3, 40.3 18, 32 18 Z" 
        fill="#FFFFFF" 
      />

      {/* Telephone Receiver in Center */}
      <path 
        d="M26.5 25 C 26.1 24.2, 25.4 24.2, 24.7 24.2 C 24.2 24.2, 23.5 24.5, 23 25 C 22.4 25.5, 21 26.9, 21 29.8 C 21 32.7, 23.1 35.5, 23.4 35.9 C 23.7 36.3, 27.5 42.1, 33.3 44.6 C 38.1 46.7, 39.1 45.8, 40.1 45.7 C 41.1 45.6, 42.4 44.9, 43 43.8 C 43.6 42.7, 43.6 41.7, 43.4 41.5 C 43.2 41.3, 42.6 41, 41.7 40.6 C 40.8 40.1, 36.5 38, 35.7 37.7 C 34.9 37.4, 34.3 37.3, 33.7 38.2 C 33 39.1, 32.2 40.1, 31.6 40.8 C 31 41.4, 30.4 41.5, 29.5 41 C 28.6 40.6, 25.8 39.6, 22.4 36.6 C 19.8 34.2, 18 31.3, 17.6 30.4 C 17.1 29.5, 17.5 29, 18 28.5 C 18.4 28.1, 18.9 27.4, 19.4 26.9 C 19.8 26.3, 20 26, 20.3 25.4 C 20.6 24.8, 20.4 24.3, 20.2 23.9 C 20 23.5, 18.4 19.4, 17.7 17.8 Z" 
        fill="#16A34A" 
        transform="translate(11, 4) scale(0.68)"
      />

      {/* 24/7 Gold VIP Dispatch Pill */}
      <g transform="translate(34, 10)">
        <rect x="0" y="0" width="18" height="9" rx="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="0.8" />
        <text x="9" y="6.8" fill="#FFFFFF" fontSize="5.5" fontWeight="900" textAnchor="middle" fontFamily="-apple-system, sans-serif">24/7</text>
      </g>
    </svg>
  );
}

/**
 * Authentic Apple Face ID Biometric Glyph
 */
export function AppleFaceIDIcon({ size = 24, color = '#38bdf8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 3H5C3.89543 3 3 3.89543 3 5V7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 21H19C20.1046 21 21 20.1046 21 19V17" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="9.5" r="1.3" fill={color} />
      <circle cx="15" cy="9.5" r="1.3" fill={color} />
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
