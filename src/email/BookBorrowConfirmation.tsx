import { getMonthAndDayAndYear } from '@/lib/utils';
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

const BookBorrowConfirmation = (
    { fullName, bookTitle, borrowDate, dueDate }: { fullName: string, bookTitle: string, borrowDate: Date, dueDate: string }
) => {
    return (
        <Html>
            <Head />
            <Preview>You’ve Borrowed a Book!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section>
                        <Text style={logo}>
                            <Img
                                src="https://bookwise-library-rho.vercel.app/logo.png"
                                height={30}
                                width={30}
                                alt='logo'
                                style={{ marginRight: 8 }}
                            /> BookWise</Text>
                        <Hr style={hr} />
                        <Text style={heading}>You’ve Borrowed a Book!</Text>
                        <Text style={text}>Hi <span style={highLight}>{fullName}</span>,</Text>
                        <Section>
                            <Text style={text}>
                                You’ve successfully borrowed <span style={highLight}>{bookTitle}</span>. Here are the details:
                            </Text>
                            <Text>• Borrowed On: <span style={highLight}>{getMonthAndDayAndYear(borrowDate)}</span></Text>
                            <Text>• Due Date: <span style={highLight}>{dueDate}</span></Text>
                        </Section>
                        <Text style={text}>Enjoy your reading, and don’t forget to return the book on time!</Text>
                        <Button style={button} href="https://bookwise-library-rho.vercel.app/my-profile">
                            View Borrowed Books
                        </Button>
                        <Text style={text}>
                            Happy reading,
                            <br />
                            The BookWise Team
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default BookBorrowConfirmation;

const main = {
    backgroundColor: '#0f172a',
    padding: '20px 20px',
    borderRadius: '8px',
    width: '480px',
    margin: '0 auto',
};

const container = {
    color: 'white',
    fontFamily: 'Helvetica, Arial, sans-serif',
};

const logo = {
    display: "flex",
    gap: 8,
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '20px',
};

const heading = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
};

const text = {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '16px',
};

const button = {
    backgroundColor: '#e7c9a5',
    color: '#000',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '12px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    display: 'inline-block',
    margin: '16px 0',
};

const hr = {
    borderColor: '#1e293b',
    margin: '20px 0',
};

const highLight = {
    color: '#e7c9a5',
    fontWeight: 'bold'
}
