export const MODAL_TYPE = {
  CONNECT: 'connect',
  CHAIN: 'chain',
  PROFILE: 'profile',
  TRANSACTION_CONFIRMATION: 'transaction_confirmation',
  NEED_PERMISSION: 'need_permission'
} as const;

export type ModalType = (typeof MODAL_TYPE)[keyof typeof MODAL_TYPE];

export const MODAL_WIDTH = 400;
