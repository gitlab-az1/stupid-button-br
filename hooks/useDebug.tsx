import type { Dict } from 'typesdk/types';
import { useEffect, useRef } from 'react';

import { useRenderCount } from './useRenderCount';


export declare type DebugInfo = {
  readonly count: number;
  readonly changedProps: Dict<{ readonly previous: any; readonly current: any; }>;
  readonly timeSinceLastRender: number;
  readonly lastRenderTimestamp: number;
}

export function useDebugInformation<T extends object>(component: string, props: T): DebugInfo {
  const count = useRenderCount();
  const changedProps = useRef<T>({} as T);
  const previousProps = useRef<T>(props);
  const lastRenderTimestamp = useRef<number>(Date.now());

  const propKeys = Object.keys({ ...props, ...previousProps });
  changedProps.current = propKeys.reduce((obj, key) => {
    if ((props as Dict<any>)[key] === (previousProps.current as Dict<any>)[key]) return obj;

    return {
      ...obj,
      [key]: { previous: (previousProps.current as Dict<any>)[key], current: (props as Dict<any>)[key] },
    };
  }, {}) as T;

  const info = Object.freeze({
    count,
    changedProps: changedProps.current,
    timeSinceLastRender: Date.now() - lastRenderTimestamp.current,
    lastRenderTimestamp: lastRenderTimestamp.current,
  });

  useEffect(() => {
    previousProps.current = props;
    lastRenderTimestamp.current = Date.now();

    if(process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_NODE_ENV === 'production') return void 0;
    console.log('[debug-info]', component, info);
  });

  return info as unknown as DebugInfo;
}


const _debug = {
  warn(topic: string, message: any): void {
    console.warn(String(new Date().getTime()), '| [debug warning]', topic, message);
  },

  error(topic: string, message: any): void {
    console.error(String(new Date().getTime()), '| [debug error]', topic, message);
  },

  info(topic: string, message: any): void {
    console.log(String(new Date().getTime()), '| [debug]', topic, message);
  },
};


type DebugFn = ((topic: string, message: any) => void);

export function useDebug(level: 'warn' | 'error' | 'info'): DebugFn {
  const validLevels = ['warn', 'error', 'info'];

  if(!level || !validLevels.includes(level)) {
    level = 'warn';
  }

  return _debug[level];
}
