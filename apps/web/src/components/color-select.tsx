import { cn } from "@/lib/utils";

type ColorSelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  colors: string[];
  className?: string;
};

export function ColorSelect({
  value,
  onChange,
  colors,
  className,
}: ColorSelectProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {colors.map((color) => (
        <button
          key={color}
          className={cn(
            `w-6 h-6 rounded-full hover:border-2 hover:border-primary`,
            value === color && "border-2 border-primary",
          )}
          style={{ backgroundColor: color }}
          onClick={(e) => {
            e.stopPropagation();
            onChange?.(color);
          }}
          tabIndex={0}
          type="button"
        />
      ))}
    </div>
  );
}
