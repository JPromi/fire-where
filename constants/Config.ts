import Constants from "expo-constants";

export const CONFIG = {
  api: {
    baseUrl: Constants.expoConfig?.extra?.apiBaseUrl as string || null
  },
  informations: {
    developer: {
      name: Constants.expoConfig?.extra?.infoDeveloperName as string || 'Unknown',
      website: Constants.expoConfig?.extra?.infoDeveloperWebsite as string || null,
    },
    app: {
      webUrl: Constants.expoConfig?.extra?.infoAppWebUrl as string || null,
      name: Constants.expoConfig?.extra?.infoAppName as string || null,
      feedbackEmail: Constants.expoConfig?.extra?.infoAppFeedbackEmail as string || null,
      repositoryName: Constants.expoConfig?.extra?.infoAppRepoName as string || null,
      repositoryUrl: Constants.expoConfig?.extra?.infoAppRepoUrl as string || null,
      imprint: Constants.expoConfig?.extra?.infoAppImprintUrl as string || null,
      legal: Constants.expoConfig?.extra?.infoAppPrivacyUrl as string || null,
    }
  }
}