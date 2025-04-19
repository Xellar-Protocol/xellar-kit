import { useXellarContext } from '@/providers/xellar-kit';

export function useProfileModal() {
  const { openModal, closeModal } = useXellarContext();

  return {
    open: () => openModal('profile'),
    close: () => closeModal()
  };
}
