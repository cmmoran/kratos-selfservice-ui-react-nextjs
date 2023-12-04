/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath: `${process.env.BASE_PATH || ""}`,
  env: {
    COOKIE_DOMAIN: `${process.env.COOKIE_DOMAIN}`,
    THEME: `${process.env.THEME}`,
  },
}
