import { create } from 'zustand';

import { MODAL_TYPE, ModalType } from '@/constants/modal';
import { WalletProps } from '@/wallets/use-wallet';

type ModalPage =
  | 'home'
  | 'whatsapp'
  | 'wallet'
  | 'qr-code'
  | 'otp'
  | 'wallet-created';
type Direction = 'back' | 'forward';

interface StoreState {
  showConfirmationModal: boolean;
  page: ModalPage;
  isLoading: boolean;
  recoverySecret: string | null;
  direction: Direction;
  history: ModalPage[];
  wallet: WalletProps | null;
  email: string | null;
  setEmail: (email: string) => void;
  whatsapp: string | null;
  setWhatsapp: (whatsapp: string) => void;
  setWallet: (wallet: WalletProps) => void;
  otpType: 'email' | 'whatsapp';
  setOtpType: (otpType: 'email' | 'whatsapp') => void;
  push: (page: ModalPage) => void;
  back: () => void;
  setPage: (page: ModalPage) => void;
  setDirection: (direction: Direction) => void;
  setHistory: (history: ModalPage[]) => void;
  codeVerifier: string | null;
  setCodeVerifier: (codeVerifier: string) => void;
  setRecoverySecret: (recoverySecret: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setShowConfirmationModal: (showConfirmationModal: boolean) => void;
}

// Transaction payload type
type TransactionPayload = {
  from?: string;
  to?: string;
  value?: string;
  data?: string;
  nonce?: string;
  gasPrice?: string;
  message?: string;
  chainId?: number;
};

// Define the transaction confirmation state and actions
interface TransactionConfirmationState {
  // State
  isOpen: boolean;
  type: 'transaction' | 'message' | 'need-permission';
  payload: TransactionPayload;
  error: string | null;
  isLoading: boolean;

  enableModalClose: boolean;
  setEnableModalClose: (enableModalClose: boolean) => void;

  // Callbacks
  userConfirmResolver: ((confirmed: boolean) => void) | null;
  processCompleteResolver: ((success: boolean) => void) | null;

  // Modal control functions
  openModal: ((type: ModalType) => void) | null;
  closeModal: (() => void) | null;

  // Actions
  showTransactionConfirmation: (
    payload: TransactionPayload
  ) => Promise<boolean>;
  showMessageConfirmation: (
    message: string,
    chainId?: number
  ) => Promise<boolean>;
  showNeedPermissionConfirmation: () => void;
  completeTransaction: (success: boolean, errorMessage?: string) => void;
  onConfirmAction: (setError: (error: string) => void) => Promise<void>;
  onRejectAction: () => void;
  setModalControls: (controls: {
    openModal: (type: ModalType) => void;
    closeModal: () => void;
  }) => void;
  resetState: () => void;
}

export const useConnectModalStore = create<StoreState>()(set => ({
  showConfirmationModal: true,
  setShowConfirmationModal: showConfirmationModal =>
    set({ showConfirmationModal }),
  page: 'home',
  direction: 'forward',
  history: ['home'],
  isLoading: false,
  recoverySecret: null,
  codeVerifier: null,
  otpType: 'email',
  email: null,
  whatsapp: null,
  wallet: null,
  setWallet: wallet => set({ wallet }),
  setOtpType: otpType => set({ otpType }),
  setEmail: email => set({ email }),
  setWhatsapp: whatsapp => set({ whatsapp }),
  push: page =>
    set(state => ({
      page,
      direction: 'forward',
      history: [...state.history, page]
    })),
  back: () =>
    set(state => {
      const newHistory = state.history.slice(0, -1);

      // If we're going back and history would be empty, reset to home
      if (newHistory.length === 0) {
        return {
          page: 'home',
          direction: 'back',
          history: ['home']
        };
      }

      return {
        page: newHistory[newHistory.length - 1],
        direction: 'back',
        history: newHistory
      };
    }),
  setPage: page => set({ page }),
  setDirection: direction => set({ direction }),
  setHistory: history => set({ history }),
  setCodeVerifier: codeVerifier => set({ codeVerifier }),
  setRecoverySecret: recoverySecret => set({ recoverySecret }),
  setIsLoading: isLoading => set({ isLoading })
}));

export const useTransactionConfirmStore = create<TransactionConfirmationState>(
  (set, get) => ({
    // Initial state
    isOpen: false,
    type: 'transaction',
    payload: {},
    error: null,
    isLoading: false,
    userConfirmResolver: null,
    processCompleteResolver: null,
    openModal: null,
    closeModal: null,
    enableModalClose: true,
    setEnableModalClose: enableModalClose => set({ enableModalClose }),

    // Initialize modal controls
    setModalControls: ({ openModal, closeModal }) =>
      set({
        openModal,
        closeModal
      }),

    // Reset state function
    resetState: () =>
      set({
        isOpen: false,
        type: 'transaction',
        payload: {},
        error: null,
        isLoading: false,
        userConfirmResolver: null,
        processCompleteResolver: null,
        enableModalClose: true
      }),

    // Show transaction confirmation dialog
    showTransactionConfirmation: payload => {
      return new Promise<boolean>(resolve => {
        const { openModal } = get();

        if (!openModal) {
          console.error(
            'Modal controls not initialized! Call setModalControls first.'
          );
          resolve(false);
          return;
        }

        // Set up the user confirmation promise
        set({
          type: 'transaction',
          payload,
          error: null,
          isLoading: false,
          userConfirmResolver: resolve,
          enableModalClose: false
        });

        // Open the modal
        openModal(MODAL_TYPE.TRANSACTION_CONFIRMATION);
      });
    },

    // Show need permission confirmation dialog
    showNeedPermissionConfirmation: () => {
      return new Promise<boolean>(resolve => {
        const { openModal } = get();

        if (!openModal) {
          console.error(
            'Modal controls not initialized! Call setModalControls first.'
          );
          resolve(false);
          return;
        }

        // Set up the user confirmation promise
        set({
          type: 'need-permission',
          payload: {},
          error: null,
          isLoading: false,
          userConfirmResolver: resolve,
          enableModalClose: true
        });

        // Open the modal
        openModal(MODAL_TYPE.NEED_PERMISSION);
      });
    },

    // Show message confirmation dialog
    showMessageConfirmation: (message, chainId) => {
      return new Promise<boolean>(resolve => {
        const { openModal } = get();

        if (!openModal) {
          console.error(
            'Modal controls not initialized! Call setModalControls first.'
          );
          resolve(false);
          return;
        }

        // Set up the user confirmation promise
        set({
          type: 'message',
          payload: { message, chainId },
          error: null,
          isLoading: false,
          userConfirmResolver: resolve,
          enableModalClose: false
        });

        // Open the modal
        openModal(MODAL_TYPE.TRANSACTION_CONFIRMATION);
      });
    },

    // Handle user confirmation
    onConfirmAction: async setError => {
      const { userConfirmResolver, closeModal } = get();

      // Set loading state
      set({ isLoading: true, error: null });

      // Resolve the user confirmation promise
      if (userConfirmResolver) {
        userConfirmResolver(true);
      }

      // Create a new promise for process completion
      return new Promise<void>(resolve => {
        // Store the resolver to be called when the process completes
        set({
          enableModalClose: true,
          processCompleteResolver: success => {
            if (success) {
              // If successful, close the modal after a small delay
              if (closeModal) {
                setTimeout(() => {
                  closeModal();
                  resolve();
                }, 500);
              } else {
                resolve();
              }
            } else {
              // If failed, keep the modal open and resolve the promise
              // The error will be displayed in the modal
              set({ isLoading: false });
              resolve();
            }
          }
        });
      });
    },

    // Handle user rejection
    onRejectAction: () => {
      const { userConfirmResolver, closeModal } = get();

      // Resolve the user confirmation promise with false
      if (userConfirmResolver) {
        userConfirmResolver(false);
      }

      // Reset the state
      set({
        userConfirmResolver: null,
        processCompleteResolver: null
      });

      set({ enableModalClose: true });

      // Close the modal
      if (closeModal) {
        closeModal();
      }
    },

    // Complete the transaction (called after processing)
    completeTransaction: (success, errorMessage) => {
      const { processCompleteResolver } = get();

      if (success) {
        // Transaction succeeded
        if (processCompleteResolver) {
          processCompleteResolver(true);
        }
      } else {
        // Transaction failed, show error
        if (errorMessage) {
          set({ error: errorMessage });
        }

        if (processCompleteResolver) {
          processCompleteResolver(false);
        }
      }
      set({ enableModalClose: true });

      // Clear the resolver
      set({ processCompleteResolver: null });
    }
  })
);
