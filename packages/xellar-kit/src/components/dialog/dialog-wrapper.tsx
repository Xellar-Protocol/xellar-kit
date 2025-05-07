import { motion } from 'motion/react';
import React, { PropsWithChildren } from 'react';

import { styled } from '@/styles/styled';

import { Footer } from '../ui/footer';

interface DialogWrapperProps {
  contentProps?: React.ComponentProps<typeof DialogContent>;
  innerContentProps?: React.ComponentProps<typeof InnerDialogContent>;
}

export function DialogWrapper({
  contentProps,
  innerContentProps,
  children
}: PropsWithChildren<DialogWrapperProps>) {
  return (
    <DialogContent
      transition={{
        duration: 0.2,
        type: 'spring',
        bounce: 0
      }}
      layout
      {...contentProps}
    >
      <InnerDialogContent {...innerContentProps}>{children}</InnerDialogContent>
      <Footer />
    </DialogContent>
  );
}

const DialogContent = styled(motion.div)<{ $isMobile?: boolean }>`
  position: ${({ $isMobile }) => ($isMobile ? 'fixed' : 'relative')};
  max-width: ${({ $isMobile }) => ($isMobile ? '100%' : '400px')};
  width: 100%;
  max-height: ${({ $isMobile }) => ($isMobile ? '85vh' : '90vh')};
  margin-top: ${({ $isMobile }) => ($isMobile ? 'auto' : '0')};
  ${({ $isMobile }) =>
    $isMobile &&
    `
    bottom: 0;
    left: 0;
    right: 0;
  `}
  background-color: ${({ theme }) => theme.general.modalBackgroundSecondary};
  border-left: 1px solid ${({ theme }) => theme.general.border};
  border-right: 1px solid ${({ theme }) => theme.general.border};
  border-bottom: 1px solid ${({ theme }) => theme.general.border};
  border-radius: ${({ $isMobile }) => ($isMobile ? '16px 16px 0 0' : '16px')};
`;

const InnerDialogContent = styled(motion.div)<{ $isMobile?: boolean }>`
  padding: 24px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.general.modalBackground};
  border: 1px solid ${({ theme }) => theme.general.border};
  border-left: none;
  border-right: none;
  border-radius: ${({ $isMobile }) => ($isMobile ? '16px 16px 0 0' : '16px')};
  color: ${({ theme }) => theme.texts.primary};
`;
