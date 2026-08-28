const http = require('http');

const licenses = {
  'BILAL-2024': { valid: true, username: 'bilal', expires: '2026-12-31', hwid: null }
};

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url.includes('/check-license')) {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const key = params.get('key');
    const license = licenses[key];

    if (!license) {
      return res.end(JSON.stringify({ valid: false }));
    }

    res.end(JSON.stringify({ valid: true, username: license.username, expires: license.expires }));
  } else {
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}).listen(process.env.PORT || 10000);
