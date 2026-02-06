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
  // CRITICAL FIX: You MUST grab 'toasts' (plural) here.
  // If your code says 'const { toast }', it will crash.
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {/* We map over the 'toasts' array. This requires the line above to be correct. */}
      {(toasts || []).map(function ({ id, title, description, action, ...props }) {
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
