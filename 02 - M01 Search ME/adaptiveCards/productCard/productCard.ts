import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import * as cardTemplate from './inventory.json';
import { CardFactory, Attachment } from "botbuilder";

export async function getCardAttachment<T extends object>(item): Promise<Attachment> {

    // Build adaptive card to display the selected item
    const card = AdaptiveCards.declare<T>(cardTemplate).render(item);
    return CardFactory.adaptiveCard(card);

}

