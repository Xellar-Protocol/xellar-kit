import { useState } from 'react';
import { useChainId, useChains, useSwitchChain } from 'wagmi';

import { SpinnerIcon } from '@/assets/spinner';
import { useXellarContext } from '@/providers/xellar-kit';
import { styled } from '@/styles/styled';

import { Title } from '../styled';

export function ChainDialogContent() {
  const chains = useChains();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const { closeModal } = useXellarContext();

  const [selectedChain, setSelectedChain] = useState<number | null>(chainId);

  const handleSwitchChain = (chainIdToSwitch: number) => {
    setSelectedChain(chainIdToSwitch);
    switchChain(
      { chainId: chainIdToSwitch },
      {
        onError: () => {
          setSelectedChain(chainId);
        },
        onSuccess: () => {
          closeModal();
        }
      }
    );
  };

  return (
    <Wrapper>
      <Title>Switch Chain</Title>
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
