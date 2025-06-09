import { describe, expect, test } from "vitest";
import { isMatchingBill } from "./utils";

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
    const bill = {
      id: "1",
      name: "Test Bill",
      amount: 1_995,
      due: { type: "yearly", index: 195 } as const,
      autoPay: false,
    };

    const paycheck = {
      id: "1",
      dateReceived: new Date("2024-07-01"),
      nextPaycheckDate: new Date("2024-07-15"),
      amount: 200_000,
      bills: [],
    };

    expect(isMatchingBill(bill, paycheck)).toBe(true);
  });
});
