import { Application } from "@microsoft/teams-ai";
import { ApplicationTurnState } from "../app";
import { TaskModuleTaskInfo, TurnContext } from "botbuilder";

const setup = (app: Application<ApplicationTurnState>) => {

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
};

export { setup };