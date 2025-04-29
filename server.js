const express = require('express');
const mongoose = require('mongoose');
const { LinkedPlayers } = require('./schemas/players');
const app = express();
const PORT = 3002;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

app.get('/', (req, res) => {
    console.log("Root endpoint triggered (GET)");
    res.send("Welcome to the Auth Server! Use /callback to handle authentication.");
})

// Route to handle favicon requests and avoid 404 errors
app.get('/favicon.ico', (req, res) => res.status(204)); // Respond with no content

app.get('/callback', async (req, res) => {
    console.log("Callback triggered (GET)");

    const urlParams = new URLSearchParams(req.url.split('?')[1]); // Manually parse the query params
    console.log("Parsed URL Params:", Object.fromEntries(urlParams));

    const access_token = urlParams.get('access_token');
    const account_id = urlParams.get('account_id');
    const nickname = urlParams.get('nickname');

    if (!access_token || !account_id) {
        return res.status(400).send("Missing required parameters.");
    }

    const user = await LinkedPlayers.findOne({ playerId: account_id });

    if (!user) {
        return res.status(404).send("Account not found in database.");
    }

    user.access_token = access_token;
    await user.save();

    res.send(`✅ Your Wargaming account has been successfully verified as ${nickname}.`);
});

app.listen(PORT, () => {
    console.log(`Auth server listening on http://localhost:${PORT}`);
});
