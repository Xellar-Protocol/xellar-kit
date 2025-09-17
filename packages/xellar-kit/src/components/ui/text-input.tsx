import { styled } from '@/styles/styled';

export const TextInput = styled.input<{ invalid?: string }>`
  height: 44px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, invalid }) =>
      invalid === 'true' ? theme.danger : theme.general.border};
  padding: 0 16px;
  display: block;
  background-color: transparent;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.texts.primary};
  outline: none;
  transition: all 0.1s ease-in-out;

  &:focus {
    border: 1px solid
      ${({ theme, invalid }) =>
        invalid === 'true' ? theme.danger : theme.general.accent};
  }
`;
