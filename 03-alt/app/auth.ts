import * as msal from "@azure/msal-node";
import config from "../config";

export const msalClient = new msal.ConfidentialClientApplication({
    auth: {
        clientId: config.aadAppId,
        clientSecret: config.aadAppClientSecret
    }
});

export const getAccessToken = async (msalClient: msal.ConfidentialClientApplication, ssoToken: string, scopes: string[]) => {
    return await msalClient.acquireTokenOnBehalfOf({
        authority: "https://login.microsoftonline.com/common",
        oboAssertion: ssoToken,
        scopes: scopes,
        skipCache: true
    });
};