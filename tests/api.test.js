/**
 * API Integration Test Suite for VidyaPath REST APIs
 */

const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

// Helper to perform in-memory requests without spawning network ports
function performRequest(app, method, url, body = null) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const parsedUrl = new URL(`http://127.0.0.1:${port}${url}`);
      const options = {
        hostname: '127.0.0.1',
        port: port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          server.close(() => {
            try {
              const parsed = data ? JSON.parse(data) : {};
              resolve({ status: res.statusCode, data: parsed });
            } catch (e) {
              resolve({ status: res.statusCode, text: data });
            }
          });
        });
      });

      req.on('error', (err) => {
        server.close(() => reject(err));
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  });
}

test('VidyaPath API Endpoints Suite', async (t) => {
  await t.test('GET /health returns healthy status', async () => {
    const res = await performRequest(app, 'GET', '/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'online');
  });

  await t.test('GET /api/options returns dropdown options', async () => {
    const res = await performRequest(app, 'GET', '/api/options');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.educationLevels));
    assert.ok(Array.isArray(res.data.states));
    assert.ok(res.data.states.includes('Karnataka'));
  });

  await t.test('GET /api/stats returns statistics', async () => {
    const res = await performRequest(app, 'GET', '/api/stats');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.totalSchemes >= 20);
    assert.ok(res.data.data.totalAidAvailable > 0);
  });

  await t.test('GET /api/announcements returns active portal notices', async () => {
    const res = await performRequest(app, 'GET', '/api/announcements');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.length >= 3);
  });

  await t.test('POST /api/match returns matched results and diagnostics', async () => {
    const payload = {
      name: 'Priyanka Sen',
      educationLevel: 'Undergraduate',
      stream: 'Engineering',
      percentage: 82,
      familyIncome: 250000,
      gender: 'Female',
      category: 'OBC',
      religion: 'Hindu',
      state: 'All India',
      isPwd: false,
      isSingleGirlChild: false,
      isWardOfDefense: false,
      isRural: false
    };

    const res = await performRequest(app, 'POST', '/api/match', payload);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data.eligible));
    assert.ok(res.data.data.counts.eligibleCount > 0);
  });

  await t.test('GET /api/schemes returns list of scholarships', async () => {
    const res = await performRequest(app, 'GET', '/api/schemes?search=Pragati');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1);
    assert.strictEqual(res.data.data[0].id, 'SCH-AICTE-001');
  });

  await t.test('GET /api/schemes/:id returns single scholarship details', async () => {
    const res = await performRequest(app, 'GET', '/api/schemes/SCH-AICTE-001');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.name, 'AICTE Pragati Scholarship Scheme for Girl Students');
  });

  await t.test('GET /api/auth/institutions returns verified schools and colleges', async () => {
    const res = await performRequest(app, 'GET', '/api/auth/institutions');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.length >= 4);
    assert.ok(res.data.data.some(i => i.id === 'INST-001'));
  });

  await t.test('POST /api/auth/student/login logs in student with college ID & roll number', async () => {
    const payload = {
      institutionId: 'INST-001',
      studentRollNo: '1RV22CS045',
      password: 'password123'
    };
    const res = await performRequest(app, 'POST', '/api/auth/student/login', payload);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.user.name, 'Arjun Nayak');
    assert.ok(res.data.user.documents.aadhaar.verified);
  });

  await t.test('POST /api/applications/apply submits scholarship to college nodal officer', async () => {
    const payload = {
      schemeId: 'SCH-HDFC-001',
      schemeName: 'HDFC Badhte Kadam Scholarship',
      studentId: 'STU-2026-001',
      studentName: 'Arjun Nayak',
      studentRollNo: '1RV22CS045',
      institutionId: 'INST-001',
      institutionName: 'RV College of Engineering',
      course: 'B.Tech Computer Science',
      percentage: 78.5,
      familyIncome: 180000,
      awardAmount: 'Up to ₹75,000 per annum'
    };
    const res = await performRequest(app, 'POST', '/api/applications/apply', payload);
    assert.ok([201, 409].includes(res.status));
    assert.ok(res.data.success || res.data.existing);
  });

  await t.test('GET /api/applications/college/INST-001 returns applications for college scrutiny', async () => {
    const res = await performRequest(app, 'GET', '/api/applications/college/INST-001');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.length >= 1);
    assert.ok(res.data.stats.totalReceived >= 1);
  });

  await t.test('POST /api/applications/:id/verify updates college attestation status', async () => {
    const payload = {
      officerName: 'Prof. S. R. Murthy',
      status: 'Verified & Approved by College',
      remarks: 'Original caste and income certificates verified.'
    };
    const res = await performRequest(app, 'POST', '/api/applications/APP-2026-9001/verify', payload);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.application.status, 'Verified & Approved by College');
  });
});
