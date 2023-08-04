import { Application, DefaultTurnState, Query } from '@microsoft/teams-ai';
import { ActivityTypes, MemoryStorage, TurnContext, MessagingExtensionResult } from 'botbuilder';
import * as SupplierME from './messageExtensions/supplierME';
import * as ProductME from './messageExtensions/productME';
import * as CustomerME from './messageExtensions/customerME';

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

// If the ME's function matches the expected event handler's signature, you can pass it directly
app.messageExtensions.query('supplierQuery', SupplierME.query<ApplicationTurnState>);
app.messageExtensions.query('productQuery', ProductME.query<ApplicationTurnState>);

// If not, then you can wrap it in a lambda
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
            case ProductME.meType: {
                return ProductME.selectItem(context, item);
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