import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { type PageEntity } from "@logseq/libs/dist/LSPlugin";
import { Trash2, Edit3, Tag, Image } from "lucide-react";
import SVGComponent from "@/components/SVGComponent";

export const PREVIEW_WINDOW = {
  width: 280,
  height: 180,
};
const TITLE_HEIGHT = 50;
export type IPageWithDrawing = PageEntity & {
  drawSvg: SVGSVGElement;
  drawAlias?: string;
  drawTag?: string;
};

const DrawingCard: React.FC<{
  page: IPageWithDrawing;
  onClickDrawing: (page: IPageWithDrawing) => void;
}> = ({ page, onClickDrawing }) => {
  const onClickCopyRendererText = (page: IPageWithDrawing) => {};
  return (
    <div
      key={page.id}
      className="flex flex-col border rounded-md overflow-hidden relative cursor-pointer hover:shadow-xl dark:border-slate-600 dark:bg-slate-700 dark:hover:shadow-slate-800"
      style={{ height: `${PREVIEW_WINDOW.height + TITLE_HEIGHT}px` }}
    >
      <div
        className="h-48 overflow-hidden flex justify-center items-center bg-white relative"
        style={{ height: `${PREVIEW_WINDOW.height}px` }}
      >
        {page.drawTag && (
          <div className="absolute top-0 right-0 bg-slate-300 px-2 rounded-bl-md text-sm text-slate-600">
            {page.drawTag}
          </div>
        )}
        <ContextMenu>
          <ContextMenuTrigger>
            <div onClick={() => onClickDrawing(page)}>
              {page.drawSvg && <SVGComponent svgElement={page.drawSvg} />}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <Edit3 className="mr-2 h-4 w-4" /> Rename
            </ContextMenuItem>
            <ContextMenuItem>
              <Tag className="mr-2 h-4 w-4" /> Set Tag
            </ContextMenuItem>
            <ContextMenuItem>
              <Image className="mr-2 h-4 w-4" /> Copy Renderer Text
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              <div className="text-rose-500 flex">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </div>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
      <div
        className="truncate border-t px-2 flex items-center bg-stone-100 dark:bg-slate-800"
        style={{ height: `${TITLE_HEIGHT}px` }}
        onClick={() => onClickDrawing(page)}
      >
        {page.drawAlias || page.name}
      </div>
    </div>
  );
};

export default DrawingCard;
