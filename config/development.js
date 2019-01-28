'use strict'
// Do NOT use _ (Undescore keys) in params names

var wagner = require('wagner-core');
var Config = wagner.invoke(function(Config) {
  return Config;
});

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
  debug: true,
  logging: {
    format: 'tiny'
  },
  //  aggregate: 'whatever that is not false, because boolean false value turns aggregation off', //false
  aggregate: false,
  mongoose: {
    debug: false
  },
  hostname: 'http://localhost:3000',
  app: {
    name: 'Web online shop'
  },
  strategies: {
    local: {
      enabled: true
    },
    landingPage: '/',
    facebook: {
      clientID: Config.facebookClientId,
      clientSecret: Config.facebookClientSecret,
      callbackURL: '/api/auth/facebook/callback', //'http://localhost:3000/api/auth/facebook/callback',
      enabled: true
    },
    twitter: {
      clientID: 'DEFAULT_CONSUMER_KEY',
      clientSecret: 'CONSUMER_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
      enabled: false
    },
    github: {
      clientID: 'DEFAULT_APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      enabled: false
    },
    google: {
      clientID: 'DEFAULT_APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      enabled: false
    },
    linkedin: {
      clientID: 'DEFAULT_API_KEY',
      clientSecret: 'SECRET_KEY',
      callbackURL: 'http://localhost:3000/api/auth/linkedin/callback',
      enabled: false 
    }
  },
  emailFrom: Config.SENDEREMAILADDRESS, // sender address like ABC <abc@example.com>
  mailer: {
    service: Config.SERVICEPROVIDER, // Gmail, SMTP
    auth: {
      user: Config.EMAILID,
      pass: Config.EMAILPASSWORD
    },
    tls: {
        rejectUnauthorized: false //setting to unlock antivirus on local machine only
    }
  },

  sessionSecret: Config.SESSION_SECRET,
  secret: Config.SECRET
}

// Do NOT use _ (Undescore keys) in params names