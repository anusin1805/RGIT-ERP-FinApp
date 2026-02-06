import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Notifications() {
  // --- SAFE MODE FIX ---
  // 1. We grab the whole hook object first.
  const hookData = useToast();
  
  // 2. We verify if the list exists.
  console.log("Notifications Component Loaded. Hook Data:", hookData);

  // 3. We create the 'toasts' variable safely.
  // This line prevents the "toasts is not defined" error.
  const toasts = hookData.toasts || []; 

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
