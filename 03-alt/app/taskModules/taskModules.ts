import { Application } from '@microsoft/teams-ai';
import { TurnContext, TaskModuleTaskInfo } from 'botbuilder';
import { ApplicationTurnState } from '../app';
import { AdaptiveCards } from '@microsoft/adaptivecards-tools';
import { NameDisplayCard } from '../models/cards';

const setup = (app: Application<ApplicationTurnState>) => {

    // handle the task/fetch invoke event 
    app.taskModules.fetch('fetchName', async (context: TurnContext, state: ApplicationTurnState, data: Record<string, any>) => {
        const card = await import('../adaptiveCards/nameForm.json');
        return {
            type: 'continue',
            title: 'Task Module',
            card: {
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: card
            }
        } as TaskModuleTaskInfo;
    });

    // handle the task/submit invoke event
    app.taskModules.submit('submitName', async (context: TurnContext, state: ApplicationTurnState, data: Record<string, any>) => {
        await context.sendActivity(`Hello, ${data.name}!`);
        const template = await import('../adaptiveCards/nameDisplay.json');
        const card = AdaptiveCards.declare<NameDisplayCard>(template).render({ name: data.name });
        return {
            type: 'continue',
            card: {
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: card
            }
        } as TaskModuleTaskInfo;
    });

};

export { setup };