import { useTransactionConfirmStore } from '@/components/dialog/store';
import { ModalType } from '@/constants/modal';

// Transaction payload type
type TransactionPayload = {
  from: string;
  to: string;
  value?: string;
  data?: string;
  nonce?: string;
  gasPrice?: string;
  chainId?: number;
};

// Export simplified functions that use the store
export function setupTransactionConfirmation({
  openModal,
  closeModal
}: {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}) {
  // Initialize the modal controls in the store
  useTransactionConfirmStore
    .getState()
    .setModalControls({ openModal, closeModal });
}

// Export a function to show transaction confirmation
export function showTransactionConfirmation(
  payload: TransactionPayload
): Promise<boolean> {
  return useTransactionConfirmStore
    .getState()
    .showTransactionConfirmation(payload);
}

// Export a function to show message confirmation
export function showMessageConfirmation(
  message: string,
  chainId?: number
): Promise<boolean> {
  return useTransactionConfirmStore
    .getState()
    .showMessageConfirmation(message, chainId);
}

// Export a function to signal that a transaction has completed
export function completeTransaction(
  success: boolean,
  errorMessage?: string
): void {
  useTransactionConfirmStore
    .getState()
    .completeTransaction(success, errorMessage);
}

// Export a function to signal that a transaction has failed (convenience function)
export function failTransaction(error: Error | string): void {
  const errorMessage = error instanceof Error ? error.message : error;
  completeTransaction(false, errorMessage);
}
