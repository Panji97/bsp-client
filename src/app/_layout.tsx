import { Stack } from 'expo-router';
import { AuthProvider } from '../context/authContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="auth" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="auth/resetPassword"
                    options={{
                        headerShown: false,
                        presentation: 'modal' // Optional
                    }}
                />
            </Stack>
        </AuthProvider>
    );
}