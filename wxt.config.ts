import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage'],
    browser_specific_settings: {
      gecko: {
        id: 'rogernum@8kohan.dev',
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },
  },
});
