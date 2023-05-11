import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { tagsAtom } from "@/model/tags";
import { useAtom } from "jotai";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

const TagSelector: React.FC<{
  value?: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [tags = [], setTags] = useAtom(tagsAtom);
  const tagOptions = tags?.map((tag) => ({ value: tag, label: tag }));

  const [newTag, setNewTag] = useState("");

  const { toast } = useToast();

  const onClickAddTag = () => {
    if (!newTag) {
      return toast({
        variant: "destructive",
        title: "Tag cannot be empty",
      });
    }
    setTags([...tags, newTag]);
    setNewTag("");
    onChange(newTag);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? tagOptions.find((framework) => framework.value === value)?.label
            : "Tag"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tag..." />
          <CommandEmpty>No tag found.</CommandEmpty>
          <CommandGroup>
            {tagOptions.map((tag) => (
              <CommandItem
                key={tag.value}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === tag.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {tag.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
        <div className="border-t flex w-full max-w-sm items-center space-x-2 p-2">
          <Input
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <Button onClick={onClickAddTag}>Add</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TagSelector;
