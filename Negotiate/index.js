module.exports = function (context, req) {
    context.log('Negotiate function called');

    let iothubLocation = process.env['iothublocation'];

    context.res = {       
        body: iothubLocation
    };
   
    context.done();
};