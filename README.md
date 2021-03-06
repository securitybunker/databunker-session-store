# databunker-session-store

The **Databunker Session Store** is an implementation of the Express.js session store that uses [Databunker Secure Session Storage](https://databunker.org/use-case/secure-session-storage/) as the persistence layer for sessions. The session middleware for Express is provided by the **session-express** module. **Databunker** is a Swiss army knife tool for **encrypted storage of personal records or PII**:
* https://databunker.org/
* https://databunker.org/use-case/privacy-by-design-default/


Prerequisites
-------------
You need to have **databunker** service up and running.

For the purpose of testing you can use the following command to start **databunker**:

```docker run -p 3000:3000 -d --rm --name dbunker securitybunker/databunker demo```

For production use, follow the Databunker installation guide: https://databunker.org/doc/install/


Installation
------------

Via npm:
```npm install --save @databunker/session-store```


Node.js example
---------------

```js
const { v4: uuidv4 } = require('uuid');
const app = require('express')();
const session = require('express-session');
const DataBunkerSessionStore = require('@databunker/session-store')(session);

const port = 3200;
const host = '0.0.0.0';
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

