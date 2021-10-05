import RedisStreamHelper from "redis-stream-helper"
import { Piscina } from "piscina"

const piscina = new Piscina({
  filename: new URL("./worker.mjs", import.meta.url).href,
})

const { listenForMessages, createStreamGroup, addStreamData, addListener } =
  RedisStreamHelper(process.env.REDIS_PORT, process.env.REDIS_HOST)

await createStreamGroup("atom:email:trigger")
await createStreamGroup("atom:email:complete")
addListener("atom:email:trigger")

const run = async () => {
  await listenForMessages(async (key, streamId, data) => {
    await piscina.run({ key, streamId, data })
  })
  run()
}

run()
