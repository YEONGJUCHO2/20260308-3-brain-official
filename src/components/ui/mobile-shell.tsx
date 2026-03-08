import { cn } from "@/lib/cn";

type MobileShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function MobileShell({ children, className }: MobileShellProps) {
  return <div className={cn("brain-page", className)}>{children}</div>;
}
