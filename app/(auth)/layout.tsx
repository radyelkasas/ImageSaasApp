import Image from "next/image";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo">
          <Image
            src="/assets/images/logo-text.svg"
            alt="Logo"
            width={180}
            height={28}
          />
        </div>
        <div className="auth-card">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
