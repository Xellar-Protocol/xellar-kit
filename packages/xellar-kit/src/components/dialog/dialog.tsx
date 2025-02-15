import { AnimatePresence, motion } from 'motion/react';
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import { RemoveScroll } from 'react-remove-scroll';
import styled from 'styled-components';

import { isMobile } from '@/utils/is-mobile';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Dialog({
  isOpen,
  onClose,
  children
}: DialogProps): React.JSX.Element | null {
  const [mounted, setMounted] = React.useState(false);
  const [isBottomSheet, setIsBottomSheet] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsBottomSheet(isMobile());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) =>
      isOpen && event.key === 'Escape' && onClose();

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const [bodyScrollable, setBodyScrollable] = useState(true);
  useEffect(() => {
    setBodyScrollable(
      getComputedStyle(window.document.body).overflow !== 'hidden'
    );
  }, []);

  const handleBackdropClick = useCallback(() => onClose(), [onClose]);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  const portalContent = (
    <RemoveScroll enabled={bodyScrollable}>
      <AnimatePresence>
        {isOpen && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <DialogContent
              variants={variants[isBottomSheet ? 'mobile' : 'desktop']}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: 'spring',
                bounce: 0,
                damping: 20,
                mass: 0.5,
                stiffness: 250
              }}
              onClick={stopPropagation}
              $isMobile={isBottomSheet}
            >
              <InnerDialogContent $isMobile={isBottomSheet} layout>
                {children}
              </InnerDialogContent>
            </DialogContent>
          </Backdrop>
        )}
      </AnimatePresence>
    </RemoveScroll>
  );

  return createPortal(portalContent, document.body);
}

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.BACKGROUND_TRANSPARENT};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled(motion.div)<{ $isMobile: boolean }>`
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  position: ${({ $isMobile }) => ($isMobile ? 'fixed' : 'relative')};
  min-width: 280px;
  max-width: ${({ $isMobile }) => ($isMobile ? '100%' : '90%')};
  max-height: ${({ $isMobile }) => ($isMobile ? '85vh' : '90vh')};
  margin-top: ${({ $isMobile }) => ($isMobile ? 'auto' : '0')};
  ${({ $isMobile }) =>
    $isMobile &&
    `
    bottom: 0;
    left: 0;
    right: 0;
  `}
`;

const InnerDialogContent = styled(motion.div)<{ $isMobile: boolean }>`
  padding: 18px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.BACKGROUND};
  border: 2px solid ${({ theme }) => theme.colors.BORDER};
  border-radius: ${({ $isMobile }) => ($isMobile ? '20px 20px 0 0' : '20px')};
  box-shadow: 0 4px 100px -19px ${({ theme }) => theme.colors.SHADOW};
  color: ${({ theme }) => theme.colors.TEXT};
`;

const variants = {
  desktop: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  },
  mobile: {
    initial: { y: '100%', opacity: 1 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 1 }
  }
};

const stopPropagation: MouseEventHandler<unknown> = event =>
  event.stopPropagation();
