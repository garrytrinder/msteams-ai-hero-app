import { Application, DefaultTurnState } from '@microsoft/teams-ai';
import { ConversationState } from './bot/state';
import adapter from './bot/adapter';
import storage from './bot/storage';
import * as bot from './bot';
import * as me from './me';

export type ApplicationTurnState = DefaultTurnState<ConversationState>;

const app = new Application<ApplicationTurnState>({
    adapter,
    storage
});

bot.setup(app);
me.setup(app);

export default app;