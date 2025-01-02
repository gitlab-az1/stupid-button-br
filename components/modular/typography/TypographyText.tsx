import { Box, type SxProps } from '@mui/material';
import React, { HTMLAttributes, memo } from 'react';

import { cn } from '@/utils/react';


export type ElementType = 
  | 'span'
  | 'p'
  | 'strong'
  | 'cite'
  | 'blockquote'
  | 'dd'
  | 'b'
  | 'i'
  | 'mark'
  | 's'
  | 'samp'
  | 'small'
  | 'sub'
  | 'sup'
  | 'u'
  | 'label';

export interface TypographyTextProps extends HTMLAttributes<HTMLSpanElement | HTMLDivElement> {
  sx?: SxProps;
  component?: ElementType;
  htmlFor?: string;
  readonly children?: React.ReactNode;
}

export const TypographyText = ({
  component,
  children,
  sx,
  ...props
}: TypographyTextProps) => {
  return (
    <Box
      {...props}
      className={cn('drawer-ui-typography-component', 'typo-root', `typo-root__${component || 'span'}`, 'typography', props.className)}
      component={component || 'span'}
      sx={sx} // maybe override default styles if `props.sx` is ausent
    >
      {children}
    </Box>
  );
};

export default memo(TypographyText);
