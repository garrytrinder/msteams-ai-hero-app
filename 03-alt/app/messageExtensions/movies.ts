import { TurnContext, MessagingExtensionResult } from "botbuilder";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { ApplicationTurnState } from "../app";
import { Movie } from "../models/cards";

export const query = async (context: TurnContext, state: ApplicationTurnState, query: Record<string, any>) => {
    const template = await import('../adaptiveCards/movie.json');
    const movies: Movie[] = [
        {
            title: 'Movie 1',
            subtitle: 'Movie 1 subtitle',
            text: 'Movie 1 text',
            images: [
                {
                    url: 'https://picsum.photos/300/200?image=1'
                }
            ]
        },
        {
            title: 'Movie 2',
            subtitle: 'Movie 2 subtitle',
            text: 'Movie 2 text',
            images: [
                {
                    url: 'https://picsum.photos/300/200?image=2'
                }
            ]
        }
    ];

    const cards = movies.map((movie: Movie) => { return AdaptiveCards.declare<Movie>(template).render(movie); });

    return new Promise<MessagingExtensionResult>((resolve, reject) => {
        const result: MessagingExtensionResult = {
            type: 'result',
            attachmentLayout: 'list',
            attachments: cards.map((card: any) => { return { contentType: 'application/vnd.microsoft.card.thumbnail', content: card } })
        };
        resolve(result);
    });
};