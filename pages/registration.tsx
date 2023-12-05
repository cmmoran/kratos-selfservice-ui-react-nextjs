import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { CardTitle } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

// Import render helpers
import { ActionCard, CenterLink, Flow, MarginCard } from "../pkg"
import { handleFlowError } from "../pkg/errors"
// Import the SDK
import ory from "../pkg/sdk"

// Renders the registration page
const Registration: NextPage = () => {
  const router = useRouter()

  const { isReady } = router
  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<RegistrationFlow>()

  // Get ?flow=... from the URL
  const { flow: flowId, return_to: returnTo } = router.query

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      const controller = new AbortController()
      ory
        .getRegistrationFlow(
          { id: String(flowId) },
          { signal: controller.signal },
        )
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          if (!controller.signal.aborted) {
            setFlow(data)
          }
        })
        .catch((err) => {
          if (!controller.signal.aborted) {
            return handleFlowError(router, "registration", setFlow)(err)
          }

          return Promise.reject(err)
        })

      return () => controller.abort()
    }

    const controller = new AbortController()
    // Otherwise we initialize it
    ory
      .createBrowserRegistrationFlow(
        {
          returnTo: returnTo ? String(returnTo) : undefined,
        },
        { signal: controller.signal },
      )
      .then(({ data }) => {
        if (!controller.signal.aborted) {
          setFlow(data)
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          return handleFlowError(router, "registration", setFlow)(err)
        }

        return Promise.reject(err)
      })

    return () => controller.abort()
  }, [flowId, router, isReady, returnTo, flow])

  const onSubmit = async (values: UpdateRegistrationFlowBody) => {
    await router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/registration?flow=${flow?.id}`, undefined, { shallow: true })

    ory
      .updateRegistrationFlow({
        flow: String(flow?.id),
        updateRegistrationFlowBody: values,
      })
      .then(async ({ data }) => {
        // If we ended up here, it means we are successfully signed up!
        //
        // You can do cool stuff here, like having access to the identity which just signed up:
        console.log("This is the user session: ", data, data.identity)

        // continue_with is a list of actions that the user might need to take before the registration is complete.
        // It could, for example, contain a link to the verification form.
        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case "show_verification_ui":
                await router.push("/verification?flow=" + item.flow.id)
                return
            }
          }
        }

        // If continue_with did not contain anything, we can just return to the home page.
        await router.push(flow?.return_to || "/")
      })
      .catch(handleFlowError(router, "registration", setFlow))
      .catch((err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data as RegistrationFlow)
          return
        }

        return Promise.reject(err)
      })
  }
  const loginPath = router.basePath ? `${router.basePath}/login` : "/login"

  return (
    <>
      <Head>
        <title>Create account - Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>
      <MarginCard>
        <CardTitle>Create account</CardTitle>
        <Flow onSubmit={onSubmit} flow={flow} />
      </MarginCard>
      <ActionCard>
        <CenterLink data-testid="cta-link" href={loginPath}>
          Sign in
        </CenterLink>
      </ActionCard>
    </>
  )
}

export default Registration
