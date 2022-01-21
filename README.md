# blackjack-strategy
Strategy Optimizer for Blackjack

Deployed here: [Blackjack Strategy Web App](https://blackjack-strategy-2649b.web.app/)
<br></br>

There are two parts here, the client and the server.

## Installation

In client directory, run:
```
npm install
```

Then, run:
```
npm start
```

To run the FastAPI server locally:

In the root directory:
```
pip install -r requirements.txt
```

Then, to run the API server:
```
python -m uvicorn server:app --reload
```

The API and its swagger doc is available from http://localhost:8000/docs

## Further improvements
```
1. Support splits
2. Show loading when waiting for API response
3. Improve validation
```

