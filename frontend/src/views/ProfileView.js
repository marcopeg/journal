import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon
} from "@ionic/react";

import { logOutOutline } from "ionicons/icons";
import useAuth from "../hooks/use-auth";

const ProfileView = () => {
  const auth = useAuth();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{auth.user.name}</IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={auth.logout}>
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Hello User!</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            Here we can add single events entries. <br />
            Just text, and maybe some media in the future.
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ProfileView;
