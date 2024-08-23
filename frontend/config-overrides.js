const { override } = require('customize-cra');

   module.exports = override(
     (config) => {
       config.ignoreWarnings = [/Failed to parse source map/];
       return config;
     }
   );
