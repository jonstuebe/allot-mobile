import { observable } from "@legendapp/state";

import type { Bill, Paycheck } from "./types";
import { id } from "./utils";

export type AppState = {
  bills: Bill[];
  paychecks: Paycheck[];
};

export const appState$ = observable<AppState>({
  bills: [
    {
      id: id(),
      name: "Rent",
      amount: 1_995,
      due: { type: "monthly", index: 1 },
      autoPay: false,
    },
    {
      id: id(),
      name: "Electricity",
      amount: 100,
      due: { type: "monthly", index: 1 },
      autoPay: false,
    },
  ],
  paychecks: [],
});

// syncObservable(appState$, {
//   persist: {
//     name: "app",
//     plugin: ObservablePersistMMKV,
//   },
// });
