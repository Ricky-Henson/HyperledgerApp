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
  const officeId = parseInt(req.params.officeId);
  // Set up and connect to Fabric Gateway
  const userId =
    officeId === 1
      ? "office1admin"
      : officeId === 2
      ? "office2admin"
      : "office3admin";
  const employeeId = req.params.employeeId;
  const networkObj = await network.connectToNetwork(userId);
  // Use the gateway and identity service to get all users enrolled by the CA
  const response = await network.getAllEmployeesByOfficeId(
    networkObj,
    officeId
  );
  // Filter the result using the employeeId
  response.error
    ? res.status(500).send(response.error)
    : res.status(200).send(
        response.filter(function (response) {
          return response.id === employeeId;
        })[0]
      );
};

// exports.getAllEmployees = async (req, res) => {
//   const userRole = req.headers.role;
//   await validateRole([ROLE_EMPLOYEE], userRole, res);
//   const networkObj = await network.connectToNetwork(req.headers.username);
//   const response = await network.getAllEmployees(networkObj);
//   res.status(200).send(response);
// }

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
