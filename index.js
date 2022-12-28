const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const router = require("./api/index.js.js");

require('dotenv').config();

const app = express();
const public = __dirname + "/public/";
const PORT = process.env.PORT_SERVER || 3002;
const whitelist = [
    '*'
  ];

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public/uploads', express.static(path.join(public, "uploads")));
app.use((req, res, next) => {
    const origin = req.get('referer');
    const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
    if (isWhitelisted) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
      res.setHeader('Access-Control-Allow-Credentials', true);
    }
    // Pass to next layer of middleware
    if (req.method === 'OPTIONS') res.sendStatus(200);
    else next();
  })

const setContext = (req, res, next) => {
    if (!req.context) req.context = {};
    next();
};
app.use(setContext);
app.use(router);

app.get('/', function(req, res) {
    res.sendFile(path.join(public + "index.html"));
});

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))