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
const fs = require("fs");
const path = require("path");

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

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, path.join(__dirname, "../upload")); // ensure this directory exists
    console.log("Dir path:", path.join(__dirname, "../upload"));
  },
  filename: function (req, file, cb) {
    const receiverID = req.body.receiverID;
    const senderID = req.body.senderID;
    const newFileName = `${receiverID}_${senderID}_${file.originalname}`;

    cb(null, newFileName);
    // cb(null, Date.now() + path.extname(file.originalname)); // prefix the filename with a timestamp
  },
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
  let { username, password, officeId, role } = req.body;
  officeId = parseInt(officeId);

  // Create a Redis client based on the office ID
  const redisClient = await createRedisClient(officeId);

  // Retrieve user details from Redis
  const userString = await redisClient.get(username);
  redisClient.quit();

  if (userString) {
    const userDetails = JSON.parse(userString);

    // Check if the password and role match
    if (userDetails.password === password && userDetails.role === role) {
      // Generate an access token
      const accessToken = generateAccessToken(username, role);
      const refreshToken = jwt.sign(
        { username: username, role: role },
        refreshSecretToken
      );
      refreshTokens.push(refreshToken);
      res.status(200).json({ accessToken, refreshToken });
    } else {
      res.status(401).send({ error: "Invalid credentials or role" });
    }
  } else {
    res.status(404).send({ error: "User not found" });
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
app.get("/admin/files", authenticateJWT, (req, res) => {
  if (req.user.role !== ROLE_ADMIN) {
    return res
      .status(403)
      .send({
        error: "Unauthorized request: Only admin can access this route",
      });
  }
  const directoryPath = path.join(__dirname, "../upload");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Unable to scan directory:", err);
      return res.status(500).send("Error reading directory contents");
    }

    res.status(200).send(files.map((file) => ({ name: file })));
  });
});
app.delete("/admin/files/:fileName", authenticateJWT, adminRoutes.deleteFile);
// app.get("/employees/_all", authenticateJWT, adminRoutes.getAllEmployees);
// //////////////////////////////// Employee Routes //////////////////////////////////////
app.get(
  "/employee/:employeeId([a-zA-Z0-9]+)",
  authenticateJWT,
  employeeRoutes.getEmployeeById
);
app.get("/employee/_all", authenticateJWT, employeeRoutes.getAllEmployees);

app.post(
  "/employee/:employeeId([a-zA-Z0-9]+)/upload",
  authenticateJWT,
  upload.single("file"),
  employeeRoutes.uploadFile,
  (req, res) => {
    console.log(req.file);
    res.status(200).send({ message: "File uploaded successfully!" });
  }
);

app.use(
  "/employee/:employeeId([a-zA-Z0-9]+)/upload",
  express.static(path.join(__dirname, "../upload"))
);

app.get(
  "/employee/:employeeId([a-zA-Z0-9]+)/download",
  authenticateJWT,
  (req, res) => {
    const employeeId = req.params.employeeId;
    console.log("Requested employeeId for file listing:", employeeId);

    // Construct the path to where the files are stored
    const directoryPath = path.join(__dirname, "../upload");

    // Read the directory
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error("Unable to scan directory:", err);
        return res.status(500).send("Error reading directory contents");
      }

      // Filter files that start with the employeeId
      const filteredFiles = files
        .filter((file) => file.startsWith(employeeId + "_"))
        .map((file) => ({ name: file }));

      // console.log('Filtered files:', filteredFiles); // For debugging

      res.status(200).send(filteredFiles);
    });
  }
);

app.get(
  "/employee/:employeeId([a-zA-Z0-9]+)/download/:fileName",
  authenticateJWT,
  (req, res) => {
    const employeeId = req.params.employeeId;
    const fileName = req.params.fileName;
    console.log(
      `Requested file download for employeeId: ${employeeId}, fileName: ${fileName}`
    );

    // Construct the path to where the file is stored
    const directoryPath = path.join(__dirname, "../upload");

    // Create the full path to the file
    const filePath = path.join(directoryPath, fileName);

    // Check if the file exists and send it to the client
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // The file does not exist
        return res.status(404).send("File not found");
      } else {
        // The file exists, send it
        res.download(filePath, fileName, (downloadError) => {
          if (downloadError) {
            // Handle any errors during the download
            console.error("Error downloading the file:", downloadError);
            return res.status(500).send("Error downloading the file");
          }
          // If no error, file download is a success
        });
      }
    });
  }
);
