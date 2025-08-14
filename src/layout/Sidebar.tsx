import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import logo_dark from "../assets/img/logo.png";
import { Icon } from "@iconify/react";
import { IMAGES } from "@/contants/images";
import { AuthService } from "@/services";
import { showConfirmation } from "@/utils/sweetAlert";

interface SubmenuItem {
  id: string;
  title: string;
  link: string;
}

interface Page {
  id: string;
  title: string;
  link: string;
  icon: string;
  submenu?: SubmenuItem[];
}

const Sidebar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Trigger on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    document.body.classList.toggle("no-scroll", sidebarOpen);
  }, [sidebarOpen]);

  const handleNavLinkClick = () => {
    setSidebarOpen(false);
    setOpenSubmenu(null);
  };

  const handleSubmenuClick = (id: any) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  const isSubmenuItemActive = (submenu: SubmenuItem[]) => {
    return submenu.some((sub) => location.pathname.startsWith(sub.link));
  };

  const handleLogout = async () => {
    // Show confirmation dialog using SweetAlert2
    const result = await showConfirmation(
      "Logout",
      "Are you sure you want to logout?",
      "Yes, Logout",
      "Cancel"
    );

    if (result.isConfirmed) {
      // Close sidebar
      setSidebarOpen(false);
      setOpenSubmenu(null);

      // Call logout service
      AuthService.logout();
    }
  };


  const pages: Page[] = [
    {
      id: "Dashboard",
      title: "Dashboard",
      link: "/dashboard",
      icon: "mdi:view-grid-outline",
    },
    {
      id: "Users",
      title: "Users",
      link: "/users",
      icon: "lucide:users",
    },
    {
      id: "Dogs",
      title: "Dogs",
      link: "/dogs",
      icon: "lucide:dog",
    },

    {
      id: "Payments",
      title: "Payments",
      link: "/payments",
      icon: "fluent:payment-28-regular",
    },
    {
      id: "Subscription Packages",
      title: "Subscription Packages",
      link: "/subscription-packages",
      icon: "streamline:subscription-cashflow",
    },
    {
      id: "Contact",
      title: "Contact",
      link: "/contact",
      icon: "lucide:message-circle",
    },
    {
      id: "Report",
      title: "Reported Users",
      link: "/report",
      icon: "mdi:alert-circle-outline",
    },
    {
      id: "Pages",
      title: "Pages",
      icon: "bx:file",
      link: "/pages",
      submenu: [
        {
          id: "DogBreeds",
          title: "Dog Breeds",
          link: "/pages/dog-breeds",
        },
        {
          id: "DogCharacters",
          title: "Dog Characters",
          link: "/pages/dog-characters",
        },
        {
          id: "Hobbies",
          title: "Hobbies",
          link: "/pages/hobbies",
        },
        {
          id: "DogLikes",
          title: "Dog Likes",
          link: "/pages/dog-likes",
        },
        {
          id: "ContentManagementMain",
          title: "Content Management",
          link: "/pages/content-management",
        },
      ],
    },
    {
      id: "FAQ's",
      title: "FAQs",
      link: "/faqs",
      icon: "mdi:faq",
    },
    {
      id: "ProfileSettings",
      title: "Profile Settings",
      link: "/profile-settings",
      icon: "solar:settings-outline",
    },
    {
      id: "Logout",
      title: "Logout",
      link: "#",
      icon: "material-symbols:logout",
    },
  ];


  return (
    <>
      <button
        onClick={toggleSidebar}
        className="btnopen"
        style={{ display: "none" }}
      >
        <Icon icon="solar:hamburger-menu-broken" />
      </button>
      <div
        className={
          sidebarOpen ? "sidebar sidebar-open" : "sidebar sidebar-closed"
        }
        style={{
          backgroundImage: `url(${IMAGES.LogoBg})`,
        }}
      >
        <div className="sidebarlogo_div">
          <Link to="/dashboard">
            <img src={logo_dark} alt="Logo" />
          </Link>
        </div>
        <div className="sidebarouter">
          {pages.map((page) => (
            <div key={page.id} className="navitem-container">
              <NavLink
                to={page.link}
                className={`navitem ${openSubmenu === page.id ||
                  (page.submenu && isSubmenuItemActive(page.submenu))
                  ? "active"
                  : ""
                  }`}
                onClick={
                  page.submenu
                    ? (e) => {
                      e.preventDefault();
                      handleSubmenuClick(page.id);
                    }
                    : page.id === "Logout"
                      ? (e) => {
                        e.preventDefault();
                        handleLogout();
                      }
                      : handleNavLinkClick
                }
              >
                <div className="flex-grow-1">
                  <Icon icon={page.icon} />
                  {page.title}
                </div>
                {page.submenu && (
                  <Icon
                    icon={
                      openSubmenu === page.id
                        ? "mdi:chevron-up"
                        : "mdi:chevron-down"
                    }
                    className={`submenu-icon me-0 ${openSubmenu === page.id ? "open" : ""
                      }`}
                  />
                )}
              </NavLink>
              {page.submenu && openSubmenu === page.id && (
                <div className="submenu">
                  {page.submenu.map((sub) => (
                    <NavLink
                      key={sub.id}
                      to={sub.link}
                      className={`submenu-item ${location.pathname.startsWith(sub.link) ? "active" : ""
                        }`}
                      onClick={handleNavLinkClick}
                    >
                      {sub.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
