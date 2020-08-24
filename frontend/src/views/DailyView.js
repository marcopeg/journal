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
  IonList,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonLabel
} from "@ionic/react";

import { add, createOutline } from "ionicons/icons";
import useJournalHistory from "../state/use-daily-log/use-journal-history";
import useWelcomeQuestions from "../state/use-daily-log/use-welcome-questions";
import JournalEntry from "../components/JournalEntry";

// TODO: we can use the variable "today" in order to highlight the current log
const DailyView = () => {
  const history = useHistory();
  const { createWelcomeQuestions, showWelcome } = useWelcomeQuestions();
  const {
    /*today,*/
    showHints,
    entries,
    loadMore,
    reload
  } = useJournalHistory();

  const reloadList = (evt) => reload().finally(() => evt.detail.complete());

  const welcomeMessage = (
    <IonCard>
      <IonCardHeader>
        <IonCardSubtitle>Welcome to your Daily questions!</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <p>
          In this area you can{" "}
          <strong>focus on something important every day</strong>
          .<br />
          Don't think too much, just write and let words flow...
        </p>
        <p>
          You can customize the questions any time you like, but if you prefer,
          just click the button below to{" "}
          <strong>start with some basic mindful questions</strong>
          for your daily meditation.
        </p>
        <IonButton
          onClick={createWelcomeQuestions}
          className="ion-margin-vertical"
        >
          <IonLabel>Create some mindful questions!</IonLabel>
          <IonIcon icon={createOutline} slot="start" />
        </IonButton>
      </IonCardContent>
    </IonCard>
  );

  const hintsMessage = (
    <IonCard>
      <IonCardContent>
        <p>
          Click on a day for which you want to answer the dayly questions, you
          will receive a survey with the questions you set up.
        </p>
      </IonCardContent>
    </IonCard>
  );

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
        {showWelcome ? (
          welcomeMessage
        ) : (
          <>
            {showHints && hintsMessage}
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
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DailyView;
