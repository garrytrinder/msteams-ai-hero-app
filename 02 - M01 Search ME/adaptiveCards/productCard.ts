import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import * as cardTemplate from './productCardTemplates/inventory.json';
import { TurnContext, CardFactory, Attachment } from "botbuilder";
import { AdaptiveCard } from '@microsoft/teams-ai';

export async function getCardAttachment<T extends object>(item): Promise<Attachment> {

    // Build adaptive card to display the selected item
    const card = AdaptiveCards.declare<T>(cardTemplate).render(item);
    return CardFactory.adaptiveCard(card);

}

export async function actionExecute<T>(context: TurnContext, state: T, data: any):
    Promise<string | AdaptiveCard> {

    return "I am a stringy string";
}
