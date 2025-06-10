import {
  addMonths,
  addYears,
  getDaysInMonth,
  getDaysInYear,
  isAfter,
  isEqual,
  isWithinInterval,
  setDate as setDayOfMonth,
  setDayOfYear,
} from "date-fns";
import * as Crypto from "expo-crypto";

import type { Bill, OptionalKeys, Paycheck } from "./types";

/**
 * Gets the next due date of a bill.
 *
 * @param bill - The bill to get the next due date for.
 * @returns The next due date of the bill.
 */
export function getNextBillDueDate(bill: Bill, date = new Date()): Date {
  switch (bill.due.type) {
    case "monthly":
      const daysInMonth = getDaysInMonth(date);
      let billDueDayOfMonth = bill.due.dayOfMonth;
      if (billDueDayOfMonth > daysInMonth) {
        billDueDayOfMonth = daysInMonth;
      }

      const dueDate = setDayOfMonth(date, billDueDayOfMonth);

      if (isEqual(dueDate, date) || isAfter(dueDate, date)) {
        return dueDate;
      }

      return addMonths(dueDate, 1);
    case "yearly":
      const nextYear = addYears(date, 1);
      const daysInNextYear = getDaysInYear(nextYear);
      if (bill.due.dayOfYear > daysInNextYear) {
        // If the day doesn't exist in the next year (e.g., Feb 29 in non-leap year),
        // use the last day of the year
        return setDayOfYear(nextYear, daysInNextYear);
      }

      return setDayOfYear(nextYear, bill.due.dayOfYear);
  }
}

/**
 * Checks if a bill is due on a given paycheck date.
 *
 * @param bill - The bill to check.
 * @param paycheck - The paycheck to check against.
 * @returns True if the bill is due during the duration of the paycheck.
 */
export function isMatchingBill(
  bill: Bill,
  paycheck: OptionalKeys<Paycheck, "id" | "bills">
): boolean {
  const dueDate = getNextBillDueDate(bill, paycheck.dateReceived);

  if (!dueDate) {
    return false;
  }

  return isWithinInterval(dueDate, {
    start: paycheck.dateReceived,
    end: paycheck.nextPaycheckDate,
  });
}

export function getPaycheckBills(
  paycheck: OptionalKeys<Paycheck, "id" | "bills">,
  bills: Bill[]
): Bill[] {
  return bills.filter((bill) => isMatchingBill(bill, paycheck));
}

export function id(): string {
  return Crypto.randomUUID();
}

export function sumBy(collection: any[], key: string): number {
  return collection.reduce((acc, item) => acc + item[key], 0);
}
