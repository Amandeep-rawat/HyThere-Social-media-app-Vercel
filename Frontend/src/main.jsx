import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { Toaster } from './components/ui/sonner.jsx'
import store from './Redux/store.js'
// persist 
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
let persistor = persistStore(store)
createRoot(document.getElementById('root')).render(
   // <StrictMode>

        <Provider store={store}>
      {/* persist iskiye use kiya he taki page refresh hone pe data null pe set na ho jaye . jaise hamne purane redux wale padhai ke folder me dekha tha refresh pe count 0 pe set ho jata tha . ab persist se nhi hoga yaha profile pic null pe set .  */}
    <PersistGate loading={null} persistor={persistor}>                   
      <App />
      <Toaster />

    </PersistGate>
    </Provider>
      
    // </StrictMode>,
)
