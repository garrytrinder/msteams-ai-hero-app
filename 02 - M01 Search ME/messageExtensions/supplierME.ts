import * as ACData from "adaptivecards-templating";
import { NorthwindSupplier } from "../model/NorthwindSupplier";
import {
    CardFactory,
    TurnContext,
    MessagingExtensionResult
} from "botbuilder";
import { Query } from '@microsoft/teams-ai';

// Selected items are of this data type
interface SupplierMEItem extends NorthwindSupplier {
    meType: string;
    flagUrl: string;
    imageUrl: string;
}

// App uses this to correlate selectedItem events with this particular ME
export const meType = "supplierME";

// Get suppliers given a query
export async function query<T>(context: TurnContext, state: T, query: Query<Record<string, any>>):
    Promise<MessagingExtensionResult> {

    try {
        const queryText = query.parameters.queryText;
        const response = await fetch(
            `https://services.odata.org/V4/Northwind/Northwind.svc/Suppliers` +
            `?$filter=contains(tolower(CompanyName),tolower('${queryText}'))` +
            `&$orderby=CompanyName&$top=8`
        );
        const responseData = await response.json() as { value: NorthwindSupplier[] }

        const attachments = [];
        responseData.value.forEach((supplier) => {

            const flagUrl = getFlagUrl(supplier.Country);
            const imageUrl = `https://picsum.photos/seed/${supplier.SupplierID}/300`;

            const itemAttachment = CardFactory.heroCard(supplier.CompanyName);
            const previewAttachment = CardFactory.thumbnailCard(supplier.CompanyName,
                `${supplier.City}, ${supplier.Country}`, [flagUrl]);

            const value: SupplierMEItem = {
                meType: meType,
                SupplierID: supplier.SupplierID,
                flagUrl: flagUrl,
                imageUrl: imageUrl,
                Address: supplier.Address || "",
                City: supplier.City || "",
                CompanyName: supplier.CompanyName || "unknown",
                ContactName: supplier.ContactName || "",
                ContactTitle: supplier.ContactTitle || "",
                Country: supplier.Country || "",
                Fax: supplier.Fax || "",
                Phone: supplier.Phone || "",
                PostalCode: supplier.PostalCode || "",
                Region: supplier.Region || ""
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

    const item: SupplierMEItem = selectedValue;

    // Read card from JSON file
    const templateJson = require('../cards/supplierCard.json');
    const template = new ACData.Template(templateJson);
    const card = template.expand({
        $root: item
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

    return `https://flagcdn.com/32x24/${COUNTRY_CODES[country.toLowerCase()]}.png`;

};
