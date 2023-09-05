import { app, pages } from "@microsoft/teams-js";

(async () => {
    await app.initialize();

    pages.config.registerOnSaveHandler(async (saveEvent) => {
        await pages.config.setConfig({
            suggestedDisplayName: "Configurable Tab",
            entityId: "configurableTab",
            contentUrl: `https://${window.location.hostname}/configtab.html`,
            websiteUrl: `https://${window.location.hostname}/configtab.html`,
        });
        saveEvent.notifySuccess();
    });
    pages.config.setValidityState(true);
});