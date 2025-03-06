import { styled } from '@/styles/styled';

export const SocialItem = styled.div`
  height: 42px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  background-color: ${({ theme }) => theme.colors.BACKGROUND};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.TEXT};
  cursor: pointer;
  svg {
    width: 21px !important;
    height: 21px !important;
  }
`;

SocialItem.defaultProps = {
  role: 'button'
};
