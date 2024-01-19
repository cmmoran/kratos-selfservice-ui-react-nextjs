import { CardTitle, CodeBox, H3, P } from "@ory/themes"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"

import { ActionCard, CenterLink, MarginCard } from "../pkg"

interface PageProps {
  xPayload: string | undefined
}
export const getServerSideProps: ({ req }: { req: any }) => Promise<{
  props: {
    xPayload: string | undefined
  }
}> = async ({ req }) => {
  const xPayload = req.headers["x-payload"] ?? ""
  return {
    props: {
      xPayload: xPayload,
    },
  }
}
const RemoteAuth: NextPage<PageProps> = ({ xPayload }) => {
  const payload = `X-Payload: ${xPayload ? String(xPayload) : "unknown"}`

  return (
    <div className={"container-fluid"}>
      <Head>
        <title>Legacy remote auth Example</title>
        <meta name="description" content="Legacy" />
      </Head>
      <MarginCard wide>
        <CardTitle>Remote Auth</CardTitle>
        <P>
          This is an example endpoint protected by an external authorizer via
          remote_json
        </P>
        <div className="row">
          <div className="col-md-12">
            <div className="box">
              <H3> Header</H3>
              <CodeBox
                className="codebox"
                data-testid="session-content"
                code={`${payload}`}
              />
            </div>
          </div>
        </div>
      </MarginCard>
      <ActionCard>
        <Link href="/" passHref>
          <CenterLink>Go back</CenterLink>
        </Link>
      </ActionCard>
    </div>
  )
}
export default RemoteAuth
