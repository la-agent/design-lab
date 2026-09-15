export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: 780,
        background: "#f6f5f1",
        color: "#192b25",
        padding: "40px 7%",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
        }}
      >
        <span>NORTHSTAR</span>
        <a href="https://example.com">Get started</a>
      </nav>
      <section style={{ maxWidth: 780, padding: "120px 0" }}>
        <h1
          style={{
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: "-4px",
            margin: "0 0 28px",
          }}
        >
          Make room for
          <br />
          your next idea.
        </h1>
        <p style={{ fontSize: 22, lineHeight: 1.6, maxWidth: 480 }}>
          A clear space to bring your team together and turn the first spark
          into something real.
        </p>
        <a
          href="https://example.com/start"
          style={{
            display: "inline-block",
            padding: "18px 24px",
            borderRadius: 6,
            background: "#174c3e",
            color: "white",
            marginTop: 20,
          }}
        >
          Start a project
        </a>
      </section>
    </main>
  );
}
