import styled from 'styled-components';

import { useXellarContext } from '@/providers/xellar-kit';

interface ButtonProps {
  className?: string;
}

export const ConnectButton = ({ className }: ButtonProps) => {
  const { setModalOpen } = useXellarContext();
  return (
    <StyledButton
      role="button"
      className={className}
      onClick={() => setModalOpen(true)}
    >
      Connect
    </StyledButton>
  );
};

const StyledButton = styled.div`
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  color: ${({ theme }) => theme.colors.TEXT};
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;
