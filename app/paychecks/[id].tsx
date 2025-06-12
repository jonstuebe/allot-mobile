import { HeaderActions } from "@/components/HeaderActions";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { appState$ } from "@/state/app";
import { getNextBillDueDate, sumBy } from "@/state/utils";
import { centsToDollars, formatDollars } from "@/utils/currency";
import { use$ } from "@legendapp/state/react";
import { format } from "date-fns";
import {
  Link,
  Redirect,
  Stack,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { ActionSheetIOS, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {
  ListContainer,
  PressableOpacity,
  RowContainer,
  RowContent,
  RowLabel,
  RowTrailing,
  SectionContainer,
  SectionContent,
  SectionHeader,
  Typography,
  spacing,
  useTheme,
} from "react-native-orchard";
import { refreshPaycheckBills, removeBillFromPaycheck } from "../../state/crud";

export default function PaycheckDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
          headerRight: () => (
            <HeaderActions>
              <PressableOpacity
                onPress={() => {
                  ActionSheetIOS.showActionSheetWithOptions(
                    {
                      title: "Refresh Bills",
                      message: "Are you sure you want to refresh the bills?",
                      options: ["Refresh", "Cancel"],
                      cancelButtonIndex: 1,
                      destructiveButtonIndex: 0,
                    },
                    (selectedIndex) => {
                      if (selectedIndex === 0) {
                        refreshPaycheckBills(paycheck);
                      }
                    }
                  );
                }}
              >
                <IconSymbol
                  name="arrow.clockwise"
                  size={24}
                  color={colors.blue}
                />
              </PressableOpacity>
              <Link href={`/paychecks/${id}/add`}>
                <IconSymbol name="plus" size={24} color={colors.blue} />
              </Link>
            </HeaderActions>
          ),
        }}
      />
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingVertical: spacing.lg,
        }}
      >
        <ListContainer>
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
                <Swipeable
                  overshootRight={false}
                  overshootLeft={false}
                  renderRightActions={(prog, drag, actions) => (
                    <PressableOpacity
                      onPress={() => {
                        actions.close();
                        Alert.alert(
                          "Delete Bill",
                          "Are you sure you want to delete this bill?",
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => {
                                removeBillFromPaycheck(paycheck, bill);
                              },
                            },
                          ]
                        );
                      }}
                      style={{
                        backgroundColor: colors.red,
                        justifyContent: "center",
                        paddingHorizontal: spacing.lg,
                      }}
                    >
                      <Typography
                        variant="bodyRegular"
                        color="white"
                        style={{ fontWeight: "500" }}
                      >
                        Delete
                      </Typography>
                    </PressableOpacity>
                  )}
                  key={idx}
                >
                  <RowContainer rounded={false}>
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
                </Swipeable>
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
