import * as ACData from "adaptivecards-templating";
import { NorthwindSupplier } from "../model/NorthwindSupplier";
import {
    CardFactory,
    TurnContext,
    MessagingExtensionResult
  } from "botbuilder";
import { Query } from '@microsoft/teams-ai';

interface NorthwindSupplierData {
    value: NorthwindSupplier[];
}
type SupplierValue = NorthwindSupplier & { meType: string, flagUrl: string, imageUrl: string };
                
export const meType = "supplierME";

// Get suppliers given a query
export async function query<T> (context: TurnContext, state: T, query: Query<Record<string, any>>):
        Promise<MessagingExtensionResult> {

        try {
            const queryText = query.parameters.queryText;
            const response = await fetch(
                `https://services.odata.org/V4/Northwind/Northwind.svc/Suppliers` +
                `?$filter=contains(tolower(CompanyName),tolower('${queryText}'))` +
                `&$orderby=CompanyName&$top=8`
            );
            const responseData = await response.json() as NorthwindSupplierData;

            const attachments = [];
            responseData.value.forEach((supplier) => {

                // Free flag images from https://flagpedia.net/
                const flagUrl = getFlagUrl(supplier.Country);
                const imageUrl = `https://picsum.photos/seed/${supplier.SupplierID}/300`;

                const itemAttachment = CardFactory.heroCard(supplier.CompanyName);
                const previewAttachment = CardFactory.thumbnailCard(supplier.CompanyName,
                    `${supplier.City}, ${supplier.Country}`, [flagUrl]);

                const value: SupplierValue = {
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

export async function selectItem (context: TurnContext, selectedValue: SupplierValue):
        Promise<MessagingExtensionResult> {

        // Read card from JSON file
        const templateJson = require('../cards/supplierCard.json');
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
    function getFlagUrl (country: string) : string {

        const COUNTRY_CODES = {
            "australia": "au",
            "brazil": "br",
            "canada": "ca",
            "denmark": "dk",
            "france": "fr",
            "germany": "de",
            "finland": "fi",
            "italy": "it",
            "japan": "jp",
            "netherlands": "nl",
            "norway": "no",
            "singapore": "sg",
            "spain": "es",
            "sweden": "se",
            "uk": "gb",
            "usa": "us"
        };

        return `https://flagcdn.com/32x24/${COUNTRY_CODES[country.toLowerCase()]}.png`;

    };

export default {
    query: query,
    selectItem: selectItem,
    meType: meType
}