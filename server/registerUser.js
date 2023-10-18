/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 13:26:42
 * @modify date 2021-03-13 15:04:01
 * @desc This file creates a user named 'appUser' at Office 1. (Just for testing. Use the API to create a patient)
 */

const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
} = require("../patient-asset-transfer/application-javascript/CAUtil.js");
const walletPath = path.join(
  __dirname,
  "/../patient-asset-transfer/application-javascript/wallet"
);
const {
  buildCCPOffice1,
  buildCCPOffice2,
  buildWallet,
  buildCCPOffice3,
} = require("../patient-asset-transfer/application-javascript/AppUtil.js");
let mspOrg;
let adminUserId;
let caClient;

/**
 * @param {String} officeId
 * @param {string} userId
 * @param {String} attributes
 */
exports.enrollRegisterUser = async function (officeId, userId, attributes) {
  try {
    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);
    officeId = parseInt(officeId);

    if (officeId === 1) {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPOffice1();

      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      caClient = buildCAClient(FabricCAServices, ccp, "ca.office1.lithium.com");

      mspOrg = "office1MSP";
      adminUserId = "office1admin";
    } else if (officeId === 2) {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPOffice2();

      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      caClient = buildCAClient(FabricCAServices, ccp, "ca.office2.lithium.com");

      mspOrg = "office2MSP";
      adminUserId = "office2admin";
    } else if (officeId === 3) {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPOffice3();

      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      caClient = buildCAClient(FabricCAServices, ccp, "ca.office3.lithium.com");

      mspOrg = "office3MSP";
      adminUserId = "office3admin";
    }
    // enrolls users to Office 1 and adds the user to the wallet
    await registerAndEnrollUser(
      caClient,
      wallet,
      mspOrg,
      userId,
      adminUserId,
      attributes
    );
    console.log(
      "msg: Successfully enrolled user " +
        userId +
        " and imported it into the wallet"
    );
  } catch (error) {
    console.error(`Failed to register user "${userId}": ${error}`);
    process.exit(1);
  }
};
