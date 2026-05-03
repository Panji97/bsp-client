import React, { useEffect } from 'react';
import { Text, View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Color, useRouter } from 'expo-router';

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
        <View style={styles.overlay}>
            <View style={styles.headerRow}>
                <Image
                    source={require('../../assets/images/icon_bspid.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Bang Sampah
                        <Text style={styles.pintar}> Pintar</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        Digitalisasi Sampah Menjadi Emas
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    headerRow: {
        flexDirection: 'row', // Ini kunci supaya menyamping
        alignItems: 'center', // Supaya logo dan teks sejajar secara vertikal
        paddingHorizontal: 20,
    },
    logo: {
        width: 80, // Ukuran diperkecil sedikit agar proporsional saat menyamping
        height: 80,
        marginRight: 15 // Jarak antara logo dan teks
    },
    textContainer: {
        flexShrink: 1, // Supaya teks tidak 'balapan' keluar layar jika kepanjangan
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F68B1E', // Sesuaikan warna karena background kamu gelap
    },
    subtitle: {
        fontSize: 12,
        color: '#ccc', // Warna teks sub-judul
    },
    pintar: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#43B02A', // Warna khusus untuk kata "Pintar"
    }
});