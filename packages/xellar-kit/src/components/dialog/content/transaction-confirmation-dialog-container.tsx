import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useTransactionConfirmStore } from '../store';
import { TransactionConfirmationDialog } from './transaction-confirmation-dialog';

export function TransactionConfirmationDialogContainer() {
  // Subscribe to all relevant states from the store
  const { type, payload, error, isLoading, onConfirmAction, onRejectAction } =
    useTransactionConfirmStore(
      useShallow(state => ({
        type: state.type,
        payload: state.payload,
        error: state.error,
        isLoading: state.isLoading,
        onConfirmAction: state.onConfirmAction,
        onRejectAction: state.onRejectAction
      }))
    );

  return (
    <TransactionConfirmationDialog
      type={type}
      payload={payload}
      onConfirm={onConfirmAction}
      onReject={onRejectAction}
      initialError={error}
      initialLoading={isLoading}
    />
  );
}
