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

export const WelcomeEmail = ({ fullName }: { fullName: string }) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to BookWise, your reading companion!</Preview>
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
                        <Text style={heading}>Welcome to BookWise, Your Reading Companion!</Text>
                        <Text style={text}>Hi {fullName},</Text>
                        <Text style={text}>
                            Welcome to BookWise! We&apos;re excited to have you join our community of book enthusiasts.
                            Explore a wide range of books, borrow with ease, and manage your reading journey seamlessly.
                        </Text>
                        <Text style={text}>Get started by logging in to your account:</Text>
                        <Button style={button} href="https://bookwise-library-rho.vercel.app/">
                            Login to BookWise
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

export default WelcomeEmail;

const main = {
    backgroundColor: '#0f172a',
    padding: '20px 0',
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
