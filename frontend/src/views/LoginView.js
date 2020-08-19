import React, { useEffect } from "react";
import useAuth from "../hooks/use-auth";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton
} from "@ionic/react";

const HomeView = () => {
  const auth = useAuth();
  useEffect(() => auth.login(), [auth]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{"Login"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>...</IonContent>
    </IonPage>
  );
};

export default HomeView;
