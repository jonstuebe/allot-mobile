import { observable } from "@legendapp/state";

import { startOfDay } from "date-fns";
import type { Bill, Paycheck } from "./types";
import { id } from "./utils";

export type AppState = {
  bills: Bill[];
  paychecks: Paycheck[];
};

const initialBills: Bill[] = [
  {
    id: id(),
    name: "Rent",
    amount: 1_995,
    due: { type: "monthly", dayOfMonth: 1 },
    autoPay: false,
  },
  {
    id: id(),
    name: "Electricity",
    amount: 1_000,
    due: { type: "monthly", dayOfMonth: 12 },
    autoPay: false,
  },
];

export const appState$ = observable<AppState>({
  bills: initialBills,
  paychecks: [
    {
      id: id(),
      amount: 5_232 * 100,
      dateReceived: startOfDay(new Date(2025, 5, 1)),
      nextPaycheckDate: startOfDay(new Date(2025, 5, 15)),
      bills: initialBills,
    },
  ],
});

// syncObservable(appState$, {
//   persist: {
//     name: "app",
//     plugin: ObservablePersistMMKV,
//   },
// });
