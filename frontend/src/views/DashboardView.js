import React from "react";
import {
  IonPage,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
  IonMenuButton
} from "@ionic/react";

// Hooks
import useMenu from "../hooks/use-menu";
import useIsMobile from "../hooks/use-is-mobile";

// Components
import GithubIssue from "../components/GithubIssue";

const DashboardView = () => {
  const menu = useMenu();
  const showFooter = useIsMobile();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{"Dashboard"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {menu
            .filter(($) => $.isDashboard)
            .map(($) => (
              <IonItem
                button
                routerLink={$.path}
                routerDirection="root"
                lines="none"
                key={$.path}
              >
                <IonIcon slot="start" icon={$.icon} />
                <IonLabel>{$.label}</IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
      {showFooter && (
        <IonFooter>
          <GithubIssue />
        </IonFooter>
      )}
    </IonPage>
  );
};

export default DashboardView;
