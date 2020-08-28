import {
  appsOutline,
  homeOutline,
  bookOutline,
  createOutline,
  fileTrayFullOutline,
  personCircleOutline,
  logInOutline,
  fingerPrintOutline
} from "ionicons/icons";

const useMenu = () => [
  // Public Items
  {
    label: "Home",
    path: "/",
    icon: homeOutline,
    isPublic: true,
    isTab: false,
    isSidebar: false,
    isDashboard: false,
    isActive: (location) => location.pathname === "/"
  },
  {
    label: "Privacy Policy",
    path: "/privacy",
    icon: fingerPrintOutline,
    isPublic: true,
    isTab: false,
    isSidebar: false,
    isDashboard: false,
    isActive: (location) => location.pathname === "/privacy"
  },
  {
    label: "Login",
    path: "/login",
    icon: logInOutline,
    isPublic: true,
    isTab: false,
    isSidebar: false,
    isDashboard: false,
    isActive: (location) => location.pathname === "/login"
  },

  // Private Items
  {
    label: "Daily",
    path: "/daily",
    icon: fileTrayFullOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: true,
    isActive: (location) => location.pathname.includes("/daily")
  },
  {
    label: "Journal",
    path: "/journal",
    icon: bookOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: true,
    isActive: (location) =>
      location.pathname === "/journal" ||
      (location.pathname.includes("/journal") &&
        location.pathname.includes("/edit") &&
        !location.pathname.includes("/$new"))
  },
  {
    label: "Write in your Journal",
    path: "/journal/$new/edit",
    icon: createOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: true,
    isActive: (location) => location.pathname.includes("/journal/$new")
  },
  {
    label: "Answer to a Mindful Question",
    path: "/journal/mindful",
    icon: createOutline,
    isPublic: false,
    isTab: false,
    isSidebar: true,
    isDashboard: true,
    isActive: (location) => location.pathname.includes("/journal/mindful")
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: appsOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: false,
    isActive: (location) => location.pathname.includes("/dashboard")
  },
  {
    label: "Profile",
    path: "/me",
    icon: personCircleOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: true,
    isActive: (location) => location.pathname.includes("/me")
  }
];

export default useMenu;
