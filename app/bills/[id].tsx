import { BillForm, type BillFormSchema } from "@/components/forms/BillForm";
import { updateBill } from "@/state/crud";
import { centsToDollars, dollarsToCents } from "@/utils/currency";
import { use$ } from "@legendapp/state/react";
import { getDate, getDayOfYear, setDate, setDayOfYear } from "date-fns";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { Typography, useTheme } from "react-native-orchard";
import { appState$ } from "../../state/app";

export default function BillPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spacing } = useTheme();
  const navigation = useNavigation();
  const bill = use$(appState$.bills.get().find((b) => b.id === id));

  const onSubmit = (data: BillFormSchema) => {
    updateBill(id, {
      name: data.name,
      amount: dollarsToCents(data.amount),
      autoPay: data.autoPay,
      due:
        data.dueEvery === "monthly"
          ? {
              type: "monthly",
              dayOfMonth: getDate(data.dueDate),
            }
          : {
              type: "yearly",
              dayOfYear: getDayOfYear(data.dueDate),
            },
    });
    navigation.goBack();
  };

  if (!bill) {
    return <Typography>Bill not found</Typography>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackTitle: "Bills",
        }}
      />
      <ScrollView contentContainerStyle={{ paddingTop: spacing.lg }}>
        <BillForm
          defaultValues={{
            name: bill.name,
            amount: centsToDollars(bill.amount).toFixed(2),
            autoPay: bill.autoPay,
            dueEvery: bill.due.type,
            dueDate:
              bill.due.type === "monthly"
                ? setDate(new Date(), bill.due.dayOfMonth)
                : setDayOfYear(new Date(), bill.due.dayOfYear),
          }}
          onSubmit={onSubmit}
          submitLabel="Save"
        />
      </ScrollView>
    </>
  );
}
