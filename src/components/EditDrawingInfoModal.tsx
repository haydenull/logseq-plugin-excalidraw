import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { IPageWithDrawing } from "./DrawingCard";
import TagSelector from "./TagSelector";
import { useToast } from "./ui/use-toast";
import { createDrawing } from "@/lib/utils";

export enum EditTypeEnum {
  Name,
  Tag,
  Create,
}

const TITLE = {
  [EditTypeEnum.Name]: "Edit drawing alias name",
  [EditTypeEnum.Tag]: "Edit drawing tag",
  [EditTypeEnum.Create]: "Create new drawing",
};

const EditDrawingInfoModal: React.FC<{
  type: EditTypeEnum;
  drawingData?: IPageWithDrawing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOk?: () => void;
}> = ({ type, drawingData, open, onOpenChange, onOk }) => {
  const [name, setName] = useState(drawingData?.drawAlias || "");
  const [tag, setTag] = useState(drawingData?.drawTag || "");
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  const onClickSave = async () => {
    const _name = name?.trim() ?? "";
    const _tag = tag?.trim() ?? "";
    if (type === EditTypeEnum.Create) {
      if (!_name) {
        return toast({ title: "Name is required", variant: "destructive" });
      }
      let params: Record<string, string> = {};
      if (_name) params.alias = _name;
      if (_tag) params.tag = _tag;
      await createDrawing(params);
      toast({ title: "Created" });
      onOpenChange(false);
      onOk?.();
      return;
    }

    if (!drawingData) return;
    const { uuid } = drawingData.drawRawBlocks[0];
    if (type === EditTypeEnum.Name) {
      if (_name?.length === 0) {
        return toast({ title: "Name is required", variant: "destructive" });
      }
      await logseq.Editor.upsertBlockProperty(
        uuid,
        "excalidraw-plugin-alias",
        _name
      );
    } else if (type === EditTypeEnum.Tag) {
      if (_tag?.length === 0) {
        return toast({ title: "Tag is required", variant: "destructive" });
      }
      await logseq.Editor.upsertBlockProperty(
        uuid,
        "excalidraw-plugin-tag",
        _tag
      );
    }
    toast({ title: "Saved" });
    onOpenChange(false);
    onOk?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{TITLE[type]}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {type === EditTypeEnum.Name || type === EditTypeEnum.Create ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Alias Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          ) : null}
          {type === EditTypeEnum.Tag || type === EditTypeEnum.Create ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Tag
              </Label>
              <TagSelector
                showAdd
                className="col-span-3"
                value={tag}
                onChange={setTag}
              />
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onClickSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDrawingInfoModal;
