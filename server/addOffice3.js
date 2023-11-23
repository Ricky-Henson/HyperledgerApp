/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2021-03-13 15:02:08
 * @modify date 2021-03-13 15:02:40
 * @desc Add admin of Office3. Execute node addOffice3.js to execute
 */

/* eslint-disable new-cap */
const { enrollAdminOffice3 } = require("./enrollAdmin-Office3");
const { ROLE_ADMIN } = require('./utils')
const redis = require("redis");

/**
 * @description enrol admin of office 3 in redis
 */
async function initRedis3() {
  redisUrl = "redis://127.0.0.1:6381";
  redisPassword = "office3lithium";
  redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);

  const adminDetails3 = {
    username:"office3admin",
    password: redisPassword,
    role: ROLE_ADMIN
  }

  redisClient.SET("office3admin", JSON.stringify(adminDetails3));
  console.log("Done");
  redisClient.QUIT();
  return;
}

/**
 * @description enrol admin of office 3
 */
async function main() {
  await enrollAdminOffice3();
  await initRedis3();
}

main();
