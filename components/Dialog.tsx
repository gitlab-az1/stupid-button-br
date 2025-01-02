import { Box } from '@mui/material';
import React, { useRef, memo } from 'react';

import { cn } from '@/utils/react';
import { KEYBOARD, useClickOutside, useKeyboardListener } from '@/hooks';


export type DialogProps = {
  readonly children: React.ReactNode;
  onOverlayClick?: () => void;
  onClose?: () => void;
  disallowEscapeKeyShortCut?: boolean;
  background?: string;
  className?: string;
  maxWidth?: string;
  padding?: string;
  boxBg?: string;
  borderRadius?: string;
  height?: string;
  maxHeight?: string;
  open: boolean;
  border?: string;
  shadow?: string;
}

const Dialog = (props: DialogProps) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useClickOutside(boxRef, () => {
    if(props.open === true) {
      props.onOverlayClick?.();
    }
  });

  useKeyboardListener(KEYBOARD.ESCAPE, () => {
    if(props.disallowEscapeKeyShortCut) return;
    props.onClose?.();
  });

  if(!props.open) return null;

  return (
    <Box
      className={cn('drawer-ui-dialog-component', props.open ? 'active' : undefined, props.className)}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100svh',
        overflow: 'hidden',
        backgroundColor: props.background ?? 'rgba(59, 59, 58, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 130,
        transition: 'opacity 0.1s ease, transform .2s ease-in-out',

        ...(() => {
          if(!props.open) return {
            pointerEvents: 'none',
            opacity: '0',
          };

          return {
            pointerEvents: 'auto',
            opacity: '1',
          };
        })(),

        '& > div': {
          ...(() => {
            if(!props.open) return {
              pointerEvents: 'none',
              transform: 'scale(0)',
            };
  
            return {
              pointerEvents: 'auto',
              transform: 'scale(1)',
            };
          })(),
        },
      }}
    >
      <Box
        ref={boxRef}
        sx={{
          maxWidth: props.maxWidth ?? '400px',
          width: '100%',
          maxHeight: props.maxHeight,
          height: props.height,
          padding: props.padding ?? '20px',
          borderRadius: props.borderRadius ?? '4px',
          backgroundColor: props.boxBg ?? 'var(--box-bg)',
          boxShadow: props.shadow || '0px 2.4px 18px -1px rgba(0, 0, 0, 0.1)',
          transition: 'opacity 0.045s ease, transform .2s ease-in-out',
          border: props.border || '1px solid var(--border-color)',
          margin: '20px',
          zIndex: 200,
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default memo(Dialog);
