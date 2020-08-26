import React from "react";
import ReactDOM from "react-dom";

import { IonApp } from "@ionic/react";
import { IonReactHashRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import App from "./App";
import { AuthProvider } from "./hooks/use-auth";
import { I18NProvider } from "./hooks/use-i18n";
import { ApolloProvider } from "./hooks/use-apollo";

const rootElement = document.getElementById("root");

const start = () =>
  ReactDOM.render(
    <IonApp>
      <IonReactHashRouter>
        <I18NProvider>
          <AuthProvider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
            audience={process.env.REACT_APP_AUTH0_AUDIENCE}
            redirect_uri={window.location.origin}
          >
            <ApolloProvider>
              <App />
            </ApolloProvider>
          </AuthProvider>
        </I18NProvider>
      </IonReactHashRouter>
    </IonApp>,
    rootElement
  );

function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

// Mostly due to the autoGrow in textareas
docReady(() => setTimeout(start, 50));
