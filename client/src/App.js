import './App.css';
import { React, useContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import GlobalStoreContext from './store';
import {
    AppBanner,
    HomeWrapper,
    LoginScreen,
    RegisterScreen,
    Statusbar,
    WorkspaceScreen
} from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {
    // const { store } = useContext(GlobalStoreContext);
    // function handleOnKeyDown(event) {
    //     console.log("here");
    //     if (event.ctrlKey && event.key == "z") {
    //         console.log("undo");
    //         if (store) {
    //             store.undo()
    //         }
    //     }
    //     if (event.ctrlKey && event.key == "y") {
    //         if (store) {
    //             store.redo()
    //         }
    //     }
    // }
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    {/* <div id="app-root" tabIndex={-1} onKeyDown={handleOnKeyDown}> */}
                    <AppBanner />
                    <Switch>
                        <Route path="/" exact component={HomeWrapper} />
                        <Route path="/login/" exact component={LoginScreen} />
                        <Route path="/register/" exact component={RegisterScreen} />
                        <Route path="/playlist/:id" exact component={WorkspaceScreen} />
                    </Switch>
                    <Statusbar />
                    {/* </div> */}
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App