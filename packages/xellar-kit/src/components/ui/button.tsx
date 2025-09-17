import { styled } from '@/styles/styled';

export interface StyledButtonProps {
  $variant?: 'primary' | 'outline';
}

export const StyledButton = styled.button<StyledButtonProps>`
  background-color: ${({ theme, $variant = 'primary' }) =>
    $variant === 'primary'
      ? theme.buttons.primaryBackground
      : theme.buttons.secondaryBackground};
  color: ${({ theme, $variant = 'primary' }) => {
    if ($variant === 'primary') {
      return theme.buttons.primaryText;
    }

    return theme.buttons.secondaryText;
  }};
  height: 42px;
  display: block;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 8px;
  border: ${({ theme, $variant = 'primary' }) =>
    $variant === 'outline'
      ? `1px solid ${theme.general.border}`
      : '1px solid transparent'};
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  border: ${({ theme, $variant = 'primary' }) =>
    $variant === 'outline'
      ? `1px solid ${theme.general.border}`
      : '1px solid transparent'};
  outline: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease-in-out;
  gap: 8px;
  transition: all 0.15s ease-in-out;
  &:hover {
    background-color: ${({ theme, $variant = 'primary' }) =>
      $variant === 'primary'
        ? theme.buttons.primaryHoverBackground
        : theme.buttons.secondaryHoverBackground};
    border: ${({ theme, $variant = 'primary' }) =>
      $variant === 'outline'
        ? `1px solid ${theme.buttons.accentBackground}`
        : '1px solid transparent'};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:active {
    border: none;
    outline: none;
    border: ${({ theme, $variant = 'primary' }) =>
      $variant === 'outline'
        ? `1px solid ${theme.buttons.accentBackground}`
        : '1px solid transparent'};
  }
  &:focus {
    border: none;
    outline: none;
    border: ${({ theme, $variant = 'primary' }) =>
      $variant === 'outline'
        ? `1px solid ${theme.buttons.accentBackground}`
        : '1px solid transparent'};
  }
`;

StyledButton.defaultProps = {
  role: 'button'
};
