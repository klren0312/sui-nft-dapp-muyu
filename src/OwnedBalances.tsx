import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Text } from "@radix-ui/themes";

export function OwnedBalances() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    },
  );

  if (!account) {
    return;
  }

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isPending || !data) {
    return <Flex>加载中...</Flex>;
  }

  return (
    <Text>
       余额: { data && data.totalBalance ? Number(data.totalBalance) / 1000000000 : 0 } SUI
    </Text>
  );
}
