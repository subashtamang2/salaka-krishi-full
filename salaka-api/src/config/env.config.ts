/* eslint-disable prettier/prettier */
export default () => ({
  database_url: process.env.DATABASE_URL as string,
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 8000,
  salt: process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10,
  client: {
    clientUrl: process.env.CLIENT_URL as string,
    port: parseInt(process.env.CLIENT_PORT as string),
  },
  pagination: {
    pageSize: process.env.POST_PER_PAGE
      ? parseInt(process.env.POST_PER_PAGE)
      : 10,
    pageSizeSm: process.env.POST_PER_PAGE_SM
      ? parseInt(process.env.POST_PER_PAGE_SM)
      : 8,
  },
  jwt: {
    access_token_secret: process.env.JWT_SECRET as string,
    access_token_expiration: process.env.ACCESS_TOKEN_EXPIRY as string,
    refresh_token_secret:
      (process.env.REFRESH_TOKEN_SECRET as string) ||
      (process.env.JWT_SECRET as string),
    refresh_token_expiration: process.env.REFRESH_TOKEN_EXPIRY as string,
  },

  google: {
    google_redirect_url: process.env.GOOGLE_REDIRECT_URL as string,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    login_callback_url: process.env.GOOGLE_LOGIN_CALLBACK_URL as string,
    register_callback_url: process.env.GOOGLE_REGISTER_CALLBACK_URL as string,
  },
  facebook: {
    client_id: process.env.FACEBOOK_CLIENT_ID as string,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET as string,
    login_callback_url: process.env.FACEBOOK_LOGIN_CALLBACK_URL as string,
    register_callback_url: process.env.FACEBOOK_REGISTER_CALLBACK_URL as string,
  },
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY as string,
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY as string,
  },
  product: {
    recentDaysThreshold: process.env.RECENT_DAYS_FOR_NEW_PRODUCT
      ? parseInt(process.env.RECENT_DAYS_FOR_NEW_PRODUCT)
      : 7,
  },
});
