import {
  IconDeviceDesktop,
  IconMoonFilled,
  IconSunFilled,
} from "@tabler/icons-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  THEMES,
  type Theme,
  useTheme,
} from "@/modules/global-layout/theme-provider";

const THEME_ICONS: { [key in Theme]: React.ReactNode } = {
  dark: <IconMoonFilled />,
  light: <IconSunFilled />,
  system: <IconDeviceDesktop />,
};

export function ModeToggle(props: ComponentProps<typeof Button>) {
  const { setTheme, theme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          onClick={() =>
            setTheme(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length])
          }
          size="icon-xs"
          {...props}
        >
          {THEME_ICONS[theme]}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}
