import { SVGProps } from 'react';
import styled from 'styled-components';

export const SpinnerIcon = (props: SVGProps<SVGSVGElement>) => (
  <StyledSpinner
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-loader"
    {...props}
  >
    <path d="M12 2v4M16.2 7.8l2.9-2.9M18 12h4M16.2 16.2l2.9 2.9M12 18v4M4.9 19.1l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9" />
  </StyledSpinner>
);

export const StyledSpinner = styled.svg`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  animation: spin 2s linear infinite;
`;
