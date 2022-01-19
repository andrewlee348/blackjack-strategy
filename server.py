from datetime import datetime
from http.client import HTTPException
from fastapi import FastAPI
from pydantic import BaseModel
from firebase.admin import db
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Game(BaseModel):
    ip_address: str
    outcome: str
    time: str
    dealer_hand: str
    player_hand: list[str]

@app.post("/game/")
async def upload_game(game: Game):
    print(jsonable_encoder(game))
    db.collection(game.ip_address).document(game.time).set(jsonable_encoder(game))

@app.get("/get_games/{ip_address}")
async def fetch_games(ip_address: str):
    docs = db.collection(ip_address).stream()
    games = []
    for doc in docs:
        games.append(doc.to_dict())
    return games
