import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import InputBar from './components/InputBar';

function App() {
  const [count, _setCount] = useState(0);
  const [_usageMode, _setUsageMode] = useState("");
  const [firstSearch, _setFirstSearch] = useState(  false);

  useEffect(() => {
    pingElectron();
  }, [count]);

  async function pingElectron() {
    // @ts-ignore
    const response = await window.electronAPI.ping();
    console.log(response);
  }

  return (
  <div className="min-h-screen w-screen flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-black/70">
    {/* Navbar*/}
    <div className="sticky top-0 z-50">
      <Navbar />
    </div>

    {/* Initial screen InputBar in middle*/}
    {firstSearch && (
      <div className="no-drag flex-1 flex flex-col items-center justify-center space-y-5 
                      rounded-3xl mx-3 mt-6 mb-3 p-6 
                      bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20">
        <div className="flex flex-col items-center justify-center space-y-5">
          <h1 className="text-white text-2xl font-semibold drop-shadow-md">Hello! JUDGE</h1>
          <InputBar firstSearch={firstSearch} />
        </div>
      </div>
    )}

    {/* After first search */}
    {!firstSearch && (
      <>
        {/* Main content*/}
        <div className="no-drag flex-1 flex flex-col items-center justify-center mx-3 my-2 p-6 
                        rounded-3xl bg-white/10 backdrop-blur-xl text-white shadow-xl border border-white/20">
          <div className="flex flex-col items-center justify-center space-y-5 w-full h-full">
            <div className="text-lg font-medium">Content</div>
          </div>
        </div>

        {/*InputBar*/}
        <div className="sticky bottom-0 z-50 flex justify-center py-2 
                        bg-gradient-to-t from-black/40 via-transparent to-transparent">
          <InputBar firstSearch={firstSearch} />
        </div>
      </>
    )}
  </div>
);

}

export default App;
