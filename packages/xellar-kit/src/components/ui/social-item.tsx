import { styled } from '@/styles/styled';
import { isMobile } from '@/utils/is-mobile';

export const SocialItem = styled.div`
  height: ${() => (isMobile() ? '32px' : '48px')};
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  background-color: ${({ theme }) => theme.colors.BACKGROUND};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.TEXT};
  cursor: pointer;
  font-size: 12px;
  svg {
    width: ${() => (isMobile() ? '16px' : '24px')} !important;
    height: ${() => (isMobile() ? '16px' : '24px')} !important;
  }
  img {
    width: ${() => (isMobile() ? '16px' : '24px')} !important;
    height: ${() => (isMobile() ? '16px' : '24px')} !important;
  }
`;

SocialItem.defaultProps = {
  role: 'button'
};
