Microsoft = {};

OAuth.registerService('microsoft', 2, null, function(query) {
  var tokens = getTokens(query);
  var accessToken = tokens.access_token;
  console.log(']]]]')
  console.log(accessToken)
  console.log(tokens)
  console.log('---')
  var identity = getIdentity(accessToken);
  var expiresAt = (new Date).getTime()/1000 + tokens.expires_in; 

  return {
    serviceData: {
      id: identity.id,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity.emails.preferred,
      username: identity.login,
      expiresAt:expiresAt
    },
    options: {profile: {name: identity.name}}
  };
});

var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

var getTokens = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'microsoft'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://login.live.com/oauth20_token.srf", {
        headers: {
          Accept: 'application/json',
          "User-Agent": userAgent
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('microsoft', config),
          grant_type:'authorization_code',
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Microsoft. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Microsoft. " + response.data.error);
  } else {
    return response.data;
  }
};

var getIdentity = function (accessToken) {
  try {
    var response = HTTP.get(
      "https://apis.live.net/v5.0/me", {
        headers: {"User-Agent": userAgent}, 
        params: {access_token: accessToken}
      });
    return response.data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Microsoft. " + err.message),
                   {response: err.response});
  }
};


Microsoft.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
