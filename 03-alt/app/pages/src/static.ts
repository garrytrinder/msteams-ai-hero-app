import { app } from "@microsoft/teams-js";

(async () => {
    await app.initialize();
    const context: app.Context = await app.getContext();
    const element = document.getElementById('context') as HTMLPreElement;
    if (element) { element.innerText = JSON.stringify(context, null, 2); };
})();