import { ActivityTypes, TurnContext } from "botbuilder";
import { Application } from "@microsoft/teams-ai";
import { ApplicationTurnState } from "..";

const setup = (app: Application) => {

    // add reset command to reset conversation state
    app.message('/reset', async (context: TurnContext, state: ApplicationTurnState) => {
        state.conversation.delete();
        await context.sendActivity(`Ok I've deleted the current conversation state.`);
    });

    // add message handler to echo back user input
    app.activity(ActivityTypes.Message, async (context: TurnContext, state: ApplicationTurnState) => {
        // Increment count state
        let count = state.conversation.value.count ?? 0;
        state.conversation.value.count = ++count;

        // Echo back users request
        await context.sendActivity(`[${count}] you said: ${context.activity.text}`);
    });

    // add installation update handler to welcome user
    app.activity(ActivityTypes.InstallationUpdate, async (context: TurnContext, state: ApplicationTurnState) => {
        await context.sendActivity(`Thanks for installing me!`);
    });
}

export { setup };
