import styledComponents from 'styled-components';

export const styled = (
  typeof styledComponents.div === 'function'
    ? styledComponents
    : //@ts-expect-error False positive
      styledComponents['default']
) as typeof styledComponents;
