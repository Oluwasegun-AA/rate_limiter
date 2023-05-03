import { Pool } from 'pg';
import dotenv from 'dotenv';
import { ResponseHandler, statusCodes } from '../helpers';

const { serverError } = statusCodes;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', error => {
  process.stdout.write('Unexpected error on idle client');
  console.log({ error });
});

const query = async (queryObj, res) => {
  const client = await pool.connect();
  try {
    const response = await client.query(queryObj);
    return response.rows;
  } catch (err) {
    res ? ResponseHandler.error(res, serverError, 'Internal server error') : console.log(err) ;
  }
};

export default query;
