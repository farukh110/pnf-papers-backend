const Razorpay = require('razorpay');

const instance = new Razorpay({
    key_id: "",
    key_secret: ""
});

// checkout

const checkout = async (req, res) => {

    const option = {
        amount: 50000,
        currency: "PKR"
    }

    const order = await instance.orders.create(option);

    res.json({
        success: true,
        order
    })
};

// payment verification

const paymentVerification = async (req, res) => {

    const { razorpayOrderId, razorpayPaymentId } = req.body;

    res.json({

        razorpayOrderId, razorpayPaymentId
    });

};

module.exports = {
    checkout,
    paymentVerification
}