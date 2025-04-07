import MobaileNav from "@/components/shared/MobaileNav";
import Sidebar from "@/components/shared/Sidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="root">
      {/* Desktop Sidebar - only visible on lg screens and above */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Navigation - only visible on screens smaller than lg */}
      <div className="lg:hidden">
        <MobaileNav />
      </div>

      {/* Main Content Area */}
      <div className="root-container lg:pl-[240px] lg:pr-[80px] xl:pl-[300px] xl:pr-[100px] 2xl:pl-[350px] 2xl:pr-[120px]">
        <div className="wrapper">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
