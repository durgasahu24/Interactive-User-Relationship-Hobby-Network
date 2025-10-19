// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getHobbiesApi } from "../hooks/UseUserGet";
// import { setHobbies } from "../redux/hobbiesSlice";

// export const Sidebar = () => {
//   const { hobbies } = useSelector((state) => state.hobbies); // list of all hobbies from Redux
//   const { users } = useSelector((state) => state.users);
//   const [search, setSearch] = useState("");
//   const dispatch = useDispatch();

//   const handleDragStart = (e, hobby) => {
//     // Set hobby data for ReactFlow node to capture
//     e.dataTransfer.setData("hobby", hobby);
//   };

//   // Filter hobbies based on search input
//   const filteredHobbies = hobbies.filter((hobby) =>
//     hobby.toLowerCase().includes(search.toLowerCase())
//   );

//   useEffect(() => {
//     const fetchHobbies = async () => {
//       try {
//         const hobbies = await getHobbiesApi();
//         dispatch(setHobbies(hobbies));
//       } catch (error) {
//         console.log("errr ", error);
//       }
//     };
//     fetchHobbies();
//   }, [dispatch,users]);

//   return (
//     <div className="p-3 w-56 bg-gray-100">
//       <h1 className="text-2xl font-semibold mb-3">Hobbies</h1>

//       {/* Search/filter input */}
//       <input
//         type="text"
//         placeholder="Search hobbies..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full mb-3 p-2 border border-gray-400 rounded"
//       />

//       {/* Draggable hobbies */}
//       <ul className="list-none p-0">
//         {filteredHobbies.map((hobby) => (
//           <li
//             key={hobby}
//             draggable
//             onDragStart={(e) => handleDragStart(e, hobby)}
//             className="cursor-grab mb-2 p-2 border border-gray-400 rounded bg-white text-center hover:bg-gray-50"
//           >
//             {hobby}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };



import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHobbiesApi } from "../hooks/UseUserGet";
import { setHobbies } from "../redux/hobbiesSlice";
import { debounce } from "../utils/debounce"; // ✅ import debounce

export const Sidebar = () => {
  const { hobbies } = useSelector((state) => state.hobbies);
  const { users } = useSelector((state) => state.users);
  const [search, setSearch] = useState("");
  const [filteredHobbies, setFilteredHobbies] = useState([]);
  const dispatch = useDispatch();

  // ✅ Fetch hobbies (updates when users change)
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

  // ✅ Debounced filter function
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

  // ✅ Handle search change with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    debouncedFilter(query);
  };

  // ✅ Handle drag
  const handleDragStart = (e, hobby) => {
    e.dataTransfer.setData("hobby", hobby);
  };

  return (
    <div className="p-3 w-56 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-3">Hobbies</h1>

      {/* Search/filter input */}
      <input
        type="text"
        placeholder="Search hobbies..."
        value={search}
        onChange={handleSearchChange}
        className="w-full mb-3 p-2 border border-gray-400 rounded"
      />

      {/* Draggable hobbies */}
      <ul className="list-none p-0">
        {filteredHobbies.map((hobby) => (
          <li
            key={hobby}
            draggable
            onDragStart={(e) => handleDragStart(e, hobby)}
            className="cursor-grab mb-2 p-2 border border-gray-400 rounded bg-white text-center hover:bg-gray-50"
          >
            {hobby}
          </li>
        ))}
      </ul>
    </div>
  );
};
