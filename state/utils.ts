import {
  addMonths,
  addYears,
  getDaysInMonth,
  getDaysInYear,
  isWithinInterval,
  setDate,
  setDayOfYear,
} from "date-fns";
import * as Crypto from "expo-crypto";

import type { Bill, Paycheck } from "./types";

/**
 * Gets the next due date of a bill. Should only used outside of the context of a paycheck.
 *
 * @param bill - The bill to get the next due date for.
 * @returns The next due date of the bill. If the bill is not due on the given date, returns undefined.
 */
export function getNextBillDueDate(bill: Bill, date = new Date()): Date {
  switch (bill.due.type) {
    case "monthly":
      if (bill.due.index > getDaysInMonth(date)) {
        return setDate(date, bill.due.index);
      } else {
        return addMonths(setDate(date, bill.due.index), 1);
      }
    case "yearly":
      if (bill.due.index > getDaysInYear(date)) {
        return setDayOfYear(date, bill.due.index);
      } else {
        return addYears(setDayOfYear(date, bill.due.index), 1);
      }
  }
}

/**
 * Gets the due date of a bill for a given paycheck.
 *
 * @param bill - The bill to get the due date for.
 * @param paycheck - The paycheck to get the due date for.
 * @returns The due date of the bill for the given paycheck.
 */
export function getBillDueDate(
  bill: Bill,
  paycheck: Paycheck
): Date | undefined {
  return getNextBillDueDate(bill, paycheck.dateReceived);
}

/**
 * Checks if a bill is due on a given paycheck date.
 *
 * @param bill - The bill to check.
 * @param paycheck - The paycheck to check against.
 * @returns True if the bill is due during the duration of the paycheck.
 */
export function isMatchingBill(bill: Bill, paycheck: Paycheck): boolean {
  const dueDate = getBillDueDate(bill, paycheck);

  if (!dueDate) {
    return false;
  }

  return isWithinInterval(dueDate, {
    start: paycheck.dateReceived,
    end: paycheck.nextPaycheckDate,
  });
}

export function getPaycheckBills(paycheck: Paycheck, bills: Bill[]): Bill[] {
  return bills.filter((bill) => isMatchingBill(bill, paycheck));
}

export function id(): string {
  return Crypto.randomUUID();
}
