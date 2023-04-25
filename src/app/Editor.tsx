import Editor from "@/components/Editor";

const EditorApp: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-auto">
      <div
        className="w-screen h-screen fixed top-0 left-0"
        onClick={() => logseq.hideMainUI()}
      ></div>
      <Editor pageName={pageName} />
    </div>
  );
};

export default EditorApp;
