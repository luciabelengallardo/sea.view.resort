import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/ui/Button";
import Navigation from "../components/layout/Navigation.jsx";
import MobileMenu from "../components/layout/MobileMenu.jsx";
import Footer from "../components/layout/Footer.jsx";
import UserMenu from "../components/layout/UserMenu.jsx";

export default function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const headerRef = useRef(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const updateHeaderHeightVar = () => {
      const height = headerRef.current
        ? Math.ceil(headerRef.current.getBoundingClientRect().height)
        : 0;
      document.documentElement.style.setProperty(
        "--app-header-height",
        `${height}px`
      );
    };

    updateHeaderHeightVar();

    let resizeObserver;
    if (headerRef.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(updateHeaderHeightVar);
      resizeObserver.observe(headerRef.current);
    } else {
      window.addEventListener("resize", updateHeaderHeightVar);
    }

    return () => {
      if (resizeObserver && headerRef.current) resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderHeightVar);
    };
  }, []);
  return (
    <div className="min-h-screen bg-resort-cream flex flex-col overflow-x-hidden">
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-30 flex flex-wrap justify-between items-center px-6 lg:px-8 py-4 lg:py-5 bg-white shadow-sm"
      >
        <div className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-baseline leading-none select-none"
            aria-label="Sea View Resort"
          >
            <span className="font-display text-resort-olive text-2xl md:text-3xl tracking-wide">
              Sea View
            </span>
            <span className="font-display text-resort-olive/90 text-sm md:text-base tracking-[0.35em] ml-3 uppercase mr-6">
              Resort
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          <Navigation />
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden lg:block ">
            <Link to="/rooms">
              <Button className="px-6 text-base">Reservar</Button>
            </Link>
          </div>
          <div className="hidden lg:block">
            <UserMenu />
          </div>

          <button
            className="lg:hidden inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-resort-olive"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        user={user}
        logout={logout}
      />

      <main className="flex-1" style={{ paddingTop: "var(--app-header-height, 64px)" }}>
        <Outlet />
      </main>

      {location.pathname !== "/404" && !isAdminRoute && <Footer />}
    </div>
  );
}
