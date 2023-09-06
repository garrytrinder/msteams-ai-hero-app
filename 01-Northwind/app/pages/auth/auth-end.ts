import { app, authentication } from "@microsoft/teams-js";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

(async (url) => {
    await app.initialize();
    const appContent: app.Context = await app.getContext();

    const currentURL = new URL(url);
    const clientId = currentURL.searchParams.get("clientId");

    const msalConfig: Configuration = {
        auth: {
            clientId: clientId,
            authority: `https://login.microsoftonline.com/${appContent.user.tenant.id}`,
            navigateToLoginRequestUrl: false
        },
        cache: {
            cacheLocation: "sessionStorage",
        },
    };

    const msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.initialize();
    
    try {
        const tokenResponse = await msalInstance.handleRedirectPromise();
        tokenResponse
            ? authentication.notifySuccess(JSON.stringify({ sessionStorage }))
            : authentication.notifyFailure("Get empty response.");
    } catch (error) {
        authentication.notifyFailure(JSON.stringify(error));
    }
})(window.location.href);