import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system/next";
import Papa from "papaparse";
import z from "zod";
import { addBill, addPaycheck } from "../state/crud";
import { dollarsToCents } from "./currency";

export async function importCSV<T>(schema: z.ZodSchema<T>): Promise<T | null> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    type: "text/csv",
  });

  try {
    if (result.assets && result.assets[0]) {
      const file = new File(result.assets[0].uri);

      const { data } = Papa.parse(file.text(), {
        header: true,
        skipEmptyLines: true,
      });

      const parsed = schema.safeParse(data);

      if (parsed.success) {
        return parsed.data;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export async function importBills() {
  const data = await importCSV(
    z.array(
      z.object({
        name: z.string(),
        amount: z.coerce.number(),
        autoPay: z.coerce.boolean(),
        dueType: z.enum(["monthly", "yearly"]),
        dueDayOf: z.coerce.number(),
      })
    )
  );

  data?.forEach((bill) => {
    addBill({
      name: bill.name,
      amount: dollarsToCents(bill.amount),
      autoPay: bill.autoPay,
      due:
        bill.dueType === "monthly"
          ? {
              type: "monthly",
              dayOfMonth: bill.dueDayOf,
            }
          : {
              type: "yearly",
              dayOfYear: bill.dueDayOf,
            },
    });
  });
}

export async function importPaychecks() {
  const data = await importCSV(
    z.array(
      z.object({
        amount: z.coerce.number(),
        dateReceived: z.coerce.date(),
        nextPaycheckDate: z.coerce.date(),
      })
    )
  );

  data?.forEach((paycheck) => {
    addPaycheck({
      amount: dollarsToCents(paycheck.amount),
      dateReceived: paycheck.dateReceived,
      nextPaycheckDate: paycheck.nextPaycheckDate,
    });
  });
}
