import * as msal from "@azure/msal-node";
import config from "../config";
import { OnBehalfOfCredentialAuthConfig } from "@microsoft/teamsfx";

export const msalClient = new msal.ConfidentialClientApplication({
    auth: {
        clientId: config.aadAppId,
        clientSecret: config.aadAppClientSecret
    }
});

export const getAccessToken = async (msalClient: msal.ConfidentialClientApplication, ssoToken: string, scopes: string[]) => {
    return await msalClient.acquireTokenOnBehalfOf({
        authority: `${config.aadAppOAuthAuthorityHost}/common`,
        oboAssertion: ssoToken,
        scopes: scopes,
        skipCache: true
    });
};

export const authentication = {
    connectionName: "MicrosoftGraph",
    title: "Sign In"
}

export const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
    authorityHost: config.aadAppOAuthAuthorityHost,
    clientId: config.aadAppId,
    clientSecret: config.aadAppClientSecret,
    tenantId: "common"
}

export const loginEndpoint = `${config.appEndpoint}/auth/auth-start.html`;