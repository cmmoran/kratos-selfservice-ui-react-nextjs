import jwt from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"

import format from "../../pkg/sdk/utils"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { authorization } = req.headers
  const returnToFormat = "/#type={type}&user={user}&id_token={id_token}"
  const token = (authorization ?? "Bearer invalid").split(" ")[1]
  const jwt_decoded = jwt.decode(token) as any
  const {
    agencies: { entries },
  } = jwt_decoded?.meta as any
  let rand = 0
  if (entries.length === 1) {
  } else {
    rand = Math.round(Math.random() * (entries.length - 1)) % entries.length
  }
  const id_token = {
    id_token: token,
    type: entries[rand].type,
    user: entries[rand].user,
  }
  res.redirect(302, format(returnToFormat, id_token))
}
