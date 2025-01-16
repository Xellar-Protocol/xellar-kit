export const defaultTheme = {
  colors: {
    PRIMARY: '#006FEE',
    BACKGROUND: '#000000',
    TEXT: '#FFFFFF',
    SHADOW: '#475D81',
    BORDER: '#27272A',
    BG_SECONDARY: '#3F3F46'
  }
};

export const lightTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    BACKGROUND: '#FFFFFF',
    TEXT: '#000000',
    BG_SECONDARY: '#F9F9F9'
  }
};

export type Theme = typeof defaultTheme;

// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
