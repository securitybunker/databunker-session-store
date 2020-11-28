const axios = require('axios')

var util = require('util');
var defaultUrl = 'http://127.0.0.1:3000';
var defaultToken = 'DEMO';

module.exports = function (session) {
  var Store = session.Store

  function DataBunkerSessionStore(options) {
    options = options || {}
    this.srv = options.url ? options.url : defaultUrl;
    this.token = options.token ? options.token : defaultToken;
    delete(options.token);
    delete(options.url);
    Store.call(this, options)
  }

  util.inherits(DataBunkerSessionStore, Store)

  DataBunkerSessionStore.prototype._getUrl = function(sid) {
    const lastChar = this.srv.substr(this.srv.length -1);
    if (lastChar === "/") {
      return this.srv + "v1/session/" + sid;
    }
    return this.srv + "/v1/session/" + sid;
  }

  DataBunkerSessionStore.prototype.get = function (sid, cb) {
    const url = this._getUrl(sid);
    const headers = {'X-Bunker-Token': this.token};
    axios.get(url, {headers: headers})
      .then(res => {
        if (res.data.status && res.data.status == "ok") {
          cb(null, res.data.data);
	} else {
          if (res.data.status && res.data.status == "error") {
            cb(res.data.message);
	  } else {
            cb('bad response');
	  }
	}
      })
      .catch(err => {
        const res = err.response;
        if (res.data.status && res.data.status == "error" && res.data.message == "not found") {
          cb(null, null);
	} else {
          if (res.data.message) {
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
    axios.post(url, session, {headers: headers})
      .then(res => {
        if (res.data.status && res.data.status == "ok") {
          cb(null, null);
        } else {
          if (res.data.status && res.data.status == "error") {
            cb(res.data.message);
	  } else {
            cb('error');
	  }
	}
      })
      .catch(error => {
        const res = err.response;
	if (res.data.status && res.data.status == "error" && res.data.message) {
          cb(res.data.message);
	} else {
          cb('error');
        }
      });
  }

  DataBunkerSessionStore.prototype.destroy = function (sid, cb) {
    const url = this._getUrl(sid);
    const headers = {'X-Bunker-Token': this.token};
    axios.delete(url, {headers: headers})
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
