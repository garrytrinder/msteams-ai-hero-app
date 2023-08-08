import { Application, DefaultTurnState } from '@microsoft/teams-ai';
import { BlobsStorage } from 'botbuilder-azure-blobs';
import adapter from '../adapter';
import config from '../config';
import * as bot from './bots/bot';
import * as messageExtensions from './messageExtensions/messageExtensions';
import * as taskModules from './taskModules/taskmodules';

interface ConversationState {
    count: number;
}

export type ApplicationTurnState = DefaultTurnState<ConversationState>;

// Create storage
const storage = new BlobsStorage(
    config.blobConnectionString,
    config.blobContainerName
);

// Create application
const app = new Application<ApplicationTurnState>({
    adapter,
    botAppId: config.botId,
    storage,
});

// Setup bot and messaging extensions
bot.setup(app);
messageExtensions.setup(app);
taskModules.setup(app);

export default app;