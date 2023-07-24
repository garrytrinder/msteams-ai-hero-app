import ACData from "adaptivecards-templating";
import { NorthwindSupplier } from "../model/INorthwindSupplier";
import {
    CardFactory,
    TurnContext,
    MessagingExtensionQuery,
    MessagingExtensionResponse,
  } from "botbuilder";

interface NorthwindSupplierData {
    data: {
        value: NorthwindSupplier[];
    }
}

class SupplierME {

    // Get suppliers given a query
    async handleTeamsMessagingExtensionQuery (context: TurnContext, query: MessagingExtensionQuery):
        Promise<MessagingExtensionResponse> {

        try {
            const response = await fetch(
                `https://services.odata.org/V4/Northwind/Northwind.svc/Suppliers` +
                `?$filter=contains(tolower(CompanyName),tolower('${query}'))` +
                `&$orderby=CompanyName&$top=8`
            );
            const responseData = await response.json() as NorthwindSupplierData;

            const attachments = [];
            responseData.data.value.forEach((supplier) => {

                // Free flag images from https://flagpedia.net/
                const flagUrl = this.#getFlagUrl(supplier.Country);
                const imageUrl = `https://picsum.photos/seed/${supplier.SupplierID}/300`;

                const itemAttachment = CardFactory.heroCard(supplier.CompanyName);
                const previewAttachment = CardFactory.thumbnailCard(supplier.CompanyName,
                    `${supplier.City}, ${supplier.Country}`, [flagUrl]);

                previewAttachment.content.tap = {
                    type: "invoke",
                    value: {    // Values passed to selectItem when an item is selected
                        queryType: 'supplierME',
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
                    },
                };
                const attachment = { ...itemAttachment, preview: previewAttachment };
                attachments.push(attachment);
            });

            return {
                composeExtension: {
                    type: "result",
                    attachmentLayout: "list",
                    attachments: attachments,
                }
            };

        } catch (error) {
            console.log(error);
        }
    };

    handleTeamsMessagingExtensionSelectItem (context: TurnContext, selectedValue) {

        // Read card from JSON file
        const templateJson = require('../cards/supplierCard.json');
        const template = new ACData.Template(templateJson);
        const card = template.expand({
            $root: selectedValue
        });

        const resultCard = CardFactory.adaptiveCard(card);

        return {
            composeExtension: {
                type: "result",
                attachmentLayout: "list",
                attachments: [resultCard]
            },
        };

    };

    // Get a flag image URL given a country name
    // Thanks to https://flagpedia.net for providing flag images
    #getFlagUrl (country: string) : string {

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
}

export default new SupplierME();