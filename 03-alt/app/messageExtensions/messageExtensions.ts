import { Application } from "@microsoft/teams-ai";
import { MessagingExtensionResult, TurnContext } from "botbuilder";
import { ApplicationTurnState } from "../app";
import { query } from "./movies";

const setup = (app: Application<ApplicationTurnState>) => {

    // add a message extension handler
    app.messageExtensions.query('movieQuery', query);

    // global select item handler for all message extensions    
    app.messageExtensions.selectItem(async (context: TurnContext, state: ApplicationTurnState, item: Record<string, any>) => {
        const card = await import('../adaptiveCards/movie.json');
        return new Promise<MessagingExtensionResult>((resolve, reject) => {
            resolve({
                type: "result",
                attachmentLayout: "list",
                attachments: [{
                    contentType: 'application/vnd.microsoft.card.thumbnail',
                    content: card
                }]
            } as MessagingExtensionResult);
        })
    });

};

export { setup };