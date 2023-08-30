import adapter from "../../adapter";
import app from "../app";
import { MessageExtensions } from "../messageExtensions/messageExtensions";

const messageExtensions = new MessageExtensions();

export const postMessages = async (req, res) => {
    await adapter.process(req, res, async (context) => {
        await app.run(context);
        await messageExtensions.run(context);
    });
};