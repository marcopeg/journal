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

const CreateDailyModal = () => {
  const [isOpen, setOpen] = useModal("createDaily");
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
            <IonTitle>{"Create Daily"}</IonTitle>
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
              Here we should place the form to create the daily
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </IonModal>
  );
};

export default CreateDailyModal;
