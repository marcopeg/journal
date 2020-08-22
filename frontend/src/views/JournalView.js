import React from "react";
import ReactMarkdown from "react-markdown";
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
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItemSliding,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";

import { createOutline, add, trash } from "ionicons/icons";

import useJournalNotesEntries from "../state/use-journal-notes/entries";
import { showDate, showTime } from "../lib/date-time";

const JournalView = () => {
  const { entries, remove, reload, loadMore } = useJournalNotesEntries();

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
              <IonButton routerLink="/journal/$new/edit">
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={reload}>
            <IonRefresherContent />
          </IonRefresher>

          <IonList lines="full">
            {entries.map((note) => (
              <IonItemSliding key={note.id}>
                <IonItem
                  routerLink={`/journal/${note.id}/edit`}
                  routerDirection="forward"
                >
                  <IonGrid>
                    <IonRow>
                      <IonCol sizeLg={8}>
                        <IonLabel class="ion-text-wrap">
                          <p>
                            {showDate(note.created_at)} -{" "}
                            {showTime(note.created_at)}
                          </p>
                          <ReactMarkdown
                            className="markdown-text1"
                            source={note.text}
                          />
                        </IonLabel>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => remove(note.id)}>
                    <IonIcon icon={trash} size="large" />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
          <IonButton fill="clear" expand="block" onClick={loadMore}>
            <IonIcon icon={add} /> load more
          </IonButton>
        </IonContent>
      </IonPage>
    </>
  );
};

export default JournalView;
