export interface Bill {
  id: string;
  name: string;
  amount: number;
  autoPay: boolean;
  due:
    | { type: "monthly"; dayOfMonth: number }
    | { type: "yearly"; dayOfYear: number };
}

export interface Paycheck {
  id: string;
  amount: number;
  dateReceived: Date;
  nextPaycheckDate: Date;
  bills: Bill[];
}

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
