//create and export config vars


//container for all the envs

var environments = {};

//staging (default) env
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
}

//productoin env
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
}

//determine which env to export
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export
module.exports = environmentToExport;
