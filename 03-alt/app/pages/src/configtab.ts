import { app } from "@microsoft/teams-js";

(async () => {
    await app.initialize();
    const context: app.Context = await app.getContext();
    document.getElementById('context').innerText = JSON.stringify(context, null, 2);
})();