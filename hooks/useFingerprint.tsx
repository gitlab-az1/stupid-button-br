import { ssrSafeDocument, ssrSafeWindow } from 'typesdk/ssr';


export async function useFingerprint(debug: boolean = true): Promise<string> {
  if(!ssrSafeWindow) {
    throw new Error('Failed to generate fingerprint for a non-mounted app');
  }

  const devieMetadata = [
    `u_${ssrSafeWindow.navigator.userAgent}`,
    `p_${ssrSafeWindow.navigator.platform}`,
    `l_${ssrSafeWindow.navigator.language}-from-${ssrSafeWindow.navigator.languages.join(',')}`,
    `r_${ssrSafeWindow.screen.width}.${ssrSafeWindow.screen.availWidth}x${ssrSafeWindow.screen.height}.${ssrSafeWindow.screen.availHeight}`,
    `tf_${Object.values(Intl.DateTimeFormat().resolvedOptions()).join(',')}`,
  ];

  if(debug) {
    console.log('Device Metadata: %s', devieMetadata.join(' | '));
  }

  const canvas = generateCanvasFingerprint();

  if(debug) {
    console.log('Canvas info: %s', canvas);
  }

  const webgl = generateWebGLFingerprint();

  if(debug) {
    console.log('WebGL info: %s', webgl);
  }

  const webgl_v2 = generateWebGLv2Fingerprint();

  if(debug) {
    console.log('WebGL v2 info: %s', webgl_v2);
  }

  /* const bitmap = generateBitmapRenderingFingerprint();
  
  if(debug) {
    console.log('Bitmap Rendering info: %s', bitmap);
  } */

  const superset = [
    ...devieMetadata,
    canvas,
    webgl,
    webgl_v2,
  ].join('|');


  const encodedData = new TextEncoder().encode(superset);
  const hashBuffer = await crypto.subtle.digest('SHA-512', encodedData);
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
}


function generateWebGLFingerprint(): string {
  const canvas = ssrSafeDocument?.createElement('canvas');

  if(!canvas) {
    throw new Error('Failed to generate fingerprint for a non-mounted app');
  }

  const gl: any = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if(!gl) return 'no-webgl';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL); // GPU information
  const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL); // GPU vendor information

  return `${vendor}|${renderer}`;
}

function generateWebGLv2Fingerprint(): string {
  const canvas = ssrSafeDocument?.createElement('canvas');

  if(!canvas) {
    throw new Error('Failed to generate fingerprint for a non-mounted app');
  }

  const gl: any = canvas.getContext('webgl2');
  if(!gl) return 'no-webgl2';

  const debugInfo = gl.getExtension('EXT_disjoint_timer_query_webgl2') || gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL); // GPU information
  const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL); // GPU vendor information

  return `v2_${vendor}|${renderer}`;
}

function generateCanvasFingerprint(): string {
  const canvas = ssrSafeDocument?.createElement('canvas');

  if(!canvas) {
    throw new Error('Failed to generate fingerprint for a non-mounted app');
  }

  const context = canvas.getContext('2d');
  if(!context) return 'no-canvas';

  context.textBaseline = 'top';
  context.font = '14px Arial';
  
  context.fillText('Something new, not hellow world.', 2, 2);

  return canvas.toDataURL();
}


export default useFingerprint;
