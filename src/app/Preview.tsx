import Preview from "@/components/Preview";

export type Mode = "edit" | "preview";

const PreviewApp: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-auto">
      <div
        className="w-screen h-screen fixed top-0 left-0"
        onClick={() => logseq.hideMainUI()}
      ></div>
      <Preview pageName={pageName} />
    </div>
  );
};

export default PreviewApp;
