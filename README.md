# blackjack-strategy
Strategy Optimizer for Blackjack

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

The API and its swagger doc is available from http://localhost:8000/docs

To access the "Played Games" page, firebase-admin credentials are required to store and fetch user data; however, for obvious security reasons I didn't add them here.

If you're able to connect with your Firestore credentials:

In the root directory:
```
pip install -r requirements.txt
```

Then, to run the API server:
```
python -m uvicorn server:app --reload
```
