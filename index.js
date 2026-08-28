const http = require('http');

// Lisans veritabanı (basit örnek)
const licenses = {
  'BILAL-2024-ABC': {
    valid: true,
    username: 'bilal',
    expires: '2025-12-31',
    hwid: null
  },
  'TEST-LICENSE-123': {
    valid: true,
    username: 'test_user',
    expires: '2025-06-30',
    hwid: null
  }
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/check-license') {
    const key = url.searchParams.get('key');
    const hwid = url.searchParams.get('hwid');

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

    // HWID check
    if (license.hwid && license.hwid !== hwid) {
      res.writeHead(200);
      res.end(JSON.stringify({
        valid: false,
        message: 'License already bound to another machine'
      }));
      return;
    }

    // Bind HWID on first use
    if (!license.hwid && hwid) {
      license.hwid = hwid;
    }

    // Check expiry
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
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`License API running on port ${PORT}`);
});
