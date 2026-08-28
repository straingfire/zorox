const http = require('http');

const licenses = {
  'BILAL-2024-ABC': {
    valid: true,
    username: 'bilal',
    expires: '2025-12-31',
    hwid: null
  },
  'TEST-LICENSE-123': {
    valid: true,
    username: 'test',
    expires: '2025-06-30',
    hwid: null
  }
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  console.log('Request URL:', req.url);

  if (req.url.startsWith('/check-license')) {
    const url = req.url.split('?')[1] || '';
    const params = new URLSearchParams(url);
    const key = params.get('key');
    const hwid = params.get('hwid');

    console.log('License check - Key:', key, 'HWID:', hwid);

    if (!key) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'License key required' }));
      return;
    }

    const license = licenses[key];

    if (!license) {
      res.writeHead(200);
      res.end(JSON.stringify({
        valid: false,
        message: 'Invalid license key'
      }));
      return;
    }

    if (license.hwid && license.hwid !== hwid) {
      res.writeHead(200);
      res.end(JSON.stringify({
        valid: false,
        message: 'License bound to another PC'
      }));
      return;
    }

    if (!license.hwid && hwid) {
      license.hwid = hwid;
      console.log('HWID bound:', hwid);
    }

    const now = new Date();
    const expiry = new Date(license.expires);
    if (now > expiry) {
      res.writeHead(200);
      res.end(JSON.stringify({
        valid: false,
        message: 'License expired'
      }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify({
      valid: license.valid,
      username: license.username,
      expires: license.expires
    }));

  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Not found',
      path: req.url
    }));
  }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('License API running on port', PORT);
});
