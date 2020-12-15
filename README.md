# databunker-session-store

An encrypted session store service using [DataBunker API](https://databunker.org/).


Installation
------------

```npm install --save uuid axios @databunker/session-store```

Usage
-----

```js
const { v4: uuidv4 } = require('uuid');
const app = require('express')();
const session = require('express-session');
const DataBunkerSessionStore = require('@databunker/session-store')(session);

const DataBunkerConf = {
  url: 'http://localhost:3000/',
  token: 'DEMO'
};

const s = session({
  genid: function(req) {
    return uuidv4();
  },
  secret: 'JustASecret',
  resave: false,
  saveUninitialized: true,
  store: new DataBunkerSessionStore(DataBunkerConf)
});

app.use(s);

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

