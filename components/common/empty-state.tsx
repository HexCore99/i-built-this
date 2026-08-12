import { LucideIcon } from "lucide-react";

type EmtpyStateProps = { message: string; icon?: LucideIcon };

export default function EmtpyState({ message, icon: Icon }: EmtpyStateProps) {
  return (
    <div className="empty-state">
      {Icon && (
        <Icon className="size-12 text-muted-foreground/50 mx-auto mb-4" />
      )}
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
}
