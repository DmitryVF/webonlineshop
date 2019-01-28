'use strict'

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-prod',
  /**
   * Database options that will be passed directly to mongoose.connect
   */
  dbOptions: {
    /*
    server: {
        socketOptions: {
            keepAlive: 1
        },
        poolSize: 5
    },
    replset: {
      rs_name: 'myReplicaSet',
      poolSize: 5
    },
    db: {
      w: 1,
      numberOfRetries: 2
    }
    */
  },
  hostname: 'http://localhost:3000',
  app: {
    name: 'Web online shop'
  },
  logging: {
    format: 'combined'
  },
  strategies: {
    local: {
      enabled: true
    },
    landingPage: '/',
    facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      enabled: true
    },
    twitter: {
      clientID: "process.env.CONSUMER_KEY",
      clientSecret: 'process.env.CONSUMER_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
      enabled: false
    },
    github: {
      clientID: "process.env.APP_ID",
      clientSecret: "process.env.APP_SECRET",
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      enabled: false
    },
    google: {
      clientID: "process.env.APP_ID",
      clientSecret: "process.env.APP_SECRET",
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      enabled: false
    },
    linkedin: {
      clientID: "process.env.API_KEY",
      clientSecret: "process.env.SECRET_KEY",
      callbackURL: 'http://localhost:3000/api/auth/linkedin/callback',
      enabled: false
    }
  },
  emailFrom: process.env.SENDEREMAILADDRESS, // sender address like ABC <abc@example.com>
  mailer: {
    service: process.env.SERVICEPROVIDER,
    auth: {
      user: process.env.EMAILID,
      pass: process.env.EMAILPASSWORD
    }
  },
  sessionSecret: process.env.SESSION_SECRET ,
  secret: process.env.SECRET
}
