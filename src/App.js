import React from "react";
import "./App.css";
import Auth from "./components/Auth";
import Layout from "./components/Layout";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from "react";
import Notification from "./components/Notification";
import { uiActions } from "./store/ui-slice";
let isFirstRender = true

function App() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const notification = useSelector(state => state.ui.notification)

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false
      return
    }
    const sendRequest = async () => {
      //send state as sending request
      dispatch(uiActions.showNotification({
        open: true,
        message: "Sending Request",
        type: 'warning'
      }))
      const res = await fetch('https://redux-http-6a987-default-rtdb.asia-southeast1.firebasedatabase.app/cartItems.json', {
        method: "PUT",
        body: JSON.stringify(cart)
      })
      const data = await res.json();
      //send state as successful
      dispatch(uiActions.showNotification({
        open: true,
        message: "Sent Request to database successfully",
        type: 'success'
      }))
    }
    sendRequest().catch(err => {
      //send state as error
      dispatch(uiActions.showNotification({
        open: true,
        message: "Sending Request Failed",
        type: 'error'
      }))
    });
  }, [cart])
  // console.log(cartItems)
  return (
    <div className="App">
      {notification &&
        <Notification type={notification.type} message={notification.message} />
      }
      {!isLoggedIn ? <Auth /> :
        <Layout />}
    </div>
  );
}

export default App;
