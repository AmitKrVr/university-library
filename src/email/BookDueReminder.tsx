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

const BookDueReminder = ({ fullName, bookTitle, dueDate }: { fullName: string, bookTitle: string, dueDate: string }) => {
    return (
        <Html>
            <Head />
            <Preview>Reminder: {bookTitle} is Due Soon!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section>
                        <Text style={logo}>
                            <Img
                                src="https://bookwise-library-rho.vercel.app/logo.png"
                                height={30}
                                width={30}
                                alt='logo'
                            /> BookWise</Text>
                        <Hr style={hr} />
                        <Text style={heading}>Reminder: <span style={highLight}>{bookTitle}</span> is Due Soon!</Text>
                        <Text style={text}>Hi {fullName},</Text>
                        <Text style={text}>
                            Just a reminder that <span style={highLight}>{bookTitle}</span> is due for return on <span style={highLight}>{dueDate}</span>. Kindly return it on time to avoid late fees.
                        </Text>
                        <Text style={text}>If you’re still reading, you can renew the book in your account.</Text>
                        <Button style={button} href="https://bookwise-library-rho.vercel.app/">
                            Renew Book Now
                        </Button>
                        <Text style={text}>
                            Keep reading,
                            <br />
                            The BookWise Team
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default BookDueReminder;

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