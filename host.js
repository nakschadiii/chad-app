const os = require('os');
const dns = require('dns');

function getHostnameAndAddress(callback) {
  const hostname = os.hostname();
  let address;

  dns.lookup(hostname, (err, result) => {
    if (err) {
      console.error('Impossible de résoudre le nom d\'hôte', err);
      return;
    }
    address = result;
    callback(hostname, address);
  });
}

module.exports = getHostnameAndAddress;