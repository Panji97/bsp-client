import { Stack } from 'expo-router';
import "../../global.css"; // Pastikan ini diimpor untuk Nativewind

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Halaman Welcome/Login menjadi index */}
            <Stack.Screen name="auth/login" />
            {/* Halaman Sign Up */}
            <Stack.Screen name="auth/signup" />
            {/* Navigasi utama setelah login */}
            {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        </Stack>
    );
}