import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export const Sidebar = () => {
  const { hobbies } = useSelector((state) => state.hobbies); // list of all hobbies from Redux
  const [search, setSearch] = useState('');

  const handleDragStart = (e, hobby) => {
    // Set hobby data for ReactFlow node to capture
    e.dataTransfer.setData('hobby', hobby);
  };

  // Filter hobbies based on search input
  const filteredHobbies = hobbies.filter((hobby) =>
    hobby.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '10px', width: '220px', background: '#f2f2f2' }}>
      <h3>Hobbies</h3>

      {/* Search/filter input */}
      <input
        type="text"
        placeholder="Search hobbies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          marginBottom: '10px',
          padding: '5px',
          borderRadius: '4px',
          border: '1px solid gray',
        }}
      />

      {/* Draggable hobbies */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredHobbies.map((hobby) => (
          <li
            key={hobby}
            draggable
            onDragStart={(e) => handleDragStart(e, hobby)}
            style={{
              cursor: 'grab',
              marginBottom: '5px',
              padding: '5px',
              border: '1px solid gray',
              borderRadius: '4px',
              background: '#fff',
              textAlign: 'center',
            }}
          >
            {hobby}
          </li>
        ))}
      </ul>
    </div>
  );
};

