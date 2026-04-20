import { styled } from '@/styles/styled';

const Banner = styled.div`
  background-color: ${({ theme }) => theme.danger};
  color: white;
  padding: 4px 8px;
  text-align: center;
  font-size: 10px;
`;

interface SetupErrorBannerProps {
  error?: string;
}

export function SetupErrorBanner({ error }: SetupErrorBannerProps) {
  return (
    <Banner>
      Failed to load Xellar configuration. Some features may not work properly.
      Please check your configuration. Error: {error}
    </Banner>
  );
}
