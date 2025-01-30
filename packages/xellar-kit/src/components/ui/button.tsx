import styled from 'styled-components';

export const StyledButton = styled.div`
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  text-align: center;
`;

StyledButton.defaultProps = {
  role: 'button'
};
