'use strict';
const stripe = require("stripe")("sk_test_51JFovCK3IcH9x7mlEBj8XFGnk9ejt7SjIpQkc0h36wUdcsaNHiT9UVK41FjvJvM1aUatmttqIIXLiNDnqPWeCu2X00nSPDpar8");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx){
     const { addressShipping, idUser, tokenStripe, products} = ctx.request.body;

        let totalPayment = 0;
        products.forEach(product => {
         
            totalPayment += product.price * product.quantity
        });
      
        
        const charge = await stripe.charges.create({
            amount:totalPayment * 100,
            currency:"mxn",
            source:tokenStripe,
            description:`Compra existosa ID USER: ${idUser.id}`
        });


        
    

        const createOrder = [];
        for await (const product of products) {
          const data = {
            product: product.id,
            user: idUser.id,
            totalPayment: totalPayment,
            productsPayment: product.price * product.quantity,
            quantity: product.quantity,
            idPayment: charge.id,
            addressShipping,
          };
     
          const validData = await strapi.entityValidator.validateEntityCreation(
            strapi.models.order,
            data
          );
          const entry = await strapi.query("order").create(validData);
          createOrder.push(entry);
        }


        
        return createOrder;
    }
};
