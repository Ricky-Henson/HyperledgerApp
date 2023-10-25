/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const PrimaryContract = require("./lib/primary-contract.js");
const AdminContract = require("./lib/admin-contract.js");
const EmployeeContract = require("./lib/employee-contract.js");

module.exports.contracts = [
  PrimaryContract,
  AdminContract,
  EmployeeContract,
];
