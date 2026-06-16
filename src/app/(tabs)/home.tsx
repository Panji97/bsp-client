import { View, Text, Dimensions, TouchableOpacity, ScrollView, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    // State untuk menyembunyikan saldo
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [balance, setBalance] = useState({
        rupiah: 123000,
        gram: 0.000000
    });

    // Fungsi untuk navigasi ke profile
    const handleProfileNavigation = () => {
        router.push("/profile");
    };

    // Fungsi untuk toggle visibility saldo
    const toggleBalanceVisibility = () => {
        setIsBalanceVisible(!isBalanceVisible);
    };

    // Format angka dengan pemisah ribuan
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount).replace('Rp', 'Rp ');
    };

    // Format gram dengan 6 desimal
    const formatGram = (gram) => {
        return gram.toFixed(6);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#FF6B00" />

            {/* Header dengan Gradient Orange */}
            <LinearGradient
                colors={['#FF6B00', '#FF8C00', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greetingText}>Selamat Pagi 👋</Text>
                        <Text style={styles.userName}>
                            Badak <Text style={styles.userNameHighlight}>Emas</Text>
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        activeOpacity={0.8}
                        onPress={handleProfileNavigation}
                    >
                        <View style={styles.profileIconContainer}>
                            <Ionicons name="person" size={24} color="#FF6B00" />
                        </View>
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Card Saldo */}
                <View style={styles.saldoCard}>
                    <View style={styles.saldoHeader}>
                        <View style={styles.saldoLabelContainer}>
                            <Feather name="credit-card" size={20} color="#FF6B00" />
                            <Text style={styles.saldoLabel}>Total Saldo</Text>
                        </View>
                        <TouchableOpacity onPress={toggleBalanceVisibility}>
                            <Feather
                                name={isBalanceVisible ? "eye" : "eye-off"}
                                size={20}
                                color="#999"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.saldoValue}>
                        {isBalanceVisible ? formatRupiah(balance.rupiah) : 'Rp -------'}
                    </Text>

                    {/* Garis Pemisah */}
                    <View style={styles.saldoDividerHorizontal} />

                    <View style={styles.saldoFooter}>
                        <View style={styles.saldoDetail}>
                            <Text style={styles.saldoDetailLabel}>Gram</Text>
                            <Text style={styles.saldoDetailValue}>
                                {isBalanceVisible ? `${formatGram(balance.gram)} gr` : '------- gr'}
                            </Text>
                        </View>
                        <View style={styles.saldoDividerVertical} />
                        <View style={styles.saldoDetail}>
                            <Text style={styles.saldoDetailLabel}>Rupiah</Text>
                            <Text style={styles.saldoDetailValue}>
                                {isBalanceVisible ? formatRupiah(balance.rupiah) : 'Rp -------'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                        <LinearGradient
                            colors={['#FF6B00', '#FF8C00']}
                            style={styles.actionIconContainer}
                        >
                            <Feather name="plus" size={24} color="#FFF" />
                        </LinearGradient>
                        <Text style={styles.actionText}>Top Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                        <LinearGradient
                            colors={['#FF6B00', '#FF8C00']}
                            style={styles.actionIconContainer}
                        >
                            <Feather name="arrow-down" size={24} color="#FFF" />
                        </LinearGradient>
                        <Text style={styles.actionText}>Tarik</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                        <LinearGradient
                            colors={['#FF6B00', '#FF8C00']}
                            style={styles.actionIconContainer}
                        >
                            <Feather name="repeat" size={24} color="#FFF" />
                        </LinearGradient>
                        <Text style={styles.actionText}>Transfer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                        <LinearGradient
                            colors={['#FF6B00', '#FF8C00']}
                            style={styles.actionIconContainer}
                        >
                            <Feather name="list" size={24} color="#FFF" />
                        </LinearGradient>
                        <Text style={styles.actionText}>Riwayat</Text>
                    </TouchableOpacity>
                </View>

                {/* Section Pengajuan */}
                <View style={styles.pengajuanSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pengajuan</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pengajuanCard}>
                        <View style={styles.pengajuanIconContainer}>
                            <MaterialCommunityIcons name="file-document-outline" size={24} color="#FF6B00" />
                        </View>
                        <View style={styles.pengajuanContent}>
                            <Text style={styles.pengajuanStatus}>Menunggu Persetujuan</Text>
                            <Text style={styles.pengajuanDate}>
                                <Ionicons name="time-outline" size={14} color="#999" />
                                {' '}Diperbarui Jumat, 1 Mei 2026
                            </Text>
                        </View>
                        <View style={styles.pengajuanBadge}>
                            <Text style={styles.badgeText}>1</Text>
                        </View>
                    </View>
                </View>

                {/* Info Beli */}
                <TouchableOpacity style={styles.beliButton} activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#FF6B00', '#FF8C00', '#FFA500']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.beliGradient}
                    >
                        <View style={styles.beliContent}>
                            <View>
                                <Text style={styles.beliLabel}>💰 Harga Emas Hari Ini</Text>
                                <Text style={styles.beliSubLabel}>Update terbaru</Text>
                            </View>
                            <View>
                                <Text style={styles.beliPrice}>Rp 2.799.000</Text>
                                <Text style={styles.beliPriceSub}>/ gram</Text>
                            </View>
                        </View>
                        <View style={styles.beliArrow}>
                            <Feather name="chevron-right" size={24} color="#FFF" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Grafik Sederhana */}
                <View style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>📊 Grafik Harga</Text>
                        <TouchableOpacity>
                            <Text style={styles.chartPeriod}>1 Bulan</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.chartPlaceholder}>
                        <View style={styles.chartBars}>
                            {[40, 65, 45, 80, 60, 90, 70, 85, 55, 75, 95, 50].map((height, index) => (
                                <View key={index} style={styles.chartBarContainer}>
                                    <LinearGradient
                                        colors={['#FF6B00', '#FFA500']}
                                        style={[styles.chartBar, { height: height * 0.8 }]}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerGradient: {
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    userNameHighlight: {
        color: '#FFD700',
    },
    profileButton: {
        position: 'relative',
    },
    profileIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF3B30',
        borderWidth: 2,
        borderColor: '#FF6B00',
    },
    scrollView: {
        flex: 1,
        marginTop: -20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    saldoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    saldoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    saldoLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    saldoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    saldoValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    saldoDividerHorizontal: {
        height: 1,
        backgroundColor: '#E8E8E8',
        marginBottom: 16,
    },
    saldoFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saldoDetail: {
        flex: 1,
    },
    saldoDetailLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    saldoDetailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    saldoDividerVertical: {
        width: 1,
        height: 30,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 16,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    pengajuanSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    seeAllText: {
        fontSize: 14,
        color: '#FF6B00',
        fontWeight: '600',
    },
    pengajuanCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    pengajuanIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    pengajuanContent: {
        flex: 1,
    },
    pengajuanStatus: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    pengajuanDate: {
        fontSize: 12,
        color: '#999',
    },
    pengajuanBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FF6B00',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    beliButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    beliGradient: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    beliContent: {
        flex: 1,
    },
    beliLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    beliSubLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    beliPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'right',
    },
    beliPriceSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'right',
    },
    beliArrow: {
        marginLeft: 12,
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    chartPeriod: {
        fontSize: 14,
        color: '#FF6B00',
        fontWeight: '500',
    },
    chartPlaceholder: {
        height: 120,
        justifyContent: 'flex-end',
    },
    chartBars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 100,
    },
    chartBarContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    chartBar: {
        width: 8,
        borderRadius: 4,
        minHeight: 10,
    },
});