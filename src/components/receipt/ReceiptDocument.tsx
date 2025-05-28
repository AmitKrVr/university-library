"use client"

import { formatDate, truncateText } from '@/lib/utils';
import { Document, Page, Text, View, StyleSheet, Image as ReactImage } from '@react-pdf/renderer'

interface Props {
    borrow: {
        id: string;
        userId: string;
        bookId: string;
        borrowDate: Date;
        dueDate: string;
        returnDate: string | null;
        status: "BORROWED" | "RETURNED" | "LATERETURN";
        createdAt: Date | null;
    };
    book: {
        id: string;
        title: string;
        author: string;
        genre: string;
        coverColor: string;
        coverUrl?: string;
    };
}

const ReceiptDocument = ({ borrow, book }: Props) => {
    const borrowDate = new Date(borrow.borrowDate);
    const dueDate = new Date(borrow.dueDate);
    const returnDate = borrow.returnDate ? new Date(borrow.returnDate) : null;

    const duration = Math.ceil((dueDate.getTime() - borrowDate.getTime()) / (1000 * 3600 * 24));

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <ReactImage
                            style={styles.logo}
                            src="/logo.png"
                        />
                        <Text style={styles.companyName}>BookWise</Text>
                    </View>

                    <View>
                        <Text style={styles.receiptTitle}>Borrow Receipt</Text>
                        <View style={styles.metaContainer}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Receipt ID: </Text>
                                <Text style={styles.metaValue}>{borrow.id.slice(-6).toUpperCase()}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Date Issued: </Text>
                                <Text style={styles.metaValue}>{formatDate(borrowDate, 'numeric')}</Text>
                            </View>
                        </View>
                    </View>

                    <Hr />

                    <View>
                        <Text style={styles.sectionTitle}>Book Details:</Text>
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Title</Text>
                                <Text style={styles.detailValue}>{truncateText(book.title, 25)}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Author</Text>
                                <Text style={styles.detailValue}>{truncateText(book.author, 25)}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Genre</Text>
                                <Text style={styles.detailValue}>{truncateText(book.genre, 25)}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Borrowed on</Text>
                                <Text style={styles.detailValue}>{formatDate(borrowDate)}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Due Date</Text>
                                <Text style={styles.detailValue}>{formatDate(dueDate)}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Duration</Text>
                                <Text style={styles.detailValue}>{duration} Days</Text>
                            </View>
                        </View>
                    </View>

                    <Hr />

                    <View>
                        <Text style={styles.sectionTitle}>Terms</Text>
                        <View style={styles.termsList}>
                            <Text style={styles.termText}>•  Please return the book by the due date.</Text>
                            <Text style={styles.termText}>•  Lost or damaged books may incur replacement costs.</Text>

                            {returnDate && (
                                <Text style={styles.termText}>•  Book returned on {formatDate(returnDate)}</Text>
                            )}
                        </View>
                    </View>

                    <Hr />

                    <View style={styles.footer}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4, lineHeight: 1.2 }}>
                            <Text style={styles.footerText}>Thank you for using </Text>
                            <Text style={styles.footerValue}>BookWise!</Text>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4, lineHeight: 1.2 }}>
                            <Text style={styles.footerText}>Website: </Text>
                            <Text style={styles.footerValue}>bookwise-library-rho.vercel.app/</Text>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4, lineHeight: 1.2 }}>
                            <Text style={styles.footerText}>Email: </Text>
                            <Text style={styles.footerValue}>contact@devamit.info</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ReceiptDocument;

const Hr = () => {
    return (
        <View style={{
            borderBottomWidth: 0.5,
            borderBottomColor: '#D6E0FF',
            opacity: 0.5,
        }} />
    )
}

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#111624',
        fontFamily: 'Helvetica',
        color: '#f9fafb',
        height: 842,
        width: 595,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#232839',
        borderRadius: 16,
        padding: 40,
        height: 785,
        width: 544,
        gap: 24,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 15,
    },
    logo: {
        width: 32,
        height: 32,
    },
    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f9fafb'
    },
    receiptTitle: {
        fontSize: 24,
        fontWeight: "semibold",
        color: '#FFFFFF',
        marginBottom: 14,
    },
    metaContainer: {

    },
    metaItem: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        lineHeight: 1.2
    },
    metaLabel: {
        fontSize: 16,
        fontWeight: 500,
        color: '#E2E8F0'
    },
    metaValue: {
        fontSize: 16,
        fontWeight: 600,
        color: "#EED1AC"
    },
    sectionTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: "bold",
        marginBottom: 14,
    },

    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between",
        gap: 12,
    },
    detailItem: {
        padding: 10,
        width: '48%',
        border: "1px solid #D6E0FF",
        borderRadius: 6,
    },
    detailLabel: {
        fontSize: 12,
        marginBottom: 3,
        color: '#E2E8F0',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "bold",
        color: '#FFFFFF',
    },

    termsList: {
        paddingLeft: 10,
    },
    termText: {
        fontSize: 16,
        fontWeight: "normal",
        color: "#E2E8F0",
        lineHeight: 1.3
    },
    footer: {

    },
    footerText: {
        fontSize: 14,
        color: "#E2E8F0"
    },
    footerValue: {
        fontSize: 16,
        color: "#E2E8F0",
        fontWeight: "bold"
    },
});
