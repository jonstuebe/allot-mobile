import { IconSymbol } from "@/components/ui/IconSymbol";
import { centsToDollars, dollarsToCents } from "@/utils/currency";
import { faker } from "@faker-js/faker";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
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

type Paycheck = {
  id: string;
  amount: number;
  dateReceived: string;
  nextPaycheckDate: string;
};

// Generate 10 fake paychecks
const mockPaychecks: Paycheck[] = (() => {
  const paychecks: Paycheck[] = [];
  const today = new Date();

  // Generate 10 paychecks, each 2 weeks apart
  for (let i = 0; i < 10; i++) {
    const dateReceived = new Date(today);
    dateReceived.setDate(today.getDate() - i * 14); // Go back 2 weeks for each paycheck

    const nextPaycheckDate = new Date(dateReceived);
    nextPaycheckDate.setDate(dateReceived.getDate() + 14); // Next paycheck is 2 weeks later

    paychecks.push({
      id: faker.string.uuid(),
      amount: dollarsToCents(faker.number.int({ min: 1000, max: 5000 })),
      dateReceived: dateReceived.toISOString().split("T")[0],
      nextPaycheckDate: nextPaycheckDate.toISOString().split("T")[0],
    });
  }

  return paychecks;
})();

// Sort paychecks by date received in descending order (most recent first)
mockPaychecks.sort(
  (a, b) =>
    new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime()
);

export default function PaychecksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [paychecks, setPaychecks] = useState<Paycheck[]>(mockPaychecks);

  const deletePaycheck = (paycheck: Paycheck) => {
    setPaychecks((currentPaychecks) =>
      currentPaychecks.filter((p) => p.id !== paycheck.id)
    );
  };

  // const addPaycheck = () => {
  //   const dateReceived = new Date();
  //   const nextPaycheckDate = new Date(dateReceived);
  //   nextPaycheckDate.setDate(nextPaycheckDate.getDate() + 14); // Assuming bi-weekly paychecks

  //   const newPaycheck: Paycheck = {
  //     id: faker.string.uuid(),
  //     amount: dollarsToCents(faker.number.int({ min: 1000, max: 5000 })),
  //     dateReceived: dateReceived.toISOString().split("T")[0],
  //     nextPaycheckDate: nextPaycheckDate.toISOString().split("T")[0],
  //   };

  //   setPaychecks((currentPaychecks) =>
  //     [newPaycheck, ...currentPaychecks].sort(
  //       (a, b) =>
  //         new Date(b.dateReceived).getTime() -
  //         new Date(a.dateReceived).getTime()
  //     )
  //   );
  // };

  // Group paychecks by month
  const groupedPaychecks = useMemo(() => {
    const groups: { [key: string]: Paycheck[] } = {};

    paychecks.forEach((paycheck) => {
      const date = new Date(paycheck.dateReceived);
      const monthKey = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(paycheck);
    });

    // Sort months in descending order
    return Object.entries(groups).sort(([a], [b]) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  }, [paychecks]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Paychecks",
          headerRight: () => (
            <PressableOpacity
              onPress={() => router.push("/paychecks/new")}
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
            paddingBottom: 100,
          }}
        >
          <ListContainer>
            {groupedPaychecks.map(([month, monthPaychecks]) => (
              <SectionContainer key={month}>
                <SectionHeader>{month}</SectionHeader>
                <SectionContent>
                  {monthPaychecks.map((paycheck) => (
                    <Swipeable
                      key={paycheck.id}
                      overshootRight={false}
                      overshootLeft={false}
                      renderRightActions={(prog, drag, actions) => (
                        <PressableOpacity
                          onPress={() => {
                            actions.close();
                            deletePaycheck(paycheck);
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
                        onPress={() => router.push(`/paychecks/${paycheck.id}`)}
                        style={{
                          flex: 1,
                        }}
                      >
                        <RowContainer rounded={false}>
                          <RowContent>
                            <RowLabel variant="title">
                              {new Date(
                                paycheck.dateReceived
                              ).toLocaleDateString()}
                            </RowLabel>
                            <RowLabel variant="subtitle">
                              Next:{" "}
                              {new Date(
                                paycheck.nextPaycheckDate
                              ).toLocaleDateString()}
                            </RowLabel>
                          </RowContent>
                          <RowTrailing>
                            <Typography
                              variant="bodyRegular"
                              color="labelPrimary"
                            >
                              {centsToDollars(paycheck.amount)}
                            </Typography>
                          </RowTrailing>
                        </RowContainer>
                      </PressableOpacity>
                    </Swipeable>
                  ))}
                </SectionContent>
              </SectionContainer>
            ))}
          </ListContainer>
        </ScrollView>
      </View>
    </>
  );
}
