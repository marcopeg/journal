import React from "react";
import {
  IonPage,
  IonHeader,
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

import useMenu from "../hooks/use-menu";

const DashboardView = () => (
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
        {useMenu()
          .filter(($) => $.isDashboard)
          .map(($) => (
            <IonItem
              button
              routerLink={$.path}
              routerDirection="root"
              lines="none"
              key={$.path}
            >
              <IonLabel>{$.label}</IonLabel>
              <IonIcon icon={$.icon} />
            </IonItem>
          ))}
      </IonList>
    </IonContent>
  </IonPage>
);

export default DashboardView;
