import type { DataModel } from "@drift/backend/convex/dataModel";
import { IconPlus } from "@tabler/icons-react";
import { ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ColorSelect } from "./color-select";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";

type CreateableMultiComboboxProps = {
  availableTags?: DataModel["projectTagsRef"]["document"][];
  loading?: boolean;
  values?: string[];
  onChange?: (values: string[]) => void;
  onAddTag?: (value: string, color: string) => void;
};

const TAG_COLORS = [
  "#81C784", // Medium Green
  "#64B5F6", // Medium Blue
  "#BA68C8", // Medium Purple
  "#FFB74D", // Medium Orange
  "#F06292", // Medium Pink
  "#AED581", // Medium Lime
  "#4FC3F7", // Medium Cyan
  "#FFD54F", // Medium Yellow
];

export function TagsCreatableCombobox({
  availableTags = [],
  loading = false,
  values = [],
  onChange,
  onAddTag,
}: CreateableMultiComboboxProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [newTagColor, setNewTagColor] = React.useState(TAG_COLORS[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {loading ? (
          <Skeleton className="w-full h-9" />
        ) : (
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12"
          >
            {values.length === 0 && (
              <span className="text-muted-foreground">Select tags...</span>
            )}
            {values.length > 0 && availableTags && (
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter((option) => values.includes(option.name))
                  .map((option) => (
                    <Badge
                      key={option._id}
                      style={{ backgroundColor: option.color }}
                      variant="secondary"
                    >
                      {option.name}
                    </Badge>
                  ))}
              </div>
            )}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: buttonRef.current?.clientWidth }}
      >
        <Command>
          <CommandInput
            placeholder={
              availableTags.length > 0
                ? `Search or add tags...`
                : `Enter the name of a new tag...`
            }
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);
            }}
          />
          {(availableTags.length > 0 || searchValue !== "") && (
            <CommandList>
              <CommandEmpty>
                {availableTags.length > 0 ? `No tags found.` : ``}
              </CommandEmpty>
              <CommandGroup>
                {availableTags.map((option) => (
                  <CommandItem
                    key={option._id}
                    value={option.name}
                    className="p-3"
                    onSelect={(currentValue) => {
                      const isIncluded = values.includes(currentValue);
                      onChange?.(
                        isIncluded
                          ? values.filter((value) => value !== currentValue)
                          : [...values, currentValue],
                      );
                    }}
                  >
                    <Checkbox
                      checked={values.includes(option.name)}
                      variant="outlined"
                      className="mr-2"
                    />
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: option.color }}
                    >
                      {option.name}
                    </Badge>
                  </CommandItem>
                ))}
                {searchValue &&
                  !availableTags.some((tag) => tag.name === searchValue) && (
                    <CommandItem
                      value={searchValue}
                      className="p-3"
                      key="create"
                      onSelect={() => {
                        onAddTag?.(searchValue, newTagColor);
                        onChange?.([...values, searchValue]);
                        setSearchValue("");
                      }}
                    >
                      <IconPlus className="text-primary" />
                      Add new tag:
                      <Badge
                        style={{ backgroundColor: newTagColor }}
                        variant="secondary"
                      >
                        {searchValue}
                      </Badge>
                      <ColorSelect
                        className="ml-4"
                        colors={TAG_COLORS}
                        value={newTagColor}
                        onChange={setNewTagColor}
                      />
                    </CommandItem>
                  )}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
