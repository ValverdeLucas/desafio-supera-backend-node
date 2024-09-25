import knex, { Knex } from "knex";

export const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './src/sqlite/database-desafio-supera.db'
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 1,
    }
})