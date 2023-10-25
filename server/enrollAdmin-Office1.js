/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 13:26:42
 * @modify date 2021-01-30 12:21:44
 * @desc Execute this file to create and enroll an admin at Office 1.
 */

const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  enrollAdmin,
} = require("../employee-asset-transfer/application-javascript/CAUtil.js");
const {
  buildCCPOffice1,
  buildWallet,
} = require("../employee-asset-transfer/application-javascript/AppUtil.js");
const adminOffice1 = "office1admin";
const adminOffice1Passwd = "office1lithium";

const mspOffice1 = "office1MSP";
const walletPath = path.join(
  __dirname,
  "../employee-asset-transfer/application-javascript/wallet"
);

// Temporary DB
// const {addUser} = require('./Office1LocalDB.js');

/**
 * @description This functions enrolls the admin of Office 1
 */
exports.enrollAdminOffice1 = async function () {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOffice1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.office1.lithium.com"
    );

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // to be executed and only once per office. Which enrolls admin and creates admin in the wallet
    await enrollAdmin(
      caClient,
      wallet,
      mspOffice1,
      adminOffice1,
      adminOffice1Passwd
    );

    console.log(
      "msg: Successfully enrolled admin user " +
        adminOffice1 +
        " and imported it into the wallet"
    );
  } catch (error) {
    console.error(
      `Failed to enroll admin user ' + ${adminOffice1} + : ${error}`
    );
    process.exit(1);
  }
};
