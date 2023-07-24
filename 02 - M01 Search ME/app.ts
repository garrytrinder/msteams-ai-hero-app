import { Application, DefaultTurnState } from '@microsoft/teams-ai';
import { ActivityTypes, MemoryStorage, TurnContext } from 'botbuilder';

interface ConversationState {
    count: number;
}
type ApplicationTurnState = DefaultTurnState<ConversationState>;

const storage = new MemoryStorage();
const app = new Application<ApplicationTurnState>({
    storage
});

app.message('/reset', async (context: TurnContext, state: ApplicationTurnState) => {
    state.conversation.delete();
    await context.sendActivity(`Ok I've deleted the current conversation state.`);
});

app.activity(ActivityTypes.Message, async (context: TurnContext, state: ApplicationTurnState) => {
    // Increment count state
    let count = state.conversation.value.count ?? 0;
    state.conversation.value.count = ++count;

    // Echo back users request
    await context.sendActivity(`[${count}] you said: ${context.activity.text}`);
});

export default app;