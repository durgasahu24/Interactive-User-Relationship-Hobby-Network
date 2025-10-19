import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { UserForm } from "./pages/UserForm.jsx"; // your create/edit form page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />            
        <Route path="/user/new" element={<UserForm />} /> 
         <Route path="/user/:id" element={<UserForm />} />
      </Routes>
    </Router>
  );
}

export default App;
