import { TurnContext } from "botbuilder";
import { ApplicationTurnState } from "..";

export const onMessage = async (context: TurnContext, state: ApplicationTurnState) => {
    // Increment count state
    let count = state.conversation.value.count ?? 0;
    state.conversation.value.count = ++count;

    // Echo back users request
    await context.sendActivity(`[${count}] you said: ${context.activity.text}`);
};

export const onInstall = async (context: TurnContext, state: ApplicationTurnState) => {
    await context.sendActivity(`Thanks for installing me!`);
};