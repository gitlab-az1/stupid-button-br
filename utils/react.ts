import { SxProps } from '@mui/material';
import type { Dict } from 'typesdk/types';
import math, { Random } from 'typesdk/math';
import { inorderTransversal, type MultidimensionalArray } from 'typesdk/array';


export function cn(...values: MultidimensionalArray<string | Dict<boolean | null | undefined> | null | undefined>): string {
  const result: string[] = [];
  const gen = inorderTransversal([values]);

  let c = gen.next();

  while(!c.done) {
    if(c.value) {
      if(typeof c.value === 'string') {
        result.push(c.value.trim());
      } else if(typeof c.value === 'object' && !Array.isArray(c.value)) {
        for(const prop in c.value) {
          if(!Object.prototype.hasOwnProperty.call(c.value, prop)) continue;
          if(c.value[prop] !== true) continue;
  
          result.push(prop.trim());
        }
      }
    }

    c = gen.next();
  }

  return result.join(' ');
}


export function addOpacityToHexColor(hexColor: string, opacity: number): string {
  // Ensure opacity is within the valid range [0, 1]
  opacity = math.clamp(opacity, 0, 1);

  // Parse the hex color into its RGB components
  const hex = hexColor.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const red = (bigint >> 16) & 255;
  const green = (bigint >> 8) & 255;
  const blue = bigint & 255;

  // Convert opacity to an integer in the range [0, 255]
  const alpha = Math.round(opacity * 255);

  // Combine the modified RGB components and opacity to create a new hex color
  const modifiedHex = `#${(1 << 24 | red << 16 | green << 8 | blue).toString(16).slice(1)}${alpha.toString(16).padStart(2, '0')}`;
  return modifiedHex;
}

export function addOpacityToHexColorAsRGBA(hexColor: string, opacity: number): string {
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hexColor) || opacity < 0 || opacity > 1) {
    throw new Error('Invalid input. Please provide a valid hex color code and opacity value between 0 and 1.');
  }

  // Convert hex to RGB
  let r: number = 0;
  let g: number = 0;
  let b: number = 0;

  if (hexColor.length === 4) {
    r = parseInt(hexColor[1] + hexColor[1], 16);
    g = parseInt(hexColor[2] + hexColor[2], 16);
    b = parseInt(hexColor[3] + hexColor[3], 16);
  } else if (hexColor.length === 7) {
    r = parseInt(hexColor.slice(1, 3), 16);
    g = parseInt(hexColor.slice(3, 5), 16);
    b = parseInt(hexColor.slice(5, 7), 16);
  }

  // Ensure RGB values are valid
  if(isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Invalid hex color code.');
  }

  // Calculate the new RGBA values
  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  return rgbaColor;
}

export function removeOpacity(color: string): string {
  // Helper function to validate and handle hex color
  const handleHexColor = (hex: string): string => {
    // Hex color with opacity (#RRGGBBAA)
    if(/^#([0-9A-Fa-f]{8})$/.test(hex)) return `#${hex.slice(1, 7)}`;

    // Hex color without opacity (#RRGGBB)
    if(/^#([0-9A-Fa-f]{6})$/.test(hex)) return hex;
    
    throw new Error('Invalid hex color format.');
  };

  // Helper function to validate and handle RGBA color
  const handleRgbaColor = (rgba: string): string => {
    const rgbaRegex = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0|1|0?\.\d+))?\s*\)$/;
    const match = rgba.match(rgbaRegex);

    if(!match) {
      throw new Error('Invalid RGBA color format.');
    }

    // Extract RGB values
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    // Ensure RGB values are within range
    if(r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error('RGB values must be between 0 and 255.');
    }

    // Convert RGB to hex format
    const toHex = (value: number) => value.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Determine input type and process accordingly
  color = color.trim();

  if(color.startsWith('#')) return handleHexColor(color);
  if(color.startsWith('rgba') || color.startsWith('rgb')) return handleRgbaColor(color);
  
  throw new Error('Unsupported color format. Please provide a hex or rgba color.');
}


export function randomColorInRangeHex(x: string, y: string): string {
  if(!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(x)) {
    throw new Error('Invalid input. Please provide a valid hex color code.');
  }

  if(!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(y)) {
    throw new Error('Invalid input. Please provide a valid hex color code.');
  }

  // Convert hex to RGB
  let r: number;
  let g: number;
  let b: number;

  if(x.length === 4) {
    r = parseInt(x[1] + x[1], 16);
    g = parseInt(x[2] + x[2], 16);
    b = parseInt(x[3] + x[3], 16);
  } else if (x.length === 7) {
    r = parseInt(x.slice(1, 3), 16);
    g = parseInt(x.slice(3, 5), 16);
    b = parseInt(x.slice(5, 7), 16);
  } else {
    throw new Error('Invalid hex color code.');
  }

  // Ensure RGB values are valid
  if(isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Invalid hex color code.');
  }

  // Calculate the new RGBA values
  let rf: number;
  let gf: number;
  let bf: number;

  if(y.length === 4) {
    rf = parseInt(y[1] + y[1], 16);
    gf = parseInt(y[2] + y[2], 16);
    bf = parseInt(y[3] + y[3], 16);
  } else if (y.length === 7) {
    rf = parseInt(y.slice(1, 3), 16);
    gf = parseInt(y.slice(3, 5), 16);
    bf = parseInt(y.slice(5, 7), 16);
  } else {
    throw new Error('Invalid hex color code.');
  }

  // Ensure RGB values are valid
  if(isNaN(rf) || isNaN(gf) || isNaN(bf)) {
    throw new Error('Invalid hex color code.');
  }

  // Calculate the new RGBA values
  const red = Random.uniform(r, rf);
  const green = Random.uniform(g, gf);
  const blue = Random.uniform(b, bf);

  // Combine the modified RGB components and opacity to create a new hex color
  const modifiedHex = `#${(1 << 24 | red << 16 | green << 8 | blue).toString(16).slice(1)}`;
  return modifiedHex;
}


export function randomBrightColorAsHex(): string {
  const minBrightness = 150; // Adjust this threshold as needed
  
  // Generate random RGB values using bitwise operators
  const randomRed = (Math.random() * 256) | 0;
  const randomGreen = (Math.random() * 256) | 0;
  const randomBlue = (Math.random() * 256) | 0;
  
  // Ensure the generated color is bright
  const isBright = randomRed > minBrightness || randomGreen > minBrightness || randomBlue > minBrightness;
  let hex: string;
  
  // If not bright, adjust the values to increase brightness
  if(!isBright) {
    const brightnessIncrease = minBrightness - Math.min(randomRed, randomGreen, randomBlue);
  
    // Increase brightness while keeping values within the [0, 255] range
    const adjustedRed = Math.min(255, randomRed + brightnessIncrease);
    const adjustedGreen = Math.min(255, randomGreen + brightnessIncrease);
    const adjustedBlue = Math.min(255, randomBlue + brightnessIncrease);
  
    // Format the RGB values to hex
    hex = `#${(adjustedRed << 16 | adjustedGreen << 8 | adjustedBlue).toString(16).padStart(6, '0')}`;
  } else {
    // If already bright, format the RGB values to hex
    hex = `#${(randomRed << 16 | randomGreen << 8 | randomBlue).toString(16).padStart(6, '0')}`;
  }
  
  return hex;
}




export function variable<T extends Dict<SxProps>, KDefault extends keyof T>(variants: T, defaultVariant?: KDefault): ((variant: keyof T) => SxProps) {
  return (variant) => {
    // eslint-disable-next-line no-extra-boolean-cast
    if(!!variants[variant]) return variants[variant];
    if(!defaultVariant) return {};
    return variants[defaultVariant] ?? {};
  };
}


export const getOperatingSystem = () => {
  const userAgent = window.navigator.userAgent;

  if(userAgent.includes('Win')) return 'Win32';
  if(userAgent.includes('Linux')) return 'Linux x86_64';
  if(userAgent.includes('Mac')) return 'MacIntel';
  return 'Unknown';
};

// Detect if it's a mobile device
export const isMobile = () => {
  return /iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};


export const platform = () => {
  return `${getOperatingSystem()}:${isMobile() ? 'Mobile' : 'Desktop'}`.toLowerCase();
};

export function megabytesToBytes(value: number | string): number {
  return (typeof value === 'number' ? value : Number(value)) * 1024 * 1024;
}


export type LuminanceContrastRef = {
  black?: string;
  white?: string;
}

export function getLuminanceContrastColor(hexColor: string, tolerance?: number, ref?: LuminanceContrastRef): string {
  if(!!tolerance && typeof tolerance !== 'number') {
    throw new Error('Please provide a valid tolerance value between 0 and 1.');
  }

  if(!!tolerance &&
      (tolerance < 0 || tolerance > 1)) {
    throw new Error('Please provide a valid tolerance value between 0 and 1.');
  }

  // Remove '#' if present
  hexColor = hexColor.replace('#', '');

  // Convert hex to RGB
  let r: number;
  let g: number;
  let b: number;

  if(hexColor.length === 3) {
    r = parseInt(hexColor[0] + hexColor[0], 16);
    g = parseInt(hexColor[1] + hexColor[1], 16);
    b = parseInt(hexColor[2] + hexColor[2], 16);
  } else {
    r = parseInt(hexColor.substring(0, 2), 16);
    g = parseInt(hexColor.substring(2, 4), 16);
    b = parseInt(hexColor.substring(4, 6), 16);
  }

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Choose contrast color based on luminance
  return luminance > (tolerance || 0.5) ?
    ref?.black || '#000000' :
    ref?.white || '#ffffff';
}
