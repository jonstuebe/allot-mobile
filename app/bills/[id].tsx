import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import {
  ListContainer,
  RowContainer,
  RowLabel,
  SectionContainer,
  SectionContent,
  useTheme,
} from "react-native-orchard";

export default function BillPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spacing } = useTheme();

  return (
    <>
      <ScrollView>
        <ListContainer style={{ marginTop: spacing.lg }}>
          <SectionContainer>
            <SectionContent>
              <RowContainer>
                <RowLabel>Name</RowLabel>
              </RowContainer>
            </SectionContent>
          </SectionContainer>
        </ListContainer>
      </ScrollView>
    </>
  );
}
