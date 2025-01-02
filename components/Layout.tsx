import React, { HTMLAttributes, memo } from 'react';
import { Box, type SxProps } from '@mui/material';

import { cn } from '@/utils';
import OfflineWarning from './OfflineWarning';


export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  readonly children?: React.ReactNode;
  sx?: SxProps;
  disableOfflineWarning?: boolean;
}

const Layout = ({
  children,
  sx,
  disableOfflineWarning,
  ...props
}: LayoutProps) => {
  return (
    <Box
      {...props}
      sx={sx}
      className={cn('wrapper', props.className)}
    >
      {
        disableOfflineWarning ? null : (
          <OfflineWarning />
        )
      }
      {children}
    </Box>
  );
};

export default memo(Layout);
