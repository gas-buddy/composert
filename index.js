/**
 * Cert composer
 * @module @gasbuddy/composert
 */

const fs = require('fs');

/**
 * Split pem-encoded crts into individual certs in an array
 * @param {...string} path fs path to a .pem.crt
 * @param {function} [callback] an optional callback
 * @returns {undefined|Promise} returns a <code>Promise</code> if callback not provided
 */
module.exports = function compose(...certs) {
  const noCert = Error('please specify a cert');

  if (!certs.length) {
    return Promise.reject(noCert);
  }

  if (typeof certs[0] === 'function') {
    return certs[0](noCert);
  }

  if (typeof certs[certs.length - 1] !== 'function') {
    return new Promise((resolve, reject) => {
      const callback = (err, res) => {
        if (err) { return reject(err); }
        resolve(res);
      };
      compose.call(null, ...certs, callback);
    });
  }

  const callback = certs.pop();

  iterateCerts(certs, callback);

  function iterateCerts(certs, callback) {
    let bucket = [];
    recurse();

    function recurse() {
      if (certs.length) {
        const cert = certs.shift();

        parseCertPath(cert, (err, CAs) => {
          if (err) {
            return callback(err);
          }
          bucket = bucket.concat(CAs);
          process.nextTick(recurse);
        });
      } else {

        callback(null, bucket);
      }
    }
  }

  function parseCertPath(certPath, callback) {
    const stream = fs.createReadStream(certPath, { encoding: 'utf8' });
    const CAs = [];

    let accumBytes = '';

    stream.on('data', chunk => {
      const lines = (accumBytes + chunk).split('\n');

      accumBytes = lines.pop();

      for (const line of lines) {
        if (line.startsWith('-----BEGIN')) {
          CAs.push('');
        }
        CAs[CAs.length - 1] = CAs[CAs.length - 1] + line + '\n';
      };
    });

    stream.on('end', () => callback(null, CAs));
    stream.on('error', callback);
  }
}
