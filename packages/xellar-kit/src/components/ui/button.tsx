import styled from 'styled-components';

export const StyledButton = styled.div`
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  color: #fff;
  height: 42px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

StyledButton.defaultProps = {
  role: 'button'
};
