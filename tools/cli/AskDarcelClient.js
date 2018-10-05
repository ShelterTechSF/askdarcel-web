const ax = require('axios');

class AskDarcelClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.headers = {};
  }

  signIn(email, password) {
    return this.postData('/admin/auth/sign_in', { email, password })
      .then(d => {
        this.headers['access-token'] = d.headers['access-token'];
        this.headers.client = d.headers.client;
        this.headers.uid = d.headers.uid;
      });
  }

  getData(path) {
    return ax.get(`${this.endpoint}${path}`, { headers: this.headers });
  }

  postData(path, body) {
    return ax.post(`${this.endpoint}${path}`, body, { headers: this.headers });
  }
}

module.exports = AskDarcelClient;
