import { cn } from "@/lib/cn";
import { InAppBrowserBanner } from "@/components/ui/in-app-browser-banner";

type MobileShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function MobileShell({ children, className }: MobileShellProps) {
  return (
    <div className={cn("brain-page", className)}>
      <InAppBrowserBanner />
      {children}
    </div>
  );
}
