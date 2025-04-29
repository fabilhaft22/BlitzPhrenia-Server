const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI;

mongoose.connect(URI) //you need to put your own mongoDB connection string in here
    .then(() => console.log("Connected to MongoDB LinkedPlayers collection"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

const playerSchema = new mongoose.Schema({
    ign: { type: String, required: true, unique: true },
    playerId: { type: String, required: true, unique: true },
    discordId: { type: String, required: true, unique: true },
    access_token: { type: String, required: true, default: "N/A" },
})

const LinkedPlayers = mongoose.model('linkedplayers', playerSchema);

module.exports = {
    LinkedPlayers
}