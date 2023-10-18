/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 13:26:42
 * @modify date 2021-01-30 12:22:11
 * @desc Execute this file to create and enroll an admin at Office 2.
 */

const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  enrollAdmin,
} = require("../patient-asset-transfer/application-javascript/CAUtil.js");
const {
  buildCCPOffice2,
  buildWallet,
} = require("../patient-asset-transfer/application-javascript/AppUtil.js");
const adminOffice2 = "office2admin";
const adminOffice2Passwd = "office2lithium";

const mspOffice2 = "office2MSP";
const walletPath = path.join(
  __dirname,
  "../patient-asset-transfer/application-javascript/wallet"
);

/**
 * @description This functions enrolls the admin of Office 2
 */
exports.enrollAdminOffice2 = async function () {
  try {
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccp = buildCCPOffice2();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.office2.lithium.com"
    );

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // to be executed and only once per office. Which enrolls admin and creates admin in the wallet
    await enrollAdmin(
      caClient,
      wallet,
      mspOffice2,
      adminOffice2,
      adminOffice2Passwd
    );

    console.log(
      "msg: Successfully enrolled admin user " +
        adminOffice2 +
        " and imported it into the wallet"
    );
  } catch (error) {
    console.error(
      `Failed to enroll admin user ' + ${adminOffice2} + : ${error}`
    );
    process.exit(1);
  }
};
