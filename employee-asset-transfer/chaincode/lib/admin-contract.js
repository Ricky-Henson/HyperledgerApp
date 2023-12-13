/*
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";

let Employee = require("./Employee.js");
const PrimaryContract = require("./primary-contract.js");

class AdminContract extends PrimaryContract {
  //Delete the file from the ledger
  async deleteFile(ctx, fileHash) {
    const exists = await this.fileHashExists(ctx, fileHash);
    if (!exists) {
      throw new Error(`The file ${fileHash} does not exist`);
    }
    await ctx.stub.deleteState(fileHash);
  }

  async fileHashExists(ctx, key) {
    const data = await ctx.stub.getState(key);
    return data && data.length > 0;
  }

  //Returns the last employeeId in the set
  async getLatestEmployeeId(ctx) {
    let allResults = await this.queryAllEmployees(ctx);

    return allResults[allResults.length - 1].employeeId;
  }

  async createEmployee(ctx, args) {
    args = JSON.parse(args);
    console.log("Received args: ", args);
    if (
      !args.employeeId ||
      !args.firstName ||
      !args.lastName ||
      !args.password ||
      !args.speciality ||
      !args.officeId
    ) {
      throw new Error(`Missing required fields`);
    }
    let newEmployee = await new Employee(
      args.employeeId,
      args.firstName,
      args.lastName,
      args.password,
      args.speciality,
      args.officeId
    );
    console.log("employeeId in createEmployee:", newEmployee.employeeId);
    if (typeof newEmployee.employeeId === "undefined") {
      throw new Error("employeeId is undefined");
    }

    const exists = await this.employeeExists(ctx, newEmployee.employeeId);
    if (exists) {
      throw new Error(`The Employee ${newEmployee.employeeId} already exists`);
    }
    console.log("New Employee Object:", newEmployee);
    const buffer = Buffer.from(JSON.stringify(newEmployee));
    await ctx.stub.putState(newEmployee.employeeId, buffer);
  }

  //Read Employee details based on employeeId
  async readEmployee(ctx, employeeId) {
    let asset = await super.readEmployee(ctx, employeeId);

    asset = {
      employeeId: employeeId,
      firstName: asset.firstName,
      lastName: asset.lastName,
      speciality: asset.speciality,
      officeId: asset.officeId,
    };
    return asset;
  }

  //Delete Employee from the ledger based on employeeId
  async deleteEmployee(ctx, employeeId) {
    const exists = await this.employeeExists(ctx, employeeId);
    if (!exists) {
      throw new Error(`The Employee ${employeeId} does not exist`);
    }
    await ctx.stub.deleteState(employeeId);
  }

  //Read Employees based on lastname
  async queryEmployeesByLastName(ctx, lastName) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = "Employee";
    queryString.selector.lastName = lastName;
    const buffer = await this.getQueryResultForQueryString(
      ctx,
      JSON.stringify(queryString)
    );
    let asset = JSON.parse(buffer.toString());

    return this.fetchLimitedFields(asset);
  }

  //Read Employees based on firstName
  async queryEmployeesByFirstName(ctx, firstName) {
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = "Employee";
    queryString.selector.firstName = firstName;
    const buffer = await this.getQueryResultForQueryString(
      ctx,
      JSON.stringify(queryString)
    );
    let asset = JSON.parse(buffer.toString());

    return this.fetchLimitedFields(asset);
  }

  //Retrieves all Employees details
  async queryAllEmployees(ctx) {
    let resultsIterator = await ctx.stub.getStateByRange("", "");
    let asset = await this.getAllEmployeeResults(resultsIterator, false);

    return this.fetchLimitedFields(asset);
  }

  fetchLimitedFields = (asset) => {
    for (let i = 0; i < asset.length; i++) {
      const obj = asset[i];
      asset[i] = {
        employeeId: obj.Key,
        firstName: obj.Record.firstName,
        lastName: obj.Record.lastName,
      };
    }
    return asset;
  };
}
module.exports = AdminContract;
