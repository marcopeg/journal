import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton
} from "@ionic/react";

import { close, reloadOutline, arrowForwardOutline } from "ionicons/icons";
import useMindfulQuestions from "../state/use-mindful-questions";

const JournalMindfulQuestionView = () => {
  const {
    question,
    bucket,
    setBucket,
    shuffle,
    create
  } = useMindfulQuestions();

  const questionEl = question ? (
    <div>
      <h4 style={{ minHeight: 100, marginTop: 20 }}>{question.text}</h4>
      <IonButton onClick={create} expand={"full"}>
        <IonLabel>Answer</IonLabel>
        <IonIcon slot="end" icon={arrowForwardOutline} />
      </IonButton>
      <IonButton onClick={shuffle} fill={"clear"} expand={"full"}>
        <IonLabel>Try a different question</IonLabel>
        <IonIcon slot="start" icon={reloadOutline} />
      </IonButton>
    </div>
  ) : null;

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{"Mindful Question"}</IonTitle>
            <IonButtons slot="primary">
              <IonButton routerLink="/dashboard" routerDirection={"back"}>
                <IonIcon slot="icon-only" icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className={"ion-padding"}>
          <IonSegment
            onIonChange={(e) => setBucket(e.detail.value)}
            value={bucket}
          >
            <IonSegmentButton value="quick">
              <IonLabel>Mindful</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="life">
              <IonLabel>Reflectful</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          {questionEl}
        </IonContent>
      </IonPage>
    </>
  );
};

export default JournalMindfulQuestionView;
