import {
  addMonths,
  addYears,
  getDaysInMonth,
  getDaysInYear,
  isAfter,
  isWithinInterval,
  setDate,
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
      // Helper function to get a valid due date for a given month
      const getValidDueDateForMonth = (baseDate: Date): Date => {
        const daysInMonth = getDaysInMonth(baseDate);
        const adjustedDay = Math.min(
          (bill.due as { type: "monthly"; dayOfMonth: number }).dayOfMonth,
          daysInMonth
        );
        return setDate(baseDate, adjustedDay);
      };

      // Helper function to check if we should skip February for high day numbers
      const shouldSkipFebruary = (date: Date): boolean => {
        return (
          date.getMonth() === 1 &&
          (bill.due as { type: "monthly"; dayOfMonth: number }).dayOfMonth > 28
        ); // February is month 1 (0-indexed)
      };

      // Try the current month first, unless it's February and dayOfMonth > 28
      if (!shouldSkipFebruary(date)) {
        const currentMonthDueDate = getValidDueDateForMonth(date);
        if (isAfter(currentMonthDueDate, date)) {
          return currentMonthDueDate;
        }
      }

      // Move to next month(s) until we find a suitable month
      let nextMonth = addMonths(date, 1);
      while (shouldSkipFebruary(nextMonth)) {
        nextMonth = addMonths(nextMonth, 1);
      }

      return getValidDueDateForMonth(nextMonth);
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

  console.log("bill.name", bill.name, dueDate);

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
