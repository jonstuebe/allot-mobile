import { describe, expect, test } from "vitest";
import { getNextBillDueDate, isMatchingBill } from "./utils";

describe("isMatchingBill", () => {
  test("should return true if the bill is due on the paycheck date (montly", () => {
    const bill = {
      id: "1",
      name: "Test Bill",
      amount: 1_995,
      due: { type: "monthly", index: 1 } as const,
      autoPay: false,
    };

    const paycheck = {
      id: "1",
      dateReceived: new Date("2024-01-01"),
      nextPaycheckDate: new Date("2024-01-15"),
      amount: 200_000,
      bills: [],
    };

    expect(isMatchingBill(bill, paycheck)).toBe(true);
  });

  test("should return true if the bill is due on the paycheck date (yearly)", () => {
    expect(
      isMatchingBill(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "yearly", index: 12 } as const,
          autoPay: false,
        },
        {
          id: "1",
          dateReceived: new Date("2024-01-01"),
          nextPaycheckDate: new Date("2024-01-15"),
          amount: 200_000,
          bills: [],
        }
      )
    ).toBe(true);
  });
});

describe("getNextBillDueDate", () => {
  test("should return the next due date of a bill (monthly)", () => {
    expect(
      getNextBillDueDate(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "monthly", index: 1 } as const,
          autoPay: false,
        },
        new Date("2024-01-01")
      )
    ).toEqual(new Date("2024-01-02"));
  });

  test("should return the next due date of a bill (yearly)", () => {
    expect(
      getNextBillDueDate(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "yearly", index: 24 } as const,
          autoPay: false,
        },
        new Date("2024-05-01")
      )
    ).toEqual(new Date("2025-01-25"));

    expect(
      getNextBillDueDate(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "yearly", index: 364 } as const,
          autoPay: false,
        },
        new Date("2024-12-31")
      )
    ).toEqual(new Date("2025-12-30"));
  });
});
