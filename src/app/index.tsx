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
    const [servicesDropdownVisible, setServicesDropdownVisible] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;
    const isMobile = width < 768;

    const [gradientHeight, setGradientHeight] = useState(300);

    // Data layanan untuk dropdown
    const servicesList = [
        { id: '1', label: 'Registrasi Sampah', href: '/services/register-waste' },
        { id: '2', label: 'Tukar Poin', href: '/services/redeem-points' },
        { id: '3', label: 'Laporan Sampah', href: '/services/waste-report' },
        { id: '4', label: 'Merchant Partner', href: '/services/merchant' },
        { id: '5', label: 'Komunitas', href: '/services/community' }
    ];

    const menuItems = [
        { id: 'home', label: 'Beranda', href: '/' },
        { id: 'about', label: 'Tentang Kami', href: '/about' },
        { id: 'services', label: 'Layanan', href: '/services', hasDropdown: true },
        { id: 'login', label: 'Masuk', href: '/auth/login' }
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

    // Animasi menu muncul
    const showMenu = () => {
        setMenuVisible(true);
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11
            }),
            Animated.timing(overlayAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            })
        ]).start();
    };

    // Animasi menu tertutup
    const closeMenu = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -300,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            })
        ]).start(() => {
            setMenuVisible(false);
        });
    };

    const handleNavigation = (href: string) => {
        closeMenu();
        setServicesDropdownVisible(false);
        setTimeout(() => {
            router.push(href as any);
        }, 300);
    };

    const handleServicesClick = () => {
        setServicesDropdownVisible(!servicesDropdownVisible);
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
                    width: width * 0.6,
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
                activeOpacity={0.8}
            >
                <Text style={styles.featureButtonIcon}>→</Text>
                <Text style={styles.featureButtonText}>Selengkapnya</Text>
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
            {/* Navbar Sticky */}
            <View style={[styles.navbar, isMobile && styles.navbarMobile]}>
                <View style={styles.navContent}>
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

                    {!isMobile && (
                        <View style={styles.desktopMenu}>
                            {menuItems.map((item) => (
                                <View key={item.id}>
                                    {item.hasDropdown ? (
                                        // Dropdown untuk menu Layanan
                                        <View>
                                            <TouchableOpacity
                                                style={styles.navItem}
                                                onPress={handleServicesClick}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.navText}>{item.label}</Text>
                                                <Text style={styles.dropdownArrow}>
                                                    {servicesDropdownVisible ? '▲' : '▼'}
                                                </Text>
                                            </TouchableOpacity>

                                            {servicesDropdownVisible && (
                                                <View style={styles.dropdownMenu}>
                                                    {servicesList.map((service) => (
                                                        <TouchableOpacity
                                                            key={service.id}
                                                            style={styles.dropdownItem}
                                                            onPress={() => handleNavigation(service.href)}
                                                        >
                                                            <Text style={styles.dropdownItemText}>
                                                                {service.label}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.navItem}
                                            onPress={() => handleNavigation(item.href)}
                                        >
                                            <Text style={styles.navText}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {isMobile && (
                        <TouchableOpacity
                            style={styles.burgerButton}
                            onPress={menuVisible ? closeMenu : showMenu}
                            activeOpacity={0.7}
                        >
                            <Animated.View style={[
                                styles.burgerLine,
                                menuVisible && styles.burgerLineActive1
                            ]} />
                            <Animated.View style={[
                                styles.burgerLine,
                                menuVisible && styles.burgerLineActive2
                            ]} />
                            <Animated.View style={[
                                styles.burgerLine,
                                menuVisible && styles.burgerLineActive3
                            ]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Mobile Menu Overlay dengan Animasi */}
            {isMobile && menuVisible && (
                <Animated.View
                    style={[
                        styles.overlay,
                        {
                            opacity: overlayAnim
                        }
                    ]}
                >
                    <Pressable
                        style={styles.overlayPressable}
                        onPress={closeMenu}
                    >
                        <Animated.View
                            style={[
                                styles.mobileMenuContainer,
                                {
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            <View style={styles.mobileMenu}>
                                <View style={styles.menuHeader}>
                                    <Text style={styles.menuHeaderText}>Menu</Text>
                                    <View style={styles.menuIndicator} />
                                </View>
                                {menuItems.map((item, index) => (
                                    <Animated.View
                                        key={item.id}
                                        style={{
                                            opacity: slideAnim.interpolate({
                                                inputRange: [-300, 0],
                                                outputRange: [0, 1],
                                                extrapolate: 'clamp'
                                            }),
                                            transform: [{
                                                translateX: slideAnim.interpolate({
                                                    inputRange: [-300, 0],
                                                    outputRange: [-50 * (index + 1), 0],
                                                    extrapolate: 'clamp'
                                                })
                                            }]
                                        }}
                                    >
                                        {item.hasDropdown ? (
                                            // Untuk mobile, layanan akan menampilkan submenu
                                            <View>
                                                <TouchableOpacity
                                                    style={styles.mobileNavItem}
                                                    onPress={() => {
                                                        setServicesDropdownVisible(!servicesDropdownVisible);
                                                    }}
                                                >
                                                    <View style={styles.mobileNavItemWithArrow}>
                                                        <Text style={styles.mobileNavText}>{item.label}</Text>
                                                        <Text style={styles.mobileDropdownArrow}>
                                                            {servicesDropdownVisible ? '▼' : '▶'}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>

                                                {servicesDropdownVisible && (
                                                    <View style={styles.mobileSubmenu}>
                                                        {servicesList.map((service) => (
                                                            <TouchableOpacity
                                                                key={service.id}
                                                                style={styles.mobileSubmenuItem}
                                                                onPress={() => handleNavigation(service.href)}
                                                            >
                                                                <View style={styles.mobileSubmenuContent}>
                                                                    <View style={styles.mobileSubmenuLine} />
                                                                    <Text style={styles.mobileSubmenuText}>
                                                                        {service.label}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                style={styles.mobileNavItem}
                                                onPress={() => handleNavigation(item.href)}
                                            >
                                                <Text style={styles.mobileNavText}>{item.label}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </Animated.View>
                                ))}
                            </View>
                        </Animated.View>
                    </Pressable>
                </Animated.View>
            )}

            {/* Konten Utama dengan ScrollView */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 0 }}
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

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            © 2026 Bank Sampah Pintar. All rights reserved.
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
        backgroundColor: '#FFFFFF',
    },
    gradientBackground: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent',
        zIndex: 2,
    },
    container: {
        flex: 1,
    },
    navbar: {
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
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
        color: '#333333',
    },
    logoTextOr: {
        color: '#F68B1E',
    },
    desktopMenu: {
        flexDirection: 'row',
        gap: 30,
        position: 'relative',
    },
    navItem: {
        paddingVertical: 8,
        paddingHorizontal: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dropdownArrow: {
        color: '#F68B1E',
        fontSize: 12,
        marginLeft: 4,
    },
    navText: {
        color: '#333333',
        fontSize: 14,
        fontWeight: '500',
    },
    // Style untuk dropdown desktop
    dropdownMenu: {
        position: 'absolute',
        top: 35,
        left: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        minWidth: 200,
        zIndex: 2000,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dropdownItemText: {
        color: '#555555',
        fontSize: 14,
        fontWeight: '400',
    },
    // Mobile menu styles
    burgerButton: {
        width: 30,
        height: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    burgerLine: {
        width: '100%',
        height: 3,
        backgroundColor: '#F68B1E',
        borderRadius: 2,
        transformOrigin: 'center',
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
    overlayPressable: {
        flex: 1,
    },
    mobileMenuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    mobileMenu: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    menuHeader: {
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F68B1E',
        marginBottom: 8,
    },
    menuIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#F68B1E',
        borderRadius: 2,
    },
    mobileNavItem: {
        paddingVertical: 14,
        paddingHorizontal: 0,
        marginVertical: 2,
        borderRadius: 0,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    mobileNavItemWithArrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mobileNavText: {
        color: '#333333',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'left',
    },
    mobileDropdownArrow: {
        color: '#F68B1E',
        fontSize: 14,
        fontWeight: 'bold',
    },
    mobileSubmenu: {
        marginTop: 8,
        marginBottom: 8,
        paddingLeft: 0,
    },
    mobileSubmenuItem: {
        paddingVertical: 10,
        paddingHorizontal: 0,
        marginVertical: 2,
        borderRadius: 0,
        backgroundColor: 'transparent',
    },
    mobileSubmenuContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    mobileSubmenuLine: {
        width: 2,
        height: 20,
        backgroundColor: '#F68B1E',
        borderRadius: 1,
    },
    mobileSubmenuText: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '400',
        flex: 1,
    },
    heroSection: {
        paddingVertical: 60,
        paddingHorizontal: 20,
        alignItems: 'center',
        minHeight: '70%',
        backgroundColor: 'transparent',
    },
    heroContent: {
        alignItems: 'center',
        maxWidth: 600,
        marginTop: 90,
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
        color: '#333333',
    },
    heroTitleGreen: {
        color: '#F68B1E',
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 32,
    },
    ctaButton: {
        backgroundColor: '#F68B1E',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#F68B1E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
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
        position: 'relative',
    },
    navButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    navButtonDisabled: {
        opacity: 0.3,
    },
    prevButton: {
        marginRight: 5,
    },
    nextButton: {
        marginLeft: 5,
    },
    navButtonText: {
        color: '#2E7D32',
        fontSize: 32,
        fontWeight: 'bold',
    },
    featureCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 8,
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
        color: '#666666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
        minHeight: 60,
    },
    featureButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginTop: 8,
        minWidth: 140,
    },
    featureButtonIcon: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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