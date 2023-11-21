/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2021-01-27 12:44:51
 * @modify date 2021-03-14 21:24:41
 * @desc Employee specific methods - API documentation in http://localhost:3002/ swagger editor.
 */

// Bring common classes into scope, and Fabric SDK network class
const {
  ROLE_EMPLOYEE,
  ROLE_ADMIN,
  capitalize,
  getMessage,
  validateRole,
} = require("../utils.js");
const network = require("../../employee-asset-transfer/application-javascript/app.js");

/**
 * @param  {Request} req role in the header and officeId, employeeId in the url
 * @param  {Response} res A 200 response if employee is present else a 500 response with a error json
 * @description This method retrives an existing employee
 */

exports.getEmployeeById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_EMPLOYEE], userRole, res);
  const employeeId = req.params.employeeId;
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    true,
    capitalize(userRole) + "Contract:readEmployee",
    employeeId
  );
  response.error
    ? res.status(400).send(response.error)
    : res.status(200).send(JSON.parse(response));
};

const crypto = require('crypto');
const fs = require('fs').promises;

exports.uploadFile = async (req, res) => {
  try {
    // Validate user role
    const userRole = req.headers.role;
    await validateRole([ROLE_EMPLOYEE], userRole, res);

    // Validate and process the file
    if (!req.file || !req.file.path) {
      return res.status(400).send({ message: 'No file provided' });
    }

    const fileData = await fs.readFile(req.file.path);
    console.log("fileData in employee-route:", fileData);
    const fileHash = crypto.createHash('sha256').update(fileData).digest('hex');
    console.log("fileHash in employee-route:", fileHash);
    const agrs = [JSON.stringify(fileHash)];
    // Connect to Fabric Gateway
    const networkObj = await network.connectToNetwork(req.headers.username);
    const response = await network.invoke(networkObj, false, capitalize(userRole) + "Contract:uploadFile", agrs);
    res.status(200).send(response);
  } catch (error) {
    console.error('Error in uploadFile:', error);
    res.status(500).send({ message: 'Error processing file upload' });
  }
};

exports.getAllEmployees = async (req, res) => {
  // User role from the request header is validated for both employee and admin roles
  const userRole = req.headers.role;
  await validateRole([ROLE_EMPLOYEE, ROLE_ADMIN], userRole, res); // Include ADMIN_ROLE

  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req.headers.username);

  // Determine the contract function to invoke based on the user role
  let contractFunction = "";
  if (userRole === ROLE_EMPLOYEE) {
    contractFunction = capitalize(userRole) + "Contract:queryAllEmployees";
  } else if (userRole === ROLE_ADMIN) {
    contractFunction = capitalize(userRole) + "Contract:queryAllEmployees";
  }

  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    true,
    contractFunction,
    userRole === ROLE_EMPLOYEE ? req.headers.username : ""
  );

  const parsedResponse = await JSON.parse(response);
  res.status(200).send(parsedResponse);
};
