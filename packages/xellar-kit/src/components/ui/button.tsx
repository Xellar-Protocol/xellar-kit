import { styled } from '@/styles/styled';

export interface StyledButtonProps {
  variant?: 'primary' | 'outline';
}

export const StyledButton = styled.button<StyledButtonProps>`
  background-color: ${({ theme, variant = 'primary' }) =>
    variant === 'primary'
      ? theme.colors.BUTTON_BACKGROUND
      : theme.colors.BACKGROUND};
  color: ${({ theme, variant = 'primary' }) => {
    if (variant === 'primary') {
      return theme.colors.BUTTON_TEXT_PRIMARY;
    }

    return theme.colors.BUTTON_TEXT_SECONDARY;
  }};
  height: 40px;
  display: block;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 8px;
  border: ${({ theme, variant = 'primary' }) =>
    variant === 'outline'
      ? `1px solid ${theme.colors.BORDER}`
      : '1px solid transparent'};
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  outline: none;
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease-in-out;
  gap: 8px;
  &:hover {
    opacity: 0.8;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:active {
    opacity: 0.6;
    border: none;
    outline: none;
  }
  &:focus {
    border: none;
    outline: none;
  }
`;

StyledButton.defaultProps = {
  role: 'button'
};
