/**
 * @author Jathin Sreenivas
 * @email jathin.sreenivas@stud.fra-uas.de
 * @create date 2020-12-26 13:26:42
 * @modify date 2021-03-14 20:52:37
 * @desc The file which interacts with the fabric network.
 */

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const { buildCAClient, registerAndEnrollUser } = require("./CAUtil.js");
const {
  buildCCPOffice3,
  buildCCPOffice2,
  buildCCPOffice1,
  buildWallet,
} = require("./AppUtil.js");

const channelName = "officechannel";
const chaincodeName = "employee";
const mspOrg1 = "office1MSP";
const mspOrg2 = "office2MSP";
const mspOrg3 = "office3MSP";
const walletPath = path.join(__dirname, "wallet");

/**
 * @author Jathin Sreenivas
 * @param  {string} employeeID
 * @return {networkObj} networkObj if all paramters are correct, the networkObj consists of contract, network, gateway
 * @return {string} response error if there is a error in the method
 * @description Connects to the network using the username - employeeID, networkObj contains the paramters using which
 * @description a connection to the fabric network is possible.
 */
exports.connectToNetwork = async function (employeeID) {
  const gateway = new Gateway();
  const ccp = buildCCPOffice1();

  try {
    const walletPath = path.join(
      process.cwd(),
      "../employee-asset-transfer/application-javascript/wallet/"
    );

    const wallet = await buildWallet(Wallets, walletPath);

    const userExists = await wallet.get(employeeID);
    if (!userExists) {
      console.log(
        "An identity for the employeeID: " +
          employeeID +
          " does not exist in the wallet"
      );
      console.log("Create the employeeID before retrying");
      const response = {};
      response.error =
        "An identity for the user " +
        employeeID +
        " does not exist in the wallet. Register " +
        employeeID +
        " first";
      return response;
    }

    /**
     * setup the gateway instance
     *  he user will now be able to create connections to the fabric network and be able to
     * ubmit transactions and query. All transactions submitted by this gateway will be
     * signed by this user using the credentials stored in the wallet.
     */
    // using asLocalhost as this gateway is using a fabric network deployed locally
    await gateway.connect(ccp, {
      wallet,
      identity: employeeID,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);

    const networkObj = {
      contract: contract,
      network: network,
      gateway: gateway,
    };
    console.log("Succesfully connected to the network.");
    return networkObj;
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    const response = {};
    response.error = error;
    return response;
  }
};

/**
 * @author Jathin Sreenivas
 * @param  {*} networkObj the object which is given when connectToNetwork is executed
 * @param  {boolean} isQuery true if retieving from ledger, else false in the case of add a transaction to the ledger.
 * @param  {string} func must be the function name in the chaincode.
 * @param  {string} args - a json string, if there are mutiple args, the args must be a json as one string
 * @return {string} response if the transaction was successful
 * @return {string} response error otherwise
 * @description A common function to interact with the ledger
 */
exports.invoke = async function (networkObj, isQuery, func, args = "") {
  try {
    if (isQuery === true) {
      const response = await networkObj.contract.evaluateTransaction(
        func,
        args
      );
      console.log(response);
      await networkObj.gateway.disconnect();
      return response;
    } else {
      if (args) {
        args = JSON.parse(args[0]);
        args = JSON.stringify(args);
      }
      const response = await networkObj.contract.submitTransaction(func, args);
      await networkObj.gateway.disconnect();
      return response;
    }
  } catch (error) {
    const response = {};
    response.error = error;
    console.error(`Failed to submit transaction: ${error}`);
    return response;
  }
};

/**
 * @author Jathin Sreenivas
 * @param  {string} attributes JSON string in which userId, officeId and role must be present.
 * @description For employee attributes also contain the employee object
 * @description Creates a employee and adds to the wallet to the given officeId
 */
exports.registerUser = async function (attributes) {
  const attrs = JSON.parse(attributes);
  const officeId = parseInt(attrs.officeId);
  const userId = attrs.userId;

  if (!userId || !officeId) {
    const response = {};
    response.error =
      "Error! You need to fill all fields before you can register!";
    return response;
  }

  try {
    const wallet = await buildWallet(Wallets, walletPath);
    // TODO: Must be handled in a config file instead of using if
    if (officeId === 1) {
      const ccp = buildCCPOffice1();
      const caClient = buildCAClient(
        FabricCAServices,
        ccp,
        "ca.office1.ccu.com"
      );
      await registerAndEnrollUser(
        caClient,
        wallet,
        mspOrg1,
        userId,
        "office1admin",
        attributes
      );
    } else if (officeId === 2) {
      const ccp = buildCCPOffice2();
      const caClient = buildCAClient(
        FabricCAServices,
        ccp,
        "ca.office2.ccu.com"
      );
      await registerAndEnrollUser(
        caClient,
        wallet,
        mspOrg2,
        userId,
        "office2admin",
        attributes
      );
    } else if (officeId === 3) {
      const ccp = buildCCPOffice3();
      const caClient = buildCAClient(
        FabricCAServices,
        ccp,
        "ca.office3.ccu.com"
      );
      await registerAndEnrollUser(
        caClient,
        wallet,
        mspOrg3,
        userId,
        "office3admin",
        attributes
      );
    }
    console.log(`Successfully registered user: + ${userId}`);
    const response = "Successfully registered user: " + userId;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${userId} + : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
};

/**
 * @param  {NetworkObj} networkObj The object which is generated when connectToNetwork is executed
 * @param  {Number} officeId
 * @return {JSON} Returns an JSON array consisting of all employee object.
 * @description Retrieves all the users(employees) based on user type(employee) and officeId
 */
exports.getAllEmployeesByOfficeId = async function (networkObj, officeId) {
  // Get the User from the identity context
  const users = networkObj.gateway.identityContext.user;
  let caClient;
  const result = [];
  try {
    // TODO: Must be handled in a config file instead of using if
    if (officeId === 1) {
      const ccp = buildCCPOffice1();
      caClient = buildCAClient(FabricCAServices, ccp, "ca.office1.ccu.com");
    } else if (officeId === 2) {
      const ccp = buildCCPOffice2();
      caClient = buildCAClient(FabricCAServices, ccp, "ca.office2.ccu.com");
    } else if (officeId === 3) {
      const ccp = buildCCPOffice3();
      caClient = buildCAClient(FabricCAServices, ccp, "ca.office3.ccu.com");
    }

    // Use the identity service to get the user enrolled using the respective CA
    const idService = caClient.newIdentityService();
    const userList = await idService.getAll(users);

    // for all identities the attrs can be found
    const identities = userList.result.identities;
    
    for (let i = 0; i < identities.length; i++) {
      tmp = {};
      if (identities[i].type === "client") {
        tmp.id = identities[i].id;
        tmp.role = identities[i].type;
        attributes = identities[i].attrs;
        // Employee object will consist of firstName and lastName
        for (let j = 0; j < attributes.length; j++) {
          if (
            attributes[j].name.endsWith("Name") ||
            attributes[j].name === "role" ||
            attributes[j].name === "speciality"
          ) {
            tmp[attributes[j].name] = attributes[j].value;
          }
        }
        result.push(tmp);
      }
    }
  } catch (error) {
    console.error(`Unable to get all employees : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
  return result.filter(function (result) {
    return result.role === "employee";
  });
};