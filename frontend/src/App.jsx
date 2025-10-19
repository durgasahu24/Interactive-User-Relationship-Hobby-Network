import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home } from "./pages/Home.jsx";
import { UserForm } from "./pages/UserForm.jsx";
import Loader from './utils/Loader.jsx';
import ErrorBoundary from "./utils/ErrorBoundary.jsx";

function App() {
  const status = useSelector((state) => state.users.status);
  const loading = status === 'loading'; 

  return (
    <ErrorBoundary>
    <Router>
      {/* Global loader overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30">
          <Loader />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/new" element={<UserForm />} />
        <Route path="/user/:id" element={<UserForm />} />
      </Routes>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
