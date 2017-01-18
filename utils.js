
function q(self, method, ...args) {
  return new Promise(function(resolve, reject) {
    self[method](...args, function(err, ...args) {
      err ? reject(err) : resolve(...args);
    });
  });
}

function t(func, ...args) {
  return new Promise(function(resolve, reject) {
    func(...args, function(err, ...args) {
      err ? reject(err) : resolve(...args);
    });
  });
}

module.exports = { t, q };