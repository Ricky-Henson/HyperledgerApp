/* eslint-disable new-cap */
/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 11:31:42
 * @modify date 2021-03-14 21:12:15
 * @desc NodeJS APIs to interact with the fabric network.
 * @desc Look into API docs for the documentation of the routes
 */

// Classes for Node Express
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const jwtSecretToken = "password";
const refreshSecretToken = "refreshpassword";
let refreshTokens = [];

// const https = require('https');
// const fs = require('fs');
// const path = require('path');

// Express Application init
const app = express();
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

app.listen(3001, () => console.log("Backend server running on 3001"));

// Bring key classes into scope
const employeeRoutes = require("./employee-routes");
const adminRoutes = require("./admin-routes");
const { ROLE_EMPLOYEE, ROLE_ADMIN, CHANGE_TMP_PASSWORD } = require("../utils");
const { createRedisClient, capitalize, getMessage } = require("../utils");
const network = require("../../employee-asset-transfer/application-javascript/app.js");

// TODO: We can start the server with https so encryption will be done for the data transferred ove the network
// TODO: followed this link https://timonweb.com/javascript/running-expressjs-server-over-https/ to create certificate and added in the code
/* https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert')),
}, app)
  .listen(3001, function() {
    console.log('Backend server running on 3001! Go to https://localhost:3001/');
  });*/

// Multer setup for file storage
const path = require("path");

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, path.join(__dirname, "upload")); // ensure this directory exists
    console.log("Dir path:", path.join(__dirname, "upload"));
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // prefix the filename with a timestamp
  }
});

// Multer upload
const upload = multer({ storage: storage });


const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (token === "" || token === "null") {
      return res.status(401).send("Unauthorized request: Token is missing");
    }
    jwt.verify(token, jwtSecretToken, (err, user) => {
      if (err) {
        return res
          .status(403)
          .send("Unauthorized request: Wrong or expired token found");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).send("Unauthorized request: Token is missing");
  }
};

/**
 * @description Generates a new accessToken
 */
function generateAccessToken(username, role) {
  return jwt.sign({ username: username, role: role }, jwtSecretToken, {
    expiresIn: "5m",
  });
}

/**
 * @description Login and create a session with and add two variables to the session
 */
app.post("/login", async (req, res) => {
  // Read username and password from request body
  let { username, password, officeId, role } = req.body;
  officeId = parseInt(officeId);
  let user;
  // using get instead of redis GET for async
  if (role === ROLE_EMPLOYEE || role === ROLE_ADMIN) {
    // Create a redis client based on the office ID
    const redisClient = await createRedisClient(officeId);
    // Async get
    const value = await redisClient.get(username);
    // comparing passwords
    user = value === password;
    redisClient.quit();
  }

  if (user) {
    // Generate an access token
    const accessToken = generateAccessToken(username, role);
    const refreshToken = jwt.sign(
      { username: username, role: role },
      refreshSecretToken
    );
    refreshTokens.push(refreshToken);
    // Once the password is matched a session is created with the username and password
    res.status(200);
    res.json({
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).send({ error: "Username or password incorrect!" });
  }
});

/**
 * @description Creates a new accessToken when refreshToken is passed in post request
 */
app.post("/token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, refreshSecretToken, (err, username) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = generateAccessToken({
      username: username,
      role: req.headers.role,
    });
    res.json({
      accessToken,
    });
  });
});

/**
 * @description Logout to remove refreshTokens
 */
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.headers.token);
  res.sendStatus(204);
});


// //////////////////////////////// Admin Routes //////////////////////////////////////
app.post("/employee/register", authenticateJWT, adminRoutes.createEmployee);
// app.get("/employees/_all", authenticateJWT, adminRoutes.getAllEmployees);
// //////////////////////////////// Employee Routes //////////////////////////////////////
app.get(
  "/employee/:employeeId([a-zA-Z0-9]+)",
  authenticateJWT,
  employeeRoutes.getEmployeeById
);
app.get(
  "/employee/_all", authenticateJWT, employeeRoutes.getAllEmployees);
  app.post(
    "/employee/:employeeId([a-zA-Z0-9]+)/upload",
    authenticateJWT,
    (req, res, next) => {
      console.log("Upload route hit"); // Log when route is hit
      next(); // Pass control to the next middleware
    },
    upload.single("file"),
    (req, res) => {
      console.log("Multer middleware processed the file");
  
      // If the file wasn't uploaded, multer won't process the request further.
      if (!req.file) {
        console.log("No file in the request");
        return res.status(400).send('No file uploaded!');
      }
  
      const filePath = path.join(__dirname, "upload", req.file.filename);
      console.log("File path:", filePath);
  
      // Check if file already exists
      if (fs.existsSync(filePath)) {
        console.log("File already exists at path:", filePath);
        return res.status(409).send({ message: 'File already exists!' }); // 409 Conflict
      }
  
      // If you've reached this point, the file is uploaded and doesn't exist yet
      console.log("File is new and uploaded to path:", filePath);
      res.status(200).send({ message: 'File uploaded successfully!', file: req.file });
    }
  );
  