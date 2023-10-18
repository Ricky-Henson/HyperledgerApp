/* eslint-disable new-cap */
const fs = require("fs");
const { enrollAdminOffice1 } = require("./enrollAdmin-Office1");
const { enrollAdminOffice2 } = require("./enrollAdmin-Office2");
const { enrollRegisterUser } = require("./registerUser");
const { createRedisClient } = require("./utils");

const redis = require("redis");

/**
 * @description Enrolls and registers the patients in the initLedger as users.
 */
async function initLedger() {
  try {
    const jsonString = fs.readFileSync(
      "../patient-asset-transfer/chaincode/lib/initLedger.json"
    );
    const patients = JSON.parse(jsonString);
    let i = 0;
    for (i = 0; i < patients.length; i++) {
      const attr = {
        firstName: patients[i].firstName,
        lastName: patients[i].lastName,
        role: "patient",
      };
      await enrollRegisterUser("1", "PID" + i, JSON.stringify(attr));
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
  redisClient.SET("office1admin", redisPassword);
  redisClient.QUIT();

  redisUrl = "redis://127.0.0.1:6380";
  redisPassword = "office2lithium";
  redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);
  redisClient.SET("office2admin", redisPassword);
  console.log("Done");
  redisClient.QUIT();
  return;
}

/**
 * @description Create doctors in both organizations based on the initDoctors JSON
 */
async function enrollAndRegisterDoctors() {
  try {
    const jsonString = fs.readFileSync("./initDoctors.json");
    const doctors = JSON.parse(jsonString);
    for (let i = 0; i < doctors.length; i++) {
      const attr = {
        firstName: doctors[i].firstName,
        lastName: doctors[i].lastName,
        role: "doctor",
        speciality: doctors[i].speciality,
      };
      // Create a redis client and add the doctor to redis
      doctors[i].officeId = parseInt(doctors[i].officeId);
      const redisClient = createRedisClient(doctors[i].officeId);
      (await redisClient).SET(
        "OFFICE" + doctors[i].officeId + "-" + "DOC" + i,
        "password"
      );
      await enrollRegisterUser(
        doctors[i].officeId,
        "OFFICE" + doctors[i].officeId + "-" + "DOC" + i,
        JSON.stringify(attr)
      );
      (await redisClient).QUIT();
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * @description Function to initialise the backend server, enrolls and regsiter the admins and initLedger patients.
 * @description Need not run this manually, included as a prestart in package.json
 */
async function main() {
  await enrollAdminOffice1();
  await enrollAdminOffice2();
  await initLedger();
  await initRedis();
  await enrollAndRegisterDoctors();
}

main();
