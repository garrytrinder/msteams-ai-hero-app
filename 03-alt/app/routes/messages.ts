import adapter from "../../adapter";
import app from "../app";

export const postMessages = async (req, res) => {
    await adapter.process(req, res, async (context) => {
        await app.run(context);
    });
};