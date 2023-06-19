const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const transactionController = require('WEBSERVICES/transaction.controller');

const multer = require('multer');

const request_param = multer();


//////////////////////////// authentication starts ////////////////////////////////////
namedRouter.all('/transaction*', auth.authenticateAPI);

/**
 * @swagger
 * /transaction/list:
 *   post:
 *     summary: Transaction List
 *     security:
 *       - Token: []
 *     tags:
 *       - Transaction
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Transaction List
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - fromDt
 *                 - toDt
 *             properties:
 *                 fromDt:
 *                      type: string
 *                      example: 2023-02-20T00:00:00.000Z
 *                 toDt:
 *                      type: string
 *                      example: 2023-02-20T00:00:00.000Z
 *     responses:
 *        200:
 *          description: Transaction list fetched successfully.
 *        
 */
namedRouter.post('api.transaction.list', '/transaction/list' , transactionController.getTransactionList);


/**
 * @swagger
 * /transaction/statement/list:
 *   post:
 *     summary: Statement List
 *     security:
 *       - Token: []
 *     tags:
 *       - Transaction
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Statement List
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - fromDt
 *                 - toDt
 *             properties:
 *                 fromDt:
 *                      type: string
 *                      example: 2023-02-20T00:00:00.000Z
 *                 toDt:
 *                      type: string
 *                      example: 2023-02-20T00:00:00.000Z
 *     responses:
 *        200:
 *          description: Statement list fetched successfully.
 *        
 */
namedRouter.post('api.transaction.statement.list', '/transaction/statement/list' , transactionController.getStatementsList);


/**
 * @swagger
 * /transaction/invoice/list:
 *   post:
 *     summary: Invoices List
 *     security:
 *       - Token: []
 *     tags:
 *       - Transaction
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Invoices List
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - fromDt
 *                 - toDt
 *             properties:
 *                 fromDt:
 *                      type: string
 *                      example: 2023-02-20T00:00:00.000Z
 *                 toDt:
 *                      type: string
 *                      example: 2023-02-20T00:00:00.000Z
 *     responses:
 *        200:
 *          description: Invoices list fetched successfully.
 *        
 */
namedRouter.post('api.transaction.invoice.list', '/transaction/invoice/list' , transactionController.getInvoicesList);




module.exports = router;