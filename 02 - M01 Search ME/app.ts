import { Application, DefaultTurnState, Query } from '@microsoft/teams-ai';
import { ActivityTypes, MemoryStorage, TurnContext, MessagingExtensionResult } from 'botbuilder';
import SupplierME from './messageExtensions/supplierME';
import CustomerME from './messageExtensions/mockCustomerME';

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

app.messageExtensions.query('supplierQuery',
    (context: TurnContext, state: ApplicationTurnState, query: Query<Record<string, any>>):
        Promise<MessagingExtensionResult> => {
        return SupplierME.query(context, query);
    });

app.messageExtensions.query('customerQuery',
    (context: TurnContext, state: ApplicationTurnState, query: Query<Record<string, any>>):
        Promise<MessagingExtensionResult> => {
        return CustomerME.query(context, query);
    });

app.messageExtensions.selectItem((context: TurnContext, state: ApplicationTurnState, item: Record<string, any>):
    Promise<MessagingExtensionResult> => {
        switch (item.meType) {
            case SupplierME.meType: {
                return SupplierME.selectItem(context, item);
            }
            case CustomerME.meType: {
                return CustomerME.selectItem(context, item);
            }
            default: {
                return null;
            }
        }
});


export default app;