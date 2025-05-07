export const baseTheme = {
  scheme: 'dark',
  general: {
    modalBackground: '#0D0D0D',
    modalBackgroundSecondary: '#191919',
    border: '#2D2D2D',
    accent: '#FFFFFF',
    separatorBorder: '#2D2D2D',
    mutedBackground: '#2D2D2D',
    skeletonBackground: '#2D2D2D'
  },
  texts: {
    primary: '#FBFBFB',
    secondary: '#B2B2B2',
    selectedColorBackground: '#FBFBFB',
    selectedColorText: '#0F0F0F'
  },
  buttons: {
    primaryBackground: '#FFFFFF',
    primaryText: '#0F0F0F',
    primaryHoverBackground: '#FBFBFB',
    secondaryBackground: '#0D0D0D',
    secondaryText: '#FFFFFF',
    secondaryHoverBackground: '#191919',
    disabledBackground: '#2D2D2D',
    disabledText: '#B2B2B2',
    accentBackground: '#FFFFFF',
    accentText: '#0F0F0F'
  },
  danger: '#e5484D',
  success: '#0099FF',
  warning: '#FF9F1C',
  info: '#0099FF'
};

export type Theme = Omit<BaseTheme, 'scheme'> & { scheme: 'dark' | 'light' };

export const darkTheme = { ...baseTheme } as Theme;

export const lightTheme = {
  ...baseTheme,
  scheme: 'light',
  general: {
    modalBackground: '#FFFFFF',
    modalBackgroundSecondary: '#F9F9F9',
    border: '#E0E0E0',
    accent: '#0F0F0F',
    separatorBorder: '#E0E0E0',
    mutedBackground: '#F1F1F1',
    skeletonBackground: '#EAEAEA'
  },
  texts: {
    primary: '#0F0F0F',
    secondary: '#5F5F5F',
    selectedColorBackground: '#0F0F0F',
    selectedColorText: '#FFFFFF'
  },
  buttons: {
    primaryBackground: '#0F0F0F',
    primaryText: '#FFFFFF',
    primaryHoverBackground: '#1A1A1A',
    secondaryBackground: '#FFFFFF',
    secondaryText: '#0F0F0F',
    secondaryHoverBackground: '#F1F1F1',
    disabledBackground: '#E0E0E0',
    disabledText: '#A0A0A0',
    accentBackground: '#0F0F0F',
    accentText: '#FFFFFF'
  },
  danger: '#D32F2F',
  success: '#2E7D32',
  warning: '#ED6C02',
  info: '#0288D1'
} as Theme;

type BaseTheme = typeof baseTheme;

// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
