import DateTimePicker from "@react-native-community/datetimepicker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {
  ListContainer,
  RowContainer,
  RowLabel,
  RowSwitch,
  RowTextInput,
  RowTrailing,
  SectionContainer,
  SectionContent,
  SheetHeaderCloseButton,
  SheetHeaderContainer,
  useTheme,
} from "react-native-orchard";

export default function NewBill() {
  const { spacing } = useTheme();

  return (
    <>
      <SheetHeaderContainer>
        <SheetHeaderCloseButton />
      </SheetHeaderContainer>
      <ListContainer>
        <SectionContainer>
          <SectionContent>
            <RowContainer>
              <RowLabel>Name</RowLabel>
              <RowTrailing>
                <RowTextInput placeholder="Enter Name" />
              </RowTrailing>
            </RowContainer>
            <RowContainer>
              <RowLabel>Amount</RowLabel>
              <RowTrailing>
                <RowTextInput placeholder="Enter Amount" />
              </RowTrailing>
            </RowContainer>
            <RowContainer>
              <RowLabel>Auto Pay</RowLabel>
              <RowTrailing>
                <RowSwitch />
              </RowTrailing>
            </RowContainer>
            <RowContainer>
              <RowLabel>Due Every</RowLabel>
              <RowTrailing>
                <SegmentedControl
                  values={["Monthly", "Yearly"]}
                  selectedIndex={0}
                  style={{ flex: 1, marginVertical: -1 * spacing.xs }}
                />
              </RowTrailing>
            </RowContainer>
            <RowContainer>
              <RowLabel>Due Date</RowLabel>
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
    </>
  );
}
