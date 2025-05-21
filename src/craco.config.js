const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Cambia la ruta de entrada
      webpackConfig.entry = './src/index.tsx';
      
      // Actualiza las rutas de resolución
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, './'),
        'node_modules'
      ];
      
      return webpackConfig;
    }
  },
  paths: {
    appIndexJs: path.resolve(__dirname, 'index.tsx'),
    appSrc: path.resolve(__dirname, './')
  }
};
