const config = {
  aadAppId: process.env.AAD_APP_CLIENT_ID,
  aadAppClientSecret: process.env.AAD_APP_CLIENT_SECRET,
  appEndpoint: process.env.APP_ENDPOINT,
  blobConnectionString: process.env.BLOB_STORAGE_CONNECTION_STRING,
  blobContainerName: process.env.BLOB_STORAGE_CONTAINER_NAME
};

export default config;
