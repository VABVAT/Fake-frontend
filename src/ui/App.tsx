import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import InputBar from './components/InputBar';

function App() {
  const [count, _setCount] = useState(0);
  const [_usageMode, _setUsageMode] = useState("");
  const [firstSearch, _setFirstSearch] = useState( false);

  useEffect(() => {
    pingElectron();
  }, [count]);

  async function pingElectron() {
    // @ts-ignore
    const response = await window.electronAPI.ping();
    console.log(response);
  }

  return (
    <div className="min-h-screen w-screen flex flex-col overflow-hidden">
      {/* Navbar*/}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Initial screen InputBar in middle*/}
      {firstSearch && (
        <div className="no-drag flex-1 flex flex-col items-center justify-center space-y-5 rounded-2xl mx-3 my-6 p-2 bg-black/20">
          <div className="flex flex-col items-center justify-center space-y-5">
            <h1 className="text-white text-xl">Hello! JUDGE</h1>
            <InputBar firstSearch={firstSearch} />
          </div>
        </div>
      )}

      {/* After first search */}
      {!firstSearch && (
        <>
          {/* Main content*/}
          <div className="flex-1 flex flex-col items-center justify-center mx-3 my-2 rounded-2xl p-2 bg-black/20">
            <div className="flex flex-col items-center justify-center space-y-5 w-full h-full">
              <div>Content</div>
            </div>
          </div>

          {/*InputBar*/}
          <div className="sticky bottom-0 z-50 flex justify-center py-2">
            <InputBar firstSearch={firstSearch} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
