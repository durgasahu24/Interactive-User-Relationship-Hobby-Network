import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHobbiesApi } from "../hooks/UseUserApi";
import { setHobbies } from "../redux/hobbiesSlice";
import { debounce } from "../utils/debounce"; 

export const Sidebar = () => {
  const { hobbies } = useSelector((state) => state.hobbies);
  const { users } = useSelector((state) => state.users);
  const [search, setSearch] = useState("");
  const [filteredHobbies, setFilteredHobbies] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const hobbies = await getHobbiesApi();
        dispatch(setHobbies(hobbies));
        setFilteredHobbies(hobbies); // initialize
      } catch (error) {
        console.log("Error fetching hobbies:", error);
      }
    };
    fetchHobbies();
  }, [dispatch, users]);

  const debouncedFilter = useMemo(
    () =>
      debounce((query) => {
        const filtered = hobbies.filter((hobby) =>
          hobby.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredHobbies(filtered);
      }, 300),
    [hobbies]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    debouncedFilter(query);
  };

  const handleDragStart = (e, hobby) => {
    e.dataTransfer.setData("hobby", hobby);
  };

  return (
    <div className="p-3 w-56 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-3">Hobbies</h1>

      <input
        type="text"
        placeholder="Search hobbies..."
        value={search}
        onChange={handleSearchChange}
        className="w-full mb-3 p-2 border border-gray-400 rounded"
      />

      <ul className="list-none p-0">
        {filteredHobbies.length > 0 ? (
          filteredHobbies.map((hobby) => (
            <li
              key={hobby}
              draggable
              onDragStart={(e) => handleDragStart(e, hobby)}
              className="cursor-grab mb-2 p-2 border border-gray-400 rounded bg-white text-center hover:bg-gray-50"
            >
              {hobby}
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-center p-2">
            {search ? "No hobbies match your search." : "No hobbies available."}
          </li>
        )}
      </ul>
    </div>
  );
};
