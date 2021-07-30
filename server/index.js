const express = require('express');
const cors = require('cors');
const Pusher = require("pusher");

const secret = require('../secret');

const pusher = new Pusher({
  app_id: "1239723",
  key: "940714571a82759ab2fa",
  secret,
  cluster: "us2",
  useTLS: true
});

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:4200'
  ]
}))

app.use(express.json());


app.post('/api/messages', async (req, res, next) => {
  await pusher.trigger("chat", "message", {
    username: req.body.username,
    message: req.body.message
  });

  res.sendStatus(200);
})

console.log('Listening at port 8080');
app.listen(8080)
