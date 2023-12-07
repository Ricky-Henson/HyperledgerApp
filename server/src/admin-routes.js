/* eslint-disable new-cap */
/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2021-01-27 12:47:10
 * @modify date 2021-02-03 23:42:25
 * @desc Admin specific methods - API documentation in http://localhost:3002/ swagger editor.
 */

// Bring common classes into scope, and Fabric SDK network class
const {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  capitalize,
  getMessage,
  validateRole,
  createRedisClient,
} = require("../utils.js");
const network = require("../../employee-asset-transfer/application-javascript/app.js");
const path = require("path");
const fs = require("fs").promises;
const crypto = require("crypto");
/**
 * @param  {Request} req Body must be a employee json and role in the header
 * @param  {Response} res 201 response if asset is created else 400 with a simple json message
 * @description Creates a employee as an user adds the employee to the wallet
 */

exports.getAllEmployees = async (req, res) => {
  // Validate user role
  const userRole = req.headers.role;
  await validateRole([ROLE_ADMIN], userRole, res);

  // Connect to the Fabric network
  const networkObj = await network.connectToNetwork(req.headers.username);

  // Invoke the getAllEmployees smart contract function
  const response = await network.invoke(
    networkObj,
    true,
    capitalize(userRole) + "Contract:queryAllEmployees",
    userRole === ROLE_EMPLOYEE ? req.headers.username : ""
  );
  const parsedResponse = await JSON.parse(response);
  return res.status(200).send(parsedResponse);
};

exports.createEmployee = async (req, res) => {
  try {
    // Validate user role
    const userRole = req.headers.role;
    await validateRole([ROLE_ADMIN], userRole, res);

    // Connect to the Fabric network
    const networkObj = await network.connectToNetwork(req.headers.username);

    // Destructure and validate fields from the request body
    let { officeId, username, password, firstName, lastName, speciality } =
      req.body;
    officeId = parseInt(officeId);
    if (!username || !password || !officeId) {
      return res.status(400).send("Missing required fields");
    }

    // Create employee data object
    const employeeData = {
      employeeId: username,
      firstName,
      lastName,
      password,
      speciality,
      officeId,
    };
    const args = [JSON.stringify(employeeData)];

    // Invoke the createEmployee smart contract function
    const createEmployeeRes = await network.invoke(
      networkObj,
      false,
      capitalize(userRole) + "Contract:createEmployee",
      args
    );
    if (createEmployeeRes.error) {
      return res.status(400).send(createEmployeeRes.error);
    }

    // Create a Redis client and add the employee to Redis
    const redisClient = await createRedisClient(officeId);

    // Create user details object to store in Redis
    const userDetails = {
      username: employeeData.employeeId,
      password: employeeData.password,
      role: ROLE_EMPLOYEE // Assuming this is the role constant for employees
    };
        
    await redisClient.SET(employeeData.employeeId, JSON.stringify(userDetails));

    // Register the new employee user
    const userData = JSON.stringify({
      officeId,
      userId: employeeData.employeeId,
    });
    const registerUserRes = await network.registerUser(userData);
    if (registerUserRes.error) {
      await redisClient.DEL(username);
      await network.invoke(
        networkObj,
        false,
        capitalize(userRole) + "Contract:deleteEmployee",
        [employeeData.employeeId]
      );
      return res.status(400).send(registerUserRes.error);
    }

    return res
      .status(201)
      .send(
        getMessage(
          false,
          "Successfully registered Employee.",
          employeeData.employeeId,
          password
        )
      );
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

exports.deleteFile = async (req, res) => {
  try {
    // Validate user role
    const userRole = req.headers.role;
    await validateRole([ROLE_ADMIN], userRole, res);

    // Get the file name from the request
    const fileName = req.params.fileName;
    console.log("fileName in admin-route:" + fileName);

    // Compute the path to the file
    const filePath = path.join(__dirname, "../upload", fileName);

    // Read the file data
    const fileData = await fs.readFile(filePath);
    // console.log("fileData in admin-route:", fileData.toString());

    // Combine the originalname and the file data
    const combinedData = fileName + fileData.toString();

    // Compute the hash of the combined data
    const fileHash = crypto
      .createHash("sha256")
      .update(combinedData)
      .digest("hex");
    console.log("fileHash in admin-route:", fileHash);

    const args = [JSON.stringify(fileHash)];
    // Connect to Fabric Gateway
    const networkObj = await network.connectToNetwork(req.headers.username);

    // Invoke the smart contract function to delete the file
    const response = await network.invoke(
      networkObj,
      false,
      "AdminContract:deleteFile",
      args
    );

    // Check if the chaincode returned an error
    if (response.error) {
      // Return an error response
      return res.status(500).send({ message: "Error in chaincode execution" });
    }

    // If there's no error in the chaincode execution, delete the file
    await fs.unlink(filePath);

    res.status(200).send(response);
  } catch (error) {
    console.error("Error in deleteFile:", error);
    res.status(500).send({ message: "Error processing file deletion" });
  }
};

