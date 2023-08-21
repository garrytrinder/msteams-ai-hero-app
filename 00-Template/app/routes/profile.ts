import { getAccessToken, msalClient } from "../auth";

export const postProfile = async (req: any, res: any) => {
    const { ssoToken, scopes } = JSON.parse(req.body);
    const token = (await getAccessToken(msalClient, ssoToken, scopes)).accessToken;
    const profile = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    res.send(await profile.json());
};