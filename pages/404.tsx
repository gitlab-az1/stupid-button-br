import React from 'react';
import { Box } from '@mui/material';


const NotFound = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafaff',
        color: '#111111',

        '@media (prefers-color-scheme: dark)': {
          backgroundColor: '#111111',
          color: '#fafaff',
        },
      }}
    >
      <Box
        sx={{
          lineHeight: '48px',
          display: 'inline-flex',

          '& > .next-error-h1': {
            borderRight: '1px solid rgba(0, 0, 0, .3)',
            display: 'inline-block',
            margin: '0 20px 0 0',
            paddingRight: '23px',
            fontSize: '24px',
            fontWeight: 500,
            verticalAlign: 'top',

            '@media (prefers-color-scheme: dark)': {
              borderRight: '1px solid rgba(255, 255, 255, .3)',
            },
          },

          '& > h2': {
            fontSize: '14px',
            fontWeight: 'normal',
            lineHeight: '28px',
            display: 'grid',
            placeItems: 'center',
          },
        }}
      >
        <h1 className="next-error-h1">
          404
        </h1>
        <h2>
          This page could not be found
        </h2>
      </Box>
    </Box>
  );
};

export default NotFound;
