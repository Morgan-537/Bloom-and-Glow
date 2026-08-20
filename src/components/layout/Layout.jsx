import NavBar from "./NavBar";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
