import { Stack } from "expo-router";

export default function AuthenticatedLayout() {
    return(
        <Stack>
            <Stack.Screen name="Dashboard/index" options={{ headerShown: false }} />
            <Stack.Screen name="Profile/index" options={{ headerShown: false }} />
            <Stack.Screen name="Receive/index" options={{ headerShown: false }} />
            <Stack.Screen name="Send/index" options={{ headerShown: false }} />
            <Stack.Screen name="TransactionDetail/index" options={{ headerShown: false }} />
            <Stack.Screen name="Transactions/index" options={{ headerShown: false }} />
        </Stack>
    )
}