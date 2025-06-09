import { observable } from "@legendapp/state";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { syncObservable } from "@legendapp/state/sync";

import type { Bill, Paycheck } from "./types";

export type AppState = {
  bills: Bill[];
  paychecks: Paycheck[];
};

export const appState$ = observable<AppState>({
  bills: [],
  paychecks: [],
});

syncObservable(appState$, {
  persist: {
    name: "app",
    plugin: ObservablePersistMMKV,
  },
});
