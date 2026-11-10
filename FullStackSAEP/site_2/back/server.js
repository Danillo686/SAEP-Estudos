const express = require('express');
const cors = require('cors');
const router = require('./routes/carRoute.js')

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

PORT = 3000
app.listen(PORT, () => {
    console.log("Rodando na porta 3000!")
})