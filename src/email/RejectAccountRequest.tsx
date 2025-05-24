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

const RejectAccountRequest = ({ fullName }: { fullName: string }) => {
    return (
        <Html>
            <Head />
            <Preview>Your BookWise Account Could Not Be Approved</Preview>
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
                        <Text style={heading}>Account Approval Unsuccessful!</Text>
                        <Text style={text}>Hi <span style={highlight}>{fullName}</span>,</Text>
                        <Text style={text}>
                            Thank you for registering with BookWise. Unfortunately, your account could not be approved at this time due to eligibility criteria.
                        </Text>
                        <Text style={text}>If you believe this was a mistake or would like to request a review, feel free to contact our support team.</Text>
                        <Button style={button} href="mailto:contact@devamit.info">
                            Contact Support
                        </Button>
                        <Text style={text}>
                            We appreciate your interest,
                            <br />
                            The BookWise Team
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default RejectAccountRequest;

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

const highlight = {
    color: '#e7c9a5',
    fontWeight: 'bold'
}
