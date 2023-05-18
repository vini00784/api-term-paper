const Stripe = require('stripe')



class PaymentStripe {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_KEY, { apiVersion: '2022-11-15 '});
    }
    async createSession(data) {
        // console.log(data);
        const session = await this.stripe.checkout.sessions.create({
            success_url: `${process.env.BASE_URL}/redirect`,
            cancel_url:`${process.env.BASE_URL}/redirect`,
            mode: 'payment',
            line_items: data.products.map((item) => ({
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: item.name,
                        images: item.images.map((image) => image),
                        description: item.description
                    },
                    unit_amount: item.price,
                },
                quantity: 1,
            }))
        });
        return session;
    }
}

const paymentStripe = new PaymentStripe;


module.exports = { paymentStripe }