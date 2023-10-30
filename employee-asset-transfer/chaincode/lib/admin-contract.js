/**
 * @author Varsha Kamath
 * @email varsha.kamath@stud.fra-uas.de
 * @create date 2021-01-23 21:50:38
 * @modify date 2021-01-26 13:30:00
 * @desc [Admin Smartcontract to create, read Employee details in legder]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

let Employee = require('./Employee.js');
const PrimaryContract = require('./primary-contract.js');

class AdminContract extends PrimaryContract {

    //Returns the last EmployeeId in the set
    async getLatestEmployeeId(ctx) {
        let allResults = await this.queryAllEmployees(ctx);

        return allResults[allResults.length - 1].EmployeeId;
    }

    async createEmployee(ctx, args) {
        args = JSON.parse(args);
        console.log("Received args: ", args);
        if (!args.EmployeeId || !args.firstName || !args.lastName || !args.password || !args.speciality || !args.officeId) {
          throw new Error(`Missing required fields`);
        }
        let newEmployee = await new Employee(args.EmployeeId, args.firstName, args.lastName, args.password, args.speciality, args.officeId);
        console.log("EmployeeId in createEmployee:", newEmployee.EmployeeId);
        if(typeof newEmployee.EmployeeId === 'undefined') {
            throw new Error('EmployeeId is undefined');
        }
        
        const exists = await this.EmployeeExists(ctx, newEmployee.EmployeeId);
        if (exists) {
          throw new Error(`The Employee ${newEmployee.EmployeeId} already exists`);
        }
        console.log("New Employee Object:", newEmployee);
        const buffer = Buffer.from(JSON.stringify(newEmployee));
        await ctx.stub.putState(newEmployee.EmployeeId, buffer);
      }

    //   async createPatient(ctx, args) {
    //     args = JSON.parse(args);

    //     if (args.password === null || args.password === '') {
    //         throw new Error(`Empty or null values should not be passed for password parameter`);
    //     }

    //     let newPatient = await new Patient(args.patientId, args.firstName, args.lastName, args.password, args.age,
    //         args.phoneNumber, args.emergPhoneNumber, args.address, args.bloodGroup, args.changedBy, args.allergies);
    //     const exists = await this.patientExists(ctx, newPatient.patientId);
    //     if (exists) {
    //         throw new Error(`The patient ${newPatient.patientId} already exists`);
    //     }
    //     const buffer = Buffer.from(JSON.stringify(newPatient));
    //     await ctx.stub.putState(newPatient.patientId, buffer);
    // }
    
    //Read Employee details based on EmployeeId
    async readEmployee(ctx, EmployeeId) {
        let asset = await super.readEmployee(ctx, EmployeeId)

        asset = ({
            EmployeeId: EmployeeId,
            firstName: asset.firstName,
            lastName: asset.lastName,
            speciality: asset.speciality,
            officeId: asset.officeId,
        });
        return asset;
    }

    //Delete Employee from the ledger based on EmployeeId
    async deleteEmployee(ctx, EmployeeId) {
        const exists = await this.EmployeeExists(ctx, EmployeeId);
        if (!exists) {
            throw new Error(`The Employee ${EmployeeId} does not exist`);
        }
        await ctx.stub.deleteState(EmployeeId);
    }

    //Read Employees based on lastname
    async queryEmployeesByLastName(ctx, lastName) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'Employee';
        queryString.selector.lastName = lastName;
        const buffer = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let asset = JSON.parse(buffer.toString());

        return this.fetchLimitedFields(asset);
    }

    //Read Employees based on firstName
    async queryEmployeesByFirstName(ctx, firstName) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'Employee';
        queryString.selector.firstName = firstName;
        const buffer = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let asset = JSON.parse(buffer.toString());

        return this.fetchLimitedFields(asset);
    }

    //Retrieves all Employees details
    async queryAllEmployees(ctx) {
        let resultsIterator = await ctx.stub.getStateByRange('', '');
        let asset = await this.getAllEmployeeResults(resultsIterator, false);

        return this.fetchLimitedFields(asset);
    }

    fetchLimitedFields = asset => {
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            asset[i] = {
                EmployeeId: obj.Key,
                firstName: obj.Record.firstName,
                lastName: obj.Record.lastName,
            };
        }
        return asset;
    }
}
module.exports = AdminContract;