import RedisStreamHelper from "redis-stream-helper"
import { enrichStandardFields } from "atom-helper"

const { listenForMessages, createStreamGroup, addStreamData, addListener } =
  RedisStreamHelper(process.env.REDIS_PORT, process.env.REDIS_HOST)

await createStreamGroup("atom:email:trigger")
await createStreamGroup("atom:email:complete")
addListener("atom:email:trigger")

const run = async () => {
  await listenForMessages(async (key, streamId, data) => {
    enrichStandardFields("email", data, addStreamData)
    console.log("email executed with data", key, streamId, data)
  })
  run()
}

run()
