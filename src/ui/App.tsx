import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import InputBar from './components/InputBar';
import Container from './components/Container';

function App() {
  interface EvidenceItem {
      quote: string;
      source: string;
  }

interface DebugData {
  verdict: string;
  confidence: number;
  evidence: EvidenceItem[];
  recommended_actions: string;
  reasoning: string;
}

  const [debug, setDebug] = useState<DebugData>({
    verdict: '',
    confidence: 0,
    evidence: [],
    recommended_actions: '',
    reasoning: ''
  });
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
  <div className="min-h-screen w-screen flex flex-col overflow-hidden rounded-3xl 
                bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-black/70">
                  
    {/* Initial screen (before first search) remove ! here*/}
    {firstSearch && (
      <>
        {/* Navbar (top) */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        {/* Center box with Input */}
        <div className="no-drag flex-1 flex flex-col items-center justify-center space-y-5 
                        mx-3 mt-6 mb-3 p-6 rounded-3xl 
                        bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20">

          <div className="flex flex-col items-center justify-center space-y-5">
            <h1 className="text-white text-2xl font-semibold drop-shadow-md font-[Segoe_Fluent_Icons]">
              Hello! JUDGE
            </h1>

            <InputBar
              firstSearch={firstSearch}
              setFirstSearch={setFirstSearch}
              setLoading={setLoading}
              setDebug={setDebug}
            />
          </div>
        </div>
      </>
    )}

    {/* After first search  add ! here */}
    {!firstSearch && (
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <div className="sticky top-0 z-50 w-full">
          <Navbar />
        </div>

        {/* Middle scrollable container */}
        <div className="flex-1 overflow-y-auto scrollbar-hide no-drag 
                        mx-3 my-2 p-6 rounded-3xl 
                        bg-white/10 backdrop-blur-xl text-white shadow-xl border border-white/20">
          <Container debug={debug} />
        </div>

        {/* InputBar */}
        <div className="sticky bottom-0 z-50 flex justify-center py-2 
                        bg-gradient-to-t from-black/40 via-transparent to-transparent">
          <InputBar
            firstSearch={!firstSearch}
            setFirstSearch={setFirstSearch}
            setLoading={setLoading}
            setDebug={setDebug}
          />
        </div>
      </div>
    )}
  </div>
);

}

export default App;
