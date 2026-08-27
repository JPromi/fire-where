import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    // API
    apiBaseUrl: process.env.API_BASE_URL,
    
    // App Information
    infoAppWebUrl: process.env.INFO_APP_WEB_URL,
    infoAppName: process.env.INFO_APP_NAME,
    infoDeveloperName: process.env.INFO_DEVELOPER_NAME,
    infoDeveloperWebsite: process.env.INFO_DEVELOPER_WEBSITE,

    infoAppFeedbackEmail: process.env.INFO_APP_FEEDBACK_EMAIL,
    infoAppRepoName: process.env.INFO_APP_REPO_NAME,
    infoAppRepoUrl: process.env.INFO_APP_REPO_URL,
    infoAppImprintUrl: process.env.INFO_APP_IMPRINT_URL,
    infoAppPrivacyUrl: process.env.INFO_APP_PRIVACY_URL,

    // Build information
    buildVersion: process.env.VERSION_NAME,
    buildNumber: process.env.VERSION_CODE || process.env.BUILD_NUMBER,
  },
});
