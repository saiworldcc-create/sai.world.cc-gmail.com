const http = require('http');

async function testPdfRoute() {
  console.log('Testing PDF Route...');
  return new Promise((resolve) => {
    http.get('http://localhost:5000/api/v1/pdf/awb/FAKE123', (res) => {
      console.log(`PDF Route Status Code: ${res.statusCode}`); // Expected 404 since it's fake
      console.log(`PDF Content-Type: ${res.headers['content-type']}`); // Expected application/json for error
      resolve();
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      resolve();
    });
  });
}

async function testFleetRoute() {
  console.log('Testing Fleet Route...');
  return new Promise((resolve) => {
    http.get('http://localhost:5000/api/v1/fleet', (res) => {
      console.log(`Fleet Route Status Code: ${res.statusCode}`); // Expected 200
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`Fleet API Success: ${json.success}`);
        } catch(e) {
          console.error('Fleet API returned non-JSON');
        }
        resolve();
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      resolve();
    });
  });
}

async function runTests() {
  await testPdfRoute();
  await testFleetRoute();
  console.log('All QA tests complete.');
}

runTests();
