const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "local" ? "/" : "/",
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
  devServer: {
    proxy: {
      "^/stf": {
        target: process.env.STF_API,
        changeOrigin: true,
        pathRewrite: { "^/stf": "/api" },
      },
      "^/stg": {
        target: process.env.STG_API,
        changeOrigin: true,
        pathRewrite: { "^/stg": "/api" },
      },
    },
  },
});
