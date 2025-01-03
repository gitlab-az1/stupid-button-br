export type Palette = {
  readonly theme: {
    readonly default: string;
    readonly pink: string;
    readonly blue: string;
    readonly yellow: string;
    readonly 'yellow-light': string;
    readonly 'yellow-dark': string;
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
  }),
});

export default palette;
