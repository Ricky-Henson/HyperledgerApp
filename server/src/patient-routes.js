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
  ROLE_PATIENT,
  capitalize,
  getMessage,
  validateRole,
} = require("../utils.js");
const network = require("../../patient-asset-transfer/application-javascript/app.js");

/**
 * @param  {Request} req Role in the header and patientId in the url
 * @param  {Response} res Body consists of json of the patient object
 * @description This method retrives an existing patient from the ledger
 */
exports.getPatientById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_EMPLOYEE, ROLE_PATIENT], userRole, res);
  const patientId = req.params.patientId;
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    true,
    capitalize(userRole) + "Contract:readPatient",
    patientId
  );
  response.error
    ? res.status(400).send(response.error)
    : res.status(200).send(JSON.parse(response));
};

/**
 * @param  {Request} req Body must be a json, role in the header and patientId in the url
 * @param  {Response} res A 200 response if patient is updated successfully else a 500 response with s simple message json
 * @description  This method updates an existing patient personal details. This method can be executed only by the patient.
 */
exports.updatePatientPersonalDetails = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_PATIENT], userRole, res);
  // The request present in the body is converted into a single json string
  let args = req.body;
  args.patientId = req.params.patientId;
  args.changedBy = req.params.patientId;
  args = [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    false,
    capitalize(userRole) + "Contract:updatePatientPersonalDetails",
    args
  );
  response.error
    ? res.status(500).send(response.error)
    : res.status(200).send(getMessage(false, "Successfully Updated Patient."));
};

/**
 * @param  {Request} req Role in the header and patientId in the url
 * @param  {Response} res Body consists of json of history of the patient object consists of time stamps and patient object
 * @description Retrives the history transaction of an asset(Patient) in the ledger
 */
exports.getPatientHistoryById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_EMPLOYEE, ROLE_PATIENT], userRole, res);
  const patientId = req.params.patientId;
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    true,
    capitalize(userRole) + "Contract:getPatientHistory",
    patientId
  );
  const parsedResponse = await JSON.parse(response);
  response.error
    ? res.status(400).send(response.error)
    : res.status(200).send(parsedResponse);
};

/**
 * @param  {Request} req Role in the header and officeId in the url
 * @param  {Response} res 200 response with array of all employees else 500 with the error message
 * @description Get all the employees of the mentioned officeId
 */
exports.getEmployeesByOfficeId = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_PATIENT, ROLE_ADMIN], userRole, res);
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
/**
 * @param  {Request} req Role in the header. patientId, employeeId in the url
 * @param  {Response} res 200 response if access was granted to the employee else 500 with the error message
 * @description Patient grants access to the employee.
 */
exports.grantAccessToEmployee = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_PATIENT], userRole, res);
  const patientId = req.params.patientId;
  const employeeId = req.params.employeeId;
  let args = { patientId: patientId, employeeId: employeeId };
  args = [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    false,
    capitalize(userRole) + "Contract:grantAccessToEmployee",
    args
  );
  response.error
    ? res.status(500).send(response.error)
    : res
        .status(200)
        .send(getMessage(false, `Access granted to ${employeeId}`));
};
/**
 * @param  {Request} req Role in the header. patientId, employeeId in the url
 * @param  {Response} res 200 response if access was revoked from the employee else 500 with the error message
 * @description Patient revokes access from the employee.
 */
exports.revokeAccessFromEmployee = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_PATIENT], userRole, res);
  const patientId = req.params.patientId;
  const employeeId = req.params.employeeId;
  let args = { patientId: patientId, employeeId: employeeId };
  args = [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(
    networkObj,
    false,
    capitalize(userRole) + "Contract:revokeAccessFromEmployee",
    args
  );
  response.error
    ? res.status(500).send(response.error)
    : res
        .status(200)
        .send(getMessage(false, `Access revoked from ${employeeId}`));
};
