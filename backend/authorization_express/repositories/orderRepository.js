// REPOSITORY:
// Kapselt den Datenzugriff:
// - Datenbank
// - Dateien
// - externe APIs
// Sagt: WO liegen die Daten?

/******** Merksatz: ********
*👉 Repositories speichern.*
****************************/

import mysql from 'mysql2/promise';

const repository = {
    getOrders
};

const connection = await mysql.createConnection({
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  database: process.env.MARIADB_DB,
  port: Number.parseInt(process.env.MARIADB_PORT),
  password: process.env.MARIADB_PASSWORD
});

await connection.connect();

const orders = [
    {
        id: 1,
        customer_id: 1337,
        sum: 999.9,
        products: [
            {
                id: 4711,
                description: 'notebook xyz',
                price: 899.9
            },
            {
                id: 4712,
                description: 'notebook protection case',
                price: 100
            }
        ]
    },
    {
        id: 2,
        customer_id: 815,
        sum: 99.9,
        products: [
            {
                id: 4710,
                description: 'smartwatch made in china',
                price: 99.9
            }
        ]
    }
];

async function getOrders(filterString) {
    try {
        const [results] = await connection.query(
            `SELECT * FROM orders
            WHERE 1 = 1
            AND sum >= ?`,
            [filterString]
        );

        return results;
    } catch (err) {
        console.log(err);
    }

    return null;
    /*return orders
        .filter(order => order.products
                            .find(p => p.description.toLowerCase().includes(filterString.toLowerCase())));*/
}

export default repository;