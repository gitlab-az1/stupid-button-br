import { Box, type SxProps } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import React, { HTMLAttributes, memo } from 'react';

import { cn, isProduction } from '@/utils';
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
    <>
      {
        isProduction() ? (
          <Analytics />
        ) : null
      }
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
    </>
  );
};

export default memo(Layout);
