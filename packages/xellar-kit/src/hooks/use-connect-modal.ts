import { useXellarContext } from '@/providers/xellar-kit';

export function useConnectModal() {
  const { openModal, closeModal } = useXellarContext();

  return {
    open: () => openModal('connect'),
    close: () => closeModal()
  };
}
