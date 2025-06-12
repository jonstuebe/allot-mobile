import { appState$ } from "./app";
import type { Bill, Paycheck } from "./types";
import { getPaycheckBills, id } from "./utils";

export function addBill(bill: Omit<Bill, "id">) {
  appState$.bills.push({
    ...bill,
    id: id(),
  });
}

export function removeBill(id: string) {
  appState$.bills.set(
    appState$.bills
      .peek()
      .filter((bill) => (bill.id as unknown as string) !== id)
  );
}

export function updateBill(id: string, updates: Partial<Bill>) {
  appState$.bills.set(
    appState$.bills.peek().map((bill) => {
      if ((bill.id as unknown as string) === id) {
        return { ...bill, ...updates };
      }

      return bill;
    })
  );
}

export function addPaycheck(paycheck: Omit<Paycheck, "id" | "bills">) {
  const uuid = id();

  appState$.paychecks.push({
    ...paycheck,
    id: uuid,
    bills: getPaycheckBills({ ...paycheck, id: uuid }, appState$.bills.peek()),
  });

  return uuid;
}

export function addBillsToPaycheck(paycheck: Paycheck, bills: Bill[]) {
  updatePaycheck(paycheck.id, { bills: [...paycheck.bills, ...bills] });
}

export function removeBillFromPaycheck(paycheck: Paycheck, bill: Bill) {
  updatePaycheck(paycheck.id, {
    bills: paycheck.bills.filter((b) => b.id !== bill.id),
  });
}

export function removePaycheck(id: string) {
  appState$.paychecks.set(
    appState$.paychecks
      .peek()
      .filter((paycheck) => (paycheck.id as unknown as string) !== id)
  );
}

export function updatePaycheck(id: string, updates: Partial<Paycheck>) {
  appState$.paychecks.set(
    appState$.paychecks.peek().map((paycheck) => {
      if ((paycheck.id as unknown as string) === id) {
        return { ...paycheck, ...updates };
      }

      return paycheck;
    })
  );
}

export function refreshPaycheckBills(paycheck: Paycheck) {
  const bills = getPaycheckBills(paycheck, appState$.bills.peek());
  updatePaycheck(paycheck.id, { bills });
}
