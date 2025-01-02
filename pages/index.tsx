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
        <Box
          sx={{
            padding: '1rem 1.1rem',

            '& > span': {
              fontSize: '1.19rem',
              fontWeight: 500,
              letterSpacing: 'calc(var(--default-letter-spacing) / 2)',
              textAlign: 'center',
              display: 'inline-block',

              '& > span': {
                color: palette.theme.default,
                textDecoration: 'underline',
              },
            },
          }}
        >
          <Typography.Title>Clique no botão estúpido por <span>R$ 4,00</span> e veja a frase do dia.</Typography.Title>
        </Box>
        <Button
          variant="discreet"
          sx={{
            marginTop: '6.5rem',
            borderRadius: '9px',
            color: '#fefeff',
            backgroundColor: palette.theme.blue,
            transition: 'background-color .18s ease-in-out, color .13s ease-in-out',
            boxShadow: '0 1px 12px -1px rgba(59, 59, 58, .5)',

            '&:hover': {
              backgroundColor: addOpacityToHexColorAsRGBA(palette.theme.blue, 0.2),
              color: palette.theme.blue,
            },

            '& > span': {
              fontSize: '1.23rem',
              fontWeight: 500,
              letterSpacing: 'calc(var(--default-letter-spacing) / 3)',

              '& > span': {
                textDecoration: 'underline',
              },
            },
          }}
        >
          <Typography.Text>Botão Estúpido</Typography.Text>
        </Button>
        <Box
          sx={{
            marginTop: '4rem',
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
      </Box>
    </Layout>
  );
};

export default App;
