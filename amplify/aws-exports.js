const awsConfig = {
    Auth: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_example',
      userPoolWebClientId: 'example12345',
    },
    API: {
      endpoints: [
        {
          name: "multiTenantAPI",
          endpoint: "https://example.appsync-api.us-east-1.amazonaws.com/graphql",
          region: "us-east-1",
        },
      ],
    },
  };
  
  export default awsConfig;
  