          <div className="m-4">
            <h2>Enter your cuisine or choose from below</h2>
            <div className="flex items-start mb-4 mt-4">
              <input
                type="text"
                placeholder="Enter your cuisine"
                className="border border-blue-500 rounded-md w-full h-8"
              />
            </div>
            <ul>
              {cuisines.map((item) => (
                <li
                  className={`mb-2 p-2 border rounded-md cursor-pointer ${
                    cuisine === item
                      ? "border-blue-500 bg-blue-200"
                      : "border-blue-300"
                  }`}
                  key={item}
                  onClick={() => handleCuisineClick(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-end justify-end">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Next
            </button>
          </div>