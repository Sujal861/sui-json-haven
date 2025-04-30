
interface SuiWallet {
  getAccounts: () => Promise<string[]>;
  requestPermissions: () => Promise<string[]>;
  signAndExecuteTransaction: (tx: any) => Promise<any>;
}

interface Window {
  suiWallet?: SuiWallet;
}
