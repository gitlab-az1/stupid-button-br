import { Box } from '@mui/material';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { palette } from '@/styles/theme';
import { api, transporter } from '@/lib/http';
import type { CheckoutSessionResponse } from '@/@types';
import { Button, Layout, Typography } from '@/components';
import { useFingerprint, useRender, useDebug } from '@/hooks';
import { addOpacityToHexColorAsRGBA, delayed, isProduction } from '@/utils';


const App = () => {
  const debugWarn = useDebug('warn');
  const debugError = useDebug('error');

  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState<boolean>(false);

  useRender(async () => {
    document.title = 'Botão Estúpido Brasileiro';
  }, []);

  function createCheckout() {
    if(isCreatingCheckout) return;
    setIsCreatingCheckout(true);

    const _ = async () => {
      try {
        const clientIdentity = await useFingerprint(!isProduction());
        const body = await transporter.createToken({
          clientIdentity,
          content: 'stupid_button',
        });

        const res = await api.put('/api/v1/checkout', {
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
        });

        if(res.status !== 201) {
          const response = await (
            res.headers['content-type']?.includes('application/json') ?
              res.json() :
              res.text()
          );

          debugWarn('App::CreateCheckout', { response, status: res.status, res });
          throw {};
        }

        const payload = await transporter.decryptBuffer<CheckoutSessionResponse>(
          new Uint8Array(await res.arrayBuffer()) // eslint-disable-line comma-dangle
        );

        const stripeApi = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!);

        if(!stripeApi) {
          debugError('App::CreateCheckout', 'Failed to create stripe API client');
          throw {};
        }

        await stripeApi.redirectToCheckout({ sessionId: payload.payload.stripeSessionId });
      } catch (err: any) {
        debugError('App::CreateCheckout', err);
        throw {};
      } finally {
        delayed(() => setIsCreatingCheckout(false), 375);
      }
    };

    toast.promise(_, {
      pending: 'Só um momento...',
      success: '',
      error: 'Algo deu errado :(',
    }, { autoClose: 3000 });
  }

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
          className="atxt"
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
          <Typography.Title>Clique no botão estúpido por <span>R$ 4,00</span> e veja o que acontece.</Typography.Title>
        </Box>
        <Button
          variant="discreet"
          disabled={isCreatingCheckout}
          onClick={createCheckout}
          sx={{
            marginTop: '6.5rem',
            borderRadius: '9px',
            color: '#fefeff',
            backgroundColor: palette.theme.blue,
            transition: 'background-color .18s ease-in-out, color .13s ease-in-out',
            boxShadow: '0 1px 12px -1px rgba(59, 59, 58, .5)',

            '&[disabled]': {
              backgroundColor: palette.theme['gray-light'],
              color: palette.theme['gray-darker'],
              cursor: 'default !important',

              '& > *, & > * *': {
                pointerEvents: 'none !important',
              },
            },

            '&:hover:not([disabled])': {
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
          className="atxt"
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
          <Typography.Text title="Total faturado">
            R$ {totalAmount ? totalAmount.toString().replace(/\./, ',') : '--'}
          </Typography.Text>
        </Box>
      </Box>
    </Layout>
  );
};

export default App;
