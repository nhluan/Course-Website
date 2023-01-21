// MYSQL_ADDON_HOST=bzjcd1eqx0l3pe2bjvqz-mysql.services.clever-cloud.com
// MYSQL_ADDON_DB=bzjcd1eqx0l3pe2bjvqz
// MYSQL_ADDON_USER=ueipdkh8tl2mtmu1
// MYSQL_ADDON_PORT=3306
// MYSQL_ADDON_PASSWORD=hV7XyjYJJpud3qXqFHZH
// MYSQL_ADDON_URI=mysql://ueipdkh8tl2mtmu1:hV7XyjYJJpud3qXqFHZH@bzjcd1eqx0l3pe2bjvqz-mysql.services.clever-cloud.com:3306/bzjcd1eqx0l3pe2bjvqz

import knexObj from 'knex';
import dotenv from "dotenv"
dotenv.config();

export const connection = {
    host: process.env.HOST_DB,
    port: process.env.POST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE,
};

const knex = knexObj({
    client: 'mysql2',
    connection: connection,
    pool: { min: 0, max: 10 },
});



export default knex;
