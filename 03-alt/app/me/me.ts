import { Application } from "@microsoft/teams-ai";
import { MessagingExtensionResult, TurnContext } from "botbuilder";
import { ApplicationTurnState } from "../app";
import { query } from "./movies";

const setup = (app: Application<ApplicationTurnState>) => {
    
    app.messageExtensions.query('movieQuery', query);
    
    app.messageExtensions.selectItem((context: TurnContext, state: ApplicationTurnState, item: Record<string, any>) => {
        return new Promise<MessagingExtensionResult>((resolve, reject) => {
            resolve({
                type: "result",
                attachmentLayout: "list",
                attachments: [
                    {
                        contentType: 'application/vnd.microsoft.card.thumbnail',
                        content: {
                            title: 'Movie 1',
                            subtitle: 'Movie 1 subtitle',
                            text: 'Movie 1 text',
                            images: [
                                {
                                    url: 'https://picsum.photos/300/200?image=1'
                                }
                            ]
                        }
                    }]
            } as MessagingExtensionResult);
        })
    });

};

export { setup };