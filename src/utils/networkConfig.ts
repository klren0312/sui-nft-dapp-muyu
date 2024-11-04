import { getFullnodeUrl } from "@mysten/sui/client"
import {
	TESTNET_COUNTER_PACKAGE_ID,
	MAINNET_COUNTER_PACKAGE_ID,
} from "./constants.ts";
import { createNetworkConfig } from "@mysten/dapp-kit"

const { networkConfig, useNetworkVariable, useNetworkVariables } =
	createNetworkConfig({
		testnet: {
			url: getFullnodeUrl("testnet"),
			variables: {
				packageId: TESTNET_COUNTER_PACKAGE_ID,
			},
		},
		mainnet: {
			url: getFullnodeUrl("mainnet"),
			variables: {
				packageId: MAINNET_COUNTER_PACKAGE_ID,
			},
		},
	})

export { useNetworkVariable, useNetworkVariables, networkConfig }
