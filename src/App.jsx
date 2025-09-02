import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookie from "js-cookie";
import { useState } from "react";
import "./App.css";

// Import components
import Header from "./components/Header/Header";
// Import pages
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import SignUp from "./pages/SignUp/SignUp";
import Publish from "./pages/Publish/Publish";
import Login from "./pages/Login/Login";
import SuccessPublish from "./pages/Publish/SuccessPublish";

function App() {
  const [isConnected, setIsConnected] = useState(Cookie.get("token") || false);
  const [searchFilters, setSearchFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTotalPagesChange = (total) => {
    setTotalPages(total);
  };

  return (
    <Router>
      <div className="app-container">
        <Header
          isConnected={isConnected}
          setIsConnected={setIsConnected}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={totalPages}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                searchFilters={searchFilters}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onTotalPagesChange={handleTotalPagesChange}
              />
            }
          />
          <Route path="/offer/:id" element={<Product />} />
          <Route
            path="/signup"
            element={<SignUp setIsConnected={setIsConnected} />}
          />
          <Route
            path="/login"
            element={<Login setIsConnected={setIsConnected} />}
          />
          <Route
            path="/publish"
            element={
              <Publish
                isConnected={isConnected}
                setIsConnected={setIsConnected}
              />
            }
          />
          <Route path="/publish/success" element={<SuccessPublish />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
