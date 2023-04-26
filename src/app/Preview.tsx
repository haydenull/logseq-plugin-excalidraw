import Preview from "@/components/Preview";
import { useEffect } from "react";

export type Mode = "edit" | "preview";

const PreviewApp: React.FC<{ pageName: string }> = ({ pageName }) => {
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") logseq.hideMainUI();
    };
    // listen esc
    window.addEventListener("keyup", close);
    return () => {
      window.removeEventListener("keyup", close);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-auto">
      <div
        className="w-screen h-screen fixed top-0 left-0 bg-black opacity-70"
        onClick={() => logseq.hideMainUI()}
      ></div>
      <Preview pageName={pageName} />
    </div>
  );
};

export default PreviewApp;
