import React from "react";

import { IonItem, IonLabel, IonGrid, IonRow, IonCol } from "@ionic/react";

import IonAvatarDate from "../IonAvatarDate";

import TypeText from "./TypeText";

const types = {
  text: TypeText
};

const JournalEntryItem = ({ children }) => (
  <IonGrid>
    <IonRow>
      <IonCol sizeLg={8}>{children}</IonCol>
    </IonRow>
  </IonGrid>
);

const JournalEntry = ({ logDate, onDisclose, entries }) => (
  <IonItem onClick={onDisclose}>
    <IonAvatarDate date={logDate} />
    <IonLabel class="ion-text-wrap">
      {entries.map((entry, index) => {
        const el = React.createElement(types[entry.type], {
          ...entry,
          entries,
          entryIndex: index
        });

        return (
          <JournalEntryItem
            key={`${logDate}--${entry.questionId}`}
            children={el}
          />
        );
      })}
    </IonLabel>
  </IonItem>
);

export default JournalEntry;
