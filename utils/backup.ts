import { format } from "date-fns";
import { File, Paths } from "expo-file-system/next";
import * as Sharing from "expo-sharing";
import papa from "papaparse";
import { appState$ } from "../state/app";
import { centsToDollars } from "./currency";

export function getBillsCsv() {
  return papa.unparse(
    appState$.bills.peek().map((bill) => ({
      name: bill.name,
      amount: centsToDollars(bill.amount),
      autoPay: bill.autoPay ? "true" : "false",
      dueType: bill.due.type,
      dueDayOf:
        bill.due.type === "monthly" ? bill.due.dayOfMonth : bill.due.dayOfYear,
    })),
    {
      header: true,
      columns: ["name", "amount", "autoPay", "dueType", "dueDayOf"],
    }
  );
}

export function getPaychecksCsv() {
  return papa.unparse(
    appState$.paychecks.peek().map((paycheck) => ({
      amount: centsToDollars(paycheck.amount),
      dateReceived: format(paycheck.dateReceived, "yyyy-MM-dd"),
      nextPaycheckDate: format(paycheck.nextPaycheckDate, "yyyy-MM-dd"),
    })),
    {
      header: true,
      columns: ["amount", "dateReceived", "nextPaycheckDate"],
    }
  );
}

export function backup(type: "bills" | "paychecks", csv: string) {
  const file = new File(
    Paths.cache,
    `${type}-${format(new Date(), "yyyy-MM-dd")}.csv`
  );
  file.write(csv);
  Sharing.shareAsync(file.uri);
}

export function backupBills() {
  backup("bills", getBillsCsv());
}

export function backupPaychecks() {
  backup("paychecks", getPaychecksCsv());
}
