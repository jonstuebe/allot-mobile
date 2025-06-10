import { appState$ } from "@/state/app";
import { getPaycheckBills, sumBy } from "@/state/utils";
import { use$ } from "@legendapp/state/react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays } from "date-fns";
import { useRouter } from "expo-router";
import { useMemo } from "react";
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
  SectionHeader,
  SheetHeaderCloseButton,
  SheetHeaderContainer,
  Typography,
  useTheme,
} from "react-native-orchard";
import { addPaycheck } from "../../state/crud";
import {
  centsToDollars,
  dollarsToCents,
  formatDollars,
} from "../../utils/currency";

export default function NewPaycheck() {
  const { spacing } = useTheme();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      amount: "",
      dateReceived: new Date(),
      nextPaycheckDate: addDays(new Date(), 14),
    },
  });

  const onSubmit = handleSubmit((data) => {
    addPaycheck({
      amount: dollarsToCents(Number(data.amount)),
      dateReceived: data.dateReceived,
      nextPaycheckDate: data.nextPaycheckDate,
    });
    router.dismiss();
  });

  const data = watch();
  const curBills = use$(appState$.bills.get());
  const paycheckBills = useMemo(() => {
    return getPaycheckBills(
      {
        amount: dollarsToCents(Number(data.amount)),
        dateReceived: data.dateReceived,
        nextPaycheckDate: data.nextPaycheckDate,
      },
      curBills
    );
  }, [data, curBills]);
  console.log("paycheckBills", paycheckBills);

  return (
    <>
      <SheetHeaderContainer>
        <SheetHeaderCloseButton />
      </SheetHeaderContainer>
      <ListContainer>
        <SectionContainer>
          <SectionHeader>Details</SectionHeader>
          <SectionContent>
            <RowContainer>
              <RowLabel>Amount</RowLabel>
              <RowTrailing>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <RowTextInput
                      placeholder="Enter Amount"
                      keyboardType="decimal-pad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      style={{
                        fontSize: 16,
                      }}
                    />
                  )}
                />
              </RowTrailing>
            </RowContainer>
            <RowContainer>
              <RowLabel>Received On</RowLabel>
              <RowTrailing>
                <Controller
                  control={control}
                  name="dateReceived"
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      value={value}
                      onChange={(_event, selectedDate) => {
                        if (selectedDate) {
                          onChange(selectedDate);
                          setValue(
                            "nextPaycheckDate",
                            addDays(selectedDate, 14)
                          );
                        }
                      }}
                      mode="date"
                      display="compact"
                      style={{
                        marginVertical: -1 * spacing.xs,
                      }}
                    />
                  )}
                />
              </RowTrailing>
            </RowContainer>
            <RowContainer>
              <RowLabel>Next Paycheck</RowLabel>
              <RowTrailing>
                <Controller
                  control={control}
                  name="nextPaycheckDate"
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      value={value}
                      onChange={(_event, selectedDate) => {
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                      mode="date"
                      display="compact"
                      style={{
                        marginVertical: -1 * spacing.xs,
                      }}
                    />
                  )}
                />
              </RowTrailing>
            </RowContainer>
          </SectionContent>
        </SectionContainer>

        <SectionContainer>
          <SectionHeader>Preview</SectionHeader>
          <SectionContent>
            <RowContainer>
              <RowLabel>Bills</RowLabel>
              <RowTrailing>
                <Typography color="labelPrimary">
                  {formatDollars(
                    centsToDollars(sumBy(paycheckBills, "amount"))
                  )}
                </Typography>
              </RowTrailing>
            </RowContainer>
            <RowContainer>
              <RowLabel>Remainder</RowLabel>
              <RowTrailing>
                <Typography color="labelPrimary">
                  {formatDollars(
                    centsToDollars(
                      dollarsToCents(Number(data.amount)) -
                        sumBy(paycheckBills, "amount")
                    )
                  )}
                </Typography>
              </RowTrailing>
            </RowContainer>
          </SectionContent>
        </SectionContainer>
        <Button onPress={onSubmit}>Add Paycheck</Button>
      </ListContainer>
    </>
  );
}
