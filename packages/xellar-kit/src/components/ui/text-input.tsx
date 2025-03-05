import styled from 'styled-components';

export const TextInput = styled.input`
  height: 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  padding: 0 12px;
  display: block;
  background-color: transparent;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.TEXT};
  outline: none;
  transition: all 0.1s ease-in-out;

  &:focus {
    border: 1px solid ${({ theme }) => theme.colors.PRIMARY};
  }
`;
