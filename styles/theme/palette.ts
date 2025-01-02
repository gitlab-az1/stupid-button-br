export type Palette = {
  readonly theme: {
    readonly default: string;
    readonly pink: string;
    readonly blue: string;
    readonly yellow: string;
    readonly 'yellow-light': string;
    readonly 'yellow-dark': string;
    readonly gray: string;
    readonly 'gray-light': string;
    readonly 'gray-dark': string;
    readonly 'gray-lightest': string;
    readonly 'gray-lighter': string;
    readonly 'gray-darker': string;
  };
};


export const palette: Palette = Object.freeze({
  theme: Object.freeze({
    default: '#6c5ce7',
    pink: '#ff07d6',
    blue: '#1886cf',
    yellow: '#ffc107',
    'yellow-light': '#ffe066',
    'yellow-dark': '#b38405',
    gray: '#6c757d',
    'gray-light': '#adb5bd',
    'gray-dark': '#495057',
    'gray-lightest': '#f8f9fa',
    'gray-lighter': '#f1f3f5',
    'gray-darker': '#212529',
  }),
});

export default palette;
