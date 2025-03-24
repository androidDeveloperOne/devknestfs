import AWS from "aws-sdk";

AWS.config.update({
  region: "ap-south-1",
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "ap-south-1:ca4909c2-0a66-464a-9df2-08ec56c13df8",
  }),
});

export default AWS;
