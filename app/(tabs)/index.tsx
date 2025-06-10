import { HeaderActions } from "@/components/HeaderActions";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { appState$ } from "@/state/app";
import { removeBill } from "@/state/crud";
import { getNextBillDueDate } from "@/state/utils";
import { centsToDollars, formatDollars } from "@/utils/currency";
import { importBills } from "@/utils/import";
import { use$ } from "@legendapp/state/react";
import { Stack, useRouter } from "expo-router";
import { Alert } from "react-native";
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
  Typography,
  spacing,
  useTheme,
} from "react-native-orchard";

export default function BillsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const bills = use$(appState$.bills);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Bills",
          headerRight: () => (
            <HeaderActions>
              <PressableOpacity
                onPress={() => router.push("/bills/new")}
                onLongPress={importBills}
              >
                <IconSymbol name="plus.circle" size={24} color={colors.blue} />
              </PressableOpacity>
            </HeaderActions>
          ),
        }}
      />
      <ScrollView
        style={{
          flex: 1,
          position: "relative",
        }}
        contentContainerStyle={{
          paddingTop: spacing.lg,
          // please adjust this to add padding based on the height of the tab bar
          // this is a hacky way to do it, but it works for now
          paddingBottom: 100,
        }}
      >
        <ListContainer>
          <SectionContainer>
            <SectionContent>
              {bills.map((bill) => (
                <Swipeable
                  key={bill.id}
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
                                removeBill(bill.id);
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
                >
                  <PressableOpacity
                    onPress={() => router.push(`/bills/${bill.id}`)}
                  >
                    <RowContainer rounded={false}>
                      <RowContent>
                        <RowLabel variant="title">{bill.name}</RowLabel>
                        <RowLabel variant="subtitle">
                          Due {getNextBillDueDate(bill).toLocaleDateString()}
                        </RowLabel>
                      </RowContent>
                      <RowTrailing>
                        <Typography variant="bodyRegular" color="labelPrimary">
                          {formatDollars(centsToDollars(bill.amount))}
                        </Typography>
                        <IconSymbol
                          name="chevron.right"
                          size={16}
                          color={colors.labelSecondary}
                        />
                      </RowTrailing>
                    </RowContainer>
                  </PressableOpacity>
                </Swipeable>
              ))}
            </SectionContent>
          </SectionContainer>
        </ListContainer>
      </ScrollView>
    </>
  );
}
