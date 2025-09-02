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
  return (
    <Router>
      <div className="app-container">
        <Header isConnected={isConnected} setIsConnected={setIsConnected} />
        <Routes>
          <Route path="/" element={<Home />} />
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
