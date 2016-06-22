Package.describe({
  name: "clarktlaugh:accounts-microsoft",
  summary: "Microsoft OAuth flow",
  version: "0.5.3",
  git: "https://github.com/clarktlaugh/meteor-accounts-microsoft.git"
});

Package.on_use(function(api) {
  api.versionsFrom("METEOR@0.9.2")
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('accounts-base', ['client', 'server']);
  api.use('service-configuration', ['client', 'server']);

  api.export('Microsoft');


  api.add_files(['onedrive_configure.html', 'onedrive_configure.js'],'client');

  api.add_files('onedrive_common.js', ['client','server']);
  api.add_files('onedrive_server.js', 'server');
  api.add_files('onedrive_client.js', 'client');
  api.add_files('onedrive_login_button.css', 'client');
});
