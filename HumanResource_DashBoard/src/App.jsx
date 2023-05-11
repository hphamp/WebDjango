import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { privateRoutes, publicRoutes } from "./routes";
import { DefaultLayout } from "./layouts";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeDetails } from "./actions/employeeActions";

function App() {
  const authData = useSelector((state) => state.authReducer.authData);
  // console.log(authData.id);
  const [authenticated, setAuthenticated] = useState(authData?.id === 1);
  // console.log(authData?.id);
  
  useEffect(() => {
    if (authData?.id === 1) { // check if authData exists and has an id of 1
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }

    if (authData) {
      dispatch(getEmployeeDetails(authData.id));
    }
  }, [authData]);
  const dispatch = useDispatch();
  console.log(authenticated, authData?.id);
  // useEffect(() => {
  //   if (authData) {
  //     dispatch(getEmployeeDetails(authData.id));
  //   }
  // });;

  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route, index) => {
          let Layout = DefaultLayout;
          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
        {privateRoutes.map((route, index) => {
          let Layout = DefaultLayout;
          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }
          const Page = route.component;
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  {authenticated ? <Page /> : <Navigate to="/login" />}
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
