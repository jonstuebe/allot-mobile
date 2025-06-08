import { IconSymbol } from "@/components/ui/IconSymbol";
import { centsToDollars, dollarsToCents } from "@/utils/currency";
import { faker } from "@faker-js/faker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  ListContainer,
  PressableOpacity,
  RowContent,
  RowLabel,
  RowTrailing,
  SectionContainer,
  SectionContent,
  SwipeableRowContainer,
  Typography,
  spacing,
  useTheme,
} from "react-native-orchard";

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
};

// Generate 20 fake bills
const mockBills: Bill[] = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement([
    "Rent",
    "Electricity",
    "Internet",
    "Water",
    "Gas",
    "Phone",
    "Car Insurance",
    "Health Insurance",
    "Gym Membership",
    "Netflix",
    "Spotify",
    "Amazon Prime",
    "Car Payment",
    "Student Loan",
    "Credit Card",
  ]),
  amount: dollarsToCents(faker.number.int({ min: 20, max: 2000 })),
  dueDate: faker.date.future().toISOString().split("T")[0],
}));

// Sort bills by due date
mockBills.sort(
  (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
);

export default function BillsScreen() {
  const { colors } = useTheme();
  const [bills, setBills] = useState<Bill[]>(mockBills);

  const deleteBill = (bill: Bill) => {
    setBills((currentBills) => currentBills.filter((b) => b.id !== bill.id));
  };

  const addBill = () => {
    const newBill: Bill = {
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement([
        "Rent",
        "Electricity",
        "Internet",
        "Water",
        "Gas",
        "Phone",
        "Car Insurance",
        "Health Insurance",
        "Gym Membership",
        "Netflix",
        "Spotify",
        "Amazon Prime",
        "Car Payment",
        "Student Loan",
        "Credit Card",
      ]),
      amount: dollarsToCents(faker.number.int({ min: 20, max: 2000 })),
      dueDate: faker.date.future().toISOString().split("T")[0],
    };
    setBills((currentBills) =>
      [...currentBills, newBill].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Bills",
          headerRight: () => (
            <PressableOpacity
              onPress={addBill}
              style={{
                padding: spacing.lg,
              }}
            >
              <IconSymbol
                name="plus.circle.fill"
                size={24}
                color={colors.blue}
              />
            </PressableOpacity>
          ),
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          style={{
            flex: 1,
            position: "relative",
          }}
          contentContainerStyle={{
            marginTop: spacing.lg,
            // please adjust this to add padding based on the height of the tab bar
            // this is a hacky way to do it, but it works for now
            paddingBottom: 100,
          }}
        >
          <ListContainer>
            <SectionContainer>
              <SectionContent>
                {bills.map((bill) => (
                  <SwipeableRowContainer
                    key={bill.id}
                    overshootRight={false}
                    overshootLeft={false}
                    renderRightActions={(prog, drag, actions) => (
                      <PressableOpacity
                        onPress={() => {
                          actions.close();
                          deleteBill(bill);
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
                    <RowContent>
                      <RowLabel variant="title">{bill.name}</RowLabel>
                      <RowLabel variant="subtitle">
                        Due {new Date(bill.dueDate).toLocaleDateString()}
                      </RowLabel>
                    </RowContent>
                    <RowTrailing>
                      <Typography variant="bodyRegular" color="labelPrimary">
                        {centsToDollars(bill.amount)}
                      </Typography>
                    </RowTrailing>
                  </SwipeableRowContainer>
                ))}
              </SectionContent>
            </SectionContainer>
          </ListContainer>
        </ScrollView>
      </View>
    </>
  );
}
