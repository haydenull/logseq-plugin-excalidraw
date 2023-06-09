import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
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
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

const TagSelector: React.FC<{
  value?: string;
  showAdd?: boolean;
  onChange: (value: string) => void;
  asFilter?: boolean;
  className?: string;
}> = ({ value, onChange, showAdd = false, asFilter = false, className }) => {
  const [open, setOpen] = useState(false);
  const [tags = [], setTags] = useAtom(tagsAtom);
  const tagOptions = tags?.map((tag) => ({
    value: tag?.toLowerCase(),
    label: tag,
  }));

  const [newTag, setNewTag] = useState("");

  const { toast } = useToast();

  const onClickAddTag = () => {
    if (!newTag) {
      return toast({
        variant: "destructive",
        title: "Tag cannot be empty",
      });
    }
    if (tags?.map((tag) => tag.toLowerCase()).includes(newTag?.toLowerCase())) {
      return toast({
        variant: "destructive",
        title: "Tag already exists",
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
        {asFilter ? (
          <Button variant="outline" className={cn("border-dashed", className)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tag
            {value && (
              <>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-2 font-normal"
                >
                  {value}
                </Badge>
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value ? (
              tagOptions.find((framework) => framework.value === value)?.label
            ) : (
              <span className="text-slate-400 truncate">Select a tag</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
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
                  onChange(currentValue === value ? "" : currentValue);
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
        {showAdd && (
          <div className="border-t flex w-full max-w-sm items-center space-x-2 p-2">
            <Input
              className="h-8"
              placeholder="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Button size="sm" className="h-8" onClick={onClickAddTag}>
              Add
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default TagSelector;
