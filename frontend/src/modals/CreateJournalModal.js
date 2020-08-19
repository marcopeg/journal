import React from "react";
import useModal from "../hooks/use-modal";
import {
  IonModal,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButtons,
  IonButton,
  IonIcon
} from "@ionic/react";

import { closeOutline, checkmarkOutline } from "ionicons/icons";

const CreateJournalModal = () => {
  const [isOpen, setOpen] = useModal("createJournal");
  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => setOpen(false, true)}>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="secondary">
              <IonButton onClick={() => setOpen(false, true)}>
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>{"Create Journal Entry"}</IonTitle>
            <IonButtons slot="primary">
              <IonButton onClick={() => setOpen(false, true)}>
                <IonIcon slot="icon-only" icon={checkmarkOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardContent>
              Here we should place the form to create a Journal entry
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </IonModal>
  );
};

export default CreateJournalModal;
