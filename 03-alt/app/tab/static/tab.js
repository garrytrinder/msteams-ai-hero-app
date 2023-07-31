import 'https://unpkg.com/@microsoft/teams-js@2.13.0/dist/MicrosoftTeams.min.js';

(() => {
    microsoftTeams.app.initialize().then(() => {
        microsoftTeams.app.getContext().then((context) => {
            document.getElementById('context').innerText = JSON.stringify(context, null, 2);
        });
    });
})();