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

export const MilestoneEmail = ({ fullName }: { fullName: string }) => {
    return (
        <Html>
            <Head />
            <Preview>You&apos;ve hit a new milestone with BookWise! 🎉</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section>
                        <Text style={logo}>
                            <Img
                                src="/icons/logo.svg"
                                height={30}
                                width={30}
                                alt='logo'
                            /> BookWise</Text>
                        <Hr style={hr} />
                        <Text style={heading}>Congratulations on Reaching a New Milestone!</Text>
                        <Text style={text}>Hi {fullName},</Text>
                        <Text style={text}>
                            Great news! You’ve reached a new milestone in your reading journey with BookWise. 🎉
                            Whether it’s finishing a challenging book, staying consistent with your reading goals,
                            or exploring new genres, your dedication inspires us.
                        </Text>
                        <Text style={text}>
                            Keep the momentum going—there are more exciting books and features waiting for you!
                        </Text>
                        <Text style={text}>Log in now to discover your next adventure:</Text>
                        <Button style={button} href="https://bookwise-library-rho.vercel.app/">
                            Discover New Reads
                        </Button>
                        <Text style={text}>
                            Keep the pages turning,
                            <br />
                            The BookWise Team
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default MilestoneEmail;

const main = {
    backgroundColor: '#0f172a',
    padding: '40px 0',
};

const container = {
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    width: '480px',
    margin: '0 auto',
    padding: '32px',
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
