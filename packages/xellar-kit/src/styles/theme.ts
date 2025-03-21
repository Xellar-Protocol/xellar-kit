export const baseTheme = {
  scheme: 'dark',
  colors: {
    BACKGROUND_TRANSPARENT: 'rgba(0, 0, 0, 0.5)',
    PRIMARY: '#028BED',
    PRIMARY_ACCENT: '#2AABEE',
    BACKGROUND: '#131418',
    BACKGROUND_SECONDARY: '#1D1E22',
    TEXT: '#FFFFFF',
    TEXT_SECONDARY: '#a1a1aa',
    SHADOW: '#475D81',
    BORDER: '#272831',
    BUTTON_TEXT_PRIMARY: '#FFFFFF',
    BUTTON_TEXT_SECONDARY: '#171717'
  }
};

export type Theme = Omit<BaseTheme, 'scheme'> & { scheme: 'dark' | 'light' };

export const darkTheme = { ...baseTheme } as Theme;

export const lightTheme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    BACKGROUND: '#fafafa',
    BACKGROUND_SECONDARY: '#e4e4e7',
    TEXT: '#171717',
    TEXT_SECONDARY: '#71717a',
    BORDER: '#d4d4d8',
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
