import { ActivityTypes } from "botbuilder";
import { onInstall, onMessage } from "./activity";
import { onReset } from "./message";
import { Application } from "@microsoft/teams-ai";

const setup = (app: Application) => {
    app.message('/reset', onReset);

    app.activity(ActivityTypes.Message, onMessage);

    app.activity(ActivityTypes.InstallationUpdate, onInstall);
}

export { setup };
