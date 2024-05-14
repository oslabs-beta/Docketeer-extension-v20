// Docketeer Extension 19: Replaced Redis with Memcached as Redis is no longer free
// Chose Memcached as it has a well maintained docker image
// See https://www.npmjs.com/package/memcached for methods
// See https://hub.docker.com/_/memcached for docker image
const Memcached = require('memcached');

// Connect to the Memcached server
const memcachedClient: any = new Memcached('memcached:11211', { retries: 1, retry: 5000 });

export default memcachedClient;