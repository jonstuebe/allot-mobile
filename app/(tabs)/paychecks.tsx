import { HeaderActions } from "@/components/HeaderActions";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { appState$ } from "@/state/app";
import { removePaycheck } from "@/state/crud";
import { centsToDollars, formatDollars } from "@/utils/currency";
import { importPaychecks } from "@/utils/import";
import { use$ } from "@legendapp/state/react";
import { format } from "date-fns";
import { Stack, useRouter } from "expo-router";
import { groupBy } from "lodash-es";
import { Alert, View } from "react-native";
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

export default function PaychecksScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const groupedPaychecks = use$(() => {
    const paychecks = appState$.paychecks.get();

    const groups = groupBy(paychecks, (paycheck) => {
      return format(paycheck.dateReceived, "MMMM yyyy");
    });

    return Object.entries(groups)
      .sort((a, b) => {
        return new Date(b[0]).getTime() - new Date(a[0]).getTime();
      })
      .reverse();
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Paychecks",
          headerRight: () => (
            <HeaderActions>
              <PressableOpacity
                onPress={() => router.navigate("/paychecks/new")}
                onLongPress={importPaychecks}
              >
                <IconSymbol name="plus.circle" size={24} color={colors.blue} />
              </PressableOpacity>
            </HeaderActions>
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
            paddingVertical: spacing.lg,
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
                            Alert.alert(
                              "Delete Paycheck",
                              "Are you sure you want to delete this paycheck?",
                              [
                                {
                                  text: "Cancel",
                                  style: "cancel",
                                },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: () => {
                                    removePaycheck(paycheck.id);
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
                        onPress={() =>
                          router.navigate(`/paychecks/${paycheck.id}`)
                        }
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
                              {formatDollars(centsToDollars(paycheck.amount))}
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
            ))}
          </ListContainer>
        </ScrollView>
      </View>
    </>
  );
}
