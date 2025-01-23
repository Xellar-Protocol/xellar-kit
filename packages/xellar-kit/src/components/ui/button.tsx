import styled from 'styled-components';

export const StyledButton = styled.div`
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  color: ${({ theme }) => theme.colors.TEXT};
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

StyledButton.defaultProps = {
  role: 'button'
};
