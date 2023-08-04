import { NorthwindProduct } from "../model/NorthwindProduct";
import {
    CardFactory,
    TurnContext,
    MessagingExtensionResult
} from "botbuilder";
import { Query } from '@microsoft/teams-ai';

import { getCardAttachment } from "../adaptiveCards/productCard";

// Selected items are of this data type
interface ProductMEItem extends NorthwindProduct {
    meType: string;
    iconUrl: string;
    imageUrl: string;
}

// App uses this to correlate selectedItem events with this particular ME
export const meType = "productME";

// Get products given a query
export async function query<T>(context: TurnContext, state: T, query: Query<Record<string, any>>):
    Promise<MessagingExtensionResult> {

    try {
        const queryText = query.parameters.queryText;
        const response = await fetch(
            `https://services.odata.org/V4/Northwind/Northwind.svc/Products` +
            `?$filter=startswith(tolower(ProductName),tolower('${queryText}'))` +
            `&$orderby=ProductName&$top=20`
        );
        const responseData = await response.json() as { value: NorthwindProduct[] }

        const attachments = [];
        responseData.value.forEach((product) => {

            const iconUrl = `https://picsum.photos/seed/${product.CategoryID}/50`;
            const imageUrl = `https://picsum.photos/seed/${product.ProductID}/300`;

            const itemAttachment = CardFactory.heroCard(product.ProductName);
            const previewAttachment = CardFactory.thumbnailCard(product.ProductName, [iconUrl]);

            const value: ProductMEItem = {
                meType: meType,
                iconUrl: iconUrl,
                imageUrl: imageUrl,
                ProductID: product.ProductID,
                ProductName: product.ProductName || "unknown",
                SupplierID: product.SupplierID,
                CategoryID: product.CategoryID,
                QuantityPerUnit: product.QuantityPerUnit || "",
                UnitPrice: product.UnitPrice,
                UnitsInStock: product.UnitsInStock,
                UnitsOnOrder: product.UnitsOnOrder,
                ReorderLevel: product.ReorderLevel,
                Discontinued: product.Discontinued
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

    const item: ProductMEItem = selectedValue;
    const cardAttachment = await getCardAttachment(item);

    return {
        type: "result",
        attachmentLayout: "list",
        attachments: [cardAttachment]
    };

};
