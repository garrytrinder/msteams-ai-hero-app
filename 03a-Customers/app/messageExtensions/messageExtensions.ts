import { Application, Query } from '@microsoft/teams-ai';
import { ApplicationTurnState } from '../app';
import * as userME from './userME';
import * as customerME from './customerME';
import { ActivityTypes, MemoryStorage, TurnContext, MessagingExtensionResult } from 'botbuilder';


const setup = (app: Application<ApplicationTurnState>) => {

    app.messageExtensions.query("userQuery", userME.query);

    app.messageExtensions.query("customerQuery", customerME.query);

    app.messageExtensions.selectItem(async (context: TurnContext, state: ApplicationTurnState, item: Record<string, any>):
        Promise<MessagingExtensionResult> => {
        switch (item.meType) {
            case customerME.meType: {
                return await customerME.selectItem(context, item);
            }
            default: {
                return null;
            }
        }
    });

};

export { setup };
