import { TurnContext, MessagingExtensionResult } from "botbuilder";
import { ApplicationTurnState } from "../..";

export const query = (context: TurnContext, state: ApplicationTurnState, query: Record<string, any>) => {
    return new Promise<MessagingExtensionResult>((resolve, reject) => {
        const result: MessagingExtensionResult = {
            type: 'result',
            attachmentLayout: 'list',
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
                },
                {
                    contentType: 'application/vnd.microsoft.card.thumbnail',
                    content: {
                        title: 'Movie 2',
                        subtitle: 'Movie 2 subtitle',
                        text: 'Movie 2 text',
                        images: [
                            {
                                url: 'https://picsum.photos/300/200?image=2'
                            }
                        ]
                    }
                }
            ]
        };
        resolve(result);
    });
};