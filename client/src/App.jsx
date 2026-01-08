import {BrowserRouter, Routes, Route} from "react-router-dom"
import "./App.css";
import Login from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

export default function App() {
  return(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/api/messages" element={<MainPage />} />
    </Routes>
  </BrowserRouter>
  )
}
