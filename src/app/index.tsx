import React, { useState, useRef, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    Pressable,
    FlatList,
    Animated
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [menuVisible, setMenuVisible] = useState(false);
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const isMobile = width < 768;

    const menuItems = [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'about', label: 'Tentang Kami', href: '/about' },
        { id: 'services', label: 'Layanan', href: '/services' },
        { id: 'login', label: 'Login', href: '/auth/login' }
    ];

    const features = [
        {
            id: '1',
            icon: '♻️',
            title: 'Digitalisasi Sampah',
            desc: 'Kelola sampah secara digital dan modern dengan sistem terintegrasi',
            color: '#4CAF50'
        },
        {
            id: '2',
            icon: '💰',
            title: 'Menjadi Emas',
            desc: 'Ubah sampah menjadi nilai ekonomis yang menguntungkan',
            color: '#FF9800'
        },
        {
            id: '3',
            icon: '🌱',
            title: 'Ramah Lingkungan',
            desc: 'Dukung gerakan peduli lingkungan untuk masa depan lebih baik',
            color: '#2196F3'
        },
        {
            id: '4',
            icon: '📱',
            title: 'Aplikasi Mobile',
            desc: 'Akses mudah melalui smartphone Anda kapan saja',
            color: '#9C27B0'
        },
        {
            id: '5',
            icon: '🏆',
            title: 'Reward Point',
            desc: 'Dapatkan poin dan tukarkan dengan berbagai hadiah menarik',
            color: '#F44336'
        }
    ];

    const handleNavigation = (href: string) => {
        setMenuVisible(false);
        router.push(href as any);
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const handleNextFeature = () => {
        if (currentFeatureIndex < features.length - 1) {
            const newIndex = currentFeatureIndex + 1;
            setCurrentFeatureIndex(newIndex);
            flatListRef.current?.scrollToIndex({
                index: newIndex,
                animated: true,
                viewPosition: 0.5
            });
        }
    };

    const handlePrevFeature = () => {
        if (currentFeatureIndex > 0) {
            const newIndex = currentFeatureIndex - 1;
            setCurrentFeatureIndex(newIndex);
            flatListRef.current?.scrollToIndex({
                index: newIndex,
                animated: true,
                viewPosition: 0.5
            });
        }
    };

    const onScrollEnd = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / (width * 0.8 + 20));
        setCurrentFeatureIndex(index);
    };

    const renderFeatureItem = ({ item, index }: { item: any; index: number }) => (
        <Animated.View
            style={[
                styles.featureCard,
                {
                    width: width * 0.8,
                    transform: [
                        {
                            scale: scrollX.interpolate({
                                inputRange: [
                                    (index - 1) * (width * 0.8 + 20),
                                    index * (width * 0.8 + 20),
                                    (index + 1) * (width * 0.8 + 20)
                                ],
                                outputRange: [0.9, 1, 0.9],
                                extrapolate: 'clamp'
                            })
                        }
                    ]
                }
            ]}
        >
            <View style={[styles.featureIconContainer, { backgroundColor: `${item.color}20` }]}>
                <Text style={styles.featureIcon}>{item.icon}</Text>
            </View>
            <Text style={[styles.featureTitle, { color: item.color }]}>{item.title}</Text>
            <Text style={styles.featureDesc}>{item.desc}</Text>
            <TouchableOpacity
                style={[styles.featureButton, { backgroundColor: item.color }]}
                onPress={() => router.push('/auth/login')}
            >
                <Text style={styles.featureButtonText}>Pelajari Lebih Lanjut</Text>
            </TouchableOpacity>
        </Animated.View>
    );

    const getItemLayout = (data: any, index: number) => ({
        length: width * 0.8 + 20,
        offset: (width * 0.8 + 20) * index,
        index,
    });

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

                    {/* Features Section with Carousel */}
                    <View style={styles.featuresSection}>
                        <Text style={styles.sectionTitle}>Mengapa Bank Sampah Pintar?</Text>

                        <View style={styles.carouselContainer}>
                            {/* Previous Button */}
                            <TouchableOpacity
                                style={[
                                    styles.navButton,
                                    styles.prevButton,
                                    currentFeatureIndex === 0 && styles.navButtonDisabled
                                ]}
                                onPress={handlePrevFeature}
                                disabled={currentFeatureIndex === 0}
                            >
                                <Text style={styles.navButtonText}>{'<'}</Text>
                            </TouchableOpacity>

                            {/* Features Carousel */}
                            <FlatList
                                ref={flatListRef}
                                data={features}
                                renderItem={renderFeatureItem}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={width * 0.8 + 20}
                                snapToAlignment="center"
                                decelerationRate="fast"
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                    { useNativeDriver: true }
                                )}
                                onMomentumScrollEnd={onScrollEnd}
                            />

                            {/* Next Button */}
                            <TouchableOpacity
                                style={[
                                    styles.navButton,
                                    styles.nextButton,
                                    currentFeatureIndex === features.length - 1 && styles.navButtonDisabled
                                ]}
                                onPress={handleNextFeature}
                                disabled={currentFeatureIndex === features.length - 1}
                            >
                                <Text style={styles.navButtonText}>{'>'}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Pagination Dots */}
                        <View style={styles.paginationContainer}>
                            {features.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.paginationDot,
                                        currentFeatureIndex === index && styles.paginationDotActive
                                    ]}
                                />
                            ))}
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
        backgroundColor: '#ffff',
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
        color: 'black',
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
        backgroundColor: 'black',
        borderRadius: 2,
    },
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
        marginTop: 64,
    },
    mobileMenu: {
        backgroundColor: '#ffffff',
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
        borderTopColor: '#F5F5DC',
    },
    mobileNavText: {
        color: 'black',
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
        color: 'black',
    },
    heroTitleGreen: {
        color: '#F68B1E',
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
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    navButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    navButtonDisabled: {
        backgroundColor: '#CCCCCC',
        opacity: 0.5,
    },
    prevButton: {
        marginRight: 3,
    },
    nextButton: {
        marginLeft: 3,
    },
    navButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    featureCard: {
        backgroundColor: '#F5F5DC',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        marginHorizontal: 10,
    },
    featureIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    featureIcon: {
        fontSize: 48,
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    featureDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    featureButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 8,
    },
    featureButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CCCCCC',
        marginHorizontal: 5,
    },
    paginationDotActive: {
        width: 20,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2E7D32',
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