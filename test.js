const Test = require('tap').test;
const Parse = require('./');

Test('error on no certs', t => {
  Parse((err, result) => {
    t.ok(err);
    t.notOk(result);
    t.end();
  });
});

Test('error on cert does not resolve', t => {
  Parse('./mock-not-here.crt', (err, result) => {
    t.ok(err);
    t.notOk(result);
    t.end();
  });
});

Test('returns array', t => {
  Parse('./mock.crt', (err, result) => {
    t.type(result, 'Array');
    t.end(err);
  });
});

Test('error on no certs: promise', t =>
  Parse().catch(err => t.type(err, Error))
);

Test('error on cert does not resolve: promise', t =>
  Parse('./mock-not-here.crt').catch(err => t.type(err, Error))
);

Test('returns array: promise', t => 
  Parse('./mock.crt')
);

Test('array splits on BEGIN', t => {
  Parse('./mock.crt', (err, result) => {
    for (const CA of result) {
      t.ok(CA.startsWith('-----BEGIN'));
    }
    t.end(err);
  });
});

Test('CAs end with a new line', t => {
  Parse('./mock.crt', (err, result) => {
    for (const CA of result) {
      t.ok(CA.endsWith('\n'));
    }
    t.end(err);
  });
});

Test('can handle multiple certs', t => {
  Parse('./mock.crt', (err, result) => {
    t.error(err);
    Parse('./mock.crt', './mock.crt', (err, result2) => {
      t.equal(result2.length, result.length * 2);
      t.end(err);
    });
  });
});
