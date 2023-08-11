const config = {
  botEndpoint: process.env.BOT_ENDPOINT,
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  blobConnectionString: process.env.BLOB_STORAGE_CONNECTION_STRING,
  blobContainerName: process.env.BLOB_STORAGE_CONTAINER_NAME,
  tableConnectionString: process.env.TABLE_STORAGE_CONNECTION_STRING,
};

export default config;
