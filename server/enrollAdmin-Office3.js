/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 13:26:42
 * @modify date 2021-03-13 15:03:43
 * @desc Execute this file to create and enroll an admin at Office 3.
 */

const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  enrollAdmin,
} = require("../employee-asset-transfer/application-javascript/CAUtil.js");
const {
  buildWallet,
  buildCCPOffice3,
} = require("../employee-asset-transfer/application-javascript/AppUtil.js");
const adminOffice3 = "office3admin";
const adminOffice3Passwd = "office3lithium";

const mspOffice3 = "office3MSP";
const walletPath = path.join(
  __dirname,
  "../employee-asset-transfer/application-javascript/wallet"
);

/**
 * @description This functions enrolls the admin of Office 3
 */
exports.enrollAdminOffice3 = async function () {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOffice3();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.office3.lithium.com"
    );

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // to be executed and only once per office. Which enrolls admin and creates admin in the wallet
    await enrollAdmin(
      caClient,
      wallet,
      mspOffice3,
      adminOffice3,
      adminOffice3Passwd
    );

    console.log(
      "msg: Successfully enrolled admin user " +
        adminOffice3 +
        " and imported it into the wallet"
    );
  } catch (error) {
    console.error(
      `Failed to enroll admin user ' + ${adminOffice3} + : ${error}`
    );
    process.exit(1);
  }
};
