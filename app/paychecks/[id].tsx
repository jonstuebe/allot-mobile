import { appState$ } from "@/state/app";
import { centsToDollars, formatDollars } from "@/utils/currency";
import { use$ } from "@legendapp/state/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import {
  ListContainer,
  RowContainer,
  RowLabel,
  RowTrailing,
  SectionContainer,
  SectionContent,
  Typography,
  spacing,
  useTheme,
} from "react-native-orchard";

export default function PaycheckDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const paycheck = use$(appState$.paychecks.get().find((p) => p.id === id));

  if (!paycheck) {
    return null;
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
        </ListContainer>
      </ScrollView>
    </>
  );
}
