import service from '../services/orderService.js';

// CONTROLLER:
// Kümmert sich um HTTP:
// - liest Request (request)
// - setzt Statuscodes & Response (response)
// - ruft Services auf
// Sagt: WAS kommt rein, WAS geht raus?

/********* Merksatz: **********
*👉 Controller sprechen HTTP.*
******************************/

export async function getOrders(request, response) {
    const queryParameter = request.query['q'];
    
    response
        .status(200)
        .json(await service.getOrders(queryParameter));
}