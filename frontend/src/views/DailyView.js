import React from "react";
import { useHistory } from "react-router-dom";
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
  IonList
} from "@ionic/react";

import { add } from "ionicons/icons";
import useJournalHistory from "../state/use-daily-log/use-journal-history";
import JournalEntry from "../components/JournalEntry";

// TODO: we can use the variable "today" in order to highlight the current log
const DailyView = () => {
  const history = useHistory();
  const { /*today,*/ entries, loadMore, reload } = useJournalHistory();

  const reloadList = (evt) => reload().finally(() => evt.detail.complete());

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{"Daily Journal"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={reloadList}>
          <IonRefresherContent
            pullingIcon="arrow-dropdown"
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing..."
          ></IonRefresherContent>
        </IonRefresher>
        <IonList lines={"full"}>
          {entries.map((entry) => (
            <JournalEntry
              {...entry}
              key={entry.logDate}
              onDisclose={() => {
                history.push(`/daily/${entry.logDate}`);
              }}
            />
          ))}
        </IonList>
        <IonButton
          onClick={loadMore}
          expand={"full"}
          fill={"clear"}
          size={"small"}
        >
          <IonIcon icon={add} /> load more
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DailyView;
