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
  IonMenuButton,
  IonItemDivider
} from "@ionic/react";

import { refreshCircleOutline } from "ionicons/icons";

import * as serviceWorker from "../serviceWorker";

// Hooks
import useMenu from "../hooks/use-menu";
import useIsMobile from "../hooks/use-is-mobile";

// Components
import GithubIssue from "../components/GithubIssue";

const DashboardView = () => {
  const menu = useMenu();
  const showFooter = useIsMobile();

  const forceReload = () => {
    serviceWorker.unregister();
    window.location.reload(true);
  };

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
                routerDirection={"forward"}
                lines="none"
                key={$.path}
              >
                <IonIcon slot="start" icon={$.icon} />
                <IonLabel>{$.label}</IonLabel>
              </IonItem>
            ))}

          <IonItemDivider />

          <IonItem button onClick={forceReload} lines="none" key={"reload"}>
            <IonIcon slot="start" icon={refreshCircleOutline} />
            <IonLabel>
              Update client
              <br />
              <small style={{ fontSize: 8 }}>
                currently at <b>v1.0</b>
              </small>
            </IonLabel>
          </IonItem>
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
