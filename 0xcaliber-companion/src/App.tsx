import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';

const contractAddress = '0x1A706F5001f66931BCce4667dCf8D128D2A10B1c'; // Your deployed contract address

const contractAbi = [
  {
    "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "name": "usernames",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const zkSyncTestnet = {
  id: 300,
};

function App() {
  // Get the connected account
  const { address, isConnected } = useAccount();
  const { connectors, connect, status, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  // State to store the entered zkSync SSO unique address
  const [ssoAddress, setSsoAddress] = useState("");

  // Read the username for the provided SSO address from the contract using useReadContract
  const { data: username, isPending, error: readError } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'usernames',
    args: [ssoAddress],
    chainId: zkSyncTestnet.id,
    query: {
      enabled: !!ssoAddress, // Only call if ssoAddress is provided
    },
  });

  return (
    <div>
      <h2>Account</h2>
      <p>Status: {isConnected ? 'Connected' : 'Not connected'}</p>
      <p>Address: {address || 'No address'}</p>
      {isConnected && (
        <button onClick={() => disconnect()}>
          Disconnect
        </button>
      )}
      
      <h2>Enter zkSync SSO Unique Address</h2>
      <input
        type="text"
        placeholder="Enter your SSO address"
        value={ssoAddress}
        onChange={(e) => setSsoAddress(e.target.value)}
      />

      <h2>Contract Query</h2>
      {isPending ? (
        <p>Loading username...</p>
      ) : readError ? (
        <p>Error: {readError.message}</p>
      ) : (
        <p>Username: {username || 'No username found'}</p>
      )}

      <h2>Connect</h2>
      {!isConnected && connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
        </button>
      ))}
      {status && <div>{status}</div>}
      {connectError && <div>{connectError.message}</div>}
    </div>
  );
}

export default App;
