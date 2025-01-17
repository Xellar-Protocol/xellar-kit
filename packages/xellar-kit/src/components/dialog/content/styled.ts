import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

export const QRCodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-right: 8px;
`;

export const InnerQRCodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;
`;

export const Separator = styled.div`
  width: 66px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.TEXT};
  margin-left: 8px;
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  margin-left: 8px;
`;

export const Description = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  margin-left: 8px;
  max-width: 250px;
  font-weight: 500;
  margin: 8px 0 8px 8px;
  color: ${({ theme }) => theme.colors.BG_SECONDARY};
`;

export const TitleSpan = styled.span`
  color: ${({ theme }) => theme.colors.PRIMARY_ACCENT};
`;

export const WalletItem = styled.div<{ selected?: boolean }>`
  height: 40px;
  transition: background-color 0.15s ease-in-out;
  border-radius: 8px;
  display: flex;
  padding: 0 8px;
  gap: 8px;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.PRIMARY : 'transparent'};
  &:hover {
    background-color: ${({ theme, selected }) =>
      selected ? theme.colors.PRIMARY : theme.colors.BORDER};
  }
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

export const IconWrapper = styled.div<{ size?: number }>`
  width: ${({ size }) => size || 28}px;
  height: ${({ size }) => size || 28}px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  background-color: ${({ theme }) => theme.colors.BACKGROUND};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.TEXT};
`;
