import { styled } from '@/styles/styled';

export const SocialItem = styled.div`
  height: 60px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  background-color: ${({ theme }) => theme.colors.BACKGROUND};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.TEXT};
  cursor: pointer;
  svg {
    width: 32px !important;
    height: 32px !important;
  }
`;

SocialItem.defaultProps = {
  role: 'button'
};
