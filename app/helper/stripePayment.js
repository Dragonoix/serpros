const { matches } = require('underscore');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.stripePayment = async (params) => {
    try {

        var card_details = {
            'number': params.card_number,
            'exp_month': params.exp_month,
            'exp_year': params.exp_year,
            'cvc': params.cvv
        };
        var stripeCardResponse = await stripe.tokens.create({ card: card_details });


        var card_no = stripeCardResponse.card.last4;
        var expiry_month = stripeCardResponse.card.exp_month;
        var expiry_year = stripeCardResponse.card.exp_year;
        var stripe_token = stripeCardResponse.id;

        var customer = await stripe.customers.create({
            email: params.email,
            name: params.name,
            address: {
                line1: params.address,
                country: 'US',
            }
        });


        var source = await stripe.customers.createSource(customer.id, {
            source: stripe_token,
        });

        let amount = parseFloat(params.payment_amount * 100).toFixed(2);
        let payableAmount = parseInt(amount);

        //var payableAmount = params.payment_amount * 100;

        var stripeChargeCreate = await stripe.charges.create({
            amount: payableAmount,
            currency: 'usd',
            description: 'Payment to stripe',
            customer: customer.id
        });
        // console.log(stripeChargeCreate);

        let subscriptionResponse = {};
        subscriptionResponse.transcationID = stripeChargeCreate.balance_transaction;
        subscriptionResponse.chargeID = stripeChargeCreate.id;
        subscriptionResponse.card_id = source.id;
        subscriptionResponse.card_token = stripe_token;
        subscriptionResponse.customer = customer.id;
        subscriptionResponse.charge_id = stripeChargeCreate.id;
        subscriptionResponse.card_no = card_no;
        subscriptionResponse.card_expiry_month = expiry_month;
        subscriptionResponse.card_expiry_year = expiry_year;
        subscriptionResponse.status = stripeChargeCreate.status

        return subscriptionResponse;
    }
    catch (e) {
        throw (e);
    }
};



exports.stripeRefund = async (charge_id, refund_amount) => {

    try {
        const refund = await stripe.refunds.create({
            charge: charge_id,
            amount: Math.round(refund_amount * 100), //convert refund amount from dollar to cent

        });

        return refund;
    }
    catch (e) {
        throw (e);
    }

};



exports.createTax = async (percent) => {
    try {

        const taxRate = await stripe.taxRates.create({
            display_name: 'Sales Tax',
            inclusive: false,
            percentage: percent,
            country: 'US',
            state: 'CA',
            jurisdiction: 'US - CA',
            description: 'CA Sales Tax',
        });

        return taxRate;
    }
    catch (e) {
        throw (e);
    }
};



exports.invoicePayment = async (percent) => {
    try {

        const taxRate = await stripe.taxRates.retrieve(process.env.STRIPE_TAX_RATE_ID);

        const product = await stripe.products.create({ name: all_users[i].full_name + ' Meeting Product' });
        await userRepo.updateById({ stripe_invoice_product_id: product.id }, all_users[i]._id);
        var stripe_invoice_product_id = product.id

        const price = await stripe.prices.create({
            product: stripe_invoice_product_id,
            unit_amount: Math.round(all_users[i].total_price * 100),
            currency: 'usd',
        });
        const invoice = await stripe.invoices.create({
            customer: all_users[i].stripe_customer_id,
            default_payment_method: all_users[i].stripe_paymentMethod_id,
            description: all_users[i].full_name + ' meeting payment on ' + moment(last_date).format('MMMM DD, YYYY'),
            default_tax_rates: [
                taxRate.id
            ],
            collection_method: 'charge_automatically'
        });
        const invoiceItem = await stripe.invoiceItems.create({
            customer: all_users[i].stripe_customer_id,
            price: price.id,
            invoice: invoice.id,
        });
        const invoice_final = await stripe.invoices.finalizeInvoice(invoice.id);
        const invoice_pay = await stripe.invoices.pay(invoice.id);
        if (!_.isEmpty(invoice_pay)) {
            let checkTranscation = invoice_pay.payment_intent ? 'Success' : 'Failed'
            let trans_amount = parseFloat(invoice_pay.amount_paid / 100).toFixed(2);
            let actual_amount = parseFloat(invoice_pay.total_excluding_tax / 100).toFixed(2);
            var tax_amount = trans_amount - actual_amount;
            let transaction = await transRepo.save({
                user_id: all_users[i]._id,
                trans_amount: trans_amount,
                actual_amount: actual_amount,
                tax_amount: parseFloat(tax_amount).toFixed(2),
                tax_percentage: taxRate.percentage,
                transaction_id: invoice_pay.payment_intent,
                charge_id: invoice_pay.charge,
                invoice_id: invoice_pay.id,
                trans_type: 'Meeting Monthly',
                platform: 'web',
                payment_status: checkTranscation,
                card_id: invoice_pay.default_payment_method
            });
            await meetingRepo.updateManyByParam({ _id: { $in: all_users[i].meeting_ids }, "status": "Complete" }, { "isPayment": true, "transaction_id": transaction._id });
            let email_message = "Your payment has been done successfully!";
            let locals = {
                site_logo_url: process.env.PUBLIC_PATH + "/assets/media/logos/swyfty-logo.svg",
                name: all_users[i].full_name,
                message: email_message,
                trans_amount: trans_amount,
                trans_date: moment().format('MMMM Do YYYY, h:mm:ss a')
            };

            let sendMail = await mailer.sendMail(`Swyfty<${process.env.SEND_GRID_FROM_EMAIL}>`, all_users[i].email, 'Payment Successfull | Swyfty', 'payment-completed-cron', locals);
        }

        return { status: 200, data: all_users, message: 'Meeting payment has been done.' };

    }
    catch (e) {
        throw (e);
    }
};

