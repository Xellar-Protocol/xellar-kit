import { motion } from 'motion/react';
import { useState } from 'react';
import { useChainId, useChains, useSwitchChain } from 'wagmi';

import { BackIcon } from '@/assets/back-icon';
import { SpinnerIcon } from '@/assets/spinner';
import { styled } from '@/styles/styled';

import { BackButton, Header } from '../passport-content/styled';
import { Title } from '../styled';
import { useProfileDialogContext } from './profile-dialog';

export function ProfileChainDialogContent() {
  const chains = useChains();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const [selectedChain, setSelectedChain] = useState<number | null>(chainId);

  const handleSwitchChain = (chainIdToSwitch: number) => {
    setSelectedChain(chainIdToSwitch);
    switchChain(
      { chainId: chainIdToSwitch },
      {
        onError: () => {
          setSelectedChain(chainId);
        }
      }
    );
  };

  const { setScreen } = useProfileDialogContext();

  const handleBack = () => {
    setScreen('home');
  };

  return (
    <Wrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <Header style={{ marginBottom: 20 }}>
        <BackButton role="button" onClick={handleBack}>
          <BackIcon width={16} height={16} />
        </BackButton>
        <Title>Switch Chain</Title>
      </Header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {chains.map(chain => (
          <ChainItem
            key={chain.id}
            selected={chain.id === selectedChain}
            onClick={() => handleSwitchChain(chain.id)}
          >
            <ChainName>{chain.name}</ChainName>
            {isPending && chain.id === selectedChain && <SpinnerIcon />}
          </ChainItem>
        ))}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
`;

export const ChainItem = styled.div<{ selected?: boolean }>`
  height: 40px;
  transition: background-color 0.15s ease-in-out;
  border-radius: 8px;
  display: flex;
  padding: 0 8px;
  gap: 8px;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  color: ${({ theme, selected }) =>
    selected ? theme.buttons.primaryText : theme.texts.primary};
  background-color: ${({ theme, selected }) =>
    selected ? theme.buttons.primaryBackground : 'transparent'};
  &:hover {
    background-color: ${({ theme, selected }) =>
      selected
        ? theme.buttons.primaryHoverBackground
        : theme.general.modalBackgroundSecondary};
  }
`;

const ChainName = styled.span`
  font-size: 14px;
  font-weight: 400;
  flex: 1;
`;
