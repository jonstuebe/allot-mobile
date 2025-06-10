import { describe, expect, test } from "vitest";
import { getNextBillDueDate } from "./utils";

function date(year: number, month: number, day: number) {
  return new Date(year, month - 1, day);
}

describe("getNextBillDueDate", () => {
  test("monthly", () => {
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
  });

  test("if month doesn't have the proper amount of days", () => {
    expect(
      getNextBillDueDate(
        {
          id: "1",
          name: "Test Bill",
          amount: 1_995,
          due: { type: "monthly", dayOfMonth: 31 } as const,
          autoPay: false,
        },
        date(2024, 2, 15)
      )
    ).toEqual(date(2024, 2, 29));
  });

  test("monthly (leap year)", () => {
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
    ).toEqual(date(2024, 2, 29));
  });

  test("yearly", () => {
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
  });

  test("yearly (leap year)", () => {
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
