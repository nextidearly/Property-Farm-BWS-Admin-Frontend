import React, { useEffect, useRef, useState } from "react";
import Header from "./components/header/header.jsx";
import TopNav from "./components/top-nav/top-nav.jsx";
import Sidebar from "./components/sidebar/sidebar.jsx";
import Content from "./components/content/content.jsx";
import Footer from "./components/footer/footer.jsx";
import ThemePanel from "./components/theme-panel/theme-panel.jsx";
import { AppSettings } from "./config/app-settings.js";
import { makeStore } from "./store/store.js";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import WalletContext from "./context/walletContext";

function App() {
  const storeRef = useRef();
  let persistor;
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    persistor = persistStore(storeRef.current);
  }

  var defaultOptions = {
    appMode: "dark",
    appTheme: "theme-teal",
    appCover: "",
    appHeaderNone: false,
    appSidebarNone: false,
    appSidebarCollapsed: true,
    appContentNone: false,
    appContentClass: "",
    appContentFullHeight: false,
    appBoxedLayout: false,
    appFooter: false,
    appTopNav: false,
  };
  const [appHeaderNone, setAppHeaderNone] = useState(
    defaultOptions.appHeaderNone
  );
  const [appSidebarNone, setAppSidebarNone] = useState(
    defaultOptions.appSidebarNone
  );
  const [appSidebarCollapsed, setAppSidebarCollapsed] = useState(
    defaultOptions.appSidebarCollapsed
  );
  const [appContentNone, setAppContentNone] = useState(
    defaultOptions.appContentNone
  );
  const [appContentClass, setAppContentClass] = useState(
    defaultOptions.appContentClass
  );
  const [appContentFullHeight, setAppContentFullHeight] = useState(
    defaultOptions.appContentFullHeight
  );
  const [appBoxedLayout, setAppBoxedLayout] = useState(
    defaultOptions.appBoxedLayout
  );
  const [appFooter, setAppFooter] = useState(defaultOptions.appFooter);
  const [appTopNav, setAppTopNav] = useState(defaultOptions.appTopNav);
  const providerValue = {
    setAppHeaderNone,
    setAppSidebarNone,
    setAppSidebarCollapsed,
    setAppContentNone,
    setAppContentClass,
    setAppContentFullHeight,
    setAppBoxedLayout,
    setAppFooter,
    setAppTopNav,
  };

  var handleSetAppTheme = (value) => {
    if (value) {
      var newTheme = value;
      for (var x = 0; x < document.body.classList.length; x++) {
        if (
          document.body.classList[x].indexOf("theme-") > -1 &&
          document.body.classList[x] !== newTheme
        ) {
          document.body.classList.remove(document.body.classList[x]);
        }
      }

      if (localStorage && value) {
        localStorage.appTheme = value;
      }

      document.body.classList.add(newTheme);
      document.dispatchEvent(new Event("theme-reload"));
    }
  };

  var handleSetAppMode = (value) => {
    if (value) {
      document.documentElement.setAttribute("data-bs-theme", value);
    }
  };

  var handleSetAppCover = (value) => {
    if (value) {
      var htmlElm = document.querySelector("html");
      for (var x = 0; x < document.documentElement.classList.length; x++) {
        var targetClass = document.documentElement.classList[x];
        if (targetClass.search("bg-cover-") > -1) {
          htmlElm.classList.remove(targetClass);
        }
      }
      htmlElm.classList.add(value);

      if (localStorage && value) {
        localStorage.appCover = value;
      }
    }
  };

  useEffect(() => {
    if (defaultOptions.appMode) {
      handleSetAppMode(defaultOptions.appMode);
    }
    if (defaultOptions.appTheme) {
      handleSetAppTheme(defaultOptions.appTheme);
    }
    if (defaultOptions.appCover) {
      handleSetAppCover(defaultOptions.appCover);
    }

    if (localStorage) {
      if (typeof localStorage.appMode !== "undefined") {
        handleSetAppMode(localStorage.appMode);
      }
      if (typeof localStorage.appTheme !== "undefined") {
        handleSetAppTheme(localStorage.appTheme);
      }
      if (typeof localStorage.appCover !== "undefined") {
        handleSetAppCover(localStorage.appCover);
      }
    }

    // eslint-disable-next-line
  }, []);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        <AppSettings.Provider value={providerValue}>
          <WalletContext>
            <div
              className={
                "app " +
                (appBoxedLayout ? "app-boxed-layout " : "") +
                (appContentFullHeight ? "app-content-full-height " : "") +
                (appHeaderNone ? "app-without-header " : "") +
                (appSidebarNone ? "app-without-sidebar " : "") +
                (appSidebarCollapsed ? "app-sidebar-collapsed " : "") +
                (appFooter ? "app-footer-fixed " : "") +
                (appTopNav ? "app-with-top-nav " : "")
              }
            >
              {!appHeaderNone && <Header />}
              {appTopNav && <TopNav />}
              {!appSidebarNone && <Sidebar />}
              {!appContentNone && <Content className={appContentClass} />}
              {appFooter && <Footer />}
              <ThemePanel />
            </div>
          </WalletContext>
        </AppSettings.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
