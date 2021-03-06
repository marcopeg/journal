import React from "react";
import { Route, Redirect } from "react-router";
import { useLocation } from "react-router-dom";

import {
  IonSplitPane,
  IonList,
  IonItem,
  IonMenu,
  IonContent,
  IonRouterOutlet,
  IonMenuToggle,
  IonIcon,
  IonLabel,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle
} from "@ionic/react";

import useMenu from "../hooks/use-menu";
import useI18N from "../hooks/use-i18n";

// Views
import DailyView from "../views/DailyView";
import DailyEditView from "../views/DailyEditView";
import JournalView from "../views/JournalView";
import JournalEditView from "../views/JournalEditView";
import JournalMindfulQuestionView from "../views/JournalMindfulQuestionView";
import DashboardView from "../views/DashboardView";
import ProfileView from "../views/ProfileView";
import ProfileDeleteView from "../views/ProfileDeleteView";
import PageNotFoundView from "../views/PageNotFoundView";

// Modals
import CreateDailyModal from "../modals/CreateDailyModal";
import CreateJournalModal from "../modals/CreateJournalModal";

// Components
import GithubIssue from "../components/GithubIssue";

const DesktopLayout = () => {
  const location = useLocation();
  const i18n = useI18N();

  return (
    <>
      <IonSplitPane contentId="main" when="md">
        <IonMenu contentId="main" type="overlay">
          <IonHeader>
            <IonToolbar>
              <IonTitle>{i18n.get("menu")}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList id="inbox-list">
              {useMenu()
                .filter(($) => $.isSidebar)
                .map(($) => (
                  <IonMenuToggle key={$.path} autoHide={false}>
                    <IonItem
                      routerLink={$.path}
                      routerDirection="root"
                      lines="none"
                      detail={false}
                      color={$.isActive(location) ? "primary" : null}
                    >
                      <IonIcon slot="start" ios={$.icon} md={$.icon} />
                      <IonLabel>{$.label}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                ))}
            </IonList>
          </IonContent>
          <IonFooter>
            <GithubIssue />
          </IonFooter>
        </IonMenu>
        <IonRouterOutlet id="main">
          <Route exact path="/dashboard" component={DashboardView} />
          <Route exact path="/daily/:logDate" component={DailyEditView} />
          <Route exact path="/daily" component={DailyView} />
          <Route
            exact
            path="/journal/mindful"
            component={JournalMindfulQuestionView}
          />
          <Route exact path="/create-in-journal" component={JournalEditView} />
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
      </IonSplitPane>
      <CreateDailyModal />
      <CreateJournalModal />
    </>
  );
};

export default DesktopLayout;
