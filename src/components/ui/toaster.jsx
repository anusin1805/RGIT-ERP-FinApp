import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  // 1. Grab the hook
  const hookData = useToast();
  
  // 2. LOGGING: This will show up in your browser console (F12)
  console.log("Toaster Hook Data:", hookData);

  // 3. SAFETY: Check if 'toasts' exists, otherwise use empty list []
  // This line is what prevents the "ReferenceError"
  const toasts = hookData?.toasts || []; 

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
