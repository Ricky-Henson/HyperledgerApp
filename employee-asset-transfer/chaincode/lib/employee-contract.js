/**
 * @author Varsha Kamath
 * @email varsha.kamath@stud.fra-uas.de
 * @create date 2021-01-14 21:50:38
 * @modify date 2021-02-05 20:03:33
 * @desc [Smartcontract to read, update Employee details in legder]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";

let Employee = require("./Employee.js");
const AdminContract = require("./admin-contract.js");
const PrimaryContract = require("./primary-contract.js");
const { Context } = require("fabric-contract-api");

class EmployeeContract extends AdminContract {
  //Read Employee details based on employeeId
  async readEmployee(ctx, employeeId) {
    return await super.readEmployee(ctx, employeeId);
  }

  async uploadFile(ctx, fileHash) {
    try {
      // You can use the hash itself as a key, or another unique identifier
      console.log("fileHash:", fileHash);
      await ctx.stub.putState(fileHash, Buffer.from(fileHash));
      return { status: 'success', fileHash: fileHash };
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw new Error('Error storing file hash in the ledger');
    }
  }
  


  async deleteEmployee(ctx, employeeId) {
    const exist = await this.employeeExists(ctx, employeeId);
    if (!exist) {
      throw new Error(`The employee ${employeeId} does not exist`);
    }
    await ctx.stub.deleteState(employeeId);
  }

  //Read Employees based on lastname
  async queryEmployeesByLastName(ctx, lastName) {
    return await super.queryEmployeesByLastName(ctx, lastName);
  }

  //Read Employees based on firstName
  async queryEmployeesByFirstName(ctx, firstName) {
    return await super.queryEmployeesByFirstName(ctx, firstName);
  }

  //Retrieves all Employees details
  async queryAllEmployees(ctx, employeeId) {
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let asset = await this.getAllEmployeeResults(resultsIterator, false);
    return this.fetchLimitedFields(asset);
  }

  fetchLimitedFields = (asset, includeTimeStamp = false) => {
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      asset[i] = {
        employeeId: obj.Key,
        firstName: obj.Record.firstName,
        lastName: obj.Record.lastName,
        speciality: obj.Record.speciality,
        officeId: obj.Record.officeId,
      };
      if (includeTimeStamp) {
        asset[i].Timestamp = obj.Timestamp;
      }
    }

    return asset;
  };

  /**
   * @author Jathin Sreenivas
   * @param  {Context} ctx
   * @description Get the client used to connect to the network.
   */
  async getClientId(ctx) {
    const clientIdentity = ctx.clientIdentity.getID();
    // Ouput of the above - 'x509::/OU=client/CN=hoffice1admin::/C=US/ST=North Carolina/L=Durham/O=hoffice1.lithium.com/CN=ca.hoffice1.lithium.com'
    let identity = clientIdentity.split("::");
    identity = identity[1].split("/")[2].split("=");
    return identity[1].toString("utf8");
  }
}
module.exports = EmployeeContract;
