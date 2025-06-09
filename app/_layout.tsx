import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { theme } from "react-native-orchard/theme";

import "react-native-reanimated";

enableReactTracking({
  warnMissingUse: true,
});

export default function RootLayout() {
  const mode = useColorScheme() ?? "light";
  return (
    <GestureHandlerRootView>
      <ThemeProvider value={theme[mode]}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="bills/new"
            options={{
              headerShown: false,
              presentation: "formSheet",
              animation: "slide_from_bottom",
              gestureDirection: "vertical",
              sheetAllowedDetents: [0.5, 1],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              sheetCornerRadius: 10,
            }}
          />
          <Stack.Screen
            name="paychecks/new"
            options={{
              title: "New Paycheck",
              headerShown: true,
              presentation: "modal",
              animation: "slide_from_bottom",
              gestureDirection: "vertical",
              sheetAllowedDetents: [0.5, 1],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              sheetCornerRadius: 10,
            }}
          />
          <Stack.Screen
            name="paychecks/[id]"
            options={{
              title: "Paycheck Details",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="bills/[id]"
            options={{
              title: "Bill Details",
              headerShown: true,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
