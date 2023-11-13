/**
 * @author Varsha Kamath
 * @email varsha.kamath@stud.fra-uas.de
 * @create date 2021-01-23 21:50:38
 * @modify date 2021-01-30 19:52:41
 * @desc [Primary Smartcontract to initiate ledger with Employee details]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict";

const { Contract } = require("fabric-contract-api");
let Employee = require("./Employee.js");
let initEmployees = require("./initLedger.json");

class PrimaryContract extends Contract {
  async initLedger(ctx) {
    console.info("============= START : Initialize Ledger ===========");
    for (let i = 0; i < initEmployees.length; i++) {
      initEmployees[i].docType = "Employee";
      await ctx.stub.putState(
        "EID" + i,
        Buffer.from(JSON.stringify(initEmployees[i]))
      );
      console.info("Added <--> ", initEmployees[i]);
    }
    console.info("============= END : Initialize Ledger ===========");
  }

  //Read Employee details based on employeeId
  async readEmployee(ctx, employeeId) {
    const exists = await this.employeeExists(ctx, employeeId);
    if (!exists) {
      throw new Error(`The Employee ${employeeId} does not exist`);
    }

    const buffer = await ctx.stub.getState(employeeId);
    let asset = JSON.parse(buffer.toString());
    asset = {
      employeeId: employeeId,
      firstName: asset.firstName,
      lastName: asset.lastName,
      speciality: asset.speciality,
      officeId: asset.officeId,
      password: asset.password,
      pwdTemp: asset.pwdTemp,
    };
    return asset;
  }

  async employeeExists(ctx, employeeId) {
    console.log("employeeId in employeeExists:", employeeId);
    if (typeof employeeId === "undefined") {
      throw new Error("employeeId is undefined");
    }
    const buffer = await ctx.stub.getState(employeeId);
    return !!buffer && buffer.length > 0;
  }

  async getQueryResultForQueryString(ctx, queryString) {
    let resultsIterator = await ctx.stub.getQueryResult(queryString);
    console.info("getQueryResultForQueryString <--> ", resultsIterator);
    let results = await this.getAllEmployeeResults(resultsIterator, false);
    return JSON.stringify(results);
  }

  async getAllEmployeeResults(iterator, isHistory) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();
  
      // Check if res.value exists and its value can be converted to string
      if (res.value && res.value.value.toString()) {
        // Check if the key starts with 'EID'
        const isEID = res.value.key.startsWith('EID');
        
        if (isEID) {
          let jsonRes = {};
          console.log(res.value.value.toString("utf8"));
  
          if (isHistory && isHistory === true) {
            jsonRes.Timestamp = res.value.timestamp;
          }
          jsonRes.Key = res.value.key;
  
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString("utf8");
          }
          allResults.push(jsonRes);
        }
      }
  
      if (res.done) {
        console.log("end of data");
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }
  
  // async getAllEmployeeResults(iterator, isHistory) {
  //   let allResults = [];
  //   while (true) {
  //     let res = await iterator.next();

  //     if (res.value && res.value.value.toString()) {
  //       let jsonRes = {};
  //       console.log(res.value.value.toString("utf8"));

  //       if (isHistory && isHistory === true) {
  //         jsonRes.Timestamp = res.value.timestamp;
  //       }
  //       jsonRes.Key = res.value.key;

  //       try {
  //         jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
  //       } catch (err) {
  //         console.log(err);
  //         jsonRes.Record = res.value.value.toString("utf8");
  //       }
  //       allResults.push(jsonRes);
  //     }
  //     if (res.done) {
  //       console.log("end of data");
  //       await iterator.close();
  //       console.info(allResults);
  //       return allResults;
  //     }
  //   }
  // }
}
module.exports = PrimaryContract;
