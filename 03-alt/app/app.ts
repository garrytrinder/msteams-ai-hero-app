import { Application, DefaultTurnState } from '@microsoft/teams-ai';
import { BlobsStorage } from 'botbuilder-azure-blobs';
import adapter from '../adapter';
import config from '../config';
import * as bot from './bot/bot';
import * as me from './me/me';

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
    storage
});

// Setup bot and messaging extensions
bot.setup(app);
me.setup(app);

export default app;