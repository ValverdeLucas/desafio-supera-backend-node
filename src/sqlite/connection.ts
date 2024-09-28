import knex, { Knex } from "knex";
import { sqlite3 } from "sqlite3";

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './src/sqlite/database/database-desafio-supera.db'
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 1,
    }
})

export { db };