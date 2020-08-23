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
    label: "Write",
    path: "/journal/$new/edit",
    icon: createOutline,
    isPublic: false,
    isTab: true,
    isSidebar: false,
    isDashboard: true
  },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: appsOutline,
    isPublic: false,
    isTab: true,
    isSidebar: true,
    isDashboard: false
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
