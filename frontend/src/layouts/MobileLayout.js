import React from "react";
import { Route, Redirect } from "react-router";
import { useLocation } from "react-router-dom";

import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
  IonLabel,
  IonIcon
} from "@ionic/react";

import useMenu from "../hooks/use-menu";
import DailyView from "../views/DailyView";
import DailyEditView from "../views/DailyEditView";
import JournalView from "../views/JournalView";
import JournalEditView from "../views/JournalEditView";
import JournalMindfulQuestionView from "../views/JournalMindfulQuestionView";
import DashboardView from "../views/DashboardView";
import ProfileView from "../views/ProfileView";
import ProfileDeleteView from "../views/ProfileDeleteView";
import PageNotFoundView from "../views/PageNotFoundView";

import CreateDailyModal from "../modals/CreateDailyModal";
import CreateJournalModal from "../modals/CreateJournalModal";

const MobileLayout = () => {
  const location = useLocation();

  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/dashboard" component={DashboardView} />
          <Route exact path="/daily/:logDate" component={DailyEditView} />
          <Route exact path="/daily" component={DailyView} />
          <Route
            exact
            path="/journal/mindful"
            component={JournalMindfulQuestionView}
          />
          <Route
            exact
            path="/journal/:noteId/edit"
            component={JournalEditView}
          />
          <Route exact path="/journal" component={JournalView} />
          <Route exact path="/me/delete" component={ProfileDeleteView} />
          <Route exact path="/me" component={ProfileView} />
          <Route exact path="/" render={() => <Redirect to="/daily" />} />
          <Route path="" component={PageNotFoundView} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom" style={{ marginBottom: 10 }}>
          {useMenu()
            .filter(($) => $.isTab)
            .map(($) => (
              <IonTabButton
                key={$.path}
                tab={$.path}
                href={$.path}
                layout="label-hide"
                selected={$.isActive(location)}
              >
                <IonIcon icon={$.icon} />
                <IonLabel>{$.label}</IonLabel>
              </IonTabButton>
            ))}
        </IonTabBar>
      </IonTabs>
      <CreateDailyModal />
      <CreateJournalModal />
    </>
  );
};

export default MobileLayout;
