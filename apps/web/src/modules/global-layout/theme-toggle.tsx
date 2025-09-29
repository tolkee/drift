import { IconShadow } from "@tabler/icons-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/modules/global-layout/theme-provider";

export function ModeToggle(props: ComponentProps<typeof Button>) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      {...props}
    >
      <IconShadow className="size-5" />
    </Button>
  );
}
