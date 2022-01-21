import { useState, useEffect } from "react";
import { Button, Container, Row, Col, ButtonGroup, Alert } from "react-bootstrap";
import Nav_Bar from "./nav_bar";
import axios from "axios";

import { hchart } from "../charts/hard_chart";
import { schart } from "../charts/soft_chart";

export default function Home() {
  const [dealer, setDealer] = useState("");
  const [player, setPlayer] = useState([]);
  const [decision, setDecision] = useState("");
  const [outcome, setOutcome] = useState("");
  const [ip_address, setIP] = useState("");
  const [invalidMsg, setInvalidMsg] = useState("");
  const [showInvalid, setShowInvalid] = useState(false);

  const convert_special_cards = (card) => {
    return card === "J" || card === "Q" || card === "K" ? 10 : (card === "A" ? 1 : parseInt(card));
  }

  const best_decision = (dealer, player) => {
    let dealer_processed = convert_special_cards(dealer);
    let player_processed = player.slice();
    player_processed.forEach((card, idx) => {
      player_processed[idx] = convert_special_cards(card);
    });
    let dealer_idx = dealer_processed === 1 ? 11 : dealer_processed;
    if (!player_processed.includes(1)) {
      let total = player_processed.reduce((prev, curr) => prev + curr);
      setDecision(total <= 21 ? (total <= 17 ? hchart[dealer_idx - 2][total - 4] : "S") : "B");
    } else {
      player_processed.splice(player_processed.indexOf(1), 1);
      let sub_total = player_processed.reduce((prev, curr) => prev + curr);
      let total = sub_total;
      if (sub_total <= 10) {
        setDecision(total <= 21 ? schart[dealer_idx - 2][sub_total - 2] : "B");
      } else{
        total = sub_total + 1;
        setDecision(total <= 21 ? (total <= 17 ? hchart[dealer_idx - 2][sub_total - 4] : "S") : "B");
      }
    }
  };

  const get_ip_address = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };

  const upload_game_validation = () => {
    let invalid_msgs = []
    if (!dealer) {
      invalid_msgs.push("dealer card");
    }
    if (player.length === 0) {
      if (invalid_msgs.length > 0) {
        invalid_msgs.push(", player cards");
      } else {
        invalid_msgs.push("player cards");
      }
    }
    if (!outcome) {
      if (invalid_msgs.length > 0) {
        invalid_msgs.push(", outcome");
      } else {
        invalid_msgs.push("outcome");
      }
    }
    if (invalid_msgs) {
      setInvalidMsg("Please input " + invalid_msgs.join(""));
    } else {
      setInvalidMsg("");
    }
  }

  const upload_game = () => {
    const game = {
      ip_address: ip_address,
      outcome: outcome,
      time: new Date().toISOString(),
      dealer_hand: dealer,
      player_hand: player,
    };

    upload_game_validation();

    if (game.dealer_hand && game.player_hand.length > 0 && game.outcome) {
      axios
      .post("https://blackjack-strategy-2649b.wl.r.appspot.com/game", game)
      .then(() => {
        console.log("Success");
      })
      .catch((err) => {
        console.log(err);
      });

    setDealer("");
    setPlayer([]);
    setDecision("");
    setOutcome("");
    setShowInvalid(false);
    } else {
      setShowInvalid(true);
      setTimeout(() => {
        setShowInvalid(false);
     }, 4000)
    }
  };

  const dealer_setter = (card_val) => {
    setDealer(card_val);
  };

  const player_appender = (card_val) => {
    if (player.length < 6) {
      setPlayer((player) => [...player, card_val])
    }
  }

  useEffect(() => {
    get_ip_address();
  }, []);

  return (
    <div style={{width: "100%"}}>
      <Nav_Bar />
      {showInvalid ?
          <Alert variant="danger" onClose={() => setShowInvalid(false)} dismissible style={{margin: "15px auto", display: "table"}}>
            {invalidMsg}
          </Alert>
          : null}
      <Container style={{marginTop: "25px"}}>
        <Row>
          <Col sm={5} style={{textAlign: "center", backgroundColor: "#dedede", padding: "40px", borderRadius:"10px"}}>
            <h5>Dealer Card</h5>
              <h1 style={{height: "55px", width: "55px", backgroundColor: "#b8b8b8", margin: "auto", marginBottom: "10px", marginTop: "15px", borderRadius: "5px"}}>{dealer}</h1>
            <div style={{marginBottom: "10px"}}>
              <ButtonGroup>
                <Button variant="secondary" onClick={() => dealer_setter("2")}>
                  2
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("3")}>
                  3
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("4")}>
                  4
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("5")}>
                  5
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("6")}>
                  6
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("7")}>
                  7
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("8")}>
                  8
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("9")}>
                  9
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("10")}>
                  10
                </Button>
              </ButtonGroup>
            </div>
            <div>
              <Button variant="secondary" onClick={() => dealer_setter("A")} style={{marginRight: "10px"}}>
                A
              </Button>
              <ButtonGroup>
                <Button variant="secondary" onClick={() => dealer_setter("J")}>
                  J
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("Q")}>
                  Q
                </Button>
                <Button variant="secondary" onClick={() => dealer_setter("K")}>
                  K
                </Button>
              </ButtonGroup>
            </div>
          </Col>
          <Col sm={2} style={{textAlign: "center", padding: "40px"}}>
            <h5 style={{marginTop: "10px"}}>Decision</h5>
            <h1 style={{height: "55px", width: "55px", backgroundColor: "#b8b8b8", margin: "auto", marginBottom: "10px", marginTop: "15px", borderRadius: "5px"}}>{decision}</h1>
          </Col>
          <Col sm={5} style={{textAlign: "center", backgroundColor: "#dedede", padding: "40px", borderRadius:"10px"}}>
            <h5>Player Cards</h5>
            <div style={{display: "inline-flex", flexDirection: "row", flexWrap: "wrap"}}>
              { player.length === 0 ?
                <h1 style={{height: "55px", width: "55px", backgroundColor: "#b8b8b8", margin: "auto", marginBottom: "10px", marginTop: "15px", "marginRight": "10px",  borderRadius: "5px", display: "inline-flex"}}></h1> :
                player.map((card) => (
                  <h1 style={{height: "55px", width: "55px", backgroundColor: "#b8b8b8", margin: "auto", marginBottom: "10px", marginTop: "15px", "marginRight": "10px", borderRadius: "5px"}}>{card}</h1>
                ))
              }
            </div>
            <div style={{marginBottom: "10px"}}>
            <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => player_appender("2")}
              >
                2
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("3")}
              >
                3
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("4")}
              >
                4
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("5")}
              >
                5
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("6")}
              >
                6
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("7")}
              >
                7
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("8")}
              >
                8
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("9")}
              >
                9
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("10")}
              >
                10
              </Button>
            </ButtonGroup>
            </div>
            <div>
              <Button
                variant="secondary"
                onClick={() => player_appender("A")}
                style={{marginRight: "10px"}}
              >
                A
              </Button>
              <ButtonGroup>
              <Button
                variant="secondary"
                onClick={() => player_appender("J")}
              >
                J
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("Q")}
              >
                Q
              </Button>
              <Button
                variant="secondary"
                onClick={() => player_appender("K")}
              >
                K
              </Button>
            </ButtonGroup>
            </div>
          </Col>
        </Row>
        <Row style={{marginTop: "15px"}}>
          <Col style={{textAlign: "center"}}>
            <Button variant="dark" onClick={() => best_decision(dealer, player)} style={{width: "225px", marginTop: "50px"}}>
              Compute
            </Button>
            <div style={{marginTop: "10px"}}>
              <ButtonGroup>
                <Button variant="success" onClick={() => setOutcome("WIN")} style={{width: "75px"}}>
                  Win
                </Button>
                <Button variant="warning" onClick={() => setOutcome("PUSH")} style={{width: "75px"}}>
                  Push
                </Button>
                <Button variant="danger" onClick={() => setOutcome("LOSS")} style={{width: "75px"}}>
                  Loss
                </Button>
              </ButtonGroup>
            </div>
            <div style={{textAlign: "right"}}>
              <Button variant="dark" onClick={() => upload_game()} style={{height: "50px", marginTop: "50px", width: "125px"}}>
                Next Game
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
