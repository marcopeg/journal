import React from "react";
import { IonItem, IonLabel, IonTextarea } from "@ionic/react";

const TypeText = ({
  question,
  questionData,
  answer,
  answerData,
  updateAnswer
}) => (
  <IonItem>
    <div style={{ maxWidth: 650 }}>
      <IonLabel position="floating">{question}</IonLabel>
      <IonTextarea
        autocapitalize={true}
        {...questionData}
        value={answer}
        onIonChange={(e) => updateAnswer(e.target.value, answerData)}
      />
    </div>
  </IonItem>
);

export default TypeText;
