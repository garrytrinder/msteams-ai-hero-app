import { Query } from '@microsoft/teams-ai';
import { ApplicationTurnState } from '../app';
import { AdaptiveCards } from '@microsoft/adaptivecards-tools';
import { CardFactory, TurnContext } from 'botbuilder';
import { getCustomers } from '../models/northwindData';
import { Customer } from '../models/db';
import { MessagingExtensionResult, MessagingExtensionAttachment } from 'botbuilder';

export const meType = "customerME";

export async function query(context: TurnContext, state: ApplicationTurnState, query: Query<Record<string, any>>):
    Promise<MessagingExtensionResult | undefined> {

    try {
        const { queryText } = query.parameters;

        const customers = await getCustomers(queryText);
        const attachments = [] as MessagingExtensionAttachment[];

        customers.forEach((customer: Customer) => {

            const itemAttachment = CardFactory.heroCard(customer.CompanyName);
            const previewAttachment = CardFactory.thumbnailCard(customer.CompanyName,
                `${customer.City}, ${customer.Country}`, [customer.ImageUrl]);

            const value = {
                meType: meType,
                CustomerID: customer.CustomerID,
                FlagUrl: customer.FlagUrl,
                ImageUrl: customer.ImageUrl,
                Address: customer.Address || "",
                City: customer.City || "",
                CompanyName: "C " + customer.CompanyName || "unknown",
                ContactName: customer.ContactName || "",
                ContactTitle: customer.ContactTitle || "",
                Country: customer.Country || "",
                Fax: customer.Fax || "",
                Phone: customer.Phone || "",
                PostalCode: customer.PostalCode || "",
                Region: customer.Region || ""
            }
            previewAttachment.content.tap = {
                type: "invoke",
                value: value
            };
            const attachment = { ...itemAttachment, preview: previewAttachment };
            attachments.push(attachment);
        });

        return {
            type: "result",
            attachmentLayout: "list",
            attachments: attachments,
        };


    } catch (error) {
        console.log(error);
    }
};

export async function selectItem(context: TurnContext, selectedValue: any): Promise<MessagingExtensionResult | undefined> {

    const template = await import('../adaptiveCards/customerDetail.json');

    const resultCard = CardFactory.adaptiveCard(
        AdaptiveCards.declare<Customer>(template).render(selectedValue)
    );

    return {
        type: "result",
        attachmentLayout: "list",
        attachments: [resultCard]
    };

};


