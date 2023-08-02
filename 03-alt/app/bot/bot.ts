import { ActivityTypes, TaskModuleTaskInfo, TurnContext } from "botbuilder";
import { Application } from "@microsoft/teams-ai";
import { ApplicationTurnState } from "../app";

const setup = (app: Application) => {

    // add installation update handler to welcome user
    app.activity(ActivityTypes.InstallationUpdate, async (context: TurnContext, state: ApplicationTurnState) => {
        await context.sendActivity(`Thanks for installing me!`);
    });

    // add reset command to reset conversation state
    app.message('/reset', async (context: TurnContext, state: ApplicationTurnState) => {
        state.conversation.delete();
        await context.sendActivity(`Ok I've deleted the current conversation state.`);
    });

    app.message('/tm', async (context: TurnContext, state: ApplicationTurnState) => {
        // return adaptive card
        await context.sendActivity({
            type: 'message',
            attachments: [{
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: {
                    type: 'AdaptiveCard',
                    version: '1.5',
                    body: [
                        {
                            type: 'TextBlock',
                            text: 'Task Module',
                            size: 'large',
                            weight: 'bolder'
                        },
                        {
                            type: 'TextBlock',
                            text: 'Click the button below to open a task module',
                            wrap: true
                        }
                    ],
                    actions: [
                        {
                            type: 'Action.Submit',
                            title: 'Open Task Module',
                            data: { msteams: { type: 'task/fetch' }, verb: 'fetchName' }
                        }
                    ]
                }
            }]
        });
    });

    // handle the task/fetch invoke event 
    app.taskModules.fetch('fetchName', async (context: TurnContext, state: ApplicationTurnState, data: Record<string, any>) => {
        return {
            type: 'continue',
            title: 'Task Module',
            card: {
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: {
                    "type": "AdaptiveCard",
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "version": "1.5",
                    "body": [
                        {
                            "type": "Input.Text",
                            "id": "name",
                            "text": "Your name",
                            "placeholder": "Your name",
                        }
                    ],
                    "actions": [
                        {
                            "type": "Action.Submit",
                            "title": "Submit",
                            data: {
                                verb: 'submitName',
                            }
                        }
                    ]
                }
            }
        } as TaskModuleTaskInfo;
    });

    // handle the task/submit invoke event
    app.taskModules.submit('submitName', async (context: TurnContext, state: ApplicationTurnState, data: Record<string, any>) => {
        await context.sendActivity(`Hello, ${data.name}!`);
        return {
            type: 'continue',
            card: {
                contentType: 'application/vnd.microsoft.card.adaptive',
                content: {
                    "type": "AdaptiveCard",
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "version": "1.5",
                    "body": [
                        {
                            "type": "TextBlock",
                            "text": `Hello, ${data.name}!`,
                        }
                    ],
                }
            }
        } as TaskModuleTaskInfo;
    });
    
    // add message handler to echo back user input
    app.activity(ActivityTypes.Message, async (context: TurnContext, state: ApplicationTurnState) => {
        // Increment count state
        let count = state.conversation.value.count ?? 0;
        state.conversation.value.count = ++count;

        // Echo back users request
        await context.sendActivity(`[${count}] you said: ${context.activity.text}`);
    });
}

export { setup };
