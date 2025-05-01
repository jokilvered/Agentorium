import { HCS10Client } from "../src/hcs10/HCS10Client";
import {
  AcceptConnectionRequestTool,
  ConnectionMonitorTool,
  ConnectionTool,
  initializeHCS10Client,
  InitiateConnectionTool,
  IStateManager,
  ListConnectionsTool,
  ManageConnectionRequestsTool,
  OpenConvaiState,
  RegisterAgentTool,
  RetrieveProfileTool,
} from "../src/index";

import fs from "fs";
import path from "path";

import { HederaAgentKit, createHederaTools } from "hedera-agent-kit";

import { Logger, ProfileResponse } from "@hashgraphonline/standards-sdk";

import DeFiPlugin from "./plugins/defi";
import { HbarPricePlugin } from "../src/plugins/hedera/HbarPricePlugin";

import { PluginRegistry, PluginContext } from "../src/plugins";
import * as dotenv from "dotenv";
import { ConversationTokenBufferMemory } from "langchain/memory";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { z } from "zod";
import { AccountId, PrivateKey } from "@hashgraph/sdk";

const AGENT_FILE_PATH = path.join("./agents.json");

// Type definitions for better code clarity
interface RegisteredAgent {
  name: string;
  accountId: string;
  inboundTopicId: string;
  outboundTopicId: string;
  profileTopicId?: string;
  privateKey: string;

  hcsClient?: HCS10Client; // Added this to store the client for each agent
  connectionTool?: ConnectionTool; // Added to store tool for connection handling
  connectionMonitorTool?: ConnectionMonitorTool; // Added to store tool for monitoring connections
}

dotenv.config();

class HCS10ClientManager {
  public hcsClient: HCS10Client;
  private connectionTool: ConnectionTool;
  public connectionMonitorTool: ConnectionMonitorTool;
  private registeredPlugins: PluginRegistry | null = null;
  private pluginSystemContext: PluginContext | null = null;
  public stateManager: IStateManager;

  private pluginContext: PluginContext | null = null;
  private pluginRegistry: PluginRegistry;

  public agents: RegisteredAgent[] = [];

  public currentAgent: RegisteredAgent | null = null;

  public hederaAgentkit: HederaAgentKit;

  constructor() {
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID!);
    const operatorKey = PrivateKey.fromStringDer(
      process.env.HEDERA_OPERATOR_KEY!
    );

    const publicKey = operatorKey.publicKey;

    const hederaAgentkit = new HederaAgentKit(
      operatorId.toString(),
      operatorKey.toStringRaw(),
      publicKey.toStringRaw(),
      "testnet"
    );

    this.hederaAgentkit = hederaAgentkit;

    this.stateManager = new OpenConvaiState();

    const initResult = initializeHCS10Client({
      stateManager: this.stateManager,
      clientConfig: {
        operatorId: process.env.HEDERA_OPERATOR_ID,
        operatorKey: process.env.HEDERA_OPERATOR_KEY,
        network: "testnet",
        useEncryption: false,
        registryUrl: "https://moonscape.tech",
      },
    });

    this.hcsClient = initResult.hcs10Client;

    if (!initResult.tools.connectionTool) {
      throw new Error("ConnectionTool failed to initialize.");
    }

    this.connectionTool = initResult.tools.connectionTool;
    this.stateManager.initializeConnectionsManager(
      this.hcsClient.standardClient
    );
    console.log("ConnectionsManager initialized with current client");

    this.connectionMonitorTool = new ConnectionMonitorTool({
      hcsClient: this.hcsClient,
      stateManager: this.stateManager,
    });

    const pluginContext = {
      client: this.hcsClient,
      logger: new Logger({ module: "PluginSystem" }),
      config: {
        weatherApiKey: process.env.WEATHER_API_KEY,
      },
    };

    this.pluginRegistry = new PluginRegistry(pluginContext);

    const agents = this.loadAgentsFromFile();
    if (agents) {
      for (const agent of agents) {
        this.initializeAgent(agent);
      }

      this.currentAgent = this.agents[0] || null;
    }
  }

  private initializeAgent(agent: RegisteredAgent) {
    const newAgent: RegisteredAgent = {
      name: agent.name,
      accountId: agent.accountId,
      inboundTopicId: agent.inboundTopicId,
      outboundTopicId: agent.outboundTopicId,
      profileTopicId: agent.profileTopicId,
      privateKey: agent.privateKey,
    };

    const hcsClient = new HCS10Client(
      newAgent.accountId,
      newAgent.privateKey,
      this.hcsClient.getNetwork(),
      {
        useEncryption: false,
        registryUrl: "https://moonscape.tech",
      }
    );

    const stateManager = new OpenConvaiState();

    stateManager.setCurrentAgent(newAgent);
    stateManager.initializeConnectionsManager(hcsClient.standardClient);

    const connectionTool = new ConnectionTool({
      client: hcsClient,
      stateManager: stateManager,
    });

    const connectionMonitorTool = new ConnectionMonitorTool({
      hcsClient: hcsClient,
      stateManager: stateManager,
    });

    // Assign the tools to the agent
    newAgent.hcsClient = hcsClient;
    newAgent.connectionTool = connectionTool;
    newAgent.connectionMonitorTool = connectionMonitorTool;

    this.listenForConnections(newAgent);
    this.listenForMessages(newAgent);
    this.agents.push(newAgent);
  }

  private async listenForConnections(agent: RegisteredAgent) {
    console.log(
      `Agent ${agent.name} is now listening for incoming connection requests...`
    );

    // Set up a loop with delay (e.g., every 10 seconds) for checking connections
    const checkInterval = 10000; // 10 seconds interval between connection checks

    const listenLoop = async () => {
      try {
        const incomingConnection = await agent.connectionMonitorTool!.invoke({
          acceptAll: true,
          monitorDurationSeconds: 60,
        });

        console.log(incomingConnection);
      } catch (error) {
        console.error(
          `Error while listening for connections for Agent ${agent.name}:`,
          error
        );
      }

      // Re-run the loop after the specified interval
      setTimeout(listenLoop, checkInterval);
    };

    // Start the listening loop for this agent
    listenLoop();
  }

  private async listenForMessages(agent: RegisteredAgent) {
    console.log(
      `Agent ${agent.name} is now listening for incoming messages...`
    );

    const checkInterval = 10000; // 10 seconds interval between message checks

    const listenLoop = async () => {
      try {
        const messageResponse = await this.hcsClient.getMessages(
          agent.inboundTopicId
        );
        const messages = messageResponse?.messages || [];

        if (messages.length > 0) {
          for (const msg of messages) {
            if (msg.op === "connection_created") {
              const profileAgent = await this.fetchAgentProfile(agent);
              const agentExecutor = await this.setupAgentExecutor(agent);
              await this.handleConnectionCreated(
                msg,
                agent,
                profileAgent,
                agentExecutor
              );
            }
          }
        }
      } catch (error) {
        console.error(
          `Error while listening for messages for Agent ${agent.name}:`,
          error
        );
      }

      // Re-run the loop after the specified interval
      setTimeout(listenLoop, checkInterval);
    };

    // Start the listening loop for this agent
    listenLoop();
  }

  /**
   * Loads and initializes all plugins for the system
   */
  public async loadPlugins(): Promise<void> {
    try {
      console.log("\nAutomatically initializing plugin system...");
      const weatherApiKey = process.env.WEATHER_API_KEY;

      this.pluginSystemContext = {
        client: this.hcsClient,
        logger: new Logger({
          module: "WeatherPlugin",
        }),
        config: {
          weatherApiKey: weatherApiKey,
        },
      };

      this.registeredPlugins = new PluginRegistry(this.pluginSystemContext);

      // Initialize and register all plugins in one place
      const defiPlugin = new DeFiPlugin();
      const hbarPricePlugin = new HbarPricePlugin();

      await this.registeredPlugins.registerPlugin(defiPlugin);
      await this.registeredPlugins.registerPlugin(hbarPricePlugin);

      console.log("Plugins initialized successfully.");
    } catch (error) {
      console.error("Error initializing plugin system:", error);
      console.log("Continuing without plugin functionality.");
    }
  }
  /**
   * Registers a new agent on the network based on user input
   * @param name The name of the agent
   * @param description A description of the agent
   * @param profilePicture The URL of the profile picture
   * @param capabilities A list of capabilities for the agent
   */
  public async registerAgent(
    name: string,
    description: string,
    profilePicture: string,
    capabilities: number[]
  ): Promise<void> {
    const registerTool = new RegisterAgentTool(
      this.hcsClient,
      this.stateManager
    );

    const toolInput: z.infer<typeof registerTool.schema> = {
      name: name,
      description: description,
      model: "gpt-4o",
      type: "autonomous",
      capabilities: capabilities,
      profilePicture: profilePicture,
    };

    function generateSymbolFromName(name: string): string {
      // Step 1: Split the name into words
      const words = name.split(" ");

      // Step 2: Extract the first letter from each word and capitalize it
      const symbol = words.map((word) => word.charAt(0).toUpperCase()).join("");

      // Step 3: Optionally, ensure the symbol length does not exceed 5 characters
      const maxLength = 5;
      const truncatedSymbol = symbol.substring(0, maxLength);

      return truncatedSymbol;
    }

    try {
      const resultString = await registerTool.invoke(toolInput);
      const result = JSON.parse(resultString);
      console.log("Agent registered successfully:", result);
      this.currentAgent = result;
      this.saveAgentToFile(result);
      this.initializeAgent(result);

      const symbol = generateSymbolFromName(name);

      await this.hederaAgentkit.createFT(
        {
          name: name,
          symbol: symbol,
          initialSupply: 1000000,
          decimals: 2,
          maxSupply: 10000000,
        },
        false
      );
    } catch (error) {
      console.error("Error registering agent:", error);
    }
  }

  public saveAgentToFile(agentData: RegisteredAgent): void {
    try {
      let existingAgents: RegisteredAgent[] = [];
      if (fs.existsSync(AGENT_FILE_PATH)) {
        // Read the existing file and parse its contents
        const fileData = fs.readFileSync(AGENT_FILE_PATH, "utf-8");
        existingAgents = JSON.parse(fileData);
      }

      existingAgents.push(agentData);

      fs.writeFileSync(
        AGENT_FILE_PATH,
        JSON.stringify(existingAgents, null, 2)
      );
      console.log("Agent saved successfully.");
    } catch (error) {
      console.error("Error saving agent to file:", error);
    }
  }

  public loadAgentsFromFile(): RegisteredAgent[] | null {
    try {
      if (!fs.existsSync(AGENT_FILE_PATH)) {
        console.log("No agent data file found.");
        return null;
      }

      const fileData = fs.readFileSync(AGENT_FILE_PATH, "utf-8");
      const agents: RegisteredAgent[] = JSON.parse(fileData);
      console.log("Agents loaded successfully.");
      return agents;
    } catch (error) {
      console.error("Error loading agents from file:", error);
      return null;
    }
  }

  /**
   * Handle a new connection creation message
   */
  private async handleConnectionCreated(
    msg: Partial<{
      p: string;
      op: string;
      operator_id: string;
      data: string;
      sequence_number: number;
      consensus_timestamp: string;
      created: Date;
      timestamp: number;
      connection_topic_id: string;
      connected_account_id: string;
      connection_id: number;
      m: string;
    }>,
    agent: RegisteredAgent,
    profileAgent: ProfileResponse | null,
    agentExecutor: AgentExecutor
  ): Promise<void> {
    // Get messages from the connection topic
    const messages = await agent.hcsClient!.getMessages(
      msg.connection_topic_id as string
    );

    const lastMessage = messages.messages.at(messages.messages.length - 1);

    if (lastMessage?.operator_id === msg.operator_id) {
      return;
    }

    const messagesFiltered = messages.messages.filter(
      (message) => message.operator_id !== msg.operator_id
    );

    // Extract message text
    const messageInput =
      messagesFiltered
        .map((message) => JSON.parse(message.data).text)
        .at(messagesFiltered.length - 1) || "Please introduce yourself";

    // Prepare agent input
    const name = profileAgent?.profile?.display_name || "Assistant";
    const bioAgent = profileAgent?.profile?.bio || "";

    // Generate response
    const result = await agentExecutor.invoke({
      input: `
      You are a helpful assistant managing Hedera HCS-10 connections and messages. 
      Your are ${name} and your bio is ${bioAgent}.
      ${messageInput}
    `,
    });

    await agent.hcsClient!.sendMessage(
      msg.connection_topic_id as string,
      result.output
    );
  }
  /**
   * Configures the client for a specific agent using the provided configuration
   */
  public configureAgentClient(config: RegisteredAgent): RegisteredAgent {
    // Create agent object
    const newAgent: RegisteredAgent = {
      name: config.name,
      accountId: config.accountId,
      inboundTopicId: config.inboundTopicId,
      outboundTopicId: config.outboundTopicId,
      profileTopicId: config.profileTopicId,
      privateKey: config.privateKey,
    };

    // Reconfigure client and tools for the new agent
    this.hcsClient = new HCS10Client(
      newAgent.accountId,
      newAgent.privateKey,
      this.hcsClient.getNetwork(),
      {
        useEncryption: false,
        registryUrl: process.env.REGISTRY_URL || "https://moonscape.tech",
      }
    );

    this.stateManager.setCurrentAgent(newAgent);
    this.stateManager.initializeConnectionsManager(
      this.hcsClient.standardClient
    );

    this.connectionTool = new ConnectionTool({
      client: this.hcsClient,
      stateManager: this.stateManager,
    });

    this.connectionMonitorTool = new ConnectionMonitorTool({
      hcsClient: this.hcsClient,
      stateManager: this.stateManager,
    });

    this.currentAgent = newAgent;

    return newAgent;
  }

  /**
   * Fetch the profile for the given agent
   */
  private async fetchAgentProfile(
    agent: RegisteredAgent | null
  ): Promise<ProfileResponse | null> {
    if (!agent?.accountId) {
      return null;
    }

    const profileAgent = await this.hcsClient.getAgentProfile(agent.accountId);
    return profileAgent;
  }

  /**
   * Set up the agent executor with all necessary tools and plugins
   */
  private async setupAgentExecutor(
    agent: RegisteredAgent
  ): Promise<AgentExecutor> {
    // This variable defines the personality and guidelines for the agent.
    // It's used to direct its behavior and interactions with users.
    const AGENT_PERSONALITY = `You are a helpful assistant managing Hedera HCS-10 connections and messages.
You have access to tools for registering agents, finding registered agents, initiating connections, listing active connections, sending messages over connections, and checking for new messages.
The current agent you are operating as is configured via environment variables (OPERATOR_ID), but can switch if a new agent is registered.
When asked to perform an action, use the available tools. Ask for clarification if needed.
Be concise and informative in your responses.

You also have access to a plugin system that provides additional tools for various functionalities:
- Weather tools: Get current weather and weather forecasts for locations
- DeFi tools: Get token prices, check token balances, and simulate token swaps
- Hedera tools: Get the current HBAR price

*** IMPORTANT TOOL SELECTION RULES ***
- To REGISTER a new agent, use 'register_agent'.
- To FIND existing registered agents in the registry, use 'find_registrations'. You can filter by accountId or tags.
- To START a NEW connection TO a specific target agent (using their account ID), ALWAYS use the 'initiate_connection' tool.
- To LISTEN for INCOMING connection requests FROM other agents, use the 'monitor_connections' tool (it takes NO arguments).
- To SEND a message to a specific agent, use the 'send_message_to_connection' tool.
- To ACCEPT incoming connection requests, use the 'accept_connection_request' tool.
- To MANAGE and VIEW pending connection requests, use the 'manage_connection_requests' tool.
- To CHECK FOR *NEW* messages since the last check, use the 'check_messages' tool.
- To GET THE *LATEST* MESSAGE(S) in a conversation, even if you might have seen them before, use the 'check_messages' tool and set the parameter 'fetchLatest: true'. You can optionally specify 'lastMessagesCount' to get more than one latest message (default is 1).
- For WEATHER information, use the appropriate weather plugin tools.
- For DeFi operations, use the appropriate DeFi plugin tools.
- For the CURRENT HBAR PRICE, use the 'getHbarPrice' tool.
- Do NOT confuse these tools.

Remember the connection numbers when listing connections, as users might refer to them.`;

    // Ensure API keys are loaded from environment variables in production
    const llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-mini-2024-07-18",
      temperature: 0,
    });

    const memory = new ConversationTokenBufferMemory({
      llm: llm,
      memoryKey: "chat_history",
      returnMessages: true,
      outputKey: "output",
      maxTokenLimit: 1000,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", AGENT_PERSONALITY],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const hcsClient = agent.hcsClient!;
    const stateManager = this.stateManager;

    // Initialize all core tools
    const coreTools = this.createCoreTools(hcsClient, stateManager);

    // Create the agent
    const agentLangchain = await createOpenAIToolsAgent({
      llm,
      tools: coreTools,
      prompt,
    });

    // Get all plugin tools and combine with core tools
    const pluginTools = this.pluginRegistry.getAllTools();
    const hederaAgentKitTools = createHederaTools(this.hederaAgentkit);

    const combinedTools = [
      ...coreTools,
      ...pluginTools,
      ...hederaAgentKitTools,
    ];

    return new AgentExecutor({
      agent: agentLangchain,
      tools: combinedTools,
      memory,
      verbose: false,
    });
  }

  /**
   * Create the core set of tools used by the agent
   */
  private createCoreTools(hcsClient: HCS10Client, stateManager: IStateManager) {
    return [
      new RegisterAgentTool(hcsClient),
      new InitiateConnectionTool({ hcsClient, stateManager }),
      new ListConnectionsTool({ hcsClient, stateManager }),
      new ManageConnectionRequestsTool({ hcsClient, stateManager }),
      new AcceptConnectionRequestTool({ hcsClient, stateManager }),
      new RetrieveProfileTool(hcsClient),
    ];
  }
}

const main = async () => {
  const hcsClientManager = new HCS10ClientManager();

  // console.log('  0: TEXT_GENERATION - Generate coherent, human-like text');
  // console.log('  1: IMAGE_GENERATION - Create visual content based on prompts');
  // console.log(
  //   '  2: AUDIO_GENERATION - Synthesize speech, music, or soundscapes'
  // );
  // console.log('  3: VIDEO_GENERATION - Produce dynamic visual content');
  // console.log('  4: CODE_GENERATION - Produce code based on text prompts');
  // console.log('  5: LANGUAGE_TRANSLATION - Convert text between languages');
  // console.log(
  //   '  6: SUMMARIZATION_EXTRACTION - Distill content into concise summaries'
  // );
  // console.log(
  //   '  7: KNOWLEDGE_RETRIEVAL - Access and reason with structured data'
  // );
  // console.log('  8: DATA_INTEGRATION - Aggregate and visualize data sources');
  // console.log('  9: MARKET_INTELLIGENCE - Analyze financial and economic data');
  // console.log(' 10: TRANSACTION_ANALYTICS - Monitor and analyze transactions');
  // console.log(' 11: SMART_CONTRACT_AUDIT - Evaluate decentralized code');
  // console.log(
  //   ' 12: GOVERNANCE_FACILITATION - Support decentralized decision-making'
  // );
  // console.log(
  //   ' 13: SECURITY_MONITORING - Detect and respond to security threats'
  // );
  // console.log(' 14: COMPLIANCE_ANALYSIS - Ensure regulatory adherence');
  // console.log(
  //   ' 15: FRAUD_DETECTION - Identify and mitigate fraudulent activities'
  // );
  // console.log(
  //   ' 16: MULTI_AGENT_COORDINATION - Enable collaboration between agents'
  // );
  // console.log(
  //   ' 17: API_INTEGRATION - Connect with external systems and services'
  // );
  // console.log(
  //   ' 18: WORKFLOW_AUTOMATION - Automate routine tasks and processes'
  // );

  await hcsClientManager.registerAgent(
    "Market Trend Analyzer", // Name of the AI Agent
    "The Market Trend Analyzer is an advanced AI tool designed to monitor, analyze, and predict trends in the cryptocurrency market. Using cutting-edge machine learning algorithms, it evaluates historical price movements, social media sentiment, and real-time data to forecast market direction. This agent provides timely recommendations to help traders make informed decisions and stay ahead of market shifts. By leveraging big data, it offers insights into long-term trends, short-term opportunities, and potential risks.",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbaJhfaBQvDE0ffV_xQ0Y8nGN3BRNUDv9mYQ&s",
    [1, 2, 3, 4, 5] // Groups or categories the agent belongs to
  );
};

main()
  .then(() => {
    console.log("HCS10 Client Manager initialized successfully.");
  })
  .catch((error) => {
    console.error("Error initializing HCS10 Client Manager:", error);
  });
