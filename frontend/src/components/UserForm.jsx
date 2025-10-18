import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/userSlice';
import { createUserAPI } from '../hooks/UseUserGet';

export const UserForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({ username: '', age: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({ username: '', age: '' });
    let valid = true;
    const newErrors = { username: '', age: '' };

    // Validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }
    if (!age || Number(age) <= 0) {
      newErrors.age = 'Age must be a positive number';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      const newUser = await createUserAPI({ username, age: Number(age) });
      dispatch(addUser(newUser));
      setUsername('');
      setAge('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-2 mb-4 w-full max-w-md">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded w-full"
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>

      <div className="w-24">
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border p-2 rounded w-full"
        />
        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
};
