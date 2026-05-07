import { View, Text, Dimensions, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            {/* Background atas warna ungu */}
            <View style={styles.topBackground} />

            {/* Background bawah warna putih */}
            <View style={styles.bottomBackground} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header dengan Selamat Datang dan Foto Profil */}
                <View style={styles.headerRow}>
                    <Text style={styles.welcomeText}>
                        Selamat Datang <Text style={{ color: '#F68B1E' }}>Badak</Text>
                    </Text>
                    <View style={styles.profileContainer}>
                        <Ionicons
                            name={'person'}
                            size={24}
                        />
                    </View>
                </View>

                {/* Card Total Saldo */}
                <View style={styles.saldoCard}>
                    <Text style={styles.saldoLabel}>
                        Total Saldo
                    </Text>
                    <Text style={styles.saldoValue}>
                        0,000000 gr
                    </Text>
                </View>

                {/* Section Pengajuan */}
                <View style={styles.pengajuanSection}>
                    <Text style={styles.pengajuanTitle}>
                        Pengajuan
                    </Text>
                    <View style={styles.pengajuanCard}>
                        <Text style={styles.updateText}>
                            Diperbarui Jumat, 1 Mei 2026, Pukul 09.46 WIB
                        </Text>
                    </View>
                </View>

                {/* Info Beli */}
                <TouchableOpacity style={styles.beliButton}>
                    <Text style={styles.beliButtonText}>
                        info Beli
                    </Text>
                    <Text style={styles.beliButtonPrice}>
                        Rp 2.799.000
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5DC',
    },
    topBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 210,
        backgroundColor: '#2E7D32',
    },
    bottomBackground: {
        position: 'absolute',
        top: 280,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#F5F5DC',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
    },
    profileContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    saldoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    saldoLabel: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    saldoValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
    },
    pengajuanSection: {
        marginBottom: 16,
    },
    pengajuanTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    pengajuanCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    updateText: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    beliButton: {
        backgroundColor: '#F68B1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    beliButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    beliButtonPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 4,
    },
});