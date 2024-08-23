import React, { useState } from 'react';
import { Web3ReactProvider, initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import styled from 'styled-components';
import Web3Connect from './components/Web3Connect';
import PoolCreation from './components/PoolCreation';
import PoolListing from './components/PoolListing';
import PoolDetailsAndPledging from './components/PoolDetailsAndPledging';
import UserDashboard from './components/UserDashboard';
import { Web3Provider } from '@ethersproject/providers';

const AppWrapper = styled.div`
  font-family: 'Arial', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #F5FFF5;
  min-height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #4A4A4A;
  font-size: 36px;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const NavButton = styled.button`
  background-color: #98D8AA;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #7BC5AE;
  }
`;

const getLibrary = (provider: any): Web3Provider => {
    const library = new Web3Provider(provider, 'any');
    library.pollingInterval = 12000;
    return library;
};

const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
    (actions) => new MetaMask({ actions })
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('pools');
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null);

  const handlePoolClick = (poolId: number) => {
    setSelectedPoolId(poolId);
    setCurrentView('poolDetails');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return <PoolCreation />;
      case 'pools':
        return <PoolListing onPoolClick={handlePoolClick} />;
      case 'dashboard':
        return <UserDashboard />;
      case 'poolDetails':
        return selectedPoolId !== null ? <PoolDetailsAndPledging poolId={selectedPoolId} /> : null;
      default:
        return <PoolListing onPoolClick={handlePoolClick} />;
    }
  };

  return (
    <Web3ReactProvider connectors={[[metaMask, metaMaskHooks]]}>
      <AppWrapper>
        <Header>
          <Title>KoalaKollect</Title>
          <Web3Connect />
        </Header>
        <Navigation>
          <NavButton onClick={() => setCurrentView('pools')}>View Pools</NavButton>
          <NavButton onClick={() => setCurrentView('create')}>Create Pool</NavButton>
          <NavButton onClick={() => setCurrentView('dashboard')}>My Dashboard</NavButton>
        </Navigation>
        {renderCurrentView()}
      </AppWrapper>
    </Web3ReactProvider>
  );
};

export default App;
