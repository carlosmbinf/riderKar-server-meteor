module.exports = {
  apps : [{
    name: "RiderKAR",
    script: "npm start",
    env: {
      NODE_ENV: "development",
      "ROOT_URL": "https://vidkar.ddns.net/",
      "PORT": 3000,
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
