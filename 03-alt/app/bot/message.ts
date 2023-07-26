import { TurnContext } from "botbuilder";
import { ApplicationTurnState } from "..";

export const onReset = async (context: TurnContext, state: ApplicationTurnState) => {
    state.conversation.delete();
    await context.sendActivity(`Ok I've deleted the current conversation state.`);
}