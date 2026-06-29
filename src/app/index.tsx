import React, { useState, useRef, useEffect } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Pressable, FlatList, Animated, TextInput, Alert, SafeAreaView, Dimensions, Linking } from 'react-native'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function LandingPage() {
    const router = useRouter()
    const { width } = useWindowDimensions()
    const [menuVisible, setMenuVisible] = useState(false)
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
    const [servicesDropdownVisible, setServicesDropdownVisible] = useState(false)
    const [newsletterEmail, setNewsletterEmail] = useState('')

    const flatListRef = useRef<FlatList>(null)
    const testimonialRef = useRef<FlatList>(null)
    const scrollX = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(-300)).current
    const overlayAnim = useRef(new Animated.Value(0)).current
    const fadeAnim = useRef(new Animated.Value(0)).current

    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start()
    }, [])

    // Data dari website BSP
    const servicesList = [
        { id: '1', label: 'Registrasi Sampah', href: '/services/register-waste', icon: 'recycle', description: 'Daftarkan sampah Anda' },
        { id: '2', label: 'Tukar Poin', href: '/services/redeem-points', icon: 'gift', description: 'Tukarkan poin Anda' },
        { id: '3', label: 'Laporan Sampah', href: '/services/waste-report', icon: 'file-text', description: 'Laporkan kondisi sampah' },
        { id: '4', label: 'Merchant Partner', href: '/services/merchant', icon: 'store', description: 'Bergabung sebagai mitra' },
        { id: '5', label: 'Komunitas', href: '/services/community', icon: 'people', description: 'Bergabung dengan komunitas' }
    ]

    const menuItems = [
        { id: 'home', label: 'Beranda', href: '/', icon: 'home' },
        { id: 'about', label: 'Tentang Kami', href: '/about', icon: 'information-circle' },
        { id: 'services', label: 'Layanan', href: '/services', hasDropdown: true, icon: 'briefcase' },
        { id: 'login', label: 'Masuk', href: '/auth/login', icon: 'log-in' }
    ]

    // Data Statistik dari website
    const statsData = [
        { id: '1', number: '5', label: 'Unit Bank Sampah', icon: 'business' },
        { id: '2', number: '628', label: 'Nasabah', icon: 'people' },
        { id: '3', number: '71,899.58', label: 'Terkelola (Kg)', icon: 'trash-bin' },
        { id: '4', number: '58.33', label: 'Total Emas (gr)', icon: 'cash' },
        { id: '5', number: '43.48', label: 'Ton CO2-eq', icon: 'leaf' }
    ]

    // Penghargaan dari website
    const awards = [
        { id: '1', title: 'ISDA 2022', level: 'PLATINUM', icon: 'trophy' },
        { id: '2', title: 'ISDA 2021', level: 'GOLD', icon: 'medal' },
        { id: '3', title: 'CSR Awards 2020', level: '', icon: 'ribbon' }
    ]

    // Testimoni dari website
    const testimonials = [
        { id: '1', name: 'Badak', text: 'Semoga dengan pilah sampah ini menjadi segudang emas (Amiin)', rating: 5 },
        { id: '2', name: 'Fasiha Laela Widiya', text: 'Bank sampah pok lisa Bagus sekali', rating: 5 },
        { id: '3', name: 'Gavin', text: 'bias rw 015 luar biasaaaaa......ttp semangat team', rating: 5 },
        { id: '4', name: 'Fitri', text: 'BSP mantab', rating: 5 }
    ]

    // Data Emisi dari website
    const emissionData = {
        co2: 0.029820579679,
        ch4: 0.00042839381,
        n2o: 0.000009886011,
        total: 0.043476456207
    }

    const features = [
        {
            id: '1',
            icon: '📚',
            title: 'Baca Buku Kami',
            desc: 'Sejarah baru dalam pengelolaan lingkungan berbasis digitalisasi dan pengembangan masyarakat.',
            color: '#F68B1E',
            action: 'Baca Gratis',
            link: 'https://bsp.web.id/buku'
        },
        {
            id: '2',
            icon: '🏆',
            title: 'Penghargaan',
            desc: 'Telah meraih berbagai penghargaan bergengsi di bidang pengelolaan lingkungan.',
            color: '#2E7D32',
            action: 'Lihat Penghargaan'
        },
        {
            id: '3',
            icon: '🌍',
            title: 'Pengurangan Emisi',
            desc: 'Berkontribusi dalam pengurangan emisi CO2, CH4, dan N2O melalui pengelolaan sampah.',
            color: '#2196F3',
            action: 'Lihat Data'
        }
    ]

    // Functions
    const showMenu = () => {
        setMenuVisible(true)
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
            Animated.timing(overlayAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start()
    }

    const closeMenu = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: -300, duration: 300, useNativeDriver: true }),
            Animated.timing(overlayAnim, { toValue: 0, duration: 300, useNativeDriver: true })
        ]).start(() => setMenuVisible(false))
    }

    const handleNavigation = (href: string) => {
        closeMenu()
        setServicesDropdownVisible(false)
        setTimeout(() => router.push(href as any), 300)
    }

    const handleServicesClick = () => setServicesDropdownVisible(!servicesDropdownVisible)

    const handleNewsletterSubmit = () => {
        if (newsletterEmail.trim()) {
            Alert.alert('Berhasil!', 'Terima kasih telah berlangganan newsletter kami.')
            setNewsletterEmail('')
        } else {
            Alert.alert('Peringatan', 'Silahkan masukkan alamat email Anda.')
        }
    }

    const handleExternalLink = (url: string) => {
        Linking.openURL(url).catch(() => {
            Alert.alert('Error', 'Tidak dapat membuka link')
        })
    }

    const handleNextFeature = () => {
        if (currentFeatureIndex < features.length - 1) {
            const newIndex = currentFeatureIndex + 1
            setCurrentFeatureIndex(newIndex)
            flatListRef.current?.scrollToIndex({ index: newIndex, animated: true, viewPosition: 0.5 })
        }
    }

    const handlePrevFeature = () => {
        if (currentFeatureIndex > 0) {
            const newIndex = currentFeatureIndex - 1
            setCurrentFeatureIndex(newIndex)
            flatListRef.current?.scrollToIndex({ index: newIndex, animated: true, viewPosition: 0.5 })
        }
    }

    const handleNextTestimonial = () => {
        if (currentTestimonialIndex < testimonials.length - 1) {
            const newIndex = currentTestimonialIndex + 1
            setCurrentTestimonialIndex(newIndex)
            testimonialRef.current?.scrollToIndex({ index: newIndex, animated: true, viewPosition: 0.5 })
        }
    }

    const handlePrevTestimonial = () => {
        if (currentTestimonialIndex > 0) {
            const newIndex = currentTestimonialIndex - 1
            setCurrentTestimonialIndex(newIndex)
            testimonialRef.current?.scrollToIndex({ index: newIndex, animated: true, viewPosition: 0.5 })
        }
    }

    const onScrollEnd = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x
        const itemWidth = getFeatureItemWidth()
        const index = Math.round(contentOffsetX / (itemWidth + 20))
        setCurrentFeatureIndex(Math.min(index, features.length - 1))
    }

    const onTestimonialScrollEnd = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x
        const itemWidth = isMobile ? width * 0.9 : width * 0.5
        const index = Math.round(contentOffsetX / (itemWidth + 20))
        setCurrentTestimonialIndex(Math.min(index, testimonials.length - 1))
    }

    const getFeatureItemWidth = () => {
        if (isMobile) return width * 0.85
        if (isTablet) return width * 0.45
        return width * 0.3
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => <Ionicons key={`star-${i}`} name={i < rating ? 'star' : 'star-outline'} size={16} color={i < rating ? '#FFD700' : '#CCCCCC'} />)
    }

    const renderFeatureItem = ({ item, index }: { item: any; index: number }) => {
        const itemWidth = getFeatureItemWidth()
        return (
            <Animated.View
                key={`feature-${item.id}`}
                style={[
                    styles.featureCard,
                    {
                        width: itemWidth,
                        transform: [
                            {
                                scale: scrollX.interpolate({
                                    inputRange: [(index - 1) * (itemWidth + 20), index * (itemWidth + 20), (index + 1) * (itemWidth + 20)],
                                    outputRange: [0.9, 1, 0.9],
                                    extrapolate: 'clamp'
                                })
                            }
                        ]
                    }
                ]}
            >
                <View style={styles.featureCardContent}>
                    <View style={[styles.featureIconContainer, { backgroundColor: `${item.color}20` }]}>
                        <Text style={styles.featureIcon}>{item.icon}</Text>
                    </View>
                    <Text style={[styles.featureTitle, { color: item.color }]}>{item.title}</Text>
                    <Text style={styles.featureDesc}>{item.desc}</Text>
                    <TouchableOpacity
                        style={[styles.featureButton, { backgroundColor: item.color }]}
                        onPress={() => {
                            if (item.link) {
                                handleExternalLink(item.link)
                            } else {
                                Alert.alert('Info', `Fitur ${item.title} akan segera hadir`)
                            }
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.featureButtonText}>{item.action}</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }

    const renderTestimonialItem = ({ item }: { item: any }) => (
        <View key={`testimonial-${item.id}`} style={[styles.testimonialCard, { width: isMobile ? width * 0.9 : width * 0.5 }]}>
            <View style={styles.testimonialHeader}>
                <View style={styles.testimonialAvatarContainer}>
                    <Text style={styles.testimonialAvatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.testimonialInfo}>
                    <Text style={styles.testimonialName}>{item.name}</Text>
                    <View style={styles.testimonialStars}>{renderStars(item.rating)}</View>
                </View>
            </View>
            <Text style={styles.testimonialText}>"{item.text}"</Text>
        </View>
    )

    // Render stats items
    const renderStats = () => {
        return statsData.map((stat) => (
            <View key={`stat-${stat.id}`} style={[styles.statItem, isMobile && styles.statItemMobile]}>
                <View style={styles.statIconContainer}>
                    <Ionicons name={stat.icon as any} size={isMobile ? 20 : 24} color="#F68B1E" />
                </View>
                <Text style={[styles.statNumber, isMobile && styles.statNumberMobile]}>{stat.number}</Text>
                <Text style={[styles.statLabel, isMobile && styles.statLabelMobile]}>{stat.label}</Text>
            </View>
        ))
    }

    // Render awards
    const renderAwards = () => {
        return awards.map((award) => (
            <View key={`award-${award.id}`} style={[styles.awardItem, isMobile && styles.awardItemMobile]}>
                <View style={styles.awardIconContainer}>
                    <Ionicons name={award.icon as any} size={24} color="#F68B1E" />
                </View>
                <Text style={[styles.awardTitle, isMobile && styles.awardTitleMobile]}>{award.title}</Text>
                {award.level ? <Text style={[styles.awardLevel, isMobile && styles.awardLevelMobile]}>{award.level}</Text> : null}
            </View>
        ))
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar style="dark" />

            {/* Navbar */}
            <View style={[styles.navbar, isMobile && styles.navbarMobile]}>
                <View style={styles.navContent}>
                    <TouchableOpacity style={styles.logoSection} onPress={() => handleNavigation('/')} activeOpacity={0.8}>
                        <Image source={require('../../assets/images/icon_bspid.png')} style={styles.logo} resizeMode="contain" />
                        {!isMobile && (
                            <Text style={styles.logoText}>
                                Bank Sampah<Text style={styles.logoTextOr}> Pintar</Text>
                            </Text>
                        )}
                    </TouchableOpacity>

                    {!isMobile && (
                        <View style={styles.desktopMenu}>
                            {menuItems.map((item) => (
                                <View key={`menu-${item.id}`}>
                                    {item.hasDropdown ? (
                                        <View>
                                            <TouchableOpacity style={styles.navItem} onPress={handleServicesClick} activeOpacity={0.7}>
                                                <Text style={styles.navText}>{item.label}</Text>
                                                <Ionicons name={servicesDropdownVisible ? 'chevron-up' : 'chevron-down'} size={16} color="#F68B1E" />
                                            </TouchableOpacity>
                                            {servicesDropdownVisible && (
                                                <View style={styles.dropdownMenu}>
                                                    {servicesList.map((service) => (
                                                        <TouchableOpacity key={`service-${service.id}`} style={styles.dropdownItem} onPress={() => handleNavigation(service.href)}>
                                                            <View style={styles.dropdownItemContent}>
                                                                <View style={styles.dropdownIconContainer}>
                                                                    <Ionicons name={service.icon as any} size={20} color="#F68B1E" />
                                                                </View>
                                                                <View style={styles.dropdownTextContainer}>
                                                                    <Text style={styles.dropdownItemText}>{service.label}</Text>
                                                                    <Text style={styles.dropdownItemDesc}>{service.description}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    ) : (
                                        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation(item.href)}>
                                            <Text style={styles.navText}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {isMobile && (
                        <TouchableOpacity style={styles.burgerButton} onPress={menuVisible ? closeMenu : showMenu} activeOpacity={0.7}>
                            <Animated.View style={[styles.burgerLine, menuVisible && styles.burgerLineActive1]} />
                            <Animated.View style={[styles.burgerLine, menuVisible && styles.burgerLineActive2]} />
                            <Animated.View style={[styles.burgerLine, menuVisible && styles.burgerLineActive3]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Mobile Menu */}
            {isMobile && menuVisible && (
                <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
                    <Pressable style={styles.overlayPressable} onPress={closeMenu}>
                        <Animated.View style={[styles.mobileMenuContainer, { transform: [{ translateY: slideAnim }] }]}>
                            <ScrollView style={styles.mobileMenuScroll} showsVerticalScrollIndicator={false}>
                                <View style={styles.mobileMenu}>
                                    <View style={styles.menuHeader}>
                                        <Text style={styles.menuHeaderText}>Menu</Text>
                                        <View style={styles.menuIndicator} />
                                    </View>
                                    {menuItems.map((item, index) => (
                                        <Animated.View
                                            key={`mobile-menu-${item.id}`}
                                            style={{
                                                opacity: slideAnim.interpolate({
                                                    inputRange: [-300, 0],
                                                    outputRange: [0, 1],
                                                    extrapolate: 'clamp'
                                                }),
                                                transform: [
                                                    {
                                                        translateX: slideAnim.interpolate({
                                                            inputRange: [-300, 0],
                                                            outputRange: [-50 * (index + 1), 0],
                                                            extrapolate: 'clamp'
                                                        })
                                                    }
                                                ]
                                            }}
                                        >
                                            {item.hasDropdown ? (
                                                <View>
                                                    <TouchableOpacity style={styles.mobileNavItem} onPress={() => setServicesDropdownVisible(!servicesDropdownVisible)}>
                                                        <View style={styles.mobileNavItemWithArrow}>
                                                            <View style={styles.mobileNavItemIcon}>
                                                                <Ionicons name={item.icon as any} size={20} color="#F68B1E" />
                                                                <Text style={styles.mobileNavText}>{item.label}</Text>
                                                            </View>
                                                            <Ionicons name={servicesDropdownVisible ? 'chevron-down' : 'chevron-forward'} size={20} color="#F68B1E" />
                                                        </View>
                                                    </TouchableOpacity>
                                                    {servicesDropdownVisible && (
                                                        <View style={styles.mobileSubmenu}>
                                                            {servicesList.map((service) => (
                                                                <TouchableOpacity key={`mobile-service-${service.id}`} style={styles.mobileSubmenuItem} onPress={() => handleNavigation(service.href)}>
                                                                    <View style={styles.mobileSubmenuContent}>
                                                                        <View style={styles.mobileSubmenuLine} />
                                                                        <View>
                                                                            <Text style={styles.mobileSubmenuText}>{service.label}</Text>
                                                                            <Text style={styles.mobileSubmenuDesc}>{service.description}</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </View>
                                                    )}
                                                </View>
                                            ) : (
                                                <TouchableOpacity style={styles.mobileNavItem} onPress={() => handleNavigation(item.href)}>
                                                    <View style={styles.mobileNavItemIcon}>
                                                        <Ionicons name={item.icon as any} size={20} color="#F68B1E" />
                                                        <Text style={styles.mobileNavText}>{item.label}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        </Animated.View>
                                    ))}
                                    <View style={styles.mobileMenuFooter}>
                                        <TouchableOpacity style={styles.mobileMenuButton} onPress={() => handleNavigation('/auth/login')}>
                                            <Text style={styles.mobileMenuButtonText}>Masuk</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </Animated.View>
                    </Pressable>
                </Animated.View>
            )}

            {/* Main Content */}
            <Animated.ScrollView style={[styles.scrollView, { opacity: fadeAnim }]} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Hero Section with Banner */}
                <LinearGradient colors={['#1B5E20', '#2E7D32', '#388E3C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroSection}>
                    <View style={[styles.heroContent, isMobile && styles.heroContentMobile]}>
                        {/* Banner Image / Logo */}
                        <View style={styles.heroBannerContainer}>
                            <Image source={require('../../assets/images/icon_bspid.png')} style={[styles.heroLogo, isMobile && styles.heroLogoMobile]} resizeMode="contain" />
                            <View style={styles.heroBadgeContainer}>
                                <View style={styles.heroBadge}>
                                    <Text style={styles.heroBadgeText}>#DigitalisasiSampah</Text>
                                </View>
                                <View style={[styles.heroBadge, styles.heroBadgeGold]}>
                                    <Text style={[styles.heroBadgeText, styles.heroBadgeTextGold]}>#MenjadiEmas</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={[styles.heroTitle, isMobile && styles.heroTitleMobile, isTablet && styles.heroTitleTablet]}>
                            Bank Sampah<Text style={styles.heroTitleGreen}> Pintar</Text>
                        </Text>
                        <Text style={[styles.heroSubtitle, isMobile && styles.heroSubtitleMobile]}>Digitalisasi Sampah Menjadi Emas</Text>
                        <Text style={[styles.heroDescription, isMobile && styles.heroDescriptionMobile]}>
                            Sejarah baru dalam pengelolaan lingkungan berbasis digitalisasi dan pengembangan masyarakat
                        </Text>

                        <View style={[styles.heroButtons, isMobile && styles.heroButtonsMobile]}>
                            <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/auth/login')}>
                                <Text style={styles.ctaButtonText}>Mulai Sekarang</Text>
                                <Ionicons name="arrow-forward" size={isMobile ? 16 : 20} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.ctaButtonOutline, isMobile && styles.ctaButtonOutlineMobile]} onPress={() => handleExternalLink('https://bsp.web.id/buku')}>
                                <Text style={[styles.ctaButtonOutlineText, isMobile && styles.ctaButtonOutlineTextMobile]}>
                                    <Ionicons name="book" size={isMobile ? 14 : 16} color="#FFFFFF" /> Baca Buku Kami
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Awards Section in Hero */}
                        <View style={[styles.heroAwards, isMobile && styles.heroAwardsMobile]}>{renderAwards()}</View>
                    </View>
                </LinearGradient>

                {/* Stats Section */}
                <View style={styles.statsSection}>
                    <View style={[styles.statsContainer, isMobile && styles.statsContainerMobile]}>{renderStats()}</View>
                </View>

                {/* Features Section */}
                <View style={styles.featuresSection}>
                    <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>Layanan Unggulan</Text>
                    <Text style={[styles.sectionSubtitle, isMobile && styles.sectionSubtitleMobile]}>Solusi cerdas untuk pengelolaan sampah yang berkelanjutan dan menguntungkan</Text>

                    <View style={styles.carouselContainer}>
                        {!isMobile && (
                            <TouchableOpacity style={[styles.navButton, currentFeatureIndex === 0 && styles.navButtonDisabled]} onPress={handlePrevFeature} disabled={currentFeatureIndex === 0}>
                                <Ionicons name="chevron-back" size={32} color="#2E7D32" />
                            </TouchableOpacity>
                        )}

                        <FlatList
                            ref={flatListRef}
                            data={features}
                            renderItem={renderFeatureItem}
                            keyExtractor={(item) => `feature-${item.id}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={getFeatureItemWidth() + 20}
                            snapToAlignment="center"
                            decelerationRate="fast"
                            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
                            onMomentumScrollEnd={onScrollEnd}
                            contentContainerStyle={[styles.featuresListContainer, isMobile && styles.featuresListContainerMobile]}
                        />

                        {!isMobile && (
                            <TouchableOpacity
                                style={[styles.navButton, currentFeatureIndex === features.length - 1 && styles.navButtonDisabled]}
                                onPress={handleNextFeature}
                                disabled={currentFeatureIndex === features.length - 1}
                            >
                                <Ionicons name="chevron-forward" size={32} color="#2E7D32" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.paginationContainer}>
                        {features.map((_, index) => (
                            <View key={`dot-${index}`} style={[styles.paginationDot, currentFeatureIndex === index && styles.paginationDotActive]} />
                        ))}
                    </View>
                </View>

                {/* Emission Data Section */}
                <View style={styles.emissionSection}>
                    <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile, styles.sectionTitleWhite]}>Kontribusi Pengurangan Emisi</Text>
                    <Text style={[styles.sectionSubtitle, isMobile && styles.sectionSubtitleMobile, styles.sectionSubtitleWhite]}>Data emisi yang berhasil dikurangi melalui pengelolaan sampah</Text>

                    <View style={[styles.emissionContainer, isMobile && styles.emissionContainerMobile]}>
                        <View style={[styles.emissionCard, isMobile && styles.emissionCardMobile]}>
                            <Text style={styles.emissionLabel}>Total Emisi CO2-eq</Text>
                            <Text style={styles.emissionValue}>{emissionData.total.toFixed(4)}</Text>
                            <Text style={styles.emissionUnit}>Ton CO2-eq</Text>
                        </View>
                        <View style={[styles.emissionGrid, isMobile && styles.emissionGridMobile]}>
                            <View style={styles.emissionItem}>
                                <Text style={styles.emissionItemLabel}>CO2</Text>
                                <Text style={styles.emissionItemValue}>{emissionData.co2.toFixed(4)}</Text>
                            </View>
                            <View style={styles.emissionItem}>
                                <Text style={styles.emissionItemLabel}>CH4</Text>
                                <Text style={styles.emissionItemValue}>{emissionData.ch4.toFixed(6)}</Text>
                            </View>
                            <View style={styles.emissionItem}>
                                <Text style={styles.emissionItemLabel}>N2O</Text>
                                <Text style={styles.emissionItemValue}>{emissionData.n2o.toFixed(9)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Testimonials Section */}
                <View style={styles.testimonialsSection}>
                    <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>Apa Kata Mereka?</Text>
                    <Text style={[styles.sectionSubtitle, isMobile && styles.sectionSubtitleMobile]}>Testimoni dari pengguna yang telah merasakan manfaat Bank Sampah Pintar</Text>

                    <View style={styles.testimonialContainer}>
                        {!isMobile && (
                            <TouchableOpacity
                                style={[styles.navButton, currentTestimonialIndex === 0 && styles.navButtonDisabled]}
                                onPress={handlePrevTestimonial}
                                disabled={currentTestimonialIndex === 0}
                            >
                                <Ionicons name="chevron-back" size={32} color="#F68B1E" />
                            </TouchableOpacity>
                        )}

                        <FlatList
                            ref={testimonialRef}
                            data={testimonials}
                            renderItem={renderTestimonialItem}
                            keyExtractor={(item) => `testimonial-${item.id}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={(isMobile ? width * 0.9 : width * 0.5) + 20}
                            snapToAlignment="center"
                            decelerationRate="fast"
                            onMomentumScrollEnd={onTestimonialScrollEnd}
                            contentContainerStyle={isMobile && styles.testimonialListMobile}
                        />

                        {!isMobile && (
                            <TouchableOpacity
                                style={[styles.navButton, currentTestimonialIndex === testimonials.length - 1 && styles.navButtonDisabled]}
                                onPress={handleNextTestimonial}
                                disabled={currentTestimonialIndex === testimonials.length - 1}
                            >
                                <Ionicons name="chevron-forward" size={32} color="#F68B1E" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.paginationContainer}>
                        {testimonials.map((_, index) => (
                            <View key={`testimonial-dot-${index}`} style={[styles.paginationDot, currentTestimonialIndex === index && styles.paginationDotActiveOrange]} />
                        ))}
                    </View>
                </View>

                {/* CTA Section */}
                <LinearGradient colors={['#1B5E20', '#2E7D32']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaSection}>
                    <View style={[styles.ctaContent, isMobile && styles.ctaContentMobile]}>
                        <Text style={[styles.ctaTitle, isMobile && styles.ctaTitleMobile]}>Siap Menjadi Bagian Dari Perubahan?</Text>
                        <Text style={[styles.ctaDescription, isMobile && styles.ctaDescriptionMobile]}>
                            Bergabunglah dengan {statsData[1].number} nasabah yang telah mengelola sampah dengan lebih baik
                        </Text>
                        <TouchableOpacity style={[styles.ctaButtonLarge, isMobile && styles.ctaButtonLargeMobile]} onPress={() => router.push('/auth/login')}>
                            <Text style={[styles.ctaButtonLargeText, isMobile && styles.ctaButtonLargeTextMobile]}>Daftar Sekarang</Text>
                            <Ionicons name="arrow-forward" size={isMobile ? 20 : 24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Newsletter Section */}
                <View style={styles.newsletterSection}>
                    <View style={[styles.newsletterContent, isMobile && styles.newsletterContentMobile]}>
                        <Text style={[styles.newsletterTitle, isMobile && styles.newsletterTitleMobile]}>
                            <Ionicons name="mail" size={isMobile ? 20 : 24} color="#F68B1E" /> Berlangganan Newsletter
                        </Text>
                        <Text style={[styles.newsletterDescription, isMobile && styles.newsletterDescriptionMobile]}>Dapatkan informasi terbaru tentang pengelolaan sampah dan tips lingkungan</Text>
                        <View style={[styles.newsletterInputContainer, isMobile && styles.newsletterInputContainerMobile]}>
                            <TextInput
                                style={[styles.newsletterInput, isMobile && styles.newsletterInputMobile]}
                                placeholder="Masukkan alamat email Anda"
                                placeholderTextColor="#999"
                                value={newsletterEmail}
                                onChangeText={setNewsletterEmail}
                                keyboardType="email-address"
                            />
                            <TouchableOpacity style={[styles.newsletterButton, isMobile && styles.newsletterButtonMobile]} onPress={handleNewsletterSubmit}>
                                <Text style={[styles.newsletterButtonText, isMobile && styles.newsletterButtonTextMobile]}>Berlangganan</Text>
                                <Ionicons name="send" size={isMobile ? 14 : 16} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={[styles.footerContent, isMobile && styles.footerContentMobile]}>
                        <View style={[styles.footerColumn, isMobile && styles.footerColumnMobile]}>
                            <View style={styles.footerLogo}>
                                <Image source={require('../../assets/images/icon_bspid.png')} style={[styles.footerLogoImage, isMobile && styles.footerLogoImageMobile]} resizeMode="contain" />
                                <Text style={[styles.footerLogoText, isMobile && styles.footerLogoTextMobile]}>
                                    Bank Sampah <Text style={{ color: '#F68B1E' }}>Pintar</Text>
                                </Text>
                            </View>
                            <Text style={[styles.footerDescription, isMobile && styles.footerDescriptionMobile]}>
                                Digitalisasi sampah menjadi emas melalui pengelolaan yang berkelanjutan dan inovatif.
                            </Text>
                            <Text style={[styles.footerTagline, isMobile && styles.footerTaglineMobile]}>#PilahSampah #MenjadiEmas</Text>
                        </View>

                        <View style={[styles.footerColumn, isMobile && styles.footerColumnMobile]}>
                            <Text style={[styles.footerHeading, isMobile && styles.footerHeadingMobile]}>Tautan Cepat</Text>
                            <TouchableOpacity onPress={() => handleNavigation('/about')}>
                                <Text style={[styles.footerLink, isMobile && styles.footerLinkMobile]}>Tentang Kami</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleNavigation('/services')}>
                                <Text style={[styles.footerLink, isMobile && styles.footerLinkMobile]}>Layanan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleExternalLink('https://bsp.web.id/buku')}>
                                <Text style={[styles.footerLink, isMobile && styles.footerLinkMobile]}>Baca Buku</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleNavigation('/auth/login')}>
                                <Text style={[styles.footerLink, isMobile && styles.footerLinkMobile]}>Masuk</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.footerColumn, isMobile && styles.footerColumnMobile]}>
                            <Text style={[styles.footerHeading, isMobile && styles.footerHeadingMobile]}>Penghargaan</Text>
                            {awards.map((award) => (
                                <Text key={`footer-award-${award.id}`} style={[styles.footerAward, isMobile && styles.footerAwardMobile]}>
                                    {award.title} {award.level ? `- ${award.level}` : ''}
                                </Text>
                            ))}
                        </View>

                        <View style={[styles.footerColumn, isMobile && styles.footerColumnMobile]}>
                            <Text style={[styles.footerHeading, isMobile && styles.footerHeadingMobile]}>Ikuti Kami</Text>
                            <View style={[styles.socialIcons, isMobile && styles.socialIconsMobile]}>
                                <TouchableOpacity style={[styles.socialIcon, isMobile && styles.socialIconMobile]}>
                                    <Ionicons name="logo-facebook" size={isMobile ? 20 : 24} color="#FFFFFF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.socialIcon, isMobile && styles.socialIconMobile]}>
                                    <Ionicons name="logo-instagram" size={isMobile ? 20 : 24} color="#FFFFFF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.socialIcon, isMobile && styles.socialIconMobile]}>
                                    <Ionicons name="logo-youtube" size={isMobile ? 20 : 24} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footerBottom}>
                        <Text style={[styles.footerText, isMobile && styles.footerTextMobile]}>© BSP. All Rights Reserved. Designed by IT</Text>
                    </View>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollView: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1
    },
    navbar: {
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        zIndex: 1000
    },
    navbarMobile: {
        position: 'sticky',
        top: 0
    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%'
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    logo: {
        width: 36,
        height: 36
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333'
    },
    logoTextOr: {
        color: '#F68B1E'
    },
    desktopMenu: {
        flexDirection: 'row',
        gap: 24,
        position: 'relative',
        alignItems: 'center'
    },
    navItem: {
        paddingVertical: 8,
        paddingHorizontal: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    navText: {
        color: '#333333',
        fontSize: 14,
        fontWeight: '500'
    },
    dropdownMenu: {
        position: 'absolute',
        top: 35,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        minWidth: 260,
        zIndex: 2000,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden',
        paddingVertical: 8
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    },
    dropdownItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    dropdownIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dropdownTextContainer: {
        flex: 1
    },
    dropdownItemText: {
        color: '#333333',
        fontSize: 13,
        fontWeight: '500'
    },
    dropdownItemDesc: {
        color: '#888888',
        fontSize: 11,
        marginTop: 1
    },
    burgerButton: {
        width: 28,
        height: 22,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 3
    },
    burgerLine: {
        width: '100%',
        height: 2.5,
        backgroundColor: '#F68B1E',
        borderRadius: 2,
        transformOrigin: 'center'
    },
    burgerLineActive1: {
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 9
    },
    burgerLineActive2: {
        opacity: 0
    },
    burgerLineActive3: {
        transform: [{ rotate: '-45deg' }],
        position: 'absolute',
        top: 9
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999
    },
    overlayPressable: {
        flex: 1
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
        maxHeight: '85%'
    },
    mobileMenuScroll: {
        maxHeight: '85%'
    },
    mobileMenu: {
        paddingVertical: 16,
        paddingHorizontal: 16
    },
    menuHeader: {
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    menuHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F68B1E',
        marginBottom: 6
    },
    menuIndicator: {
        width: 32,
        height: 3,
        backgroundColor: '#F68B1E',
        borderRadius: 2
    },
    mobileNavItem: {
        paddingVertical: 12,
        paddingHorizontal: 0,
        marginVertical: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    },
    mobileNavItemWithArrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    mobileNavItemIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    mobileNavText: {
        color: '#333333',
        fontSize: 15,
        fontWeight: '500'
    },
    mobileSubmenu: {
        marginTop: 6,
        marginBottom: 6,
        paddingLeft: 28
    },
    mobileSubmenuItem: {
        paddingVertical: 8,
        paddingHorizontal: 0,
        marginVertical: 1
    },
    mobileSubmenuContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    mobileSubmenuLine: {
        width: 2,
        height: 20,
        backgroundColor: '#F68B1E',
        borderRadius: 1
    },
    mobileSubmenuText: {
        color: '#555555',
        fontSize: 13,
        fontWeight: '500'
    },
    mobileSubmenuDesc: {
        color: '#888888',
        fontSize: 11
    },
    mobileMenuFooter: {
        marginTop: 16,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
    },
    mobileMenuButton: {
        backgroundColor: '#F68B1E',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center'
    },
    mobileMenuButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold'
    },
    // Hero Section
    heroSection: {
        paddingVertical: 40,
        paddingHorizontal: 16,
        alignItems: 'center',
        minHeight: 450
    },
    heroContent: {
        alignItems: 'center',
        maxWidth: 900,
        marginTop: 20,
        width: '100%'
    },
    heroContentMobile: {
        marginTop: 10
    },
    heroBannerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 16,
        flexWrap: 'wrap'
    },
    heroLogo: {
        width: 100,
        height: 100
    },
    heroLogoMobile: {
        width: 70,
        height: 70
    },
    heroBadgeContainer: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    heroBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)'
    },
    heroBadgeGold: {
        backgroundColor: 'rgba(246, 139, 30, 0.25)',
        borderColor: '#F68B1E'
    },
    heroBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500'
    },
    heroBadgeTextGold: {
        color: '#F68B1E'
    },
    heroTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#FFFFFF',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4
    },
    heroTitleMobile: {
        fontSize: 26
    },
    heroTitleTablet: {
        fontSize: 36
    },
    heroTitleGreen: {
        color: '#F68B1E'
    },
    heroSubtitle: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '600'
    },
    heroSubtitleMobile: {
        fontSize: 16
    },
    heroDescription: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        marginBottom: 24,
        maxWidth: 600,
        lineHeight: 22
    },
    heroDescriptionMobile: {
        fontSize: 13,
        maxWidth: 300,
        marginBottom: 18
    },
    heroButtons: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 24
    },
    heroButtonsMobile: {
        flexDirection: 'column',
        width: '100%',
        maxWidth: 280,
        gap: 10
    },
    ctaButton: {
        backgroundColor: '#F68B1E',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    ctaButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold'
    },
    ctaButtonOutline: {
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: 'transparent'
    },
    ctaButtonOutlineMobile: {
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    ctaButtonOutlineText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold'
    },
    ctaButtonOutlineTextMobile: {
        fontSize: 13
    },
    heroAwards: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.15)',
        width: '100%'
    },
    heroAwardsMobile: {
        gap: 10
    },
    awardItem: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        minWidth: 80
    },
    awardItemMobile: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        minWidth: 60
    },
    awardIconContainer: {
        marginBottom: 4
    },
    awardTitle: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center'
    },
    awardTitleMobile: {
        fontSize: 10
    },
    awardLevel: {
        color: '#F68B1E',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    awardLevelMobile: {
        fontSize: 8
    },
    // Stats Section
    statsSection: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 30,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
        flexWrap: 'wrap',
        gap: 16
    },
    statsContainerMobile: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12
    },
    statItem: {
        alignItems: 'center',
        minWidth: 100
    },
    statItemMobile: {
        minWidth: 70,
        flex: 1,
        maxWidth: '45%'
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 2
    },
    statNumberMobile: {
        fontSize: 16
    },
    statLabel: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center'
    },
    statLabelMobile: {
        fontSize: 10
    },
    // Features Section
    featuresSection: {
        paddingVertical: 40,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF'
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#2E7D32'
    },
    sectionTitleMobile: {
        fontSize: 20
    },
    sectionTitleWhite: {
        color: '#FFFFFF'
    },
    sectionSubtitle: {
        fontSize: 15,
        color: '#666666',
        textAlign: 'center',
        maxWidth: 600,
        alignSelf: 'center',
        marginBottom: 30,
        lineHeight: 22
    },
    sectionSubtitleMobile: {
        fontSize: 13,
        marginBottom: 20
    },
    sectionSubtitleWhite: {
        color: 'rgba(255, 255, 255, 0.85)'
    },
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
    },
    featuresListContainer: {
        paddingHorizontal: 10
    },
    featuresListContainerMobile: {
        paddingHorizontal: 5
    },
    navButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 10
    },
    navButtonDisabled: {
        opacity: 0.3
    },
    featureCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        marginHorizontal: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    featureCardContent: {
        padding: 20,
        alignItems: 'center'
    },
    featureIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    featureIcon: {
        fontSize: 32
    },
    featureTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    },
    featureDesc: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 18,
        minHeight: 50
    },
    featureButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 22,
        minWidth: 120
    },
    featureButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600'
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#CCCCCC',
        marginHorizontal: 4
    },
    paginationDotActive: {
        width: 16,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#2E7D32'
    },
    paginationDotActiveOrange: {
        width: 16,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#F68B1E'
    },
    // Emission Section
    emissionSection: {
        paddingVertical: 40,
        paddingHorizontal: 16,
        backgroundColor: '#2E7D32'
    },
    emissionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%'
    },
    emissionContainerMobile: {
        flexDirection: 'column',
        gap: 16
    },
    emissionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        minWidth: 150,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    emissionCardMobile: {
        minWidth: '100%'
    },
    emissionLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        marginBottom: 4
    },
    emissionValue: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold'
    },
    emissionUnit: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        marginTop: 2
    },
    emissionGrid: {
        flexDirection: 'row',
        gap: 12
    },
    emissionGridMobile: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    emissionItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        minWidth: 70
    },
    emissionItemLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11
    },
    emissionItemValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold'
    },
    // Testimonials Section
    testimonialsSection: {
        paddingVertical: 40,
        paddingHorizontal: 16,
        backgroundColor: '#F8F9FA'
    },
    testimonialContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
    },
    testimonialListMobile: {
        paddingHorizontal: 5
    },
    testimonialCard: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 14,
        marginHorizontal: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    testimonialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    testimonialAvatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F68B1E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    testimonialAvatarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    testimonialInfo: {
        flex: 1
    },
    testimonialName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333'
    },
    testimonialStars: {
        flexDirection: 'row',
        marginTop: 2
    },
    testimonialText: {
        fontSize: 13,
        color: '#555555',
        lineHeight: 20,
        fontStyle: 'italic'
    },
    // CTA Section
    ctaSection: {
        paddingVertical: 50,
        paddingHorizontal: 16,
        alignItems: 'center'
    },
    ctaContent: {
        alignItems: 'center',
        maxWidth: 600
    },
    ctaContentMobile: {
        paddingHorizontal: 10
    },
    ctaTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10
    },
    ctaTitleMobile: {
        fontSize: 20
    },
    ctaDescription: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22
    },
    ctaDescriptionMobile: {
        fontSize: 13,
        marginBottom: 18
    },
    ctaButtonLarge: {
        backgroundColor: '#F68B1E',
        paddingHorizontal: 34,
        paddingVertical: 14,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6
    },
    ctaButtonLargeMobile: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        width: '100%',
        justifyContent: 'center'
    },
    ctaButtonLargeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    ctaButtonLargeTextMobile: {
        fontSize: 14
    },
    // Newsletter Section
    newsletterSection: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 40,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
    },
    newsletterContent: {
        maxWidth: 600,
        alignSelf: 'center',
        width: '100%'
    },
    newsletterContentMobile: {
        paddingHorizontal: 10
    },
    newsletterTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 10
    },
    newsletterTitleMobile: {
        fontSize: 18
    },
    newsletterDescription: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22
    },
    newsletterDescriptionMobile: {
        fontSize: 13,
        marginBottom: 14
    },
    newsletterInputContainer: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    newsletterInputContainerMobile: {
        flexDirection: 'column',
        gap: 8
    },
    newsletterInput: {
        flex: 1,
        minWidth: 180,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        fontSize: 13,
        backgroundColor: '#FAFAFA'
    },
    newsletterInputMobile: {
        minWidth: '100%'
    },
    newsletterButton: {
        backgroundColor: '#F68B1E',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    newsletterButtonMobile: {
        justifyContent: 'center',
        width: '100%'
    },
    newsletterButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 13
    },
    newsletterButtonTextMobile: {
        fontSize: 13
    },
    // Footer
    footer: {
        backgroundColor: '#1A1A1A',
        paddingTop: 30
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: 16,
        paddingBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        flexWrap: 'wrap',
        gap: 16
    },
    footerContentMobile: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24
    },
    footerColumn: {
        flex: 1,
        minWidth: 130
    },
    footerColumnMobile: {
        alignItems: 'center',
        width: '100%'
    },
    footerLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10
    },
    footerLogoImage: {
        width: 32,
        height: 32
    },
    footerLogoImageMobile: {
        width: 28,
        height: 28
    },
    footerLogoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    footerLogoTextMobile: {
        fontSize: 14
    },
    footerDescription: {
        fontSize: 13,
        color: '#AAAAAA',
        lineHeight: 20,
        maxWidth: 260
    },
    footerDescriptionMobile: {
        textAlign: 'center',
        maxWidth: '100%'
    },
    footerTagline: {
        fontSize: 12,
        color: '#F68B1E',
        marginTop: 6,
        fontWeight: '500'
    },
    footerTaglineMobile: {
        textAlign: 'center'
    },
    footerHeading: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10
    },
    footerHeadingMobile: {
        textAlign: 'center'
    },
    footerLink: {
        fontSize: 13,
        color: '#AAAAAA',
        marginBottom: 6,
        paddingVertical: 1
    },
    footerLinkMobile: {
        textAlign: 'center'
    },
    footerAward: {
        fontSize: 12,
        color: '#AAAAAA',
        marginBottom: 4
    },
    footerAwardMobile: {
        textAlign: 'center',
        fontSize: 11
    },
    socialIcons: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap'
    },
    socialIconsMobile: {
        justifyContent: 'center'
    },
    socialIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center'
    },
    socialIconMobile: {
        width: 32,
        height: 32
    },
    footerBottom: {
        paddingVertical: 16,
        alignItems: 'center'
    },
    footerText: {
        color: '#AAAAAA',
        fontSize: 11,
        textAlign: 'center'
    },
    footerTextMobile: {
        fontSize: 10
    }
})
