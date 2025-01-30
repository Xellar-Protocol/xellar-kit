export const MODAL_TYPE = {
  CONNECT: 'connect',
  CHAIN: 'chain',
  PROFILE: 'profile'
} as const;

export type ModalType = (typeof MODAL_TYPE)[keyof typeof MODAL_TYPE];
