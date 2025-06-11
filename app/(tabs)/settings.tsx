import { Stack } from "expo-router";
import { ActionSheetIOS } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  ListContainer,
  RowButton,
  RowContainer,
  RowLabel,
  RowTrailing,
  SectionContainer,
  SectionContent,
  SectionHeader,
  useTheme,
} from "react-native-orchard";
import { IconSymbol } from "../../components/ui/IconSymbol";
import { appState$ } from "../../state/app";
import { backupBills, backupPaychecks } from "../../utils/backup";

export default function SettingsScreen() {
  const { colors, spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />
      <ScrollView
        contentContainerStyle={{
          paddingVertical: spacing.lg,
        }}
      >
        <ListContainer>
          <SectionContainer>
            <SectionHeader>Backup</SectionHeader>
            <SectionContent>
              <RowContainer>
                <RowLabel>Bills</RowLabel>
                <RowTrailing>
                  <RowButton onPress={backupBills}>
                    <IconSymbol
                      name="icloud.and.arrow.down"
                      size={20}
                      color={colors.blue}
                    />
                  </RowButton>
                </RowTrailing>
              </RowContainer>
              <RowContainer>
                <RowLabel>Paychecks</RowLabel>
                <RowTrailing>
                  <RowButton onPress={backupPaychecks}>
                    <IconSymbol
                      name="icloud.and.arrow.down"
                      size={20}
                      color={colors.blue}
                    />
                  </RowButton>
                </RowTrailing>
              </RowContainer>
            </SectionContent>
          </SectionContainer>
          <SectionContainer>
            <SectionContent>
              <RowContainer>
                <RowLabel>Delete All Data</RowLabel>
                <RowTrailing>
                  <RowButton
                    onPress={() => {
                      ActionSheetIOS.showActionSheetWithOptions(
                        {
                          title: "Delete All Data",
                          message: "Are you sure you want to delete all data?",
                          options: ["Cancel", "Delete"],
                          cancelButtonIndex: 0,
                          destructiveButtonIndex: 1,
                        },
                        (buttonIndex) => {
                          if (buttonIndex === 1) {
                            appState$.set({
                              bills: [],
                              paychecks: [],
                            });
                          }
                        }
                      );
                    }}
                  >
                    <IconSymbol name="trash" size={20} color={colors.red} />
                  </RowButton>
                </RowTrailing>
              </RowContainer>
            </SectionContent>
          </SectionContainer>
        </ListContainer>
      </ScrollView>
    </>
  );
}
