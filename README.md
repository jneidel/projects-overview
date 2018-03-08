# v0.4

Pre-release version and as such still missing features.

## Installation

**Download the source code:**

```
$ curl -fsSL https://github.com/jneidel/projects-overview/archive/master.tar.gz | tar -xz --strip-components=1 projects-overview-master
```

**Generate RSA keys:**

The RSA keypair is required for encrypting passwords for the transmission between client and server.

Keys are generated using [openssl](https://www.openssl.org/)

```
$ openssl genrsa -out private-key.pem 4096
$ openssl rsa -in private-key.pem -outform PEM -pubout -out public/public-key.pem
```

The RSA keys they should replace the `private-key.pem` and `public/public-key.pem`.

**Setup database:**

Either host the mongodb instance locally (install eg. via [brew](http://brewformulas.org/Mongodb)) or use [mlab](https://mlab.com/).

**Setup variables.env:**

Fill in database, port, site url, cookie secret (which can be any random string) and set `NODE_ENV=prod`. 

| Key | Type | Description | Example |
|--|--|--|--|
| `DATABASE` | `string` | Mongo connection string (URI) | `mongodb://127.0.0.1:27017/projects-overview` |
| `PORT` | `number` | Port for the app to run on | `8080` |
| `SECRET` | `string` | Secret for encrypting, verifying cookies | `m6aFtRL9ybZN` |
| `URL` | `string` | Url of the website for internal linking | `https://po.jneidel.com/` |
| `NODE_ENV` | `string` | Specifiy environment, either `dev` or `prod` | `dev` or `prod` |

**Install dependencies, build files and run app:**

```
$ npm install
$ npm run build
$ npm run prod
```

## Test

```
$ npm run test
```
