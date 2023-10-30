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
  capitalize,
  getMessage,
  validateRole,
  createRedisClient,
} = require("../utils.js");
const network = require("../../employee-asset-transfer/application-javascript/app.js");

// exports.createPatient = async (req, res) => {
//   // User role from the request header is validated
//   const userRole = req.headers.role;
//   await validateRole([ROLE_ADMIN], userRole, res);
//   // Set up and connect to Fabric Gateway using the username in header
//   const networkObj = await network.connectToNetwork(req.headers.username);

//   // Generally we create patient id by ourself so if patient id is not present in the request then fetch last id
//   // from ledger and increment it by one. Since we follow patient id pattern as "PID0", "PID1", ...
//   // 'slice' method omits first three letters and take number
//   if (!('patientId' in req.body) || req.body.patientId === null || req.body.patientId === '') {
//     const lastId = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:getLatestPatientId');
//     req.body.patientId = 'PID' + (parseInt(lastId.slice(3)) + 1);
//   }

//   // When password is not provided in the request while creating a patient record.
//   if (!('password' in req.body) || req.body.password === null || req.body.password === '') {
//     req.body.password = Math.random().toString(36).slice(-8);
//   }

//   req.body.changedBy = req.headers.username;

//   // console.log("\n\nI am HERE\n\n");
//   // console.log(req.body.patientId);
//   // console.log(req.body.password);
//   // The request present in the body is converted into a single json string
//   const data = JSON.stringify(req.body);
//   const args = [data];
//   // Invoke the smart contract function
//   const createPatientRes = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:createPatient', args);
//   if (createPatientRes.error) {
//     res.status(400).send(response.error);
//   }
//   // console.log(req.headers.username + "\n");
  
//   // Enrol and register the user with the CA and adds the user to the wallet.
//   const userData = JSON.stringify({officeId: (req.headers.username).slice(6, 7), userId: req.body.patientId});
//   // console.log(userData + "\n");
//   const registerUserRes = await network.registerUser(userData);
//   // console.log(createPatientRes + "\n");
//   if (registerUserRes.error) {
//     await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:deletePatient', req.body.patientId);
//     res.send(registerUserRes.error);
//   }

//   res.status(201).send(getMessage(false, 'Successfully registered Patient.', req.body.patientId, req.body.password));
// };


/**
 * @param  {Request} req Body must be a employee json and role in the header
 * @param  {Response} res 201 response if asset is created else 400 with a simple json message
 * @description Creates a employee as an user adds the employee to the wallet
 */
exports.createEmployee = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  let { officeId, username, password } = req.body;
  officeId = parseInt(officeId);

  await validateRole([ROLE_ADMIN], userRole, res);

  req.body.userId = username;
  req.body.role = ROLE_EMPLOYEE;
  req.body = JSON.stringify(req.body);
  const args = [req.body];
  // Create a redis client and add the employee to redis
  const redisClient = createRedisClient(officeId);
  (await redisClient).SET(username, password);
  // Enrol and register the user with the CA and adds the user to the wallet.
  const response = await network.registerUser(args);
  if (response.error) {
    (await redisClient).DEL(username);
    res.status(400).send(response.error);
  }
  res.status(201).send(getMessage(false, response, username, password));
};

exports.createEmployee = async (req, res) => {
  try {
    // Validate user role
    const userRole = req.headers.role;
    await validateRole([ROLE_ADMIN], userRole, res);

    // Connect to the Fabric network
    const networkObj = await network.connectToNetwork(req.headers.username);
    officeId = parseInt(officeId);
    // Destructure and validate fields from the request body
    let { officeId, username, password, firstName, lastName, speciality } = req.body;
    if (!username || !password || !officeId) {
      return res.status(400).send('Missing required fields');
    }

    // Create employee data object
    const employeeData = {
      EmployeeId: username,
      firstName: firstName,
      lastName: lastName,
      password: password,
      speciality: speciality,
      officeId: officeId  // Include the officeId
    };
    const args = [JSON.stringify(employeeData)];
    console.log("Smart Contract args:", args);   

    // Invoke the createEmployee smart contract function
    const createEmployeeRes = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:createEmployee', args);
    if (createEmployeeRes.error) {
      return res.status(400).send(createEmployeeRes.error);
    }
    // Register the new employee user
    const userData = JSON.stringify({officeId, userId: employeeData.EmployeeId});
    const registerUserRes = await network.registerUser(userData);
    if (registerUserRes.error) {
      await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:deleteEmployee', [employeeData.EmployeeId]);
      return res.status(400).send(registerUserRes.error);
    }

    return res.status(201).send(getMessage(false, 'Successfully registered Employee.', employeeData.EmployeeId, password));

  // req.body.userId = username;
  // req.body.role = ROLE_EMPLOYEE;
  // req.body = JSON.stringify(req.body);
  // const args = [req.body];
  // // Create a redis client and add the employee to redis
  // const redisClient = createRedisClient(officeId);
  // (await redisClient).SET(username, password);
  // // Enrol and register the user with the CA and adds the user to the wallet.
  // const response = await network.registerUser(args);
  // if (response.error) {
  //   (await redisClient).DEL(username);
  //   res.status(400).send(response.error);
  // }
  // res.status(201).send(getMessage(false, response, username, password)); 
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send('Internal Server Error');
  }
};

