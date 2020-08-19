import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonRouterLink
} from "@ionic/react";

import useI18N from "../hooks/use-i18n";

import { useSubscription, gql } from "../hooks/use-apollo";

const APP_SETTINGS = gql`
  subscription GetAppSettings {
    app_settings {
      key
      value
    }
  }
`;

const HomeView = () => {
  const i18n = useI18N();
  const { data, error } = useSubscription(APP_SETTINGS);
  console.log(error);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{i18n.get("title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <p>
                Hello User,
                <br />
                This is a <em>work in progress</em> app.
              </p>
              <p>Use it at your own risk!</p>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonRouterLink href="/login" routerLink="/login">
                {i18n.get("login")}
              </IonRouterLink>
            </IonCol>
          </IonRow>
        </IonGrid>
        <hr />
        {data &&
          data.app_settings.map(($) => (
            <div key={$.key}>
              {$.key}::{$.value}
            </div>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default HomeView;
