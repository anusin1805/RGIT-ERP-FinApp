import {
  Toast,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  // HARDCODED FIX: We are not using the hook at all right now.
  // We are manually forcing 'toasts' to be an empty list.
  const toasts = []; 

  return (
    <ToastProvider>
      {toasts.map(function ({ id, ...props }) {
        return <Toast key={id} {...props} />;
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
