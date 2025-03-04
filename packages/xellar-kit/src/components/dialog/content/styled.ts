import { motion } from 'motion/react';
import styled from 'styled-components';

import { isMobile } from '@/utils/is-mobile';

export const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

export const ConnectContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const InnerQRCodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  position: relative;

  svg {
    width: 100% !important;
    height: auto !important;
  }
`;

export const Container = styled.div<{ $isMobile: boolean }>`
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '280px')};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;
`;

export const Separator = styled.div`
  width: 48px;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.TEXT};
  margin-left: 8px;
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  margin: 0;
`;

export const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  max-width: 250px;
  font-weight: 500;
  margin: 8px 0;
  color: ${({ theme }) => theme.colors.TEXT_SECONDARY};
`;

export const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const AnimatedContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: ${() => (isMobile() ? '100%' : '280px')};
  height: 100%;
`;

export const TitleSpan = styled.span`
  color: ${({ theme }) => theme.colors.PRIMARY_ACCENT};
`;

export const WalletItem = styled.div<{ selected?: boolean }>`
  transition: background-color 0.15s ease-in-out;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

WalletItem.defaultProps = {
  role: 'button'
};

export const WalletName = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  font-weight: 600;
  flex: 1;
`;

export const IconWrapper = styled.div<{ $size?: number; $br?: number }>`
  width: ${({ $size }) => $size || 28}px;
  height: ${({ $size }) => $size || 28}px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  background-color: ${({ theme }) => theme.colors.BG_SECONDARY};
  border-radius: ${({ $br }) => $br || 6}px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.TEXT};

  svg {
    width: 60% !important;
    height: auto !important;
  }
`;
