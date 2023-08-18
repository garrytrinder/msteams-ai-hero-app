import { ActivityTypes, TurnContext } from "botbuilder";
import { Application } from "@microsoft/teams-ai";
import { ApplicationTurnState } from "../app";

const setup = (app: Application) => {

    app.activity(ActivityTypes.InstallationUpdate, async (context: TurnContext, state: ApplicationTurnState) => {
        await context.sendActivity(`Thanks for installing me!`);
    });

    app.message('/taskmodule', async (context: TurnContext, state: ApplicationTurnState) => {
        const card = await import('../adaptiveCards/taskModule.json');
        await context.sendActivity({
            type: 'message',
            attachments: [{
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: card
            }]
        });
    });

    app.message('/reset', async (context: TurnContext, state: ApplicationTurnState) => {
        state.conversation.delete();
        await context.sendActivity(`Ok I've deleted the current conversation state.`);
    });

    app.message('/profile', async (context: TurnContext, state: ApplicationTurnState) => {
        const { authToken } = state.temp.value;
        const profile = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        const data = await profile.json();
        await context.sendActivity(JSON.stringify(data, null, 2));
    });

    app.activity(ActivityTypes.Message, async (context: TurnContext, state: ApplicationTurnState) => {
        // check to see if the activity is a message with text, we don't want to reply to an adaptive card
        if (typeof context.activity.text === 'undefined') return;

        // Increment count state
        let count = state.conversation.value.count ?? 0;
        state.conversation.value.count = ++count;

        // Echo back users request
        await context.sendActivity(`[${count}] you said: ${context.activity.text}`);
    });

}

export { setup };
