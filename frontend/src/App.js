import React from "react";

import useIsMobile from "./hooks/use-is-mobile";
import PublicLayout from "./layouts/PublicLayout";
import DesktopLayout from "./layouts/DesktopLayout";
import MobileLayout from "./layouts/MobileLayout";

import useAuth from "./hooks/use-auth";

const App = () => {
  const isMobile = useIsMobile();
  const auth = useAuth();

  if (!auth.hasChecked) {
    return <div>loading...</div>;
  }

  return auth.user ? (
    isMobile ? (
      <MobileLayout />
    ) : (
      <DesktopLayout />
    )
  ) : (
    <PublicLayout />
  );
};

export default App;
