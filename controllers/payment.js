const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create PaymentIntent
const checkout = async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert dollars to cents
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Verify PaymentIntent
const paymentVerification = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ success: false, message: "PaymentIntent ID is required." });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            res.json({
                success: true,
                message: "Payment verified successfully.",
                paymentIntent,
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Payment not completed. Status: ${paymentIntent.status}`,
            });
        }
    } catch (error) {
        console.error('Stripe Verification Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    checkout,
    paymentVerification,
};
