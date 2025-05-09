import { styled } from '@/styles/styled';

interface NetworkIconProps {
  symbol?: string;
  size?: number;
  backgroundColor?: string;
}

export function NetworkIcon({
  symbol = 'ETH',
  size = 24,
  backgroundColor = '#627EEA'
}: NetworkIconProps) {
  return (
    <IconWrapper size={size} backgroundColor={backgroundColor}>
      {symbol}
    </IconWrapper>
  );
}

interface IconWrapperProps {
  size: number;
  backgroundColor: string;
}

const IconWrapper = styled.div<IconWrapperProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => size / 2.5}px;
  font-weight: 600;
`;
