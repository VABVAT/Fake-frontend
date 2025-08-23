import { useState } from "react";

type InputBarProps = {
  firstSearch: boolean;
};

const InputBar = ({firstSearch}: InputBarProps) => {
  const options = [
    "@judge: News",
    "@judge: Email",
    "@judge: Media"
  ];

  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.trim() === "") {
      setFilteredOptions([]);
      setIsOptionsVisible(false);
      return;
    }

    const filtered = options.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredOptions(filtered);
    setIsOptionsVisible(filtered.length > 0);
  };

  const handleSelect = (value: string) => {
    setInputValue(value);
    console.log(value)
    setIsOptionsVisible(false);
  };

  const handleClick = async () => {
    // @ts-ignore
    const response = await window.electronAPI.sendRequest();
    const responseObj = JSON.parse(response);
    console.log("Response from main process:", responseObj.contents);
  };

  return (
    <div className="no-drag flex flex-row space-x-2 items-center ">
      <div className={`relative  ${firstSearch ? "w-60": "w-80"}`}>
        <input
          type="text"
          placeholder="Type @judge..."
          value={inputValue}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 rounded-full px-4 py-2 outline-none no-drag"
        />
        {isOptionsVisible && (
          <ul
            className={`no-drag ${firstSearch ? "absolute": "absolute bottom-full"}`}
            role="listbox"
          >
            {filteredOptions.map((item: string, index: number) => (
              <li key={index} role="option">
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 mx-2 hover:bg-blue-600 hover:text-white cursor-pointer"
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
        className="no-drag rounded-full w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
      >
        S
      </button>
    </div>
  );
};

export default InputBar;
