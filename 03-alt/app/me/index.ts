import { Application } from "@microsoft/teams-ai";
import { MessagingExtensionResult, TurnContext } from "botbuilder";
import { ApplicationTurnState } from "..";
import supplier from "./supplier";
import { query } from "./movies";

const setup = (app: Application<ApplicationTurnState>) => {
    
    app.messageExtensions.query('supplierQuery', supplier.query<ApplicationTurnState>);

    app.messageExtensions.query('movieQuery', query);

    app.messageExtensions.selectItem((context: TurnContext, state: ApplicationTurnState, item: Record<string, any>):
        Promise<MessagingExtensionResult> => {
        switch (item.meType) {
            case supplier.meType: {
                return supplier.selectItem(context, item);
            }
            default: {
                return null;
            }
        }
    });

};

export { setup };