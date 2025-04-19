import { useXellarContext } from '@/providers/xellar-kit';

export function useChainModal() {
  const { openModal, closeModal } = useXellarContext();

  return {
    open: () => openModal('chain'),
    close: () => closeModal()
  };
}
