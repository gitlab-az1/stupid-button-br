import { isPlainObject, typeofTest } from 'typesdk/utils/is';

export * from './react';


/**
 * Checks if the value is a string.
 * 
 * @param {*} value The value to be checked
 * @returns {boolean} True if the value is a string, false otherwise
 */
export function isString(value: unknown): value is string {
  return (
    typeofTest('string')(value) ||
    (value instanceof String)
  );
}


/**
 * Checks if the value is a number.
 * 
 * @param {*} value The value to be checked 
 * @returns {boolean} True if the value is a number, false otherwise
 */
export function isDigit(value: unknown): value is number {
  return (
    typeofTest('number')(value) ||
    (value instanceof Number)
  ) && !Number.isNaN(value);
} 


/**
 * Checks if the provided value is a number represented as one of teh following:
 * - A number
 * - A string containing a number (e.g. `'123'`)
 * - A string containing a number with a leading `+` or `-` sign (e.g. `'+123'`, `'-123'`)
 * - A hexadecimal number (e.g. `0x123`)
 * - A binary number (e.g. `0b101`)
 * - An octal number (e.g. `0o123`)
 * 
 * @param {*} value The value to be checked
 * @returns {boolean} True if the value is one of the above, false otherwise
 */
export function isNumber(value: unknown): boolean {
  if(!typeofTest('number')(value) && !typeofTest('string')(value)) return false;
  if(isDigit(value)) return true;

  const str = String(value);

  if(
    ['+', '-'].includes(str[0]) &&
    /\d/.test(str.slice(1))
  ) return true;

  const hex = /^0x[0-9a-f]+$/i;
  const bin = /^0b[01]+$/i;
  const oct = /^0o[0-7]+$/i;

  return (
    hex.test(str.toLowerCase()) ||
    oct.test(str.toLowerCase()) ||
    bin.test(str)
  );
}


/**
 * Resolves a value to a number based on various conditions parsed from some of the following:
 * - A number (e.g. `123`)
 * - A string containing a number (e.g. `'123'`)
 * - A string containing a number with a leading `+` or `-` sign (e.g. `'+123'`, `'-123'`)
 * - A hexadecimal number (e.g. `0x123`)
 * - A binary number (e.g. `0b101`)
 * - An octal number (e.g. `0o123`)
 *
 * @param value - The value to be resolved to a number.
 * @returns The resolved number.
 * @throws {TypeError} If the value cannot be resolved to a number.
 */
export function resolveNumber(value: unknown): number {
  if(!isNumber(value)) {
    throw new TypeError(`Cannot resolve number from ${value}`);
  }

  if(isDigit(value)) return value;

  if(!isString(value)) {
    throw new TypeError(`Cannot resolve number from ${value}`);
  }

  if(value[0] === '+' || value[0] === '-') return value[0] === '+' ? +value.slice(1) : -value.slice(1);

  if(value.startsWith('0x')) return parseInt(value.toLowerCase(), 16);
  if(value.startsWith('0o')) return parseInt(value.toLowerCase(), 8);
  if(value.startsWith('0b')) return parseInt(value, 2);

  return parseInt(value, 10);
}


export function convertUint8ArrayToHex(arr: Uint8Array): string {
  return Array.prototype.map.call(arr, function(byte) {
    return ('0' + byte.toString(16)).slice(-2);
  }).join('');
}


export function extractMajor(version: string): string {
  if(version.startsWith('v')) return version.slice(1).split('.')[0].trim();
  return version.match(/(\d.?)+/g)?.[0].split('.')[0].trim() ?? version;
}


/**
 * Converts bytes to a human readable size
 * @param {number} size 
 */
export function formatSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    
  let i = 0;

  while(size > 1024) {
    size /= 1024;
    i++;
  }
  
  return `${size.toFixed(2)} ${units[i]}`;
}


export type JSONErrorMessage = {
  message: string;
  line: number;
  column: number;
  position: number;
}

export function parseJSONSyntaxError(message: string): JSONErrorMessage | string {
  const regex = /at position (\d+) \(line (\d+) column (\d+)\)/;
  const match = message.match(regex);

  if(!match) return message;

  const position = parseInt(match[1]);
  const line = parseInt(match[2]);
  const column = parseInt(match[3]);

  const cleanedErrorMessage = message.replace(regex, '').trim();

  return {
    message: cleanedErrorMessage,
    line: line,
    column: column,
    position,
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function freeze<T extends {}>(obj: T): Readonly<T> {
  const base = {} as Record<string, any>;

  for(const prop in obj) {
    if(!Object.prototype.hasOwnProperty.call(obj, prop)) continue;

    if(typeof obj[prop] === 'object' && isPlainObject(obj[prop])) {
      base[prop] = freeze(obj[prop] as T);
    } else {
      base[prop] = obj[prop];
    }
  }

  return Object.freeze(base) as T;
}


export function splitFirstOccurrence<T extends string>(str: T, separator: string): [first: string, second?: string] {
  if(separator.length !== 1) {
    throw new Error('Separator must be a single character');
  }

  let index = -1;
  const s = separator.charCodeAt(0);

  for(let i = 0; i < str.length; i++) {
    if(str.charCodeAt(i) !== s) continue;

    index = i;
    break;
  }

  if(index < 0) return [str];

  return [
    str.slice(0, index),
    str.slice(index + 1),
  ] as const;
}


export function findFirstSequence(arr: number[], x: number): number[] | null {
  for(let i = 0; i < arr.length - x; i++) {
    let sequence = true;

    for(let j = 1; j < x; j++) {
      if(arr[i + j] !== arr[i + j - 1] + 1) {
        sequence = false;
        break;
      }
    }

    if(sequence) return arr.slice(i, i + x);
  }

  return null;
}


export function baseurl(): URL { /* eslint-disable no-extra-boolean-cast */
  if(!!process.env.NEXT_PUBLIC_APP_URL) return new URL(process.env.NEXT_PUBLIC_APP_URL);
  if(!!process.env.VERCEL_URL) return new URL(process.env.VERCEL_URL);
  if(!!process.env.NEXT_PUBLIC_VERCEL_URL) return new URL(process.env.NEXT_PUBLIC_VERCEL_URL);

  return new URL('http://127.0.0.1:4001');
} /* eslint-enable no-extra-boolean-cast */


export function isProduction(): boolean {
  const kind = 'production';

  return (
    process.env.NODE_ENV === kind ||
    process.env.NEXT_PUBLIC_NEXT_ENV === kind ||
    process.env.VERCEL_ENV === kind ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === kind
  );
}


export function cdn(pathname: string): string {
  const cdnVersion = process.env.NEXT_PUBLIC_CDN_VERSION ?? 'v1';

  const baseUrl = ((process.env.NEXT_PUBLIC_API_URL as string).endsWith('/') ? 
    (process.env.NEXT_PUBLIC_API_URL as string).slice(0, -1) :
    process.env.NEXT_PUBLIC_API_URL) as string;

  if(pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }

  return `${baseUrl}/cdn/${cdnVersion}/${pathname}`;
}


export function calculateAge(birthDate: Date | string): number {
  if(!(birthDate instanceof Date)) {
    birthDate = new Date(birthDate);
  }

  const diff = new Date().getTime() - birthDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function weakRemoveDuplicates<T extends Record<any, any>[]>(arr: T, key: keyof T[number]): T {
  return arr.filter((v, i, a) => a.findIndex(t => (t[key] === v[key])) === i) as T;
}

export function splitLastOccurrence<T extends string>(str: T, separator: string): [first: string, second?: string] {
  if(separator.length !== 1) {
    throw new Error('Separator must be a single character');
  }

  let index = -1;
  const s = separator.charCodeAt(0);

  for(let i = str.length - 1; i >= 0; i--) {
    if(str.charCodeAt(i) !== s) continue;

    index = i;
    break;
  }

  if(index < 0) return [str];

  return [
    str.slice(0, index),
    str.slice(index + 1),
  ];
}

export function strShuffle(str: string): string {
  if(typeof str !== 'string') {
    throw new Error('Expected first argument to be \'typeof string\'');
  }

  const arr = str.split('');

  // Loop through the array
  for(let i = arr.length - 1; i > 0; i--) {
    // Generate a random index
    const j = Math.floor(Math.random() * (i + 1));

    // Swap the current element with the random element
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  // Convert the array back to a string and return it
  return arr.join('');
}

export function encodeUrlVariables<T extends object>(vars: T): string {
  if(!vars || typeof vars !== 'object' || Array.isArray(vars)) {
    throw new TypeError();
  }

  const v = [] as string[];

  for(const prop in vars) {
    v.push(`${encodeURIComponent(prop)}=${encodeURIComponent((vars as any)[prop])}`);
  }

  return encodeURIComponent(btoa(v.join(',')));
}

export function isJSON(value: unknown): boolean {
  if(!isString(value)) return false;

  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}


// Encode to URL-safe Base64
export function encodeUrlSafeBase64(input: string) {
  // Replace characters to make it URL-safe
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Decode from URL-safe Base64
export function decodeUrlSafeBase64(input: string) {
  // Replace URL-safe characters back to standard Base64 characters
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  while(base64.length % 4 !== 0) {
    base64 += '=';
  }

  return atob(base64); // Standard Base64 decoding
}


export async function _sha256(message: string): Promise<string> {
  // Convert the message to a Uint8Array
  const msgBuffer = new TextEncoder().encode(message);

  // Hash the message using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // Convert ArrayBuffer to Array, then to hexadecimal format
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}


export function defined(arg: unknown): arg is NonNullable<typeof arg> {
  return (
    arg !== null &&
    arg !== undefined &&
    typeof arg !== 'undefined' &&
    (typeof arg === 'string' ? !!arg : true)
  );
}

export function percent(part: number, whole: number): number {
  return (part / whole) * 100;
}


export function delayed(callback: () => void, timeout?: number): NodeJS.Timeout | number {
  return setTimeout(callback, timeout || 750);
}
