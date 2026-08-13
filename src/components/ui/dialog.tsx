'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type DialogContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextType | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error('Dialog components must be used inside Dialog');
  }

  return context;
}

function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen: onOpenChange,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const { setOpen } = useDialog();

  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

function DialogContent({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useDialog();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={cn(
          'relative w-full max-w-md rounded-xl border bg-background p-6 shadow-lg',
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-sm text-muted-foreground"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 space-y-1">{children}</div>;
}

function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger };
