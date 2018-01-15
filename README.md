# project-manager

[![](https://circleci.com/gh/jneidel/project-manager/tree/master.svg?style=shield&circle-token=98937429df5bf860a055272d7ded46b7c583503e)](https://circleci.com/gh/jneidel/project-manager)
[![](https://img.shields.io/badge/pre-release-blue.svg)](https://github.com/jneidel/project-manager/releases)
[![](https://img.shields.io/badge/currently-under%20development-brightgreen.svg)](https://github.com/jneidel/project-manager)

Webapp to manage current and future projects, minimizing the number of overall projects. Less concurrently active projects lead to faster completion, as ones energy is naturally more focused.

![](https://i.imgur.com/HsRgHqh.png)

## Installation

To run development version locally:

```bash
git clone https://github.com/jneidel/project-manager.git
cd project-manager/
npm install
```

Fill in the `variables.env.example` and rename it to `variables.env`.
A mongodb database will be required which can be hosted locally or via [mlab](https://mlab.com/).

To encrypt the password transmission a rsa key pair is required. Keys can be generated with [openssl](https://www.openssl.org/). After generating the keys they should replace the `private-key.pem` and `public/public-key.pem`.

Finally build and run the app with `npm run start` and open the webapp on localhost with your specified port.
