/* eslint-disable */

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
  IonItem,
  IonLabel,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";

import { closeOutline } from "ionicons/icons";

import useJournalNotesUpsert, {
  NEW_ITEM_ID
} from "../state/use-journal-notes/upsert";

const JournalEditView = ({ match }) => {
  const { values, hasChanges } = useJournalNotesUpsert(match.params.noteId);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{"Journal"}</IonTitle>
            <IonButtons slot="primary">
              <IonButton routerLink="/journal" routerDirection="back">
                {hasChanges ? <small>Saving...</small> : "Done"}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid>
            <IonRow>
              <IonCol sizeLg={8}>
                <IonItem lines="none">
                  <IonLabel position="floating">What's up?</IonLabel>
                  <IonTextarea
                    {...(values.text.options || {})}
                    rows={25}
                    value={values.text.value}
                    onIonChange={(e) => values.text.update(e.target.value)}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default JournalEditView;
