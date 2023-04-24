import "./App.css";
import Editor from "./components/Editor";
import Preview from "./components/Preview";

export type Mode = "edit" | "preview";

const App: React.FC<{ mode: Mode; pageName: string }> = ({
  mode,
  pageName,
}) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-auto">
      <div
        className="w-screen h-screen fixed top-0 left-0"
        onClick={() => logseq.hideMainUI()}
      ></div>
      {/* <div className="w-5/6 h-5/6 z-0 bg-gradient-to-tr from-green-300 via-green-500 to-green-700 flex flex-col items-center justify-center">
        <h1 className="font-bold text-4xl">logseq-plugin-react-excalidraw</h1>
      </div> */}
      {mode === "preview" ? (
        <Preview pageName={pageName} />
      ) : (
        <Editor pageName={pageName} />
      )}
    </div>
  );
};

export default App;
