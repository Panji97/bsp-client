import React, { useState, useRef, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    Pressable
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [menuVisible, setMenuVisible] = useState(false);
    const isMobile = width < 768;

    const menuItems = [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'about', label: 'Tentang Kami', href: '/about' },
        { id: 'services', label: 'Layanan', href: '/services' },
        { id: 'login', label: 'Login', href: '/auth/login' }
    ];

    const handleNavigation = (href: string) => {
        setMenuVisible(false);
        router.push(href as any);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    return (
        <View style={styles.mainContainer}>
            {/* Navbar Sticky - Selalu di atas saat scroll */}
            <View style={[styles.navbar, isMobile && styles.navbarMobile]}>
                <View style={styles.navContent}>
                    {/* Logo Section */}
                    <TouchableOpacity
                        style={styles.logoSection}
                        onPress={() => handleNavigation('/')}
                        activeOpacity={0.8}
                    >
                        <Image
                            source={require('../../assets/images/icon_bspid.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <View>
                            <Text style={styles.logoText}>
                                Bank Sampah<Text style={styles.logoTextOr}> Pintar</Text>
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Desktop Menu */}
                    {!isMobile && (
                        <View style={styles.desktopMenu}>
                            {menuItems.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.navItem}
                                    onPress={() => handleNavigation(item.href)}
                                >
                                    <Text style={styles.navText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Mobile Burger Button */}
                    {isMobile && (
                        <TouchableOpacity
                            style={styles.burgerButton}
                            onPress={() => setMenuVisible(!menuVisible)}
                        >
                            <View style={[
                                styles.burgerLine,
                                menuVisible && styles.burgerLineActive1
                            ]} />
                            <View style={[
                                styles.burgerLine,
                                menuVisible && styles.burgerLineActive2
                            ]} />
                            <View style={[
                                styles.burgerLine,
                                menuVisible && styles.burgerLineActive3
                            ]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Mobile Menu Overlay - Menutupi seluruh halaman */}
            {isMobile && menuVisible && (
                <Pressable
                    style={styles.overlay}
                    onPress={closeMenu}
                >
                    <View style={styles.mobileMenuContainer}>
                        <View style={styles.mobileMenu}>
                            {menuItems.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.mobileNavItem}
                                    onPress={() => handleNavigation(item.href)}
                                >
                                    <Text style={styles.mobileNavText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Pressable>
            )}

            {/* Konten Utama dengan ScrollView */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <View style={styles.heroContent}>
                            <Image
                                source={require('../../assets/images/icon_bspid.png')}
                                style={styles.heroLogo}
                                resizeMode="contain"
                            />
                            <Text style={styles.heroTitle}>
                                Bank Sampah
                                <Text style={styles.heroTitleGreen}> Pintar</Text>
                            </Text>
                            <Text style={styles.heroSubtitle}>
                                Digitalisasi Sampah Menjadi Emas
                            </Text>
                            <TouchableOpacity
                                style={styles.ctaButton}
                                onPress={() => router.push('/auth/login')}
                            >
                                <Text style={styles.ctaButtonText}>Mulai Sekarang</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Features Section */}
                    <View style={styles.featuresSection}>
                        <Text style={styles.sectionTitle}>Mengapa Bank Sampah Pintar?</Text>
                        <View style={styles.featuresGrid}>
                            <View style={styles.featureCard}>
                                <Text style={styles.featureIcon}>♻️</Text>
                                <Text style={styles.featureTitle}>Digitalisasi Sampah</Text>
                                <Text style={styles.featureDesc}>
                                    Kelola sampah secara digital dan modern
                                </Text>
                            </View>
                            <View style={styles.featureCard}>
                                <Text style={styles.featureIcon}>💰</Text>
                                <Text style={styles.featureTitle}>Menjadi Emas</Text>
                                <Text style={styles.featureDesc}>
                                    Ubah sampah menjadi nilai ekonomis
                                </Text>
                            </View>
                            <View style={styles.featureCard}>
                                <Text style={styles.featureIcon}>🌱</Text>
                                <Text style={styles.featureTitle}>Ramah Lingkungan</Text>
                                <Text style={styles.featureDesc}>
                                    Dukung gerakan peduli lingkungan
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            © 2024 Bank Sampah Pintar. All rights reserved.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F5DC',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F5F5DC',
    },
    container: {
        flex: 1,
    },
    // Navbar Sticky - Tetap di atas saat scroll
    navbar: {
        backgroundColor: '#2E7D32',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    navbarMobile: {
        position: 'sticky',
        top: 0,
    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logo: {
        width: 40,
        height: 40,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    logoTextOr: {
        color: '#F68B1E',
    },
    desktopMenu: {
        flexDirection: 'row',
        gap: 30,
    },
    navItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    navText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    burgerButton: {
        width: 30,
        height: 24,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    burgerLine: {
        width: '100%',
        height: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        // transition: 'all 0.3s ease',
        transitionProperty: 'all 0.3s ease',
    },
    // Animasi burger ke X (opsional)
    burgerLineActive1: {
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 10,
    },
    burgerLineActive2: {
        opacity: 0,
    },
    burgerLineActive3: {
        transform: [{ rotate: '-45deg' }],
        position: 'absolute',
        top: 10,
    },
    // Overlay full screen
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 999,
    },
    mobileMenuContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 64, // Tinggi navbar
    },
    mobileMenu: {
        backgroundColor: '#2E7D32',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    mobileNavItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#43B02A',
    },
    mobileNavText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    heroSection: {
        paddingVertical: 60,
        paddingHorizontal: 20,
        alignItems: 'center',
        minHeight: '70%',
    },
    heroContent: {
        alignItems: 'center',
        maxWidth: 600,
    },
    heroLogo: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        color: '#F68B1E',
    },
    heroTitleGreen: {
        color: '#43B02A',
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginBottom: 32,
    },
    ctaButton: {
        backgroundColor: '#F68B1E',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    ctaButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    featuresSection: {
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        color: '#2E7D32',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
    },
    featureCard: {
        flex: 1,
        minWidth: 200,
        backgroundColor: '#F5F5DC',
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    featureIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F68B1E',
        marginBottom: 8,
    },
    featureDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    footer: {
        backgroundColor: '#2E7D32',
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});