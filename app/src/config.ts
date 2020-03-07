export default {
  FRONTEND: process.env.VUE_APP_FRONTEND,
  API: `${process.env.VUE_APP_BACKEND}/.api`,
  AUTH: `${process.env.VUE_APP_BACKEND}/.auth`,
  AUTH_URL: function(provider: string) {
    return `${
     this.AUTH
    }/login/${provider}?post_login_redirect_url=${
      process.env.VUE_APP_FRONTEND
    }`;
  },
  LOGOUT_URL: `${
    process.env.VUE_APP_BACKEND
  }/.auth/logout?post_logout_redirect_uri=${process.env.VUE_APP_FRONTEND}`,
  FUNCTION_KEY: process.env.VUE_APP_FUNCTION_KEY
};
