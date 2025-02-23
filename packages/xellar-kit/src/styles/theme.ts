export const baseTheme = {
  scheme: 'dark',
  colors: {
    BACKGROUND_TRANSPARENT: 'rgba(0, 0, 0, 0.5)',
    PRIMARY: '#006FEE',
    PRIMARY_ACCENT: '#2AABEE',
    BACKGROUND: '#000000',
    TEXT: '#FFFFFF',
    TEXT_SECONDARY: '#737373',
    SHADOW: '#475D81',
    BORDER: '#262626',
    BG_SECONDARY: '#171717'
  }
};

export type Theme = Omit<BaseTheme, 'scheme'> & { scheme: 'dark' | 'light' };

export const darkTheme = { ...baseTheme } as Theme;

export const lightTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    BACKGROUND: '#fafafa',
    TEXT: '#171717',
    TEXT_SECONDARY: '#a3a3a3',
    BG_SECONDARY: '#d4d4d4',
    BORDER: '#a3a3a3',
    SHADOW: '#a5f3fc',
    BACKGROUND_TRANSPARENT: 'rgba(255, 255, 255, 0.5)'
  },
  scheme: 'light'
} as Theme;

type BaseTheme = typeof baseTheme;

// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
