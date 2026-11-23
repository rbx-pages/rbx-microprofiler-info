import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";

import App from "./App.tsx";
import MainLayout from "./js/UI/Layouts/MainLayout.tsx";
import ModalHolder from "./js/UI/Components/Base/Modals/archived/ModalHolder.tsx";
import AboutPage from "./pages/about.tsx";
import SettingsProvider from "./js/UI/Contexts/SettingsProvider.tsx";


var b_isDevelopment = (process.env.NODE_ENV == "development")
const _BASENAME = (!b_isDevelopment) ? "/rbx-microprofiler-info" : ""


ReactDOM.createRoot( document.getElementById("root")! ).render(
  <>
  {/* Settings Provider */}
  <SettingsProvider>

    {/* Content */}
    {/*
      BaseRouter over HashRouter, because of static pages issue
      that's for not using NextJS
    */}
    <HashRouter /*basename={_BASENAME}*/>
      <Routes>
        <Route element={<MainLayout/>}>
          < Route path="/*" element={<App/>} />
          < Route path="/about" element={<AboutPage/>} />
        </Route>
      </Routes>
    </HashRouter>

  </SettingsProvider>


  {/*
    Put the Modal Holder here.
    This way it won't interfere with re-render from other element's useState
  */}
  <ModalHolder/>
  </>
);