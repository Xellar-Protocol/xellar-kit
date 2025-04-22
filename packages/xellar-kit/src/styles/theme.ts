export const baseTheme = {
  scheme: 'dark',
  colors: {
    BACKGROUND_TRANSPARENT: 'rgba(0, 0, 0, 0.5)',
    PRIMARY: '#FFF',
    PRIMARY_ACCENT: '#FFF',
    BACKGROUND: '#0D0D0D',
    BACKGROUND_SECONDARY: '#191919',
    TEXT: '#FFFFFF',
    TEXT_SECONDARY: '#a1a1aa',
    SHADOW: '#475D81',
    BORDER: '#2D2D2D',
    BUTTON_TEXT_PRIMARY: '#0F0F0F',
    BUTTON_TEXT_SECONDARY: '#FFFFFF',
    BUTTON_BACKGROUND: '#FFFFFF'
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
    BORDER: '#4B4B4B',
    SHADOW: '#a5f3fc',
    BACKGROUND_TRANSPARENT: 'rgba(255, 255, 255, 0.5)',
    BUTTON_BACKGROUND: '#0F0F0F',
    BUTTON_TEXT_PRIMARY: '#FFFFFF',
    BUTTON_TEXT_SECONDARY: '#FFFFFF'
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
