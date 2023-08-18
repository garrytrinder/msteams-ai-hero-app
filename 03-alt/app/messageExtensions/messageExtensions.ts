import { MessageExtensionTokenResponse, OnBehalfOfCredentialAuthConfig, OnBehalfOfUserCredential, handleMessageExtensionQueryWithSSO } from "@microsoft/teamsfx";
import { TeamsActivityHandler, TurnContext } from "botbuilder";
import config from "../../config";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { getAccessToken, msalClient } from "../auth";
import { User } from "@microsoft/microsoft-graph-types";
import { UserListItem } from "../models/cards";

const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
    authorityHost: "https://login.microsoftonline.com",
    clientId: config.aadAppId,
    clientSecret: config.aadAppClientSecret,
    tenantId: "common"
};

const initialLoginEndpoint = `${config.appEndpoint}/auth-start.html`;

export class MessageExtensions extends TeamsActivityHandler {

    constructor() {
        super();
    }

    public async handleTeamsMessagingExtensionQuery(
        context: TurnContext,
        query: any
    ): Promise<any> {
        const { value: queryText } = query.parameters[0];
        const { count } = query.queryOptions;

        return await handleMessageExtensionQueryWithSSO(
            context,
            oboAuthConfig,
            initialLoginEndpoint,
            ["User.Read.All", "User.Read"],
            async (token: MessageExtensionTokenResponse) => {
                const authToken = (await getAccessToken(msalClient, token.ssoToken, ["User.Read.All", "User.Read"])).accessToken;
                const usersRequest = await fetch(`https://graph.microsoft.com/v1.0/users?$filter=startswith(displayName,'${queryText}')&$orderby=displayName&$count=true&$top=${count}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        ConsistencyLevel: "eventual"
                    }
                });

                const usersData = await usersRequest.json();

                const usersCardData = await Promise.all(usersData.value.map(async (user: User): Promise<UserListItem> => {
                    const userPhotoRequest = await fetch(`https://graph.microsoft.com/v1.0/users/${user.userPrincipalName}/photo/$value`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`
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
            }
        );
    }
}