import * as ACData from "adaptivecards-templating";
import { NorthwindCustomer } from "../model/NorthwindCustomer";
import {
    CardFactory,
    TurnContext,
    MessagingExtensionResult
} from "botbuilder";
import { Query } from '@microsoft/teams-ai';

interface NorthwindCustomerData {
    value: NorthwindCustomer[];
}
type CustomerValue = NorthwindCustomer & { meType: string, flagUrl: string, imageUrl: string };

export const meType = "customerME";

// Get suppliers given a query
export async function query(context: TurnContext, query: Query<Record<string, any>>):
    Promise<MessagingExtensionResult> {

    try {
        const queryText = query.parameters.queryText;
        const response = await fetch(
            `https://services.odata.org/V4/Northwind/Northwind.svc/Customers` +
            `?$filter=contains(tolower(CompanyName),tolower('${queryText}'))` +
            `&$orderby=CompanyName&$top=8`
        );
        const responseData = await response.json() as NorthwindCustomerData;

        const attachments = [];
        responseData.value.forEach((customer) => {

            // Free flag images from https://flagpedia.net/
            const flagUrl = getFlagUrl(customer.Country);
            const imageUrl = `https://picsum.photos/seed/${customer.CustomerID}/300`;

            const itemAttachment = CardFactory.heroCard(customer.CompanyName);
            const previewAttachment = CardFactory.thumbnailCard(customer.CompanyName,
                `${customer.City}, ${customer.Country}`, [flagUrl]);

            const value: CustomerValue = {
                meType: this.meType,
                CustomerID: customer.CustomerID,
                flagUrl: flagUrl,
                imageUrl: imageUrl,
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

export async function selectItem(context: TurnContext, selectedValue: any):
    Promise<MessagingExtensionResult> {

    // Read card from JSON file
    const templateJson = require('../cards/customerCard.json');
    const template = new ACData.Template(templateJson);
    const card = template.expand({
        $root: selectedValue
    });

    const resultCard = CardFactory.adaptiveCard(card);

    return {
        type: "result",
        attachmentLayout: "list",
        attachments: [resultCard]
    };

};

// Get a flag image URL given a country name
// Thanks to https://flagpedia.net for providing flag images
function getFlagUrl(country: string): string {

    const COUNTRY_CODES = {
        "argentina": "ar",
        "austria": "at",
        "australia": "au",
        "belgium": "be",
        "brazil": "br",
        "canada": "ca",
        "denmark": "dk",
        "france": "fr",
        "germany": "de",
        "finland": "fi",
        "ireland": "ie",
        "italy": "it",
        "japan": "jp",
        "mexico": "mx",
        "netherlands": "nl",
        "norway": "no",
        "singapore": "sg",
        "spain": "es",
        "sweden": "se",
        "switzerland": "ch",
        "uk": "gb",
        "usa": "us"
    };

    if (COUNTRY_CODES[country.toLowerCase()] === undefined) {
        console.log ('Missing country code for ' + country);
    }
    return `https://flagcdn.com/32x24/${COUNTRY_CODES[country.toLowerCase()]}.png`;

};


export default {
    meType,
    query,
    selectItem
}