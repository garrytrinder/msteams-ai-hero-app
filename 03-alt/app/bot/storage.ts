import { BlobsStorage } from "botbuilder-azure-blobs";
import config from "../config";

const storage = new BlobsStorage(
    config.blobConnectionString,
    config.blobContainerName
);

export default storage;