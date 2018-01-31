# v0.1

Pre-release version and as such still missing features.

## Installation

**Download the source code:**

```bash
wget https://github.com/jneidel/project-manager/archive/v0.1.tar.gz
# or
curl https://github.com/jneidel/project-manager/archive/v0.1.tar.gz -0
```

Unpack with `tar -xzf v0.1.tar.gz`.

**Setup variables.env:**

Requirements:

- MongoDB database (hosted locally or eg. via [mlab](https://mlab.com/))
- RSA key pair (eg. generated with [openssl](https://www.openssl.org/))

Fill in database, port and cookie secret. The RSA keys they should replace the `private-key.pem` and `public/public-key.pem`.

**Install dependencies and run app:**

```bash
npm install --production
npm run prod
```
