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
    <div style={{ maxWidth: 650, marginBottom: 20, paddingTop: 20 }}>
      <IonLabel position="stacked">{question}</IonLabel>
      <IonTextarea
        autocapitalize={true}
        {...questionData}
        value={answer}
        onIonChange={(e) => updateAnswer(e.target.value, answerData)}
        autoGrow
        style={{
          background: "#f6f6f6",
          borderRadius: 4,
          padding: "0 10px"
        }}
      />
    </div>
  </IonItem>
);

export default TypeText;
