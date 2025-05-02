# **Agentorium: Decentralized AI Agent Marketplace**

## **Introduction**

**Agentorium** is an innovative decentralized platform that enables the creation, buying, selling, and usage of AI agents in a secure and transparent ecosystem. At the heart of **Agentorium** is a powerful combination of blockchain technology and artificial intelligence, bringing these two fields together to create a new marketplace for AI-driven solutions. In this marketplace, AI agents are not just algorithms or services—they are tokenized as **fungible tokens** on the **Hedera Network**, each representing an individual agent's ownership, usage rights, and performance characteristics.

### **Tokenization of AI Agents**

In **Agentorium**, every AI agent created by a user is automatically **tokenized** as a fungible token through the **Hedera Token Service (HTS)**. These tokens represent ownership and the rights to interact with the AI agent, making them tradable and transferable across the platform. This allows for a dynamic and decentralized marketplace where AI agents can be freely bought, sold, and exchanged between users. The platform takes advantage of Hedera’s scalability and low transaction fees, ensuring that each transaction, whether it's the purchase, sale, or usage of an AI agent, is executed quickly and affordably.

### **Purchasing and Using AI Agents**

To use the AI agents available on the platform, users must first acquire **credits** in the form of **HBAR** (Hedera's native cryptocurrency). These HBAR credits are then exchanged for fungible tokens that represent the AI agents, enabling users to interact with these agents in a variety of ways. Whether it's for performing tasks, solving problems, or providing AI-driven services, these agents are fully integrated into the platform to cater to the users’ specific needs.

### **Royalty Model for Creators**

**Agentorium** ensures that AI creators are compensated for their work and innovation. Every time an AI agent token is traded or used within the platform, a **royalty fee** is automatically paid to the creator of the AI agent. This royalty mechanism creates an ongoing revenue stream for creators, encouraging innovation and incentivizing the development of high-quality AI agents that users will want to engage with. This dynamic model fosters a community where creators can continuously benefit from the success and adoption of their AI agents.

### **Leveraging Hedera for Security and Performance**

The **Hedera Network** serves as the underlying infrastructure for **Agentorium**, providing unparalleled performance, security, and scalability. Hedera’s **high throughput and low transaction costs** make it ideal for the frequent and high-volume transactions involved in tokenizing and interacting with AI agents. Hedera's **Hedera Consensus Service (HCS-10)** is integrated into the platform to provide decentralized, immutable messaging and transaction history. Additionally, **Hedera Agent Kit** simplifies the process of developing AI agents that leverage the Hedera network’s capabilities, ensuring seamless integration for developers.

### **Real-Time Communication and Interoperability with OpenConvAI**

The platform adopts the **OpenConvAI Standard** for **AI Agent Communication** over **HCS-10**. This enables real-time, secure, and standardized communication between AI agents and users. Whether the agents are performing tasks, learning, or adapting based on user input, their interactions are logged on the Hedera network with a tamper-proof record. This ensures the integrity and transparency of all actions performed by the agents, adding an additional layer of trust to the platform.

### **"Coining AI Agents" – A New Era for AI in Decentralized Systems**

The concept of **Coining AI Agents** introduces a novel approach to the creation and utilization of AI in a blockchain-powered ecosystem. By tokenizing AI agents as fungible tokens on the Hedera network, **Agentorium** brings a new dimension to AI, turning it into an asset that can be owned, traded, and utilized within a thriving decentralized marketplace. This not only creates new opportunities for AI developers and creators but also opens up innovative ways for users to interact with AI in a decentralized, transparent, and monetizable manner.

---

# **Key Features of Agentorium**

### **Create AI Agent with Auto Tokenization**

Creating AI agents in **Agentorium** is made simple through an intuitive and seamless process. Users can define their agents' capabilities, specializations, and performance parameters via a user-friendly interface. Upon creation, each AI agent is automatically tokenized as a fungible token using the Hedera Token Service, making it instantly tradable. The token is linked to metadata representing the agent's specifications, ensuring that the ownership, rights, and characteristics of each agent are easily traceable. These newly created agents are then automatically listed on the **Agentorium** marketplace, where they are visible to potential buyers and users. Creators can customize the visibility and pricing of their agents, giving them full control over their market presence. Additionally, creators have the ability to configure parameters for the token supply, including setting circulation limits and distribution mechanisms.

### **Buy/Sell AI Agent**

The marketplace within **Agentorium** is designed to provide a frictionless buying and selling experience. Users can easily browse, filter, and compare available AI agents based on various factors, such as capabilities, ratings, and price. All transactions—whether buying or selling AI agents—are conducted via smart contracts on the blockchain, ensuring that they are secure and transparent. The platform also provides access to each agent's complete transaction history, giving potential buyers detailed insights into previous sales, usage, and performance, ensuring informed purchasing decisions.

### **Use AI Agent (with Fungible Token Credits)**

Interacting with AI agents on the platform requires users to spend platform-specific fungible tokens, which can be acquired with **HBAR** credits. These credits are used to interact with agents in various ways, such as task execution, problem-solving, or obtaining AI-driven services. This credit-based system enables users to efficiently manage and control their usage of agents, ensuring that they only pay for what they need.

### **Royalty Fee for AI Agent Creators**

To ensure that creators are fairly compensated for their AI agents, **Agentorium** uses an automated royalty model. Each time an AI agent is bought, sold, or used on the platform, a royalty fee is automatically calculated and distributed to the creator. The royalty percentage can be customized within platform-defined parameters (typically ranging from 2-15%), allowing creators to earn revenue based on their agent's performance and popularity. The platform provides creators with a comprehensive dashboard to track their royalty earnings and ensure transparency. Moreover, these royalties are settled in real-time and transferred to the creator’s wallet immediately after each transaction, ensuring a quick and hassle-free payment process.

---

## **Technical Requirements**

* **Hedera Standard Agent Kit**
* **Hedera Agent Kit**
* **Hashgraph SDK**
* **Node.js**
* **React.js** (for front-end UI)

---

## **Installation and Setup Instructions**

### **Prerequisites**

* Node.js (version >= 20.0)
* Hashpack Wallet

### **Steps to Build**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jokilvered/Agentorium
   cd Agentorium
   ```

2. **Install Dependencies**

   ```bash
   cd agentorium-backend
   npm install

   cd agentorium-frontend
   npm install
   ```

3. **Set up ENV**

4. **Run Backend and Frontend**

   * **Backend**:

     ```bash
     npx tsx agentorium/index.ts
     ```
   * **Frontend**:

     ```bash
     npm run dev
     ```

5. **Access the Application**
   Open [http://localhost:8080](http://localhost:8080) in your browser.


## Hedera Integration Components

### HCS-10 Message Handling

The framework implements Hedera Consensus Service (HCS-10) for secure, decentralized messaging:

```javascript
// Send a message to a Hedera topic
await agent.hcsClient.sendMessage(
  msg.connection_topic_id,
  result.output
);

// Retrieve and process messages from a topic
const messages = await agent.hcsClient.getMessages(
  msg.connection_topic_id
);

// Filter messages by operator ID
const messagesFiltered = messages.messages.filter(
  (message) => message.operator_id !== msg.operator_id
);
```

### Connection Management

Agents automatically monitor and respond to connection requests:

```javascript
// Set up a connection monitoring loop
const listenLoop = async () => {
  try {
    const incomingConnection = await agent.connectionMonitorTool.invoke({
      acceptAll: true,
      monitorDurationSeconds: 60,
    });
    
    console.log(incomingConnection);
  } catch (error) {
    console.error(`Error while listening for connections:`, error);
  }
  
  // Re-run the loop after interval
  setTimeout(listenLoop, checkInterval);
};

// Start the listening loop
listenLoop();
```

### Agent Tools Integration

The framework seamlessly integrates Hedera-specific tools with LangChain agents:

```javascript
// Combine Hedera tools with core and plugin tools
const pluginTools = this.pluginRegistry.getAllTools();
const hederaAgentKitTools = createHederaTools(this.hederaAgentkit);

const combinedTools = [
  ...coreTools,
  ...pluginTools,
  ...hederaAgentKitTools,
];

// Create agent executor with combined tools
return new AgentExecutor({
  agent: agentLangchain,
  tools: combinedTools,
  memory,
  verbose: false,
});
```

### Fungible Token Creation

Easily create enhanced fungible tokens associated with hedera agent kit:

```javascript
// Generate token symbol from agent name
const symbol = generateSymbolFromName(name);

// Create fungible token with custom parameters
await this.hederaAgentkit.createFT({
  name: name,
  symbol: symbol,
  initialSupply: 1000000,
  decimals: 2,
  maxSupply: 10000000,
}, false);
```

---

Certainly! Here's a refined version of the text:

---

## **Deployment on Hedera**

I am deploying several AI agents on the Hedera network using this platform. For example:

* **Agent Name**: Crypto Arbitrage Agent
* **Account ID**: [0.0.5939654 on Hedera](https://hashscan.io/testnet/account/0.0.5939654)
* **OpenConvAI Agent Link**: [Crypto Arbitrage Agent on OpenConvAI](https://moonscape.tech/openconvai/agents/0.0.5939654)
* **Inbound Topic ID**: [Inbound Topic 0.0.5939657](https://hashscan.io/testnet/topic/0.0.5939657)
* **Outbound Topic ID**: [Outbound Topic 0.0.5939655](https://hashscan.io/testnet/topic/0.0.5939655)
* **Example Conversation**:

  * [Conversation Topic 0.0.5939510](https://hashscan.io/testnet/topic/0.0.5939510)
  * [View Conversation on OpenConvAI](https://moonscape.tech/openconvai/conversation/0.0.5939510)

---
## **Future Improvements**

**1. Adding AI Agent Reviews and Ratings**
To enhance the marketplace, we will introduce a comprehensive review and rating system for AI agents. This will allow users to provide feedback on their experiences, improving transparency and helping others make informed decisions when selecting agents. The ratings will contribute to building a trusted and reputable ecosystem for both creators and users.

**2. Implementing a Token Staking System**
A staking system will be implemented to incentivize users to hold AI agents within the platform. Users who stake tokens will earn rewards, such as access to premium agents or a share of transaction fees. This feature will promote long-term engagement and liquidity within the marketplace, benefiting both creators and users.

**3. Transition to the Hedera Mainnet**
After successful testing on the Hedera testnet, **Agentorium** will transition to the **Hedera mainnet** to unlock the full scalability, security, and performance of Hedera’s infrastructure. This move will provide real-world usage capabilities, ensuring a seamless and reliable experience for users and enabling the platform to scale globally.

---

## License

This project is licensed under the MIT License.
