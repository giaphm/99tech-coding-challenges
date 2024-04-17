interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // The getPriority function can be put into the useCallback hooks for getting rid of inefficient computation
  // type of block can be string specifically
	const getPriority = useCallback(() => (blockchain: string): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
    // Nothing to put in dependencies
	}, []);

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      // The blockchain property is not existed, it should be the currency property for currency name
		  const balancePriority = getPriority(balance.currency);
      // lhsPriority is not defined. Based on the logic, it can be balancePriority
		  if (balancePriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		})
    // The first argument is right-hand side, and the second one is left-hand side
    .sort((rhs: WalletBalance, lhs: WalletBalance) => {
      // The blockchain property is not existed, it should be the currency property for currency name
			const leftPriority = getPriority(lhs.currency);
		  const rightPriority = getPriority(rhs.currency);
      // So need to update the logic here after swapping two variables
		  if (rightPriority > leftPriority) {
		    return -1;
		  } else if (leftPriority > rightPriority) {
		    return 1;
		  }
    });
    // prices is not necessary to add in dependency because it is not used yet
  }, [balances]);

  // The formattedBalances can be wrapped into useCallback hooks for reducing redundant compututation
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      }
    })
  }, [sortedBalances]);

  // The sortedBalances does not have the property of formatted, so we need to use formattedBalances
  // We also need a useMemo hook for optimizing performance
  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
          // classes is not defined, so comment this
          // className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    })
    // The depedency is formattedBalances for updating rows
  }, [formattedBalances])

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}