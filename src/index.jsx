import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Auth0Provider } from "@auth0/auth0-react";

const container = document.getElementById("root");
const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-epfp9rhq.us.auth0.com"
      clientId="UtaXeUZokovZPQH7kknV7wpTMRsBMMnF"
      redirectUri={window.location.origin}
      audience="https://dotshopapi.com"
      scope="read:current_user update:current_user_metadata openid profile email">
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
