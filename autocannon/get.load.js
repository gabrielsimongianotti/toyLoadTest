const autocannon = require('autocannon');
const { PassThrough } = require('stream');
// const faker = require("faker");

async function run(url) {
  const buf = [];
  const outputStream = new PassThrough();

  const inst = autocannon({
    url,
    connections: 1,
    amount: 1000,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "faker.name.firstName()",
      dosage: "faker.random.number()",
    })
  });

  autocannon.track(inst, { outputStream });

  outputStream.on('data', (data) => buf.push(data));
  inst.on('done', function() {
    process.stdout.write(Buffer.concat(buf));
  });

  inst.on('response', handleResponse);

  inst.on('done', handleResults);
}

function handleResponse(client, statusCode, resBytes, responseTime) {
  console.log(
    `Got response with code ${statusCode} in ${responseTime} milliseconds `
  );
  console.log(`response: ${resBytes.toString()}`);
  console.log(client.body);

  client.setBody(
    JSON.stringify({
      name: 'conserta',
      dosage: '10ml'
    })
  );
  // console.log(client.)
}

function handleResults(result) {
  console.log(result);
}

console.log('Running all benchmarks in parallel ...');

run('http://localhost:3000/medicaton');
