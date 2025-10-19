import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, updateUser } from "../redux/userSlice";
import { setHobbies } from "../redux/hobbiesSlice";
import { createUserAPI, updateUserAPI, getHobbiesApi } from "../hooks/UseUserGet";
import toast from "react-hot-toast";

export const UserForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [hobby, setHobby] = useState([]);
  const [hobbyInput, setHobbyInput] = useState("");
  const [errors, setErrors] = useState({ username: "", age: "", hobby: "" });

  useEffect(() => {
    if (isEditMode) {
      const user = users.find((u) => u._id === id);
      if (user) {
        setUsername(user.username);
        setAge(user.age);
        setHobby(user.hobbies || []);
      }
    }
  }, [id, isEditMode, users]);

  const handleAddHobby = () => {
    if (hobbyInput.trim() && !hobby.includes(hobbyInput.trim())) {
      setHobby([...hobby, hobbyInput.trim()]);
      setHobbyInput("");
    }
  };

  const handleRemoveHobby = (h) => setHobby(hobby.filter((item) => item !== h));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let valid = true;
    const newErrors = { username: "", age: "", hobby: "" };
    if (!username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }
    if (!age || Number(age) <= 0) {
      newErrors.age = "Age must be a positive number";
      valid = false;
    }
    if (hobby.length === 0) {
      newErrors.hobby = "Add at least one hobby";
      valid = false;
    }
    if (!valid) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isEditMode) {
        const updatedUser = await updateUserAPI(id, { username, age, hobbies: hobby });
        dispatch(updateUser(updatedUser));
        toast.success("User updated successfully");
      } else {
        const newUser = await createUserAPI({ username, age, hobbies: hobby });
        dispatch(addUser(newUser));
        toast.success("User created successfully");
      }

      const hobbies = await getHobbiesApi();
      dispatch(setHobbies(hobbies));
      navigate("/"); // redirect to home/graph
    } catch (err) {
      console.error(err);
      toast.error("Failed to save user");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          {isEditMode ? "Edit User" : "Create User"}
        </h2>

        {/* Username */}
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age}</p>
          )}
        </div>

        {/* Hobbies */}
        <div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add hobby"
              value={hobbyInput}
              onChange={(e) => setHobbyInput(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={handleAddHobby}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap mt-2 gap-2">
            {hobby.map((h, i) => (
              <div
                key={i}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1"
              >
                {h}{" "}
                <button
                  type="button"
                  onClick={() => handleRemoveHobby(h)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.hobby && (
            <p className="text-red-500 text-sm mt-1">{errors.hobby}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
        >
          {isEditMode ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
};
