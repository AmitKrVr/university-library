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

const BookReturnConfirmation = ({ fullName, bookTitle }: { fullName: string, bookTitle: string }) => {
    return (
        <Html>
            <Head />
            <Preview>Thank You for Returning {bookTitle}!</Preview>
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
                        <Text style={heading}>Thank You for Returning <span style={highLight}>{bookTitle}</span>!</Text>
                        <Text style={text}>Hi {fullName},</Text>
                        <Text style={text}>
                            We’ve successfully received your return of <span style={highLight}>{bookTitle}</span>. Thank you for returning it on time.
                        </Text>
                        <Text style={text}>Looking for your next read? Browse our collection and borrow your next favorite book!</Text>
                        <Button style={button} href="https://bookwise-library-rho.vercel.app/search">
                            Explore New Books
                        </Button>
                        <Text style={text}>
                            Happy exploring,
                            <br />
                            The BookWise Team
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default BookReturnConfirmation;

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
