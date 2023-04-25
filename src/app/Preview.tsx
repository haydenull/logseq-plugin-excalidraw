import Preview from "@/components/Preview";

export type Mode = "edit" | "preview";

const PreviewApp: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-auto">
      <div
        className="w-screen h-screen fixed top-0 left-0 bg-black opacity-50"
        onClick={() => logseq.hideMainUI()}
      ></div>
      <div className="w-4/5 h-4/5 z-10 overflow-auto">
        <Preview pageName={pageName} />
      </div>
    </div>
  );
};

export default PreviewApp;
