const Navbar = () => {
  return (
    <header className="w-full backdrop-blur-lg shadow-md">
      <div className="container mx-auto px-4 h-12">
        <div className="flex items-center justify-between h-full">
          {/* Left section (Logo / Title) */}
          <p className="font-[Segoe_Fluent_Icons] text-xl font-semibold tracking-wide text-white">
            JUDGE
          </p>

          {/* Right section (Buttons) */}
          <div className="no-drag flex items-center gap-2">
            <button
              type="button"
              onClick={() => console.log("Help clicked")}
              className=" bg-white/10 rounded-lg shadow-md text-white px-3 py-1 
                         transform transition-transform duration-200 
                         hover:scale-105 active:scale-95 cursor-pointer"
            >
              Help
            </button>
            <button
              type="button"
              className="bg-white/10 rounded-lg shadow-md text-white px-3 py-1 
                         transition-transform duration-200 
                         hover:scale-105 active:scale-95 cursor-pointer"
            >
              About
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
