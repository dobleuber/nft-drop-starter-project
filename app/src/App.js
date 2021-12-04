import React, {useEffect, useState} from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';

// Constants
const TWITTER_HANDLE = 'dobleuber';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const checkIfWalletIsConneted = async () => {
    try {
      const {solana} = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom Wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log('Connected with the public key:', response.publicKey.toString());

          setWalletAddress(response.publicKey.toString());
        } 
      } else {
        alert('No solana object found! Get a phantom wallet!');
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  const connectWallet = async () => {
    const {solana} = window;
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with the public key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  }

  const renderNotConnectedContainer = () => {
    return !walletAddress
      ? (
        <button
          onClick={connectWallet}
          className="cta-button connect-wallet-button"
        >
          Connect Wallet
        </button>
      )
      : null
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConneted();
    }

    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
    }
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">👻 🕷️ Haunted House Drop 🕷️ 👻</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {renderNotConnectedContainer()}
        </div>
        {walletAddress && <CandyMachine walletAddress={window.solana} />}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
