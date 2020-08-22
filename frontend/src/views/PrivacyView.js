/* eslint-disable */

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
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
  IonCol
} from "@ionic/react";

import useI18N from "../hooks/use-i18n";

const PrivacyView = () => {
  const i18n = useI18N();
  const [content, setContent] = useState("loading...");

  // Load translated text for privacy policy
  useEffect(() => {
    fetch(i18n.get("PrivacyContent"))
      .then((r) => r.text())
      .then(setContent);
  }, [setContent, i18n]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{i18n.get("PrivacyTitle")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeLg={8}>
              <ReactMarkdown className="markdown-text1" source={content} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyView;
