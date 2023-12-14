const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");
const { sqlForPartialUpdate } = require('./sql');
const { BadRequestError } = require('../expressError');

describe("createToken", function () {
  test("works: not admin", function () {
    const token = createToken({ username: "test", is_admin: false });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: false,
    });
  });

  test("works: admin", function () {
    const token = createToken({ username: "test", isAdmin: true });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: true,
    });
  });

  test("works: default no admin", function () {
    // given the security risk if this didn't work, checking this specifically
    const token = createToken({ username: "test" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "test",
      isAdmin: false,
    });
  });
});

describe('sqlForPartialUpdate', () => {
  test('generates correct SQL for partial update with bvalid input', () => {
    const dataToUpdate = { firstName: 'David', age: 31 };
    const jsToSql = { firstName: 'first_name' };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result.setCols).toEqual('"first_name"=$1, "age"=$2');
    expect(result.values).toEqual(['David', 31]);
  });

  test('throws BadRequestError when no data is provided', () => {
    const dataToUpdate = {};
    const jsToSql = { firstName: 'first_name' };

    expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(BadRequestError);
  });
});
