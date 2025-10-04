// Smart theming utilities for dynamic color and typography

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate luminance of a color (0-1 scale)
 */
export function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  
  const { r, g, b } = rgb;
  
  // Convert to relative luminance
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;
  
  const rLinear = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const gLinear = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const bLinear = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Check if a color is light or dark
 */
export function isLightColor(hex) {
  return getLuminance(hex) > 0.5;
}

/**
 * Generate contrasting text color
 */
export function getContrastingTextColor(backgroundColor) {
  return isLightColor(backgroundColor) ? '#1a1a1a' : '#ffffff';
}

/**
 * Ensure color has # prefix
 */
export function normalizeColor(color) {
  if (!color) return '#ffffff';
  return color.startsWith('#') ? color : `#${color}`;
}

/**
 * Generate a lighter/darker variant of a color
 */
export function adjustColorBrightness(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  
  const adjustedR = Math.min(255, Math.max(0, Math.round(r * (1 + percent / 100))));
  const adjustedG = Math.min(255, Math.max(0, Math.round(g * (1 + percent / 100))));
  const adjustedB = Math.min(255, Math.max(0, Math.round(b * (1 + percent / 100))));
  
  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
}

/**
 * Generate complementary color palette
 */
export function generateColorPalette(primaryColor) {
  const isLight = isLightColor(primaryColor);
  
  return {
    primary: primaryColor,
    primaryLight: adjustColorBrightness(primaryColor, isLight ? -20 : 20),
    primaryDark: adjustColorBrightness(primaryColor, isLight ? -40 : -20),
    primaryMuted: adjustColorBrightness(primaryColor, isLight ? -60 : 40),
    
    // Text colors
    textPrimary: getContrastingTextColor(primaryColor),
    textSecondary: isLight ? '#4a5568' : '#a0aec0',
    textMuted: isLight ? '#718096' : '#718096',
    
    // Background variants
    backgroundPrimary: isLight ? '#ffffff' : '#1a202c',
    backgroundSecondary: isLight ? '#f7fafc' : '#2d3748',
    backgroundMuted: isLight ? '#edf2f7' : '#4a5568',
    
    // Accent colors
    accent: adjustColorBrightness(primaryColor, isLight ? 15 : -15),
    accentLight: adjustColorBrightness(primaryColor, isLight ? 30 : -30),
    
    // Status colors that harmonize with primary
    success: isLight ? '#38a169' : '#68d391',
    warning: isLight ? '#d69e2e' : '#fbd38d',
    error: isLight ? '#e53e3e' : '#fc8181',
    info: isLight ? '#3182ce' : '#63b3ed'
  };
}

/**
 * Generate smart typography scale based on brand personality
 */
export function getTypographyTheme(primaryColor, siteTitle) {
  const isLight = isLightColor(primaryColor);
  const luminance = getLuminance(primaryColor);
  
  // Determine brand personality from color
  const rgb = hexToRgb(primaryColor);
  let brandPersonality = 'modern'; // default
  
  if (rgb) {
    const { r, g, b } = rgb;
    
    // Red-dominant: aggressive, racing
    if (r > g && r > b && r > 150) {
      brandPersonality = 'racing';
    }
    // Blue-dominant: professional, tech
    else if (b > r && b > g && b > 150) {
      brandPersonality = 'professional';
    }
    // Orange/Yellow: energetic, fun
    else if (r > 200 && g > 150 && b < 100) {
      brandPersonality = 'energetic';
    }
    // Dark colors: premium, elegant
    else if (luminance < 0.3) {
      brandPersonality = 'premium';
    }
  }
  
  const themes = {
    racing: {
      headingFont: 'font-bold tracking-tight',
      bodyFont: 'font-medium',
      headingScale: 'text-4xl md:text-5xl lg:text-6xl',
      subheadingScale: 'text-2xl md:text-3xl lg:text-4xl',
      bodyScale: 'text-lg md:text-xl',
      letterSpacing: 'tracking-wide',
      fontWeight: 'font-extrabold'
    },
    professional: {
      headingFont: 'font-semibold tracking-normal',
      bodyFont: 'font-normal',
      headingScale: 'text-3xl md:text-4xl lg:text-5xl',
      subheadingScale: 'text-xl md:text-2xl lg:text-3xl',
      bodyScale: 'text-base md:text-lg',
      letterSpacing: 'tracking-normal',
      fontWeight: 'font-semibold'
    },
    energetic: {
      headingFont: 'font-bold tracking-wide',
      bodyFont: 'font-medium',
      headingScale: 'text-4xl md:text-5xl lg:text-6xl',
      subheadingScale: 'text-2xl md:text-3xl lg:text-4xl',
      bodyScale: 'text-lg md:text-xl',
      letterSpacing: 'tracking-wider',
      fontWeight: 'font-bold'
    },
    premium: {
      headingFont: 'font-light tracking-tight',
      bodyFont: 'font-normal',
      headingScale: 'text-3xl md:text-4xl lg:text-5xl',
      subheadingScale: 'text-xl md:text-2xl lg:text-3xl',
      bodyScale: 'text-base md:text-lg',
      letterSpacing: 'tracking-wide',
      fontWeight: 'font-medium'
    },
    modern: {
      headingFont: 'font-semibold tracking-tight',
      bodyFont: 'font-normal',
      headingScale: 'text-3xl md:text-4xl lg:text-5xl',
      subheadingScale: 'text-xl md:text-2xl lg:text-3xl',
      bodyScale: 'text-base md:text-lg',
      letterSpacing: 'tracking-normal',
      fontWeight: 'font-medium'
    }
  };
  
  return {
    personality: brandPersonality,
    ...themes[brandPersonality]
  };
}

/**
 * Apply smart theming to document
 */
export function applySmartTheming(config) {
  if (typeof document === 'undefined') return;
  
  const primaryColor = normalizeColor(config.primaryColor);
  const palette = generateColorPalette(primaryColor);
  const typography = getTypographyTheme(primaryColor, config.siteTitle);
  
  console.log('🎨 Applying smart theming:', { primaryColor, palette });
  
  // Apply CSS custom properties
  const root = document.documentElement;
  
  // Color palette
  root.style.setProperty('--primary-color', palette.primary);
  root.style.setProperty('--primary-light', palette.primaryLight);
  root.style.setProperty('--primary-dark', palette.primaryDark);
  root.style.setProperty('--primary-muted', palette.primaryMuted);
  
  // Text colors
  root.style.setProperty('--text-primary', palette.textPrimary);
  root.style.setProperty('--text-secondary', palette.textSecondary);
  root.style.setProperty('--text-muted', palette.textMuted);
  
  // Backgrounds
  root.style.setProperty('--bg-primary', palette.backgroundPrimary);
  root.style.setProperty('--bg-secondary', palette.backgroundSecondary);
  root.style.setProperty('--bg-muted', palette.backgroundMuted);
  
  // Accents
  root.style.setProperty('--accent-color', palette.accent);
  root.style.setProperty('--accent-light', palette.accentLight);
  
  // Status colors
  root.style.setProperty('--success-color', palette.success);
  root.style.setProperty('--warning-color', palette.warning);
  root.style.setProperty('--error-color', palette.error);
  root.style.setProperty('--info-color', palette.info);
  
  // Typography personality
  root.style.setProperty('--brand-personality', typography.personality);
  
  // Add brand personality class to body
  document.body.className = document.body.className.replace(/brand-\w+/g, '');
  document.body.classList.add(`brand-${typography.personality}`);
  
  return { palette, typography };
}

/**
 * Get smart button styles based on context
 */
export function getSmartButtonStyles(variant = 'primary', context = 'light') {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: context === 'light' 
      ? 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-dark)] focus:ring-[var(--primary-color)]'
      : 'bg-[var(--primary-light)] text-[var(--text-primary)] hover:bg-[var(--primary-color)] focus:ring-[var(--primary-light)]',
    
    secondary: context === 'light'
      ? 'bg-transparent border-2 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white focus:ring-[var(--primary-color)]'
      : 'bg-transparent border-2 border-[var(--primary-light)] text-[var(--primary-light)] hover:bg-[var(--primary-light)] hover:text-[var(--text-primary)] focus:ring-[var(--primary-light)]',
    
    ghost: 'bg-transparent text-[var(--primary-color)] hover:bg-[var(--primary-muted)] hover:text-[var(--text-primary)] focus:ring-[var(--primary-color)]'
  };
  
  return `${baseStyles} ${variants[variant]}`;
}

/**
 * Get smart card styles based on background context
 */
export function getSmartCardStyles(context = 'light') {
  if (context === 'dark') {
    return 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl hover:bg-white/15 transition-all duration-300';
  }
  
  return 'bg-white/80 backdrop-blur-md border border-gray-200/50 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300';
}
