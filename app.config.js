import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    // API
    apiBaseUrl: process.env.API_BASE_URL,
    
    // App Information
    infoAppName: process.env.INFO_APP_NAME,
    infoDeveloperName: process.env.INFO_DEVELOPER_NAME,
    infoDeveloperWebsite: process.env.INFO_DEVELOPER_WEBSITE,

    infoAppFeedbackEmail: process.env.INFO_APP_FEEDBACK_EMAIL,
    infoAppRepoName: process.env.INFO_APP_REPO_NAME,
    infoAppRepoUrl: process.env.INFO_APP_REPO_URL,
    infoAppImprintUrl: process.env.INFO_APP_IMPRINT_URL,
    infoAppPrivacyUrl: process.env.INFO_APP_PRIVACY_URL,
  },
});
