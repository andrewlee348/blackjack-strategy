import { useState, useEffect } from "react";
import Nav_Bar from "./nav_bar"
import axios from "axios";

export default function Played_Games() {
  const [games, setGames] = useState([]);

  const get_ip_address = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    return res.data.IPv4;
  };

  const get_games = async (ip_address) => {
    const res = await axios.get(
      "http://localhost:8000/get_games/" + ip_address
    );
    if (res.data) {
      setGames(res.data);
    }
  };

  useEffect(() => {
    get_ip_address().then((ip_address) => {
      get_games(ip_address);
    });
  }, []);
  return (
    <div>
      <Nav_Bar />
      {games.map((game) => (
        <div>
          <p>
            &nbsp;&nbsp;&nbsp; Outcome: {game.outcome}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Dealer Card: {game.dealer_hand}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Your Cards: {game.player_hand}
          </p>
        </div>
      ))}
    </div>
  );
}
