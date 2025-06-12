import { HeaderActions } from "@/components/HeaderActions";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useSelectedItems } from "@/hooks/useSelectedItems";
import { appState$ } from "@/state/app";
import { addBillsToPaycheck } from "@/state/crud";
import { centsToDollars, formatDollars } from "@/utils/currency";
import { use$ } from "@legendapp/state/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import {
  Button,
  ListContainer,
  PressableRowContainer,
  RowLabel,
  RowTrailing,
  SectionContainer,
  SectionContent,
  Typography,
  useTheme,
} from "react-native-orchard";

export default function AddBillScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { spacing } = useTheme();
  const { colors } = useTheme();

  const { bills, paycheck } = use$(() => {
    const bills = appState$.bills.get();
    const paycheck = appState$.paychecks.get().find((p) => p.id === id);

    return {
      bills: paycheck
        ? bills.filter((bill) => !paycheck?.bills.some((b) => b.id === bill.id))
        : bills,
      paycheck,
    };
  });
  const {
    selectedItems,
    selectedCount,

    toggleItem,
    isItemSelected,
    selectAllItems,
    deselectAllItems,
  } = useSelectedItems(bills, {
    allowMultiple: true,
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Select Bills",
          headerLeft: () => (
            <Button
              onPress={() => {
                if (selectedCount === bills.length) {
                  deselectAllItems();
                } else {
                  selectAllItems();
                }
              }}
              variant="plain"
              fontWeight="400"
              style={{ paddingVertical: 0, paddingHorizontal: 0 }}
            >
              {selectedCount === bills.length ? "Deselect All" : "Select All"}
            </Button>
          ),
          headerRight: () => (
            <HeaderActions>
              <Button
                onPress={() => {
                  if (!paycheck) return;
                  addBillsToPaycheck(paycheck, selectedItems);
                  router.dismiss();
                }}
                variant="plain"
                fontWeight="400"
                style={{ paddingVertical: 0, paddingHorizontal: 0 }}
              >
                Add
              </Button>
            </HeaderActions>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ paddingVertical: spacing.md }}>
        <ListContainer>
          <SectionContainer>
            <SectionContent>
              {bills.map((bill) => (
                <PressableRowContainer
                  key={bill.id}
                  onPress={() => toggleItem(bill)}
                >
                  <RowLabel>{bill.name}</RowLabel>
                  <RowTrailing>
                    <Typography variant="bodyRegular" color="labelPrimary">
                      {formatDollars(centsToDollars(bill.amount))}
                    </Typography>

                    <IconSymbol
                      name={
                        isItemSelected(bill)
                          ? "checkmark.circle.fill"
                          : "checkmark.circle"
                      }
                      size={20}
                      color={colors.blue}
                    />
                  </RowTrailing>
                </PressableRowContainer>
              ))}
            </SectionContent>
          </SectionContainer>
        </ListContainer>
      </ScrollView>
    </>
  );
}
