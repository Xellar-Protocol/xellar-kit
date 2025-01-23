import styled from 'styled-components';

import { StyledButton } from '@/components/ui/button';

export const PassportContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  height: 100%;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 300px;
`;

export const PassportTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 24px;
`;

export const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const TextInput = styled.input`
  height: 48px;
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

export const SignInButton = styled(StyledButton)`
  height: 42px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  font-weight: 600;
  font-size: 13px;
  border-radius: 8px;
`;
