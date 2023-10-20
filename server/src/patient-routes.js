/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2021-01-27 12:44:37
 * @modify date 2021-02-09 11:56:08
 * @desc Paient specific methods - API documentation in http://localhost:3002/ swagger editor.
 */

// Bring common classes into scope, and Fabric SDK network class
const {
  ROLE_ADMIN,
  ROLE_EMPLOYEE,
  capitalize,
  getMessage,
  validateRole,
} = require("../utils.js");
const network = require("../../patient-asset-transfer/application-javascript/app.js");

/**
 * @param  {Request} req Role in the header and officeId in the url
 * @param  {Response} res 200 response with array of all employees else 500 with the error message
 * @description Get all the employees of the mentioned officeId
 */
exports.getEmployeesByOfficeId = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_ADMIN], userRole, res);
  const officeId = parseInt(req.params.officeId);
  // Set up and connect to Fabric Gateway
  userId =
    officeId === 1
      ? "office1admin"
      : officeId === 2
      ? "office2admin"
      : "office3admin";
  const networkObj = await network.connectToNetwork(userId);
  // Use the gateway and identity service to get all users enrolled by the CA
  const response = await network.getAllEmployeesByOfficeId(
    networkObj,
    officeId
  );
  response.error
    ? res.status(500).send(response.error)
    : res.status(200).send(response);
};

