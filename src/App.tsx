import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth";              
import ProtectedRoute from "./protectedRoute";
import Landing from "./components/pages/landingPage";
import Login from "./components/pages/logins";
import Signup from "./components/pages/signup";
import Layout from "./components/layout";
import Dashboard from "./components/pages/dashboard";
import Product from "./components/pages/product";
import Orders from "./components/pages/order";
import "./App.css";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/product" element={<Product />} />
              <Route path="/order" element={<Orders />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  );
}

export default App;
