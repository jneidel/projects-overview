# projects-overview

> Overview of current and future projects

[![Releases](https://img.shields.io/badge/version-v0.4-blue.svg)](https://github.com/jneidel/projects-overview/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/jneidel/projects-overview/blob/master/licence)
[![Code style](https://img.shields.io/badge/code%20style-custom-ff69b4.svg)](https://github.com/jneidel/dotfiles/blob/master/eslintrc)

Webapp to manage current and future projects, minimizing the number of overall projects. Less concurrently active projects leads to faster completion, as ones energy is naturally more focused.

![](https://i.imgur.com/Wzjp8np.png)

## Features

- Overview of current projects
- Category cards, with current and future projects side
- Items can be easily deleted or moved over to other side
- Complete account control (change username/password, remove data/account)

> [View app](https://po.jneidel.com)

## Usage

Usage is detailed at [/help](https://po.jneidel.com/help).

## FAQ

**Q: What is this?**<br>
**A:** Projects-overview is a webapp to manage all of your current and future projects, not going into the projects themselves, but giving a high level overview over your current engagements.

**Q: Why would I use this?**<br>
**A:** Projects-overview is designed to help you minimize the number of active projects, which in turn helps you to actually finish those projects, as your focus is less spread out.

**Q: Why did you build this?**<br>
**A:** I read in one of [Cal Newport](http://calnewport.com/)s books that minimize my number of active projects will increase my focus in working on them. I then built this app to keep an overview over my active projects, having the overview discouraged my impulse to just start something and held me accountable to actually finishing projects. More on the history in the about section.

## Installation

If you want to run the webapp yourself follow the [installation instructions](https://github.com/jneidel/projects-overview/blob/latest/README.md) of the latest release.

## Public API

To access your current projects programmatically checkout the [API docs](https://github.com/jneidel/projects-overview/tree/master/routes/api-public.md).

## About

Based on the concept of minimizing the number of active projects to focus on getting those done, I built an non-interactive html site, listing my current projects, to stay mindful of how many active projects I had.
As editing the source every time I updated my projects wasn't very practical, I built this app from scratch to solve that problem and learn node/express/mongo in the process.

## Created using

![](https://i.imgur.com/52HU8Ua.png)

Ordered by importance: [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [Pug](https://pugjs.org/), [Webpack](https://webpack.js.org/), [Mocha](https://mochajs.org/), [Sinon](http://sinonjs.org/), [CircleCI](https://circleci.com/), [JSON Web Tokens](https://jwt.io/)

## License

MIT © [Jonathan Neidel](https://jneidel.com)
