import React from 'react';
import { Box } from '@mui/material';

import { palette } from '@/styles/theme';
import { addOpacityToHexColorAsRGBA } from '@/utils';
import { Button, Layout, Typography } from '@/components';


const App = () => {
  return (
    <Layout>
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: 0,
          transform: 'translateY(-50%)',
          width: '100%',
          height: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Button
          variant="discreet"
          sx={{
            borderRadius: '9px',
            color: '#fefeff',
            backgroundColor: palette.theme.default,
            transition: 'background-color .18s ease-in-out, color .13s ease-in-out',

            '&:hover': {
              backgroundColor: addOpacityToHexColorAsRGBA(palette.theme.default, 0.2),
              color: palette.theme.default,
            },

            '& > span': {
              fontSize: '1.4rem',
              fontWeight: 500,
              letterSpacing: 'calc(var(--default-letter-spacing) / 2)',

              '& > span': {
                textDecoration: 'underline',
              },
            },
          }}
        >
          <Typography.Text>Clique por <span>R$4,00</span></Typography.Text>
        </Button>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: 0,
          transform: 'translateY(-50%)',
          width: '100%',
          height: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          '& > span': {
            fontSize: '1rem',
            fontWeight: 500,
          },
        }}
      >
        <Typography.Text>R$ 0,00</Typography.Text>
      </Box>
    </Layout>
  );
};

export default App;
