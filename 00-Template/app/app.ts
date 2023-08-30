import { Application, DefaultTurnState } from '@microsoft/teams-ai';
import { BlobsStorage } from 'botbuilder-azure-blobs';
import adapter from '../adapter';
import config from '../config';
import * as bot from './bots/bot';
import * as taskModules from './taskModules/taskModules';
import * as messageExtensions from './messageExtensions/messageExtensions';
import { authentication } from './auth';

interface ConversationState {
    count: number;
}

export type ApplicationTurnState = DefaultTurnState<ConversationState>;

// Create storage
export const storage = new BlobsStorage(
    config.blobConnectionString,
    config.blobContainerName
);

// Create application
const app = new Application<ApplicationTurnState>({
    adapter,
    botAppId: config.aadAppId,
    storage,    
    authentication
});

taskModules.setup(app);
bot.setup(app);
messageExtensions.setup(app);

export default app;