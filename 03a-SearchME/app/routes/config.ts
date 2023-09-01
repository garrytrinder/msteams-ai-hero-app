import config from "../../config";

export const getConfig = async (req, res) => {
    res.send(config);
};