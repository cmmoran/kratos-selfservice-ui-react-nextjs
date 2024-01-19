import { Session } from "@ory/client"
import { Card, CardTitle, P, H2, H3 } from "@ory/themes"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { DocsButton, MarginCard, LogoutLink } from "../pkg"
import ory from "../pkg/sdk"

const Home: NextPage = () => {
  const [session, setSession] = useState<Session>()
  const [hasSession, setHasSession] = useState<boolean>(false)
  const router = useRouter()
  const onLogout = LogoutLink(router)

  useEffect(() => {
    const controller = new AbortController()
    ory
      .toSession({ tokenizeAs: "synergy-jwt" }, { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) {
          setSession(data)
          setHasSession(true)
        }
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          case 422:
            // This status code is returned when we are trying to
            // validate a session which has not yet completed
            // its second factor
            return router.push("/login?aal=aal2")
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })

    return () => controller.abort()
  }, [router])

  return (
    <div className={"container-fluid"}>
      <Head>
        <title>Ory NextJS Integration Example</title>
        <meta name="description" content="NextJS + React + Vercel + Ory" />
      </Head>

      <MarginCard wide>
        <CardTitle>Welcome to SSO</CardTitle>

        <div className="row">
          <div className="col-md-12">
            <div className="box">
              {hasSession ? (
                <H3>
                  Session ID: <b>{session?.id}</b>
                </H3>
              ) : (
                <H3>No Session Information</H3>
              )}
            </div>
          </div>
        </div>
      </MarginCard>

      <Card wide>
        <H2>Other User Interface Screens</H2>
        <div className={"row"}>
          <DocsButton
            unresponsive
            testid="login"
            href="/login"
            disabled={hasSession}
            title={"Login"}
            basePath={router.basePath}
          />
          <DocsButton
            unresponsive
            testid="sign-up"
            href="/registration"
            disabled={hasSession}
            title={"Sign Up"}
            basePath={router.basePath}
          />
          <DocsButton
            unresponsive
            testid="recover-account"
            href={"/recovery"}
            disabled={hasSession}
            title="Recover Account"
            basePath={router.basePath}
          />
          <DocsButton
            unresponsive
            testid="verify-account"
            href="/verification"
            title="Verify Account"
            basePath={router.basePath}
          />
          <DocsButton
            unresponsive
            testid="account-settings"
            href="/settings"
            disabled={!hasSession}
            title={"Account Settings"}
            basePath={router.basePath}
          />
          <DocsButton
            unresponsive
            testid="transfer"
            href="/api/transfer"
            disabled={!hasSession}
            title={"Initiate Transfer"}
            basePath={router.basePath}
          />
          <DocsButton
            unresponsive
            testid="remote"
            href="/remote"
            disabled={!hasSession}
            title={"Initiate (remote) auth"}
            basePath={router.basePath}
          />
          <DocsButton
            unresponsive
            testid="remote_json"
            href="/remote_json"
            disabled={!hasSession}
            title={"Initiate (remote_json) auth"}
            basePath={router.basePath}
          />
          <DocsButton
            unresponsive
            testid="logout"
            onClick={onLogout}
            disabled={!hasSession}
            title={"Logout"}
          />
        </div>
      </Card>
    </div>
  )
}

export default Home
