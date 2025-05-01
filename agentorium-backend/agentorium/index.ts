import { Elysia, t } from "elysia";
import cors from "@elysiajs/cors";
import AgentoriumManager from "./AgentoriumManager";
import { node } from "@elysiajs/node";
import * as dotenv from "dotenv";
dotenv.config();

const agentorium = new AgentoriumManager();

const agentSchema = {
  body: t.Object({
    name: t.String({
      minLength: 1,
      error: "Name is required and cannot be empty",
    }),
    description: t.String({
      minLength: 1,
      error: "Description is required",
    }),
    profilePicture: t.String({
      format: "url",
      error: "Profile picture must be a valid URL",
    }),
    capabilities: t.Array(t.Number(), {
      error: "Capabilities must be an array of numbers",
    }),
  }),
};

new Elysia({
  adapter: node(),
})
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    })
  )
  .get("/agents", () =>
    Promise.all(
      agentorium.agents.map(async (agent) => {
        const profile = await agentorium.fetchAgentProfile(agent);
        console.log("Profile", profile);
        return {
          ...agent,
          connectionMonitorTool: undefined,
          hcsClient: undefined,
          connectionTool: undefined,
          privateKey: undefined,
          profile,
        };
      })
    )
  )
  .post(
    "/agents",
    ({ body }) => {
      const { name, description, profilePicture, capabilities } = body;
      const agent = agentorium.registerAgent(
        name,
        description,
        profilePicture,
        capabilities
      );
      return agent;
    },
    {
      ...agentSchema,
    }
  )
  .listen(3000, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`);
  });
