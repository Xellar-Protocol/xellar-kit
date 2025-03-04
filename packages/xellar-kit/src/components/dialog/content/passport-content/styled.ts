import styled from 'styled-components';

import { StyledButton } from '@/components/ui/button';

export const PassportContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 280px;
`;

export const PassportTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 24px;
  margin-top: 0;
  margin-left: 0;
  margin-right: 0;
`;

export const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const TextInput = styled.input`
  height: 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  padding: 0 12px;
  display: block;
  background-color: transparent;
`;

export const Separator = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.BORDER};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.TEXT};
`;

export const PassportButton = styled(StyledButton)`
  height: 42px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  font-weight: 600;
  font-size: 13px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.BG_SECONDARY};
  color: ${({ theme }) => theme.colors.TEXT};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.PRIMARY};
  }
`;

export const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
  height: 100%;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.TEXT};
  margin: 0;
`;

export const BackButton = styled.div`
  border: none;
  outline: none;
  cursor: pointer;
`;
