import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ListContainer,
  RowContainer,
  RowLabel,
  RowTextInput,
  RowTrailing,
  SectionContainer,
  SectionContent,
  useTheme,
} from "react-native-orchard";

export default function NewPaycheck() {
  const { spacing } = useTheme();

  return (
    <ListContainer
      style={{
        marginTop: spacing.lg,
      }}
    >
      <SectionContainer>
        <SectionContent>
          <RowContainer>
            <RowLabel>Amount</RowLabel>
            <RowTrailing>
              <RowTextInput placeholder="Enter Amount" />
            </RowTrailing>
          </RowContainer>
          <RowContainer>
            <RowLabel>Received On</RowLabel>
            <RowTrailing>
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="compact"
                style={{
                  marginVertical: -1 * spacing.xs,
                }}
              />
            </RowTrailing>
          </RowContainer>
          <RowContainer>
            <RowLabel>Next Paycheck</RowLabel>
            <RowTrailing>
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="compact"
                style={{
                  marginVertical: -1 * spacing.xs,
                }}
              />
            </RowTrailing>
          </RowContainer>
        </SectionContent>
      </SectionContainer>
    </ListContainer>
  );
}
