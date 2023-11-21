/* eslint-disable new-cap */
const fs = require("fs");
const { enrollAdminOffice1 } = require("./enrollAdmin-Office1");
const { enrollAdminOffice2 } = require("./enrollAdmin-Office2");
const { enrollRegisterUser } = require("./registerUser");
const { ROLE_ADMIN, ROLE_EMPLOYEE } = require("./utils");
const { createRedisClient } = require("./utils");
const network = require("../employee-asset-transfer/application-javascript/app.js");

const redis = require("redis");

/**
 * @description Enrolls and registers the employees in the initLedger as users.
 */
async function initLedger() {
  try {
    const jsonString = fs.readFileSync(
      "../employee-asset-transfer/chaincode/lib/initLedger.json"
    );
    const employees = JSON.parse(jsonString);
    let i = 0;
    // console.log(employees);
    for (i = 0; i < employees.length; i++) {
      const attr = {
        firstName: employees[i].firstName,
        lastName: employees[i].lastName,
        role: "employee",
      };
      const employeeOfficeId = employees[i].officeId;
      console.log(employeeOfficeId);
      const regex = /\d+/g;
      const matches = employeeOfficeId.match(regex);
      const integer = parseInt(matches[0]);
      await enrollRegisterUser(integer, "EID" + i, JSON.stringify(attr));

      // Connect to the Fabric network
      const networkObj = await network.connectToNetwork("EID" + i);

      // Create employee data object
      const employeeData = {
        employeeId: "EID" + i,
        firstName: attr.firstName,
        lastName: attr.lastName,
        password: employees[i].password,
        speciality: employees[i].speciality,
        officeId: integer,
      };
      const args = [JSON.stringify(employeeData)];

      // Create a Redis client and add the employee to Redis
      const redisClient = await createRedisClient(integer);

      const userDetails = {
        username: "EID" + i,
        password: employees[i].password,
        role: ROLE_EMPLOYEE // Assuming this is the role constant for employees
      };
      
      // Store the user details as a JSON string
      await redisClient.SET("EID" + i, JSON.stringify(userDetails));
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Init the redis db with the admins credentials
 */
async function initRedis() {
  let redisUrl = "redis://127.0.0.1:6379";
  let redisPassword = "office1lithium";
  let redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);

  const adminDetails1 = {
    username: "office1admin",
    password: redisPassword,
    role: ROLE_ADMIN // Assuming this is the role constant for admins
  };

  redisClient.SET("office1admin", JSON.stringify(adminDetails1));
  redisClient.QUIT();

  redisUrl = "redis://127.0.0.1:6380";
  redisPassword = "office2lithium";
  redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);

  const adminDetails2 = {
    username: "office2admin",
    password: redisPassword,
    role: ROLE_ADMIN
  };

  redisClient.SET("office2admin", JSON.stringify(adminDetails2));
  console.log("Done");
  redisClient.QUIT();
  return;
}

/**
 * @description Function to initialise the backend server, enrolls and regsiter the admins and initLedger employees.
 * @description Need not run this manually, included as a prestart in package.json
 */
async function main() {
  await enrollAdminOffice1();
  await enrollAdminOffice2();
  await initLedger();
  await initRedis();
}

main();
