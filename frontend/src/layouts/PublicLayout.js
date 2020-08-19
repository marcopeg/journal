import React from "react";
import { Route, Switch } from "react-router";
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
  IonToolbar,
  IonTitle
} from "@ionic/react";

import useMenu from "../hooks/use-menu";
import useI18N from "../hooks/use-i18n";

// Views
import HomeView from "../views/HomeView";
import LoginView from "../views/LoginView";
import PageNotFoundView from "../views/PageNotFoundView";

const DesktopLayout = () => {
  const location = useLocation();
  const i18n = useI18N();

  return (
    <>
      <IonSplitPane contentId="main" when="(min-width: 9999px)">
        <IonMenu contentId="main" type="overlay" side="end">
          <IonHeader>
            <IonToolbar>
              <IonTitle>{i18n.get("menu")}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList id="inbox-list">
              {useMenu()
                .filter(($) => $.isPublic)
                .map(($) => (
                  <IonMenuToggle key={$.path} autoHide={false}>
                    <IonItem
                      routerLink={$.path}
                      routerDirection="none"
                      lines="none"
                      detail={false}
                      color={location.pathname === $.path ? "primary" : null}
                    >
                      <IonIcon slot="start" ios={$.icon} md={$.icon} />
                      <IonLabel>{$.label}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                ))}
            </IonList>
          </IonContent>
        </IonMenu>
        <IonRouterOutlet id="main">
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/login" component={LoginView} />
            <Route path="" component={PageNotFoundView} />
          </Switch>
        </IonRouterOutlet>
      </IonSplitPane>
    </>
  );
};

export default DesktopLayout;
