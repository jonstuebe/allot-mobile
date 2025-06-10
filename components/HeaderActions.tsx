import type { ReactNode } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-orchard";

export function HeaderActions({ children }: { children: ReactNode }) {
  const { spacing } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: spacing.lg,
        paddingHorizontal: spacing.lg,
      }}
    >
      {children}
    </View>
  );
}
