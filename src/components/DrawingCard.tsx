import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { BlockEntity, type PageEntity } from "@logseq/libs/dist/LSPlugin";
import { Trash2, Edit3, Tag, Image } from "lucide-react";
import SVGComponent from "@/components/SVGComponent";
import copy from "copy-to-clipboard";
import { useToast } from "./ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import EditDrawingInfoModal, { EditTypeEnum } from "./EditDrawingInfoModal";

export const PREVIEW_WINDOW = {
  width: 280,
  height: 180,
};
const TITLE_HEIGHT = 50;
export type IPageWithDrawing = PageEntity & {
  drawSvg: SVGSVGElement;
  drawAlias?: string;
  drawTag?: string;
  drawRawBlocks: BlockEntity[];
};

const DrawingCard: React.FC<{
  page: IPageWithDrawing;
  onClickDrawing: (page: IPageWithDrawing) => void;
  onDelete: (page: IPageWithDrawing) => void;
  onChange?: () => void;
}> = ({ page, onClickDrawing, onDelete, onChange }) => {
  const [editModalData, setEditModalData] = useState<{
    type?: EditTypeEnum;
    open: boolean;
  }>();
  const { toast } = useToast();

  const openEditDialog = (type: EditTypeEnum) => {
    setEditModalData({
      type,
      open: true,
    });
  };
  const onClickCopyRendererText = () => {
    copy(`{{renderer excalidraw-menu, ${page.originalName}}}`, {
      onCopy: () => {
        toast({
          title: "Copied",
          description: "Renderer text copied to clipboard successfully",
        });
      },
    });
  };
  const deleteDrawing = async () => {
    await logseq.Editor.deletePage(page.originalName);
    toast({
      title: "Deleted",
      description: "Page deleted successfully",
    });
    onDelete(page);
  };
  return (
    <>
      <div
        key={page.id}
        className="flex flex-col border rounded-md overflow-hidden relative cursor-pointer hover:shadow-xl dark:border-slate-600 dark:bg-slate-700 dark:hover:shadow-slate-800"
        style={{ height: `${PREVIEW_WINDOW.height + TITLE_HEIGHT}px` }}
      >
        <div
          className="h-48 overflow-hidden flex justify-center items-center bg-white dark:bg-[#121212] relative"
          style={{ height: `${PREVIEW_WINDOW.height}px` }}
        >
          <ContextMenu>
            <ContextMenuTrigger>
              <div onClick={() => onClickDrawing(page)}>
                {page.drawSvg && <SVGComponent svgElement={page.drawSvg} />}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => openEditDialog(EditTypeEnum.Name)}
              >
                <Edit3 className="mr-2 h-4 w-4" /> Rename
              </ContextMenuItem>
              <ContextMenuItem onClick={() => openEditDialog(EditTypeEnum.Tag)}>
                <Tag className="mr-2 h-4 w-4" /> Set Tag
              </ContextMenuItem>
              <ContextMenuItem onClick={onClickCopyRendererText}>
                <Image className="mr-2 h-4 w-4" /> Copy Renderer Text
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="text-rose-500 flex items-center px-2 py-[6px] cursor-default hover:bg-slate-100">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your drawing.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteDrawing}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          {page.drawTag && (
            <div className="absolute top-0 right-0 bg-slate-300 px-2 rounded-bl-md text-sm text-slate-600">
              {page.drawTag}
            </div>
          )}
        </div>
        <div
          className="truncate border-t px-2 flex items-center bg-stone-100 dark:bg-slate-800"
          style={{ height: `${TITLE_HEIGHT}px` }}
          onClick={() => onClickDrawing(page)}
        >
          {page.drawAlias || page.name}
        </div>
        <EditDrawingInfoModal
          open={editModalData?.open ?? false}
          type={editModalData?.type ?? EditTypeEnum.Create}
          drawingData={page}
          onOpenChange={(_open: boolean) => setEditModalData({ open: _open })}
          onOk={onChange}
        />
      </div>
    </>
  );
};

export default DrawingCard;
