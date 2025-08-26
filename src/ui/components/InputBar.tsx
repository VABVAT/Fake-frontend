import React, { useState } from "react";
import search from "../assets/search_icon_white.png"

type InputBarProps = {
  firstSearch: boolean;
  setFirstSearch : React.Dispatch<React.SetStateAction<boolean>>;
  setLoading : React.Dispatch<React.SetStateAction<boolean>>;
  setDebug: React.Dispatch<React.SetStateAction<string>>;
};

const InputBar = ({firstSearch, setFirstSearch, setLoading, setDebug}: InputBarProps) => {
  const options = [
    "@judge: News",
    "@judge: Email",
    "@judge: Media"
  ];

  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  // useEffect(() => {
  //     if(loading){
  //       //@ts-ignore
  //       window.electronAPI.startLoading();
  //     }
  //     else{
  //       //@ts-ignore
  //       window.electronAPI.stopLoading();
  //     }
  //   }, [loading]);

  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setFilteredOptions([]);
      setIsOptionsVisible(false);
      setHighlightIndex(-1);
      return;
    }

    const filtered = options.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(filtered);
    setIsOptionsVisible(filtered.length > 0);
    setHighlightIndex(-1);
  };

  const handleSelect = (value: string) => {
    setInputValue(value);
    setIsOptionsVisible(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOptionsVisible) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (event.key === "Enter") {
        event.preventDefault();
        if (isOptionsVisible && highlightIndex >= 0) {
          handleSelect(filteredOptions[highlightIndex]);
        }
    }
  };

  const handleClick = async () => {
    setLoading(true);
    setFirstSearch(false);
    let usageMode  = inputValue.split(":")[1]?.trim() || "General";
    usageMode = usageMode.toLowerCase();
    setDebug(usageMode);
    // @ts-ignore
    const response = await window.electronAPI.sendRequest(usageMode);
    setLoading(false);
    setDebug(response);
    const responseObj = JSON.parse(response);
    console.log("Response from main process:", responseObj.contents);
  };

  return (
    <div>
      <form className="no-drag flex flex-row space-x-2 items-center ">
        <div className={`relative  ${firstSearch ? "w-60": "w-80"}`}>
          <input
            type="text"
            placeholder="Type @judge..."
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full border-2 border-gray-300 rounded-full px-4 py-2 outline-none no-drag"
          />
          {isOptionsVisible && (
            <ul
              className={`no-drag rounded-lg bg-white/5 shadow-2xl p-1 backdrop-blur-xl ${firstSearch ? "absolute": "absolute bottom-full mb-1"}`}
              role="listbox"
            >
              {filteredOptions.map((item: string, index: number) => (
                <li key={index} role="option">
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    // className={`hover:text-white hover:font-bold cursor-pointer ${!firstSearch ? "bg-white/10 rounded-lg text-sm shadow-lg  whitespace-nowrap px-2 mb-1" : "text-left pr-4 pl-3"}`}
                    className={`pr-4 pl-3 cursor-pointer 
                      ${highlightIndex === index ? "bg-white/10 rounded-lg font-medium text-white" : "hover:text-white hover:font-medium"}`} 
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleClick}
          className="no-drag rounded-full w-10 h-10 border border-gray-300 flex items-center justify-center hover:border-white hover:border-2"
        >
          <img src={search} alt="Search" className="w-6 h-6 hover:scale-110" />
        </button>
      </form>
    </div>
  );
};

export default InputBar;
