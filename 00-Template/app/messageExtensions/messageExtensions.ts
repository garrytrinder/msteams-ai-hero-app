import { Application, Query } from '@microsoft/teams-ai';
import { ApplicationTurnState } from '../app';
import { OnBehalfOfCredentialAuthConfig, OnBehalfOfUserCredential, handleMessageExtensionQueryWithSSO } from '@microsoft/teamsfx';
import config from '../../config';
import { UserListItem } from '../models/cards';
import { AdaptiveCards } from '@microsoft/adaptivecards-tools';
import { User } from '@microsoft/microsoft-graph-types';
import { TurnContext } from 'botbuilder';

const setup = (app: Application<ApplicationTurnState>) => {

    app.messageExtensions.query("personQuery", async (context: TurnContext, state: ApplicationTurnState, query: Query<Record<string, any>>) => {
        const { queryText } = query.parameters;
        const { count } = query;

        const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
            authorityHost: "https://login.microsoftonline.com",
            tenantId: "common",
            clientId: config.aadAppId,
            clientSecret: config.aadAppClientSecret
        }
        const scopes = ["User.Read.All", "User.Read"];
        const loginEndpoint = `${config.appEndpoint}/auth-start.html`

        const result = await handleMessageExtensionQueryWithSSO(context, oboAuthConfig, loginEndpoint, scopes, async (token) => {
            const credential = new OnBehalfOfUserCredential(token.ssoToken, oboAuthConfig);
            const { token: graphToken}  = await credential.getToken(scopes);

            const usersRequest = await fetch(`https://graph.microsoft.com/v1.0/users?$filter=startswith(displayName,'${queryText}')&$orderby=displayName&$count=true&$top=${count}`, {
                headers: {
                    Authorization: `Bearer ${graphToken}`,
                    ConsistencyLevel: "eventual"
                }
            });

            const usersData = await usersRequest.json();

            const usersCardData = await Promise.all(usersData.value.map(async (user: User): Promise<UserListItem> => {
                const userPhotoRequest = await fetch(`https://graph.microsoft.com/v1.0/users/${user.userPrincipalName}/photo/$value`, {
                    headers: {
                        Authorization: `Bearer ${graphToken}`
                    }
                });

                const userPhotoBlob = await userPhotoRequest.blob();
                const userPhotoBuffer = await userPhotoBlob.arrayBuffer();

                return {
                    title: user.displayName,
                    subtitle: user.jobTitle,
                    text: user.mail,
                    images: [
                        {
                            url: `data:image/jpeg;base64,${Buffer.from(userPhotoBuffer).toString('base64')}`
                        }
                    ]
                };
            }));

            const template = await import('../adaptiveCards/userListItem.json');

            const cards = usersCardData.map((user: UserListItem) => { return AdaptiveCards.declare<UserListItem>(template).render(user); });

            return {
                composeExtension: {
                    type: 'result',
                    attachmentLayout: 'list',
                    attachments: cards.map((card: any) => { return { contentType: 'application/vnd.microsoft.card.thumbnail', content: card } })
                }
            };
        });

        if (result) {
            return result.composeExtension;
        }
    });
};

export { setup };

