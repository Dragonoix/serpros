const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const transactionRepo = require('transaction/repositories/transaction.repository')



class TransactionController {
    constructor() { }

    async getTransactionList(req, res) {
        try {
            req.body.page = req.body.page || 1;

            let transactionList = [];
            let transactionStat = [];
            if (req.user.user_type == 'client') {
                transactionList = await transactionRepo.getAllSuccessTransactionById(req);

                transactionStat = await transactionRepo.transactionByIdStat(req);
            } else {
                transactionList = await transactionRepo.getAllServicerSuccessTransaction(req);

                transactionStat = await transactionRepo.servicerTransactionByIdStat(req);
            }

            let today = new Date();
            let todayMonth = (today.getMonth());

            let thisMonthData = transactionStat.filter(item => {
                let date = new Date(item.createdAt);
                let dateMonth = (date.getMonth());
                return dateMonth == todayMonth;
            });

            let lastTwoMonthData = transactionStat.filter(item => {
                let date = new Date(item.createdAt);
                let dateMonth = (date.getMonth());
                return dateMonth == todayMonth || dateMonth == todayMonth - 1;
            });

            let thisMonthPaidAmt = thisMonthData.reduce((n, { amount }) => n + amount, 0);
            let lastTwoMonthSumAmt = lastTwoMonthData.reduce((n, { amount }) => n + amount, 0);
            let totalPaid = transactionStat.reduce((n, { amount }) => n + amount, 0);

            let stat = {};
            let summary = {};
            if (req.user.user_type == 'client') {
                stat = {
                    thisMonthPaidAmt: thisMonthPaidAmt,
                    lastTwoMonthSumAmt: lastTwoMonthSumAmt,
                    totalPaid: totalPaid
                }

            } else {
                stat = {
                    thisMonthReceivedAmt: thisMonthPaidAmt,
                    lastTwoMonthSumAmt: lastTwoMonthSumAmt,
                    totalReceived: totalPaid
                }

            }


            if (!_.isEmpty(transactionList)) {
                requestHandler.sendSuccess(res, ' Transaction list fetched successfully.')({ transaction: transactionList, stat });
            } else {
                requestHandler.throwError(400, 'Bad Request', "Transaction list not found.")();
            }
        } catch (err) {
            return requestHandler.sendError(req, res, err);
        }
    }



    async getInvoicesList(req, res) {
        try {
            req.body.page = req.body.page || 1;
            
            let transactionList = [];
            let transactionStat = [];
            if (req.user.user_type == 'client') {
                transactionList = await transactionRepo.getAllTransactionById(req);

                transactionStat = await transactionRepo.transactionByIdStat(req);
            } else {
                transactionList = await transactionRepo.getAllServicerTransaction(req);

                transactionStat = await transactionRepo.servicerTransactionByIdStat(req);
            }

            let today = new Date();
            let todayMonth = (today.getMonth());

            let thisMonthData = transactionStat.filter(item => {
                let date = new Date(item.createdAt);
                let dateMonth = (date.getMonth());
                return dateMonth == todayMonth;
            });

            let lastTwoMonthData = transactionStat.filter(item => {
                let date = new Date(item.createdAt);
                let dateMonth = (date.getMonth());
                return dateMonth == todayMonth || dateMonth == todayMonth - 1;
            });

            let thisMonthPaidAmt = thisMonthData.reduce((n, { amount }) => n + amount, 0);
            let lastTwoMonthSumAmt = lastTwoMonthData.reduce((n, { amount }) => n + amount, 0);
            let totalPaid = transactionStat.reduce((n, { amount }) => n + amount, 0);

            let stat = {};

            if (req.user.user_type == 'client') {
                stat = {
                    thisMonthPaidAmt: thisMonthPaidAmt,
                    lastTwoMonthSumAmt: lastTwoMonthSumAmt,
                    totalPaid: totalPaid
                }

            } else {
                stat = {
                    thisMonthReceivedAmt: thisMonthPaidAmt,
                    lastTwoMonthSumAmt: lastTwoMonthSumAmt,
                    totalReceived: totalPaid
                }
    
            }


            if (!_.isEmpty(transactionList)) {
                requestHandler.sendSuccess(res, ' Invoices list fetched successfully.')({ invoices: transactionList, stat });
            } else {
                requestHandler.throwError(400, 'Bad Request', "Invoices list not found1.")();
            }
        } catch (err) {
            return requestHandler.sendError(req, res, err);
        }
    }



    async getStatementsList(req, res) {
        try {
            req.body.page = req.body.page || 1;

            let transactionStat = [];

            if (req.user.user_type == 'client') {
               transactionStat = await transactionRepo.transactionByIdStat(req);
            } else {
                transactionStat = await transactionRepo.servicerTransactionByIdStat(req);
            }

            let today = new Date();
            let todayMonth = (today.getMonth());

            let thisMonthData = transactionStat.filter(item => {
                let date = new Date(item.createdAt);
                let dateMonth = (date.getMonth());
                return dateMonth == todayMonth;
            });

            let lastTwoMonthData = transactionStat.filter(item => {
                let date = new Date(item.createdAt);
                let dateMonth = (date.getMonth());
                return dateMonth == todayMonth || dateMonth == todayMonth - 1;
            });

            let thisMonthPaidAmt = thisMonthData.reduce((n, { amount }) => n + amount, 0);
            let lastTwoMonthSumAmt = lastTwoMonthData.reduce((n, { amount }) => n + amount, 0);
            let totalPaid = transactionStat.reduce((n, { amount }) => n + amount, 0);

            let stat = {};
            let summary = {};
            if (req.user.user_type == 'client') {
                stat = {
                    thisMonthPaidAmt: thisMonthPaidAmt,
                    lastTwoMonthSumAmt: lastTwoMonthSumAmt,
                    totalPaid: totalPaid
                }
    
                summary = {
                    payments: totalPaid,
                    other_fee: 0
                }
            } else {
                stat = {
                    thisMonthReceivedAmt: thisMonthPaidAmt,
                    lastTwoMonthSumAmt: lastTwoMonthSumAmt,
                    totalReceived: totalPaid
                }
    
                summary = {
                    earned: totalPaid,
                    other_fee: 0
                }
            }


            if (!_.isEmpty(transactionStat)) {
                requestHandler.sendSuccess(res, ' Transaction list fetched successfully.')({ summary, stat });
            } else {
                requestHandler.throwError(400, 'Bad Request', "Transaction list not found.")();
            }
        } catch (err) {
            return requestHandler.sendError(req, res, err);
        }
    }

};


module.exports = new TransactionController();