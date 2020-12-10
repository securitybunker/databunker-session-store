# databunker-session-store

An encrypted session store service using [DataBunker API](https://databunker.org/).


Installation
------------

```npm install --save @databunker/session-store```

Usage
-----

```js
const { v4: uuidv4 } = require('uuid');
var app = require('express')();
var session = require('express-session');
var DataBunkerSessionStore = require('@databunker/session-store')(session);

var DataBunkerConf = {
  url: 'http://localhost:3000/',
  token: 'DEMO'
}

var mw = session({
  genid: function(req) {
    return uuidv4();
  },
  secret: 'JustASecret',
  resave: false,
  saveUninitialized: true,
  store: new DataBunkerSessionStore(DataBunkerConf)
});

app.use(mw);

const port = 3200
const host = '0.0.0.0'

app.get('/', (req, res) => {
  sess=req.session;
  if (!sess.count) {
    sess.count = 1;
  } else {
    sess.count ++;
  }
  res.send('Counter: '+sess.count.toString());
  res.end();
})

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`)
})
```

Licence
-------

[MIT](https://en.wikipedia.org/wiki/MIT_License)

