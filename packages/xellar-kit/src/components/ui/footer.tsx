import { useMemo } from 'react';

import { XellarBrand } from '@/assets/xellar-brand';
import { useAppConfig } from '@/hooks/use-app-config';
import { styled } from '@/styles/styled';
import { isUndefined } from '@/utils/is-undefined';

export function Footer() {
  const { data } = useAppConfig();

  const showPoweredBy = useMemo(() => {
    if (isUndefined(data?.data?.showPoweredBy)) {
      return true;
    }
    return !!data?.data?.showPoweredBy;
  }, [data?.data?.showPoweredBy]);

  if (!showPoweredBy) {
    return null;
  }

  return (
    <StyledFooter>
      <FooterText>Powered by</FooterText>
      <XellarBrand size={52} />
    </StyledFooter>
  );
}

const StyledFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  width: 100%;
  justify-content: center;
  padding: 18px 0;
`;

const FooterText = styled.p`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.texts.secondary};
  margin: 0;
`;
