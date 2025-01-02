import { Box, type SxProps } from '@mui/material';
import React, { HTMLAttributes, memo } from 'react';

import { cn } from '@/utils/react';


export type ElementType = 
  | 'span'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

export interface TypographyTextProps extends HTMLAttributes<HTMLSpanElement | HTMLDivElement> {
  sx?: SxProps;
  component?: ElementType;
  readonly children?: React.ReactNode;
}

export const TypographyTitle = ({
  component,
  children,
  sx,
  ...props
}: TypographyTextProps) => {
  return (
    <Box
      {...props}
      component={component || 'span'}
      className={cn('drawer-ui-typography-component', 'typo-root', `typo-root__${component || 'span'}`, 'typography', props.className)}
      sx={sx} // maybe override default styles if `props.sx` is ausent
    >
      {children}
    </Box>
  );
};

export default memo(TypographyTitle);
