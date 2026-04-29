import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Halaman Welcome/Login menjadi index */}
            <Stack.Screen name="auth/index" />
            {/* Halaman Sign Up */}
            <Stack.Screen name="auth/signup" />
            {/* Navigasi utama setelah login */}
            {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        </Stack>
    );
}