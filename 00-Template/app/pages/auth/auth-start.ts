import { app } from "@microsoft/teams-js";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

(async (location) => {
    await app.initialize();
    const appContext: app.Context = await app.getContext();
    
    const currentURL = new URL(location.href);
    const clientId = currentURL.searchParams.get("clientId");
    const scope = currentURL.searchParams.get("scope");
    const loginHint = currentURL.searchParams.get("loginHint");

    const msalConfig: Configuration = {
        auth: {
            clientId: clientId,
            authority: `https://login.microsoftonline.com/${appContext.user.tenant.id}`,
            navigateToLoginRequestUrl: false
        },
        cache: {
            cacheLocation: "sessionStorage",
        }
    }

    const msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.initialize();
    const scopesArray = scope.split(" ");
    const scopesRequest = {
        scopes: scopesArray,
        redirectUri: `${location.origin}/auth/auth-end.html?clientId=${clientId}`,
        loginHint: loginHint
    };
    await msalInstance.loginRedirect(scopesRequest);

})(window.location);