const express = require('express');
const mongoose = require('mongoose');
const { LinkedPlayers } = require('./schemas/players'); // your Mongoose schema
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

app.get('/callback', async (req, res) => {
    const { access_token, account_id, nickname, expires_at, state } = req.query;
    const discordId = state; // Discord ID passed via the `state` parameter

    if (!access_token || !account_id || !discordId) {
        return res.status(400).send("Missing required parameters.");
    }

    // Find user by Discord ID
    const user = await LinkedPlayers.findOne({ discordId });

    if (!user) {
        return res.status(404).send("Discord account not found in link database.");
    }

    user.access_token = access_token;
    user.playerId = account_id;
    user.ign = nickname;
    await user.save();

    res.send(`✅ Your account has been successfully verified as ${nickname}. You can now return to Discord.`);
});

app.listen(PORT, () => {
    console.log(`Auth server listening on http://localhost:${PORT}`);
});
