const axios = require('axios')
const http = require('http');
const https = require('https');
const util = require('util');

const defaultUrl = 'http://127.0.0.1:3000';
const defaultToken = 'DEMO';
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

module.exports = function (session) {
  var Store = session.Store

  function DataBunkerSessionStore(options) {
    options = options || {}
    this.srv = options.url ? options.url : defaultUrl;
    this.token = options.token ? options.token : defaultToken;
    if (this.srv.endsWith("/")) {
      this.srv = this.srv.slice(0, -1);
    }
    delete(options.token);
    delete(options.url);
    Store.call(this, options)
  }

  util.inherits(DataBunkerSessionStore, Store)

  DataBunkerSessionStore.prototype._getUrl = function(sid) {
    return this.srv + "/v1/session/" + sid;
  }

  DataBunkerSessionStore.prototype.get = function (sid, cb) {
    const url = this._getUrl(sid);
    const headers = {'X-Bunker-Token': this.token};
    const options = {
        httpAgent, httpsAgent, headers
    };
    axios.get(url, options)
      .then(res => {
        if (res.data && res.data.status && res.data.status == "ok") {
          cb(null, res.data.data);
	} else {
          if (res.data && res.data.status && res.data.status == "error") {
            cb(res.data.message);
	  } else {
            cb('bad response');
	  }
	}
      })
      .catch(err => {
        const res = err.response;
        if (res.data && res.data.status && res.data.status == "error" && res.data.message == "not found") {
          cb(null, null);
	} else {
          if (res.data && res.data.message) {
            cb(res.data.message);
	  } else {
            cb('error');
	  }
	}
      });
  }

  DataBunkerSessionStore.prototype.set = function (sid, session, cb) {
    const url = this._getUrl(sid);
    const headers = {'X-Bunker-Token': this.token};
    const options = {
        httpAgent, httpsAgent, headers
    };
    axios.post(url, session, options)
      .then(res => {
        if (res.data && res.data.status && res.data.status == "ok") {
          cb(null, null);
        } else {
          if (res.data && res.data.status && res.data.status == "error") {
            cb(res.data.message);
	  } else {
            cb('error');
	  }
	}
      })
      .catch(error => {
        const res = err.response;
	if (res.data && res.data.status && res.data.status == "error" && res.data.message) {
          cb(res.data.message);
	} else {
          cb('error');
        }
      });
  }

  DataBunkerSessionStore.prototype.destroy = function (sid, cb) {
    const url = this._getUrl(sid);
    const headers = {'X-Bunker-Token': this.token};
    const options = {
        httpAgent, httpsAgent, headers
    };
    axios.delete(url, options)
      .then(res => {
        if (cb) {
          cb();
	}
      })
      .catch(error => {
	if (cb) {
          cb(error);
	}
      });
  }

  DataBunkerSessionStore.prototype.touch = function (sid, session, cb) {
    return this.set(sid, session, cb);
  }

  DataBunkerSessionStore.prototype.clear = function (cb) {
    // not implemented
    if (cb) {
      cb();
    }
  }

  DataBunkerSessionStore.prototype.length = function (cb) {
    // not implemented
    if (cb) {
      cb(null, null);
    }
  }

  return DataBunkerSessionStore
}
