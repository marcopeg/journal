import {
  homeOutline,
  bookOutline,
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
    isDashboard: false
  },
  {
    label: "Privacy Policy",
    path: "/privacy",
    icon: fingerPrintOutline,
    isPublic: true,
    isTab: false,
    isSidebar: false,
    isDashboard: false
  },
  {
    label: "Login",
    path: "/login",
    icon: logInOutline,
    isPublic: true,
    isTab: false,
    isSidebar: false,
    isDashboard: false
  },

  // Private Items
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: homeOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: false
  },
  {
    label: "Daily",
    path: "/daily",
    icon: fileTrayFullOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: true
  },
  {
    label: "Journal",
    path: "/journal",
    icon: bookOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: true
  },
  {
    label: "Profile",
    path: "/me",
    icon: personCircleOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: true
  }
];

export default useMenu;
