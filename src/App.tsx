import "./App.css";

const App: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-auto">
      <div
        className="w-screen h-screen fixed top-0 left-0"
        onClick={() => logseq.hideMainUI()}
      ></div>
    </div>
  );
};

export default App;
