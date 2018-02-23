# v0.3

Pre-release version and as such still missing features.

## Installation

**Download the source code:**

```bash
wget https://github.com/jneidel/project-manager/archive/v0.3.tar.gz
# or
curl https://github.com/jneidel/project-manager/archive/v0.3.tar.gz -0

# Unpack
tar -xzf v0.3.tar.gz
```

**Generate RSA keys:**

The RSA keypair is required for encrypting passwords for the transmission between client and server.

Keys are generated using [openssl](https://www.openssl.org/)

```zsh
openssl genrsa -out private-key.pem 4096
openssl rsa -in private-key.pem -outform PEM -pubout -out public/public-key.pem
```

The RSA keys they should replace the `private-key.pem` and `public/public-key.pem`.

**Setup database:**

Either host the mongodb instance locally (install eg. via [brew](http://brewformulas.org/Mongodb)) or use [mlab](https://mlab.com/).

**Setup variables.env:**

Fill in database, port, site url, cookie secret (which can be any random string) and set `NODE_ENV=prod`. 

**Install dependencies, build files and run app:**

```bash
npm i
npm run build
npm run prod
```

## Test

```bash
npm run test
```
