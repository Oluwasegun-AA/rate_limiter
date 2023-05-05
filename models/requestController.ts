import query from '../db/dbSetup';

const arrangeValues = (item, replaceQuotes='') => {
  const value = `(${item.reduce((ac, c) => {
    if (ac) {
      return `${ac}","${c}`;
    }
    return `"${c}`;
  }, undefined)}")`;
  return replaceQuotes ? value.replace(/"/g, "'") : value;
};

class Request {
  static async findOne(req, res, table, column) {
    const value = req.body[column];
    const queryText = `SELECT * FROM "${table}" WHERE "${column}"='${value}';`;
    const resp = await query(queryText, res);
    return await resp[0];
  }

  static async findTokenUser(req, res) {
    const value = req.user['email'];
    const queryText = `SELECT * FROM "Users" WHERE "email"='${value}';`;
    const resp = await query(queryText, res);
    return resp[0];
  }

  static async post(res, table, values) {
    const queryText = `INSERT INTO "${table}" ${arrangeValues(
      Object.keys(values)
    )} VALUES ${arrangeValues(
      Object.values(values),
      'singleQuote'
    )} returning *;`;
    const resp = await query(queryText, res);
    return resp[0];
  }
}

export default Request;
