const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); // Allow frontend requests
app.use(express.json()); // Parse JSON data

app.get('/test', (req, res) => {
    res.json({ message: "API is working!" });
});

app.listen(5001, () => console.log("Server running on port 5001"));


