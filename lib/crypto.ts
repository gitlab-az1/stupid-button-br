import crypto from 'crypto';


export function aesEncrypt(input: crypto.BinaryLike): Buffer;
export function aesEncrypt(input: crypto.BinaryLike, encoding: BufferEncoding): string;
export function aesEncrypt(input: crypto.BinaryLike, encoding?: BufferEncoding): Buffer | string {
  if(!process.env.NEXT_PUBLIC_SYMMETRIC_ENC_KEY) {
    throw new Error('NEXT_PUBLIC_SYMMETRIC_ENC_KEY is not defined');
  }

  const k = Buffer.from(process.env.NEXT_PUBLIC_SYMMETRIC_ENC_KEY);

  const cipher = crypto.createCipheriv('aes-256-cbc', k.subarray(0, 32), k.subarray(32, 48));
  
  const buffer = Buffer.concat([
    cipher.update(input),
    cipher.final(),
  ]);

  if(!encoding) return buffer;
  return buffer.toString(encoding);
}


export function aesDecrypt(input: Uint8Array): Buffer;
export function aesDecrypt(input: Uint8Array, encoding: BufferEncoding): string;
export function aesDecrypt(input: Uint8Array, encoding?: BufferEncoding): Buffer | string {
  if(!process.env.NEXT_PUBLIC_SYMMETRIC_ENC_KEY) {
    throw new Error('NEXT_PUBLIC_SYMMETRIC_ENC_KEY is not defined');
  }

  const k = Buffer.from(process.env.NEXT_PUBLIC_SYMMETRIC_ENC_KEY);

  const cipher = crypto.createDecipheriv('aes-256-cbc', k.subarray(0, 32), k.subarray(32, 48));
  
  const buffer = Buffer.concat([
    cipher.update(input),
    cipher.final(),
  ]);

  if(!encoding) return buffer;
  return buffer.toString(encoding);
}


export function sign(input: crypto.BinaryLike): Buffer;
export function sign(input: crypto.BinaryLike, encoding: 'base64' | 'base64url' | 'hex'): string;
export function sign(input: crypto.BinaryLike, encoding?: 'base64' | 'base64url' | 'hex'): Buffer | string {
  if(!process.env.NEXT_PUBLIC_SYMMETRIC_SIG_KEY) {
    throw new Error('NEXT_PUBLIC_SYMMETRIC_ENC_KEY is not defined');
  }

  const k = Buffer.from(process.env.NEXT_PUBLIC_SYMMETRIC_SIG_KEY);

  return crypto.createHmac('sha512', k)
    .update(input)
    .digest(encoding as crypto.BinaryToTextEncoding);
}
