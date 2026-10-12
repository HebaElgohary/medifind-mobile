// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add all file extensions to handle
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs', 'mjs'];
config.resolver.assetExts = [...config.resolver.assetExts, 'db', 'sqlite', 'png', 'jpg', 'jpeg', 'gif', 'webp'];

// Completely disable Hermes for web to avoid MIME type issues
const isWeb = process.env.PLATFORM_NAME === 'web';
config.transformer = {
  ...config.transformer,
  unstable_transformProfile: isWeb ? undefined : 'hermes-stable',
  minifierPath: isWeb ? undefined : require.resolve('metro-minify-terser'),
  minifierConfig: {},
  // Use Babel for web
  babelTransformerPath: isWeb ? require.resolve('metro-react-native-babel-transformer') : undefined,
};

// Fix MIME type issues for web
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Force JavaScript MIME type for bundle files
      if (req.url.endsWith('.bundle')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      
      // Add CORS headers for web
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      return middleware(req, res, next);
    };
  },
};

// Increase max workers for better performance
config.maxWorkers = 4;

// Add symlink resolution
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// Add watch folders
config.watchFolders = [path.resolve(__dirname, 'node_modules')];

module.exports = config; 