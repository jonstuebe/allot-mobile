import {
  isSameMonth,
  isSameYear,
  isWithinInterval,
  setDate,
  setDayOfYear,
} from "date-fns";
import * as Crypto from "expo-crypto";

import type { Bill, Paycheck } from "./types";

/**
 * Checks if a bill is due on a given paycheck date.
 *
 * @param bill - The bill to check.
 * @param paycheck - The paycheck to check against.
 * @returns True if the bill is due during the duration of the paycheck.
 */
export function isMatchingBill(bill: Bill, paycheck: Paycheck): boolean {
  let dueDate: Date;

  switch (bill.due.type) {
    case "monthly":
      if (isSameMonth(paycheck.dateReceived, paycheck.nextPaycheckDate)) {
        dueDate = setDate(paycheck.dateReceived, bill.due.index);
      } else {
        dueDate = setDate(paycheck.nextPaycheckDate, bill.due.index);
      }
      break;
    case "yearly":
      if (isSameYear(paycheck.dateReceived, paycheck.nextPaycheckDate)) {
        dueDate = setDayOfYear(paycheck.dateReceived, bill.due.index);
      } else {
        dueDate = setDayOfYear(paycheck.nextPaycheckDate, bill.due.index);
      }
      break;
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
