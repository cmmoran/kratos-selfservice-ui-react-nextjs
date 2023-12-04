// @ory/integrations offers a package for integrating with NextJS.
import { config, createApiHandler } from "@ory/integrations/next-edge"

// We need to export the config.
export { config }

const cookieDomain = process.env.COOKIE_DOMAIN || undefined
// And create the API "bridge".
export default createApiHandler({
  fallbackToPlayground: false,
  // we require this since we are proxying the Ory requests through nextjs
  // Ory needs to know about our host to generate the correct urls for redirecting back between flows
  // For example between Login MFA and Settings
  forwardAdditionalHeaders: ["x-forwarded-host"],
  forceCookieDomain: cookieDomain ?? undefined,
})
