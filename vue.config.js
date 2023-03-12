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
      "^/api": {
        target: process.env.STF_API,
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
      },
    },
  },
});
