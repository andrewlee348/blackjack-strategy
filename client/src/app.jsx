import Home from "./components/home";
import Played_Games from "./components/played_games";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/played_games" element={<Played_Games />} />
      </Routes>
    </BrowserRouter>
  );
}
