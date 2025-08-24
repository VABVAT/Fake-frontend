const Navbar = () => {
  return (
    <header
      className="w-full flex flex-row justify-between items-center backdrop-blur-lg"
    >
      <div className="container mx-auto px-3 h-12">
        <div className="flex items-center justify-between h-full">
          {/* Left section of the navbar */}
          JUDGE
          {/* Right section of the navbar */}
          <div className="flex items-center gap-2">
            {/* Settings button */}
            <span>Help</span>
            <span>About</span>
            <span>Minimize</span>
            {/* Show profile and logout buttons if the user is authenticated */}

          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar