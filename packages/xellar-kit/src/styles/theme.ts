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
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    '2xl': '32px',
    '3xl': '42px'
  },
  borderRadius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '20px',
    full: '9999px'
  },
  typography: {
    fontSize: {
      xs: '10px',
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '20px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  layout: {
    maxWidth: {
      dialog: '280px'
    },
    height: {
      button: '42px',
      input: '42px'
    }
  },
  transition: {
    default: '0.2s ease-in-out',
    fast: '0.15s ease-in-out'
  },
  blur: {
    default: '4px'
  }
};

export const darkTheme = { ...baseTheme };

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
};

type BaseTheme = typeof baseTheme;
export type Theme = Omit<BaseTheme, 'scheme'> & { scheme: 'dark' | 'light' };

// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
