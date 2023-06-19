const mongoose = require("mongoose");
const RequestHandler = require(appRoot + '/helper/RequestHandler');
const Logger = require(appRoot + '/helper/logger');
const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const subscriptionPlanRepo = require("subscriptionPlan/repositories/subscriptionPlan.repository");
const subscriptionLogRepo = require("subscription_log/repositories/subscription_log.repository");
const transactionRepo = require("transaction/repositories/transaction.repository");
const userRepo = require("user/repositories/user.repository");

const stripe = require("../../helper/stripePayment");


class SubscriptionPlanController {
    constructor() { }

    async getAllSubscriptionPlan(req, res) {
        try {
            let subscriptionPlanData = await subscriptionPlanRepo.getAllByField({ "isDeleted": false, "status": "Active" });

            if (!_.isEmpty(subscriptionPlanData)) {
                requestHandler.sendSuccess(res, 'All Subscription Plan fetched successfully.')(subscriptionPlanData);
            } else {
                requestHandler.throwError(400, 'Bad Request', "No record found")();
            }
        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };



    async purchaseSubscription(req, res) {
        try {
            if (!_.has(req.body, 'subscription_plan_id') || ((_.has(req.body, 'subscription_plan_id') && (_.isUndefined(req.body.subscription_plan_id)) || _.isNull(req.body.subscription_plan_id) || _.isEmpty(req.body.subscription_plan_id.trim())))) {
                requestHandler.throwError(400, 'Bad Request', 'Email is required!')();
            }

            let planData = await subscriptionPlanRepo.getById(mongoose.Types.ObjectId(req.body.subscription_plan_id));
            if (!_.isEmpty(planData)) {
                var params = {
                    "card_number": req.body.card_number,
                    "exp_month": req.body.exp_month,
                    "exp_year": req.body.exp_year,
                    "cvv": req.body.cvv,
                    "payment_amount": parseInt((planData.price_per_user * planData.team_size) + planData.handling_fee),
                    "name": req.user.full_name,
                    "email": req.user.email,
                    "address": req.user.stateName,
                }

                let paymentResult = await stripe.stripePayment(params);

                if (!_.isEmpty(paymentResult)) {

                    let data = await transactionRepo.save({
                        trans_date: Date.now(),
                        trans_id: "",
                        amount: parseInt(parseInt((planData.price_per_user * planData.team_size) + planData.handling_fee)),
                        description: "Subscription Purchased",
                        paymentStatus: paymentResult.status,
                        stripe_transactionId: paymentResult.transcationID,
                        stripe_charge_id: paymentResult.chargeID
                    });
                    // console.log(data);
                    let subscriptionLog = await subscriptionLogRepo.save({
                        amount: parseInt((planData.price_per_user * planData.team_size) + planData.handling_fee),
                        user_id: req.user._id,
                        subscription_plan_id: req.body.subscription_plan_id,
                        stripe_subscription_id: "",
                        charge_id: paymentResult.chargeID,
                        period_start: Date.now(),
                        period_end: new Date((new Date()).setMonth((new Date()).getMonth() + parseInt(planData.plan_duration))),
                        current_period_end_date: new Date((new Date()).setMonth((new Date()).getMonth() + parseInt(planData.plan_duration))),
                        subscription_end_date: new Date((new Date()).setMonth((new Date()).getMonth() + parseInt(planData.plan_duration))),
                    });

                    await userRepo.updateById({isPaymentCompleted: true}, req.user._id);
                    // subscriptionLog['on_trial'] = false;
                    // subscriptionLog['isPaymentCompleted'] = true;
                    requestHandler.sendSuccess(res, 'Subscription purchased successfully.')(subscriptionLog);
                } else {
                    requestHandler.throwError(400, 'Bad Request', "Payment Gateway error")();
                }
            } else {
                requestHandler.throwError(400, 'Bad Request', "Invalid Subscription Plan Id")();
            }

        } catch (error) {
            return requestHandler.sendError(req, res, error);
        }
    };

};


module.exports = new SubscriptionPlanController();