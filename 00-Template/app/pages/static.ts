import { app, authentication } from "@microsoft/teams-js";

(async () => {
    await app.initialize();
    const context: app.Context = await app.getContext();
    const contextElement = document.getElementById('context') as HTMLPreElement;
    if (contextElement) { contextElement.innerText = JSON.stringify(context, null, 2); };

    const configRequest = await fetch('/api/config');
    const configData = await configRequest.json();
    const configElement = document.getElementById('config') as HTMLPreElement;
    if (configElement) { configElement.innerText = JSON.stringify(configData, null, 2); };

    const ssoToken = await authentication.getAuthToken();
    const profileRequest = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify({
            ssoToken,
            scopes: ["https://graph.microsoft.com/.default"]
        })
    });
    const profileData = await profileRequest.json();
    if (profileData.message && profileData.message.indexOf('InteractionRequiredAuthError') > -1) {
        const adminConsentLink = document.createElement('a');
        adminConsentLink.href = `https://login.microsoftonline.com/common/adminconsent?client_id=${configData.aadAppId}`;
        adminConsentLink.innerText = 'Grant admin consent';
        adminConsentLink.target = '_blank';
        const adminConsentElement = document.getElementById('admin-consent') as HTMLPreElement;
        if (adminConsentElement) { adminConsentElement.appendChild(adminConsentLink); };
    } else {
        const profileElement = document.getElementById('profile') as HTMLPreElement;
        if (profileElement) { profileElement.innerText = JSON.stringify(profileData, null, 2); };
    }
})();