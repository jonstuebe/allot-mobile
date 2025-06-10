import { describe, expect, test } from "vitest";
import { getNextBillDueDate, isMatchingBill } from "./utils";

function date(year: number, month: number, day: number) {
  return new Date(year, month - 1, day);
}

describe("isMatchingBill", () => {
  test("should return true if the bill is due on the paycheck date (monthly)", () => {
    expect(
      isMatchingBill(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "monthly", dayOfMonth: 1 } as const,
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

  test("should return true if the bill is due on the paycheck date (yearly)", () => {
    expect(
      isMatchingBill(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "yearly", dayOfYear: 12 } as const,
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
          due: { type: "monthly", dayOfMonth: 6 } as const,
          autoPay: false,
        },
        date(2024, 1, 15)
      )
    ).toEqual(date(2024, 2, 6));

    // leap year test
    expect(
      getNextBillDueDate(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "monthly", dayOfMonth: 29 } as const,
          autoPay: false,
        },
        date(2024, 2, 1)
      )
    ).toEqual(date(2024, 3, 29));
  });

  test("should return the next due date of a bill (yearly)", () => {
    expect(
      getNextBillDueDate(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "yearly", dayOfYear: 25 } as const,
          autoPay: false,
        },
        date(2024, 5, 1)
      )
    ).toEqual(date(2025, 1, 25));

    expect(
      getNextBillDueDate(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "yearly", dayOfYear: 364 } as const,
          autoPay: false,
        },
        date(2024, 12, 31)
      )
    ).toEqual(date(2025, 12, 30));
  });
});
