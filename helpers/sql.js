const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
/**
 * Generates SQL for a partial update query based on the provided data.
 *
 * @param {Object} dataToUpdate - An object containing the data to be updated.
 * @param {Object} jsToSql - An object mapping JavaScript property names to SQL column names.
 * @returns {Object} - An object with two properties: setCols (a string of SQL columns and placeholders),
 *                    and values (an array of corresponding values).
 * @throws {BadRequestError} - If no data is provided for the update.
 */


function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
