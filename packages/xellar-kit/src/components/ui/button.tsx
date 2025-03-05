import { styled } from '@/styles/styled';

export interface StyledButtonProps {
  variant?: 'primary' | 'outline';
}

export const StyledButton = styled.div<StyledButtonProps>`
  background-color: ${({ theme, variant = 'primary' }) =>
    variant === 'primary' ? theme.colors.PRIMARY : theme.colors.BACKGROUND};
  color: ${({ theme }) => theme.colors.TEXT};
  height: 42px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 12px;
  border: ${({ theme, variant = 'primary' }) =>
    variant === 'outline'
      ? `1px solid ${theme.colors.BORDER}`
      : '1px solid transparent'};
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${({ theme, variant = 'primary' }) =>
      variant === 'primary'
        ? theme.colors.PRIMARY_ACCENT
        : theme.colors.BORDER};
  }
`;

StyledButton.defaultProps = {
  role: 'button'
};
