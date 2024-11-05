import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme/theme';
import App from './App';
import { UserProvider } from './context/UserContext'; // Import the UserProvider

import '@fontsource/poppins';
import '@fontsource/inter';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserProvider> {/* Wrap App in UserProvider to provide user context */}
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </UserProvider>
  </React.StrictMode>
);
