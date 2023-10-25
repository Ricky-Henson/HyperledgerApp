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
  // console.log(officeId);

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
