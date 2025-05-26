import {
    Body,
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

const SignupOtpEmail = ({ fullName, otp }: { fullName: string, otp: string }) => {
    return (
        <Html>
            <Head />
            <Preview>Your BookWise signup OTP code</Preview>
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
                        <Text style={heading}>Verify Your Email Address</Text>
                        <Text style={text}>Hi {fullName},</Text>
                        <Text style={text}>
                            Thank you for signing up for BookWise! To complete your registration, please verify your email address by entering the OTP code below:
                        </Text>
                        <Text style={otpBox}>{otp}</Text>
                        <Text style={text}>This OTP is valid for 5 minutes. If you didn&apos;t request this, you can safely ignore this email.</Text>
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

export default SignupOtpEmail;

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
    color: "white",
};

const text = {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '16px',
    color: "white",
};

const hr = {
    borderColor: '#1e293b',
    margin: '20px 0',
};

const otpBox = {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    padding: '12px 20px',
    backgroundColor: '#1e293b',
    color: '#e7c9a5',
    borderRadius: '6px',
    marginBottom: '24px',
};
