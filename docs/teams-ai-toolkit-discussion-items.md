# Teams AI Toolkit Discussion Items

This document is to gather feedback and items to discuss w/engineering as we go through the experience of building an app with many capabilities working together.

## Overall structure

## Message Extensions

#### ME001 - Item selected event correlation in Search ME

We love the way the SDK handles dispatching `query` events when multiple search ME's are present. It's great that we can pass in the ME's command ID from manifest and the SDK will dispatch to the right function for each ME.

~~~typescript
// If the ME's function matches the expected event handler's signature, you can pass it directly
app.messageExtensions.query('supplierQuery', SupplierME.query<ApplicationTurnState>);

// If not, then you can wrap it in a lambda
app.messageExtensions.query('customerQuery',
    (context: TurnContext, state: ApplicationTurnState, query: Query<Record<string, any>>):
        Promise<MessagingExtensionResult> => {
        return CustomerME.query(context, query);
    });
~~~

However there is no clear way to correlate the `selectItem` events. To do this we had to introduce a marker in the item definition (which is an "any" as defined in the SDK).

For example in **SupplierME.ts**, we export the marker value:

~~~typescript
export const meType = "supplierME";
~~~

and then add this value to each item

~~~typescript
const value: SupplierMEItem = {
    meType: meType,
    SupplierID: supplier.SupplierID,
    ...
~~~

Then the app has to know about this and do the dispatching via a `switch` statement.

~~~typescript
app.messageExtensions.selectItem((context: TurnContext, state: ApplicationTurnState, item: Record<string, any>):
    Promise<MessagingExtensionResult> => {
        switch (item.meType) {
            case SupplierME.meType: {
                return SupplierME.selectItem(context, item);
            }
            case CustomerME.meType: {
                return CustomerME.selectItem(context, item);
            }
            default: {
                return null;
            }
        }
});
~~~

It would be better if the `selectItem()` function mirrored the `query()` function and accepted a command ID so this extra code wouldn't be needed.

## Adaptive Cards

#### AC001 - Where is the SDK reference for @microsoft/adaptivecards-tools?