module.exports = {
  apps : [{
    name: 'HTTP',
    script: './server.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    // args: 'one two',

    wait_ready: true ,
    instances: 1,
    mode: "fork" ,
    autorestart: true,
    watch: false,
    max_memory_restart: '50M',
    env: {
      PORT: 3000 ,
      NODE_ENV: 'development'
    },
    env_production: {
      PORT: 443 ,
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
