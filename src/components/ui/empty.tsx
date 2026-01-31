import * as React from "react";
import { cn } from "@/lib/utils";
import { FileQuestion, Inbox, Search, FolderOpen } from "lucide-react";

type EmptyIcon = "inbox" | "search" | "folder" | "file" | "custom";

const iconMap = {
  inbox: Inbox,
  search: Search,
  folder: FolderOpen,
  file: FileQuestion,
};

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: EmptyIcon;
  customIcon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

function Empty({
  className,
  icon = "inbox",
  customIcon,
  title = "ไม่พบข้อมูล",
  description,
  action,
  children,
  ...props
}: EmptyProps) {
  const IconComponent = icon !== "custom" ? iconMap[icon] : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
      {...props}
    >
      {/* Icon */}
      <div className="mb-4 rounded-full bg-muted p-4">
        {customIcon || (IconComponent && (
          <IconComponent className="h-8 w-8 text-muted-foreground" />
        ))}
      </div>

      {/* Title */}
      {title && (
        <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
      )}

      {/* Description */}
      {description && (
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-2">{action}</div>}

      {/* Children */}
      {children}
    </div>
  );
}

export { Empty };
