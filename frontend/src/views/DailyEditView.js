import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonButton
} from "@ionic/react";

import useJournalEntry from "../state/use-daily-log/use-journal-entry";
import JournalQuestion from "../components/JournalQuestion";

const DailyView = ({ match }) => {
  const { questions, hasChanges } = useJournalEntry(match.params.logDate);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{`Daily - ${match.params.logDate}`}</IonTitle>
          <IonButtons slot="primary">
            <IonButton routerLink="/daily" routerDirection="back">
              {hasChanges ? "* Done" : "Done"}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {questions.map((question) => (
          <JournalQuestion {...question} key={question.id} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default DailyView;
