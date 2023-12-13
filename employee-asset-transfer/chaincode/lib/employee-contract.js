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
    // Log the received file hash for debugging purposes
    console.log("Received fileHash:", fileHash);

    // Check if the fileHash is valid (non-empty string)
    if (!fileHash || typeof fileHash !== "string") {
      throw new Error("Invalid file hash provided");
    }

    // Use the file hash itself as a key for the ledger entry
    // This requires that each file hash is unique
    const key = fileHash;

    // Check if a record with this file hash already exists to prevent overwrites
    const exists = await this.fileHashExists(ctx, key);
    if (exists) {
      throw new Error(`A file with hash ${key} already exists`);
    }
    const buffer = Buffer.from(fileHash);
    console.log("Buffer:", buffer);
    // Store the file hash in the ledger
    await ctx.stub.putState(key, buffer);
  }

  /**
   * Helper function to check if a file hash already exists in the ledger.
   * @param {Context} ctx The transaction context.
   * @param {String} key The file hash key to check.
   * @returns {Boolean} True if the file hash exists, false otherwise.
   */
  async fileHashExists(ctx, key) {
    const data = await ctx.stub.getState(key);
    return data && data.length > 0;
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

  async getClientId(ctx) {
    const clientIdentity = ctx.clientIdentity.getID();
    // Ouput of the above - 'x509::/OU=client/CN=hoffice1admin::/C=US/ST=North Carolina/L=Durham/O=hoffice1.ccu.com/CN=ca.hoffice1.ccu.com'
    let identity = clientIdentity.split("::");
    identity = identity[1].split("/")[2].split("=");
    return identity[1].toString("utf8");
  }
}
module.exports = EmployeeContract;
