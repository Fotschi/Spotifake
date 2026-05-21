import repository from '../repositories/orderRepository.js';
import ValidationError from '../errors/ValidationError.js';

// SERVICE:
// Enthält die Business-Logik:
// - Regeln
// - Validierungen
// - Entscheidungen
// Kennt kein HTTP.
// Sagt: WIE funktioniert es fachlich?

/***** Merksatz: ****
*👉 Services denken.*
*********************/

const service = {
    getOrders
};

async function getOrders(query) {
    if (query === undefined) throw new ValidationError('query parameter q is missing!');
    
    return await repository.getOrders(query);
}

export default service;