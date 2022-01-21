import { useState, useEffect } from "react";
import {  Container, Row, Col, Table } from "react-bootstrap";
import Nav_Bar from "./nav_bar"
import axios from "axios";
import dateformat from "dateformat";

export default function Played_Games() {
  const [games, setGames] = useState([]);

  const get_ip_address = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    return res.data.IPv4;
  };

  const get_games = async (ip_address) => {
    const res = await axios.get(
      "https://blackjack-strategy-2649b.wl.r.appspot.com/get_games/" + ip_address
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
      <Container style={{marginTop: "25px"}}>
        <Row>
          <Col>
          <Table striped>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Dealer card</th>
                <th>Player cards</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr>
                  <td>{dateformat(new Date(game.time), "mmmm dd, yyyy")}</td>
                  <td>{dateformat(new Date(game.time), "h:MM TT")}</td>
                  <td>{game.dealer_hand}</td>
                  <td>{game.player_hand.join(", ")}</td>
                  <td style={game.outcome === "WIN" ? {color: "green"} : (game.outcome === "LOSS" ? {color: "red"} : {color: "orange"})}>{game.outcome}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
