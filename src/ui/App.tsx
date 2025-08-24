import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import InputBar from './components/InputBar';

function App() {
  const [count, _setCount] = useState(0);
  const [usageMode, setUsageMode] = useState("");
  const [firstSearch, setFirstSearch] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(loading){
      //@ts-ignore
      window.electronAPI.startLoading();
    }
    else{
      //@ts-ignore
      window.electronAPI.stopLoading();
    }
  }, [loading]);


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
          <InputBar firstSearch={firstSearch} setFirstSearch={setFirstSearch} loading={loading} setLoading={setLoading} debug={usageMode} setDebug={setUsageMode}/>
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
            <div className="text-lg font-medium">{usageMode}</div>
          </div>
        </div>

        {/*InputBar*/}
        <div className="sticky bottom-0 z-50 flex justify-center py-2 
                        bg-gradient-to-t from-black/40 via-transparent to-transparent">
          <InputBar firstSearch={firstSearch} setFirstSearch={setFirstSearch} loading={loading} setLoading={setLoading} debug={usageMode} setDebug={setUsageMode}/>
        </div>
      </>
    )}
  </div>
);

}

export default App;
