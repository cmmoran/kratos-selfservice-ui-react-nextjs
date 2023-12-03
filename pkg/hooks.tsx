import { AxiosError } from "axios"
import { NextRouter } from "next/router"
import { useEffect, useState } from "react"

import ory from "./sdk"

// Returns a function which will log the user out
export function LogoutLink(router: NextRouter) {
  const [logoutToken, setLogoutToken] = useState<string>("")
  const { aal, refresh } = router.query

  useEffect(() => {
    const controller = new AbortController()
    ory
      .createBrowserLogoutFlow({}, { signal: controller.signal })
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return
        }

        // Something else happened!
        return Promise.reject(err)
      })
    return () => {
      controller.abort()
    }
  }, [aal, refresh])

  return () => {
    if (logoutToken) {
      ory
        .updateLogoutFlow({ token: logoutToken })
        .then(() => router.push("/login"))
        .then(() => router.reload())
    }
  }
}
