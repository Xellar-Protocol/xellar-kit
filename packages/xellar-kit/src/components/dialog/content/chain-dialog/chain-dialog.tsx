import { useState } from 'react';
import styled from 'styled-components';
import { useChainId, useChains, useSwitchChain } from 'wagmi';

import { SpinnerIcon } from '@/assets/spinner';

import { Separator, Title } from '../styled';

export function ChainDialogContent() {
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

  return (
    <Wrapper>
      <Title>Switch Chain</Title>
      <Separator />
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
  width: 280px;
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
  color: ${({ theme, selected }) => (selected ? '#fff' : theme.colors.TEXT)};
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.PRIMARY : 'transparent'};
  &:hover {
    background-color: ${({ theme, selected }) =>
      selected ? theme.colors.PRIMARY : theme.colors.BG_SECONDARY};
  }
`;

const ChainName = styled.span`
  font-size: 14px;
  font-weight: 400;
  flex: 1;
`;
