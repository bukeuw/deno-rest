import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./router.ts";

const port = Deno.env.get("PORT") || 8081;
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", (evt) => {
  console.log(`Server listen on port ${evt.port}`);
});

await app.listen({ port: +port });
