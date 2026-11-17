// Promise-based confirmation for destructive or irreversible actions.
//
//   if (await confirmAction({ title: 'Cancel this pickup?', body: '...', confirmLabel: 'Cancel pickup', tone: 'danger' })) { ... }
//
// <ConfirmHost /> (mounted once in App.jsx) renders the dialog.

export const confirmRegistry = { open: null };

export const confirmAction = (options) =>
  new Promise((resolve) => {
    if (!confirmRegistry.open) {
      resolve(false);
      return;
    }
    confirmRegistry.open({ ...options, resolve });
  });
