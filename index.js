const express = require('express')

const app = express()

app.get('/', function (req, res) {
  res.send('<html><body><img src="https://shechive.files.wordpress.com/2012/02/a-kitty-cat-7.jpg"/> <a class="twitter-timeline" href="https://twitter.com/mairie5paris?lang=fr">A Twitter List by TwitterDev</a> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script> </body></html>');
})


app.get('/secret.jpg', function (req, res) {
  res.send('hello');
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
})
