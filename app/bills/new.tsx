import { BillForm, type BillFormSchema } from "@/components/forms/BillForm";
import { addBill } from "@/state/crud";
import { dollarsToCents } from "@/utils/currency";
import { getDate, getDayOfYear } from "date-fns";
import { useNavigation } from "expo-router";
import {
  SheetHeaderCloseButton,
  SheetHeaderContainer,
} from "react-native-orchard";

export default function NewBill() {
  const navigation = useNavigation();

  const onSubmit = (data: BillFormSchema) => {
    addBill({
      name: data.name,
      amount: dollarsToCents(data.amount),
      autoPay: data.autoPay,
      due: {
        type: data.dueEvery,
        dayOfMonth: data.dueEvery === "monthly" ? getDate(data.dueDate) : 0,
        dayOfYear: data.dueEvery === "yearly" ? getDayOfYear(data.dueDate) : 0,
      },
    });
    navigation.goBack();
  };

  return (
    <>
      <SheetHeaderContainer>
        <SheetHeaderCloseButton />
      </SheetHeaderContainer>
      <BillForm onSubmit={onSubmit} />
    </>
  );
}
