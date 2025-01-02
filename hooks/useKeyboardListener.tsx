import { useEffect } from 'react';


export const enum KEYBOARD {
  ESCAPE = 'Escape',
  ENTER = 'Enter',
  SPACE = ' ',
  TAB = 'Tab',
  SHIFT = 'Shift',
  CONTROL = 'Control',
  ALT = 'Alt',
  BACKSPACE = 'Backspace',
  DELETE = 'Delete',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  HOME = 'Home',
  END = 'End',
  PAGE_UP = 'PageUp',
  PAGE_DOWN = 'PageDown',
  F1 = 'F1',
  F2 = 'F2',
  F3 = 'F3',
  F4 = 'F4',
  F5 = 'F5',
  F6 = 'F6',
  F7 = 'F7',
  F8 = 'F8',
  F9 = 'F9',
  F10 = 'F10',
  F11 = 'F11',
  F12 = 'F12',
}


export type Options = {
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  altGraphKey?: boolean;
  target?: HTMLElement;
};


export function useKeyboardListener(
  key: KEYBOARD, 
  callback: (event: KeyboardEvent) => void,
  options?: Options // eslint-disable-line comma-dangle
): void {
  useEffect(() => {
    const fn = (event: KeyboardEvent) => {
      if(event.key !== key) return;

      if(options?.ctrlKey && !event.ctrlKey) return;
      if(options?.shiftKey && !event.shiftKey) return;
      if(options?.altKey && !event.altKey) return;
      if(options?.altGraphKey && !event.getModifierState('AltGraph')) return;

      callback(event);
    };

    const targetElement = options?.target || document.body;
    targetElement.addEventListener('keyup', fn);

    return () => {
      targetElement.removeEventListener('keyup', fn);
    };
  }, [key, callback, options?.target]); // Fixed: Added key and callback to dependency array
}

export default useKeyboardListener;
