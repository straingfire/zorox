const http = require('http');

const licenses = {
  'BILAL-2024-ABC': {
    valid: true,
    username: 'bilal',
    expires: '2025-12-31',
    hwid: null
  }
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  console.log('Request:', req.url);

  if (req.url.startsWith('/check-license')) {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const key = params.get('key');
    const hwid = params.get('hwid');

    console.log('Key:', key, 'HWID:', hwid);

    if (!key) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'License key required' }));
    }

    const license = licenses[key];

    if (!license) {
      res.writeHead(200);
      return res.end(JSON.stringify({ valid: false, message: 'Invalid license' }));
    }

    if (license.hwid && license.hwid !== hwid) {
      res.writeHead(200);
      return res.end(JSON.stringify({ valid: false, message: 'HWID mismatch' }));
    }

    if (!license.hwid && hwid) {
      license.hwid = hwid;
    }

    res.writeHead(200);
    res.end(JSON.stringify({
      valid: license.valid,
      username: license.username,
      expires: license.expires
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found', path: req.url }));
  }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
