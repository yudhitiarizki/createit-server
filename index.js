const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const router = require("./routes/index.js");

require('dotenv').config();

const app = express();
const public = __dirname + "/public/";
const PORT = process.env.PORT_SERVER || 3002;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public/uploads', express.static(path.join(__dirname, "public/uploads")));
app.use(router);

app.get('/', function(req, res) {
    res.sendFile(path.join(public + "index.html"));
});

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))