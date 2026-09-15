import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
} from "@react-email/components";
export default function WelcomeEmail() {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your first project starts here.</Preview>
      <Body
        style={{
          margin: 0,
          backgroundColor: "#edf2f7",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: 600,
            padding: "48px 32px",
            backgroundColor: "#ffffff",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>
            NORTHSTAR
          </Text>
          <Section style={{ padding: "32px 0" }}>
            <Heading
              style={{ fontSize: 30, lineHeight: "1.15", color: "#172321" }}
            >
              Your next idea starts here.
            </Heading>
            <Text style={{ fontSize: 17, lineHeight: "1.7", color: "#4e5a57" }}>
              Welcome to Northstar. You now have a home for your ideas, your
              team, and whatever comes next.
            </Text>
            <Button
              href="https://example.com/start"
              style={{
                backgroundColor: "#2856bd",
                color: "#ffffff",
                padding: "16px 24px",
                borderRadius: 6,
                fontSize: 15,
              }}
            >
              Create your first project
            </Button>
          </Section>
          <Hr style={{ borderColor: "#e4e8e6" }} />
          <Text style={{ fontSize: 13, lineHeight: "1.6", color: "#6a7471" }}>
            One small step is all it takes.
            <br />
            The Northstar team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
