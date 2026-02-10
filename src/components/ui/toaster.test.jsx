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
  const hookData = useToast();
  
  // FIX: Define 'toasts' (PLURAL) exactly once.
  // This holds the list of notifications.
  const toasts = hookData.toasts || []; 

  console.log("Toaster Hook Data:", hookData);

  return (
    <ToastProvider>
      {/* FIX: Map over 'toasts' (PLURAL) */}
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
