import { HWBridgeProvider } from "@buidlerlabs/hashgraph-react-wallets";
import { HWCConnector } from "@buidlerlabs/hashgraph-react-wallets/connectors";
import { HederaTestnet } from "@buidlerlabs/hashgraph-react-wallets/chains";

// 1. Get projectId from https://cloud.reown.com
const projectId =
    "b56e18d47c72ab683b10814fe9495694";
// 2. Create a metadata object - optional
const metadata = {
    name: "Agentorium",
    description:
        "Agentorium is a decentralized marketplace for AI agents.",
    url: window.location.origin,
    icons: [window.location.origin + "/favicon.ico"],
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <HWBridgeProvider
            metadata={metadata}
            projectId={projectId}
            connectors={[HWCConnector]}
            chains={[HederaTestnet]}
        >
            {children}
        </HWBridgeProvider>
    );
};
