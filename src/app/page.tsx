'use client';

import { useState, useEffect } from 'react';
import {
  useAccount, useConnect, useDisconnect,
  useSwitchChain, useSendTransaction, useSignMessage,
  useBalance, useChainId,
} from 'wagmi';
import { parseEther } from 'viem';
import { sepolia } from 'wagmi/chains';

const CHAINS = [sepolia];

const WALLET_META: Record<string, { icon: string; desc: string }> = {
  MetaMask:          { icon: '🦊', desc: 'Browser extension wallet' },
  'Coinbase Wallet': { icon: '🔵', desc: 'Coinbase smart wallet' },
  WalletConnect:     { icon: '🔗', desc: 'Scan QR with any wallet' },
  Injected:          { icon: '⚡', desc: 'Detected wallet' },
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // ✅ Only render after client mount — fixes hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  const { sendTransaction, isPending: isSending, isSuccess: isSent, data: txHash } = useSendTransaction();
  const { signMessage, isPending: isSigning, isSuccess: isSigned, data: signature } = useSignMessage();

  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount]       = useState('');
  const [message, setMessage]     = useState('Hello from Web3!');
  const [tab, setTab]             = useState<'send' | 'sign'>('send');

  // ✅ Return null until mounted — prevents server/client HTML mismatch
  if (!mounted) return null;

  const currentChain = CHAINS.find(c => c.id === chainId);
  const shortAddr    = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  const balDisplay   = balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '— ETH';

  return (
    <div className="page-wrapper">
      <div className="container">

        <header className="header">
          <div className="logo-row">
            <div className="logo-mark">W3</div>
            <span className="logo-title">Web3 Hub</span>
          </div>
          <p className="logo-sub">Sepolia Testnet · Multi-wallet · Send · Sign</p>
        </header>

        {!isConnected ? (
          <div className="card">
            <p className="connect-label">Connect your wallet</p>
            <div className="wallet-list">
              {connectors.map(connector => {
                const meta = WALLET_META[connector.name] ?? { icon: '👛', desc: 'Connect wallet' };
                return (
                  <button key={connector.uid} className="wallet-btn"
                    onClick={() => connect({ connector })} disabled={isConnecting}>
                    <div className="wallet-icon-wrap">{meta.icon}</div>
                    <div className="wallet-info">
                      <span className="wallet-name">{connector.name}</span>
                      <span className="wallet-desc">{meta.desc}</span>
                    </div>
                    <span className="wallet-arrow">→</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="account-card">
              <div className="account-top">
                <div className="account-left">
                  <div className="status-pill">
                    <span className="status-dot" />Connected
                  </div>
                  <div className="account-address">{shortAddr}</div>
                  <div className="account-balance">Balance: <span>{balDisplay}</span></div>
                </div>
                <button className="disconnect-btn" onClick={() => disconnect()}>Disconnect</button>
              </div>
              <div className="divider" />
              <p className="section-label">Network</p>
              <div className="chain-grid">
                {CHAINS.map(chain => (
                  <button key={chain.id}
                    className={`chain-chip${chain.id === chainId ? ' active' : ''}`}
                    onClick={() => switchChain({ chainId: chain.id })}
                    disabled={isSwitching}>
                    {chain.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="action-card">
              <div className="tab-bar">
                <button className={`tab-btn${tab === 'send' ? ' active' : ''}`} onClick={() => setTab('send')}>↑ Send</button>
                <button className={`tab-btn${tab === 'sign' ? ' active' : ''}`} onClick={() => setTab('sign')}>✍ Sign Message</button>
              </div>

              <div className={`tab-panel${tab === 'send' ? ' active' : ''}`}>
                <div className="field-group">
                  <label className="field-label">Recipient Address</label>
                  <input className="input" type="text" placeholder="0x..."
                    value={toAddress} onChange={e => setToAddress(e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="field-label">Amount</label>
                  <div className="input-row">
                    <input className="input" type="number" placeholder="0.001"
                      value={amount} onChange={e => setAmount(e.target.value)} />
                    <div className="unit-badge">{currentChain?.nativeCurrency?.symbol ?? 'ETH'}</div>
                  </div>
                </div>
                <button className="btn btn-violet"
                  disabled={isSending || !toAddress || !amount}
                  onClick={() => sendTransaction({
                    to: toAddress as `0x${string}`,
                    value: parseEther(amount || '0'),
                  })}>
                  {isSending ? <><span className="spinner" />Sending…</> : 'Send Transaction'}
                </button>
                {isSent && txHash && (
                  <div className="result-box result-success">
                    <div className="result-title">✓ Transaction Sent</div>
                    <div className="result-value">{txHash}</div>
                  </div>
                )}
              </div>

              <div className={`tab-panel${tab === 'sign' ? ' active' : ''}`}>
                <div className="field-group">
                  <label className="field-label">Message</label>
                  <textarea className="input" rows={4} placeholder="Enter a message to sign…"
                    value={message} onChange={e => setMessage(e.target.value)} />
                </div>
                <button className="btn btn-cyan"
                  disabled={isSigning || !message}
                  onClick={() => signMessage({ message })}>
                  {isSigning ? <><span className="spinner" />Signing…</> : 'Sign Message'}
                </button>
                {isSigned && signature && (
                  <div className="result-box result-success">
                    <div className="result-title">✓ Message Signed</div>
                    <div className="result-value">{signature}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}