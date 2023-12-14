"use strict";

const db = require("../db");
const Job = require("./jobs");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** getAll */

describe("getAll", function () {
  test("works", async function () {
    const jobs = await Job.getAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j1",
        salary: 100000,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "j2",
        salary: 120000,
        equity: "0.05",
        companyHandle: "c2",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    const job = await Job.get(1);
    expect(job).toEqual({
      id: 1,
      title: "j1",
      salary: 100000,
      equity: "0.1",
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      fail();
    } catch (err) {
      expect(err.message).toEqual("No job: 0");
    }
  });
});


/************************************** update */

describe("update", function () {
  test("works", async function () {
    const job = await Job.update(1, {
      title: "j1-new",
      salary: 110000,
    });
    expect(job).toEqual({
      id: 1,
      title: "j1-new",
      salary: 110000,
      equity: "0.1",
      companyHandle: "c1",
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
        FROM jobs
        WHERE id = 1`
    );
    expect(result.rows).toEqual([
      {
        id: 1,
        title: "j1-new",
        salary: 110000,
        equity: "0.1",
        companyHandle: "c1",
      },
    ]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(0, {
        title: "j0-new",
      });
      fail();
    } catch (err) {
      expect(err.message).toEqual("No job: 0");
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err.message).toEqual("No data");
    }
  });
});

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new",
    salary: 100000,
    equity: "0.1",
    companyHandle: "c1",
  };

  test("works", async function () {
    const job = await Job.create(newJob);
    expect(job).toEqual({
      id: expect.any(Number),
      title: "new",
      salary: 100000,
      equity: "0.1",
      companyHandle: "c1",
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
        FROM jobs
        WHERE id = $1`,
      [job.id]
    );
    expect(result.rows).toEqual([
      {
        id: job.id,
        title: "new",
        salary: 100000,
        equity: "0.1",
        companyHandle: "c1",
      },
    ]);
  });

  test("not found if no such company", async function () {
    try {
      await Job.create({
        title: "new",
        salary: 100000,
        equity: "0.1",
        companyHandle: "nope",
      });
      fail();
    } catch (err) {
      expect(err.message).toEqual("Company not found: nope");
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    const jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j1",
        salary: 100000,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "j2",
        salary: 120000,
        equity: "0.05",
        companyHandle: "c2",
      },
    ]);
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
      "SELECT id FROM jobs WHERE id=1"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
      fail();
    } catch (err) {
      expect(err.message).toEqual("No job: 0");
    }
  });
});

/************************************** getJobsForCompany */

describe("getJobsForCompany", function () {
  test("works", async function () {
    const jobs = await Job.getJobsForCompany("c1");
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "j1",
        salary: 100000,
        equity: "0.1",
        companyHandle: "c1",
      },
    ]);
  });

  test("not found if no such company", async function () {
    try {
      await Job.getJobsForCompany("nope");
      fail();
    } catch (err) {
      expect(err.message).toEqual("Job.getJobsForCompany is not a function");
    }
  });
});