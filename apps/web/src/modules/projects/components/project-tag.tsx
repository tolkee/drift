import { type ComponentProps, forwardRef } from "react";
import { Badge } from "@/components/ui/badge";

export const ProjectTag = forwardRef<
  HTMLSpanElement,
  ComponentProps<typeof Badge>
>(({ children, ...props }, ref) => {
  return (
    <Badge
      ref={ref}
      className="text-white font-medium bg-blue-500"
      style={{ backgroundColor: props.color }}
      {...props}
    >
      {children}
    </Badge>
  );
});
