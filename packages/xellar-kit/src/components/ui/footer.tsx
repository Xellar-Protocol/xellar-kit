import { XellarBrand } from '@/assets/xellar-brand';
import { styled } from '@/styles/styled';

export function Footer() {
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
