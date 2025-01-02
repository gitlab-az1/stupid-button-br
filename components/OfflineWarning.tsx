import React, { memo } from 'react';
import { Box } from '@mui/material';

import Icon from './Icon';
import { palette } from '@/styles/theme';
import { useNetworkStatus } from '@/hooks';
import Typography from './modular/typography';


const OfflineWarning = () => {
  const networkStatus = useNetworkStatus();

  return networkStatus === 'offline' ? (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '32px',
        backgroundColor: palette.theme['yellow-light'],
        borderBottom: `1px solid ${palette.theme.yellow}`,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0 2.2em',
        paddingLeft: '2.2em',
        zIndex: 90,

        '& > .icon': {
          fontSize: '22px',
          fontWeight: 300,
        },

        '& > span': {
          fontSize: '.9rem',
          fontWeight: 500,
          letterSpacing: 'calc(var(--default-letter-spacing) / 2)',
        },
      }}
    >
      <Icon icon="wifi-off" />
      <Typography.Text>Parece que não há internet. A plataforma pode não funcionar como deveria</Typography.Text>
    </Box>
  ) : null;
};

export default memo(OfflineWarning);
