<h1 align="center">
    <img src="https://raw.githubusercontent.com/noblox/noblox.js-server/master/img/noblox.js-server-logo.png" alt="noblox.js-server" width="400"/>
    <br>
</h1>

<h4 align="center">A RESTful API using <a href="https://github.com/suufi/noblox.js">noblox.js</a> and <a href="https://koajs.com/">Koa</a>.</h4>

<p align="center">
    <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-blue.svg?style=flat-square" alt="JavaScript Style Guide"/></a>
    <a href="https://discord.gg/R5GVSyTVGv"><img src="https://img.shields.io/badge/discord-noblox.js-blue.svg?style=flat-square" alt="noblox.js Discord"/></a>
    <a href="https://travis-ci.org/noblox/noblox.js-server"><img src="https://img.shields.io/travis/noblox/noblox.js-server/master.svg?style=flat-square" alt="Travis Build Status"/></a></a>
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#prerequisites">Prerequisites</a> •
  <a href="#configuration">Configuration</a> •
  <a href="https://github.com/suufi/noblox.js/tree/master/examples">Examples</a> •
  <a href="https://www.youtube.com/playlist?list=PLEW4K4VqMUb_VMA3Yp9LI4gReRyVWGTnU">YouTube Series</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## About
This repository hosts the code for a working [RESTful API](https://restfulapi.net/) that utilizes Koa.js to expose [noblox.js](https://github.com/suufi/noblox.js) functions on the internet. Essentially, with this project, you can host it on your own server and interact with the Roblox API through your own Roblox game. 

## Prerequisites

- [**node.js**](https://nodejs.org/en/download/current/)
- a virtual private server (VPS)
    - To have your code running on a 24/7 basis, you need to use a VPS. We recommend using DigitalOcean for its ease of use and. [This referral link](https://m.do.co/c/14822e4e2d63) provides you with a $100 credit which can be used over 60 days. Other options include Amazon Web Services, Microsoft Azure, and Google Compute Engine. 
    
## Configuration
### server.js
After installing this repository on your server, start by creating an `.env` file to house your configuration settings. You can duplicate the `.env.sample` file and fill in the missing details. 
- Unless you know what you are doing, leave the `PORT` number the same.
- `MAX_RANK` refers to the highest rank (1-254) the logged in account is allowed to promote users to.
- `API_TOKEN` refers to a secret key to secure your RESTful API to avoid your API being accessed by unauthorized users. It is best to generate a key that isn't easy to guess. You can use [this](https://randomkeygen.com/) website to use an automatically generated key. You need not memorize this key.
- `COOKIE` refers to the cookie of the logged-in user account the API will execute functions from. To find your cookie, please read [this](https://github.com/suufi/noblox.js#getting-your-cookie-chrome).

After your file is configured, use a process manager like [pm2](https://pm2.keymetrics.io/) to have your script run 24/7. We do not provide support for VPS, network, and domain configuration.


### noblox.lua
If you plan on using the provided Lua module (ModuleScript) in this project, please do the following:
- Place the script only in `ServerScriptService`.
- Update the `DOMAIN` value in `CONFIGURATION` to reflect your server's IP address/domain & port. (e.g. if your domain name is noblox.io and this is running on port 3000, your value here would be `https://noblox.io:3000`)
- Update the `API_TOKEN` value in `CONFIGURATION` so that it matches what you put earlier in `server.js`.
- Optional: provide a `DEFAULT_GROUP_ID` to default to having noblox.js functions run on a single group when not specified.

## Credits

* [suufi](https://github.com/suufi) - Lead maintainer

## License

MIT