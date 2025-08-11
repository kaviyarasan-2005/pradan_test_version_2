import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <ActionSheetProvider>
        <Stack screenOptions={{ headerShown: false }} />
    </ActionSheetProvider>
  );
}
