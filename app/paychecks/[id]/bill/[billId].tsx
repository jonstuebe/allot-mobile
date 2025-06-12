import { appState$ } from "@/state/app";
import { updatePaycheckBill } from "@/state/crud";
import { centsToDollars, dollarsToCents } from "@/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { use$ } from "@legendapp/state/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ListContainer,
  RowContainer,
  RowLabel,
  RowTextInput,
  RowTrailing,
  SectionContainer,
  SectionContent,
  SheetHeaderCloseButton,
  SheetHeaderContainer,
} from "react-native-orchard";
import { z } from "zod";

export default function BillAllocationScreen() {
  const router = useRouter();
  const { id: paycheckId, billId } = useLocalSearchParams<{
    id: string;
    billId: string;
  }>();

  const paycheck = use$(() =>
    appState$.paychecks.get().find((p) => p.id === paycheckId)
  );
  const bill = paycheck?.bills.find((b) => b.id === billId);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      amount: centsToDollars(bill?.amount ?? 0).toString(),
    },
    resolver: zodResolver(
      z.object({
        amount: z
          .string()
          .nonempty("Amount is required")
          .refine((val) => !isNaN(Number(val)), {
            message: "Amount must be a valid number",
          })
          .transform((val) => Number(val))
          .refine((val) => val > 0, {
            message: "Amount must be greater than 0",
          }),
      })
    ),
  });

  const onSubmit = handleSubmit(({ amount }) => {
    updatePaycheckBill(paycheckId, billId, {
      amount: dollarsToCents(amount),
    });

    router.back();
  });

  return (
    <>
      <SheetHeaderContainer>
        <SheetHeaderCloseButton />
      </SheetHeaderContainer>

      <ListContainer>
        <SectionContainer>
          <SectionContent>
            <RowContainer>
              <RowLabel>Amount</RowLabel>
              <RowTrailing>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, value } }) => (
                    <RowTextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      onSubmitEditing={onSubmit}
                      autoFocus
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    />
                  )}
                />
              </RowTrailing>
            </RowContainer>
          </SectionContent>
        </SectionContainer>
        <Button
          onPress={onSubmit}
          variant={isValid ? "filled" : "tinted"}
          disabled={!isValid}
        >
          Update
        </Button>
      </ListContainer>
    </>
  );
}
