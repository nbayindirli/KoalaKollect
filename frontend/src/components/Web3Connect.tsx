import React from 'react';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';

const ConnectButton = styled.button`
  background-color: #98D8AA;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #7BC5AE;
  }
`;

const AccountInfo = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #4A4A4A;
`;

const Web3Connect: React.FC = () => {
  const { connector, account, isActive } = useWeb3React();

  const handleConnect = async () => {
    try {
      await connector.activate();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = () => {
    if (connector?.deactivate) {
      connector.deactivate();
    } else {
      connector.resetState();
    }
  };

  return (
    <div>
      {isActive ? (
        <>
          <ConnectButton onClick={handleDisconnect}>Disconnect</ConnectButton>
          <AccountInfo>Connected: {account}</AccountInfo>
        </>
      ) : (
        <ConnectButton onClick={handleConnect}>Connect to MetaMask</ConnectButton>
      )}
    </div>
  );
};

export default Web3Connect;
