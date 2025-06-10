import { appState$ } from "@/state/app";
import { centsToDollars, formatDollars } from "@/utils/currency";
import { use$ } from "@legendapp/state/react";
import { format } from "date-fns";
import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import {
  ListContainer,
  RowContainer,
  RowContent,
  RowLabel,
  RowTrailing,
  SectionContainer,
  SectionContent,
  SectionHeader,
  Typography,
  spacing,
} from "react-native-orchard";
import { getNextBillDueDate, sumBy } from "../../state/utils";

export default function PaycheckDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const paycheck = use$(() =>
    appState$.paychecks.get().find((p) => p.id === id)
  );

  if (!paycheck) {
    return <Redirect href="/paychecks" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitle: "Paychecks",
          // TODO: add a reload bills button
          // headerRight: () => (
          //   <HeaderActions>
          //     <PressableOpacity onPress={() => router.push("/paychecks/new")}>
          //       <IconSymbol name="plus.circle" size={24} color={colors.blue} />
          //     </PressableOpacity>
          //   </HeaderActions>
          // ),
        }}
      />
      <ScrollView style={{ flex: 1 }}>
        <ListContainer style={{ marginTop: spacing.lg }}>
          <SectionContainer>
            <SectionHeader>Details</SectionHeader>
            <SectionContent>
              <RowContainer>
                <RowLabel>Amount</RowLabel>
                <RowTrailing>
                  <Typography variant="bodyRegular" color="labelPrimary">
                    {formatDollars(centsToDollars(paycheck.amount))}
                  </Typography>
                </RowTrailing>
              </RowContainer>
              <RowContainer>
                <RowLabel>Date Received</RowLabel>
                <RowTrailing>
                  <Typography variant="bodyRegular" color="labelPrimary">
                    {new Date(paycheck.dateReceived).toLocaleDateString()}
                  </Typography>
                </RowTrailing>
              </RowContainer>
              <RowContainer>
                <RowLabel>Next Paycheck</RowLabel>
                <RowTrailing>
                  <Typography variant="bodyRegular" color="labelPrimary">
                    {new Date(paycheck.nextPaycheckDate).toLocaleDateString()}
                  </Typography>
                </RowTrailing>
              </RowContainer>
            </SectionContent>
          </SectionContainer>
          <SectionContainer>
            <SectionHeader>Bills</SectionHeader>
            <SectionContent>
              {paycheck.bills.map((bill, idx) => (
                <RowContainer key={idx}>
                  <RowContent>
                    <RowLabel>{bill.name}</RowLabel>
                    <RowLabel variant="subtitle">
                      {format(getNextBillDueDate(bill), "MM/dd/yyyy")}
                    </RowLabel>
                  </RowContent>
                  <RowTrailing>
                    <Typography variant="bodyRegular" color="labelPrimary">
                      {formatDollars(centsToDollars(bill.amount))}
                    </Typography>
                  </RowTrailing>
                </RowContainer>
              ))}
            </SectionContent>
          </SectionContainer>
          <SectionContainer>
            <SectionHeader>Totals</SectionHeader>
            <SectionContent>
              <RowContainer>
                <RowLabel>Bills</RowLabel>
                <RowTrailing>
                  <Typography variant="bodyRegular" color="labelPrimary">
                    {formatDollars(
                      centsToDollars(sumBy(paycheck.bills, "amount"))
                    )}
                  </Typography>
                </RowTrailing>
              </RowContainer>
              <RowContainer>
                <RowLabel>Remainder</RowLabel>
                <RowTrailing>
                  <Typography variant="bodyRegular" color="labelPrimary">
                    {formatDollars(
                      centsToDollars(
                        paycheck.amount - sumBy(paycheck.bills, "amount")
                      )
                    )}
                  </Typography>
                </RowTrailing>
              </RowContainer>
            </SectionContent>
          </SectionContainer>
        </ListContainer>
      </ScrollView>
    </>
  );
}
