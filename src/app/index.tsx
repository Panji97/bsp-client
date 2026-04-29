import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        // Menunggu selama 3 detik sebelum pindah ke login
        const timer = setTimeout(() => {
            router.replace('/auth/login');
            // Menggunakan .replace agar user tidak bisa menekan tombol 'back' kembali ke loading
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            {/* Tampilkan Logo Kamu di Sini */}
            <Image
                source={require('../../assets/images/android-icon-foreground.png')} // Ganti dengan path logo kamu
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Indikator Loading (Opsional) */}
            {/* <ActivityIndicator size="large" color="#00512c" style={{ marginTop: 20 }} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Sesuaikan warna background
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
});