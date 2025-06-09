export interface Bill {
  id: string;
  name: string;
  amount: number;
  autoPay: boolean;
  due: {
    type: "monthly" | "yearly";
    index: number;
  };
}

export interface Paycheck {
  id: string;
  amount: number;
  dateReceived: Date;
  nextPaycheckDate: Date;
  bills: Bill[];
}
