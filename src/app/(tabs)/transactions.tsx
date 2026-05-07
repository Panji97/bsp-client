import { View, Text, Dimensions, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

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
        <TouchableOpacity style={styles.transactionCard}>
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
                    <Text style={styles.categoryText}>{item.category}</Text>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const FilterButton = ({ label, value }: { label: string; value: 'all' | 'in' | 'out' }) => (
        <TouchableOpacity
            onPress={() => setActiveFilter(value)}
            style={[styles.filterButton, activeFilter === value && styles.activeFilterButton]}
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
            <View style={styles.summaryCard}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>
                    Rp{new Intl.NumberFormat('id-ID').format(balance)}
                </Text>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryStats}>
                    <View>
                        <Text style={styles.statsLabel}>Income</Text>
                        <Text style={styles.statsValue}>
                            +Rp{new Intl.NumberFormat('id-ID').format(totalIncome)}
                        </Text>
                    </View>

                    <View style={styles.verticalDivider} />

                    <View>
                        <Text style={styles.statsLabel}>Expense</Text>
                        <Text style={styles.statsValue}>
                            -Rp{new Intl.NumberFormat('id-ID').format(totalExpense)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Transactions</Text>
                </View>

                {/* Summary Card */}
                <SummaryCard />

                {/* Filter Section */}
                <View style={styles.filterSection}>
                    <Text style={styles.filterLabel}>Filter by</Text>
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
                            <Text style={styles.emptyText}>No transactions found</Text>
                        </View>
                    )}
                />

                {/* Floating Action Button */}
                <TouchableOpacity style={styles.fab}>
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// ============ NATIVE CSS (STYLESHEET) ============

const styles = StyleSheet.create({
    // Main Container
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        flex: 1,
    },

    // Header Styles
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },

    // Summary Card Styles
    summaryCard: {
        backgroundColor: '#0057FF',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    balanceLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 8,
    },
    balanceAmount: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#FFFFFF',
        opacity: 0.3,
        marginBottom: 16,
    },
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statsLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.8,
        marginBottom: 4,
    },
    statsValue: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#FFFFFF',
        opacity: 0.3,
    },

    // Filter Section Styles
    filterSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
        marginBottom: 12,
    },
    filterContainer: {
        flexDirection: 'row',
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        marginRight: 10,
    },
    activeFilterButton: {
        backgroundColor: '#0057FF',
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
        backgroundColor: '#FFFFFF',
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    incomeIcon: {
        backgroundColor: '#E8F5E9',
    },
    expenseIcon: {
        backgroundColor: '#FFEBEE',
    },
    iconText: {
        fontSize: 24,
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
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    incomeText: {
        color: '#4CAF50',
    },
    expenseText: {
        color: '#F44336',
    },
    transactionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 12,
        color: '#8E8E93',
    },
    dateText: {
        fontSize: 12,
        color: '#8E8E93',
    },

    // Empty State Styles
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999999',
    },

    // Floating Action Button Styles
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0057FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    fabText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});