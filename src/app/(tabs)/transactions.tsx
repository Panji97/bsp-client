import { View, Text, Dimensions, FlatList, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Transaction {
    id: string;
    type: 'in' | 'out';
    title: string;
    date: string;
    amount: number;
    category: string;
    icon: string;
}

export default function TransactionsScreen() {
    const [activeFilter, setActiveFilter] = useState<'all' | 'in' | 'out'>('all');
    const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

    const transactions: Transaction[] = [
        {
            id: '1',
            type: 'in',
            title: 'DANA Wallet Top Up',
            date: 'Today, 10:30 AM',
            amount: 500000,
            category: 'Top Up',
            icon: '💰',
        },
        {
            id: '2',
            type: 'out',
            title: 'Coffee Shop',
            date: 'Yesterday, 2:15 PM',
            amount: 45000,
            category: 'Food',
            icon: '☕',
        },
        {
            id: '3',
            type: 'in',
            title: 'Salary Transfer',
            date: 'Mar 15, 2024',
            amount: 5000000,
            category: 'Income',
            icon: '💼',
        },
        {
            id: '4',
            type: 'out',
            title: 'Electric Bill',
            date: 'Mar 14, 2024',
            amount: 250000,
            category: 'Bills',
            icon: '⚡',
        },
        {
            id: '5',
            type: 'out',
            title: 'Transfer to Bank',
            date: 'Mar 13, 2024',
            amount: 1000000,
            category: 'Transfer',
            icon: '🏦',
        },
        {
            id: '6',
            type: 'in',
            title: 'Refund Order',
            date: 'Mar 12, 2024',
            amount: 150000,
            category: 'Refund',
            icon: '↩️',
        },
    ];

    const filteredTransactions = transactions.filter(transaction => {
        if (activeFilter === 'in') return transaction.type === 'in';
        if (activeFilter === 'out') return transaction.type === 'out';
        return true;
    });

    const formatAmount = (amount: number, type: 'in' | 'out') => {
        const formattedAmount = new Intl.NumberFormat('id-ID').format(amount);
        if (type === 'in') {
            return `+ Rp${formattedAmount}`;
        } else {
            return `- Rp${formattedAmount}`;
        }
    };

    const TransactionCard = ({ item }: { item: Transaction }) => (
        <TouchableOpacity
            style={[
                styles.transactionCard,
                selectedTransaction === item.id && styles.transactionCardActive
            ]}
            onPress={() => setSelectedTransaction(item.id === selectedTransaction ? null : item.id)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, item.type === 'in' ? styles.incomeIcon : styles.expenseIcon]}>
                <Text style={styles.iconText}>{item.icon}</Text>
            </View>

            <View style={styles.transactionDetails}>
                <View style={styles.transactionHeader}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={[styles.transactionAmount, item.type === 'in' ? styles.incomeText : styles.expenseText]}>
                        {formatAmount(item.amount, item.type)}
                    </Text>
                </View>

                <View style={styles.transactionFooter}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const FilterButton = ({ label, value }: { label: string; value: 'all' | 'in' | 'out' }) => (
        <TouchableOpacity
            onPress={() => setActiveFilter(value)}
            style={[styles.filterButton, activeFilter === value && styles.activeFilterButton]}
            activeOpacity={0.8}
        >
            <Text style={[styles.filterButtonText, activeFilter === value && styles.activeFilterButtonText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const SummaryCard = () => {
        const totalIncome = transactions
            .filter(t => t.type === 'in')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'out')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        return (
            <LinearGradient
                colors={['#FF6B35', '#FF8C42', '#FFA75E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.summaryCard}
            >
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>
                    Rp{new Intl.NumberFormat('id-ID').format(balance)}
                </Text>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryStats}>
                    <View style={styles.statsItem}>
                        <View style={styles.statsIconContainer}>
                            <Text style={styles.statsIcon}>📈</Text>
                        </View>
                        <View>
                            <Text style={styles.statsLabel}>Income</Text>
                            <Text style={styles.statsValue}>
                                +Rp{new Intl.NumberFormat('id-ID').format(totalIncome)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.verticalDivider} />

                    <View style={styles.statsItem}>
                        <View style={[styles.statsIconContainer, styles.statsIconExpense]}>
                            <Text style={styles.statsIcon}>📉</Text>
                        </View>
                        <View>
                            <Text style={styles.statsLabel}>Expense</Text>
                            <Text style={styles.statsValue}>
                                -Rp{new Intl.NumberFormat('id-ID').format(totalExpense)}
                            </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Transactions</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <View style={styles.profileCircle}>
                            <Text style={styles.profileText}>JD</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Summary Card */}
                <SummaryCard />

                {/* Filter Section */}
                <View style={styles.filterSection}>
                    <View style={styles.filterHeader}>
                        <Text style={styles.filterLabel}>Recent Transactions</Text>
                        <Text style={styles.filterCount}>{filteredTransactions.length} items</Text>
                    </View>
                    <View style={styles.filterContainer}>
                        <FilterButton label="All" value="all" />
                        <FilterButton label="Income" value="in" />
                        <FilterButton label="Expense" value="out" />
                    </View>
                </View>

                {/* Transaction List */}
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionCard item={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.transactionList}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyEmoji}>🔍</Text>
                            <Text style={styles.emptyText}>No transactions found</Text>
                            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
                        </View>
                    )}
                />

                {/* Floating Action Button */}
                <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#FF6B35', '#FF8C42']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.fabGradient}
                    >
                        <Text style={styles.fabText}>+</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#999999',
        marginBottom: 2,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    profileButton: {
        padding: 4,
    },
    profileCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FF6B35',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD4B8',
    },
    profileText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Summary Card Styles
    summaryCard: {
        margin: 16,
        padding: 24,
        borderRadius: 20,
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    balanceLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        opacity: 0.9,
        marginBottom: 4,
        fontWeight: '500',
    },
    balanceAmount: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#FFFFFF',
        opacity: 0.2,
        marginBottom: 20,
    },
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statsIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    statsIconExpense: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    statsIcon: {
        fontSize: 16,
    },
    statsLabel: {
        color: '#FFFFFF',
        fontSize: 11,
        opacity: 0.8,
        marginBottom: 2,
    },
    statsValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 16,
    },

    // Filter Section Styles
    filterSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    filterCount: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#F5F5F5',
        marginRight: 8,
    },
    activeFilterButton: {
        backgroundColor: '#FF6B35',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
    },
    activeFilterButtonText: {
        color: '#FFFFFF',
    },

    // Transaction List Styles
    transactionList: {
        paddingBottom: 80,
        backgroundColor: '#F5F5F5',
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    transactionCardActive: {
        borderColor: '#FF6B35',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    incomeIcon: {
        backgroundColor: '#E8F5E9',
    },
    expenseIcon: {
        backgroundColor: '#FFF3F0',
    },
    iconText: {
        fontSize: 22,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    transactionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        flex: 1,
        marginRight: 8,
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    incomeText: {
        color: '#4CAF50',
    },
    expenseText: {
        color: '#FF6B35',
    },
    transactionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryBadge: {
        backgroundColor: '#FFF3F0',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 11,
        color: '#FF6B35',
        fontWeight: '500',
    },
    dateText: {
        fontSize: 11,
        color: '#999999',
    },

    // Empty State Styles
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 16,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '600',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999999',
    },

    // Floating Action Button Styles
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    fabGradient: {
        flex: 1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: {
        fontSize: 28,
        color: '#FFFFFF',
        fontWeight: '300',
    },
});