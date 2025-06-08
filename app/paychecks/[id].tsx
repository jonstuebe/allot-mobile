import { centsToDollars } from "@/utils/currency";
import { Stack, useLocalSearchParams } from "expo-router";
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  // In a real app, you would fetch the paycheck data based on the ID
  // For now, we'll use mock data
  const paycheck = {
    id,
    amount: 500000, // $5,000.00
    dateReceived: new Date().toISOString().split("T")[0],
    nextPaycheckDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Paycheck Details",
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
                    {centsToDollars(paycheck.amount)}
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
