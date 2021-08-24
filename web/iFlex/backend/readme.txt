
Start a new backend from the ground up. Open the git-bash (from C:/Program Files/Git/git-bash.exe)

1. Create an empty package.json file:
npm init -y

2. Install all necessary Nodejs packages (one at a time):
npm install express
npm install bcrypt
npm install body-parser
npm install jsonwebtoken
npm install mongoose
npm install morgan
npm install xml2js
npm install --save-dev nodemon

package.json:
...
  "dependencies": {
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.13.8",
    "morgan": "^1.10.0",
    "xml2js": "^0.4.23"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
...






