import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { theme } from "react-native-orchard/theme";

import "react-native-reanimated";

export default function RootLayout() {
  const mode = useColorScheme() ?? "light";
  return (
    <GestureHandlerRootView>
      <ThemeProvider value={theme[mode]}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
