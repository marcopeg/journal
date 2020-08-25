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
  IonLabel,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";

import useJournalNotesUpsert from "../state/use-journal-notes/upsert";

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
                <IonLabel position="stacked">What's up?</IonLabel>
                <IonTextarea
                  {...(values.text.options || {})}
                  autoGrow
                  // rows={12}
                  value={values.text.value}
                  onIonChange={(e) => {
                    values.text.update(e.target.value);
                    // contentRef.current.scrollToBottom();
                  }}
                  // onIonFocus={() => {
                  //   setTimeout(() => contentRef.current.scrollToBottom(), 250);
                  // }}
                  style={{
                    background: "#f6f6f6",
                    borderRadius: 4,
                    padding: "0 10px"
                  }}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default JournalEditView;
