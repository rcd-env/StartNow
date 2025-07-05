import React, { useState, useEffect, useRef } from "react";
import { Wallet, ChevronDown, ExternalLink } from "lucide-react";

interface WalletConnectionProps {
  variant?: "default" | "hero" | "navbar" | "mobile";
}

interface PetraWallet {
  connect: () => Promise<{ address: string }>;
  disconnect: () => Promise<void>;
  account: () => Promise<{ address: string }>;
  isConnected: () => Promise<boolean>;
}

declare global {
  interface Window {
    aptos?: PetraWallet;
    petra?: PetraWallet;
  }
}

const SimpleWalletConnection: React.FC<WalletConnectionProps> = ({
  variant = "default",
}) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAvailable, setWalletAvailable] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if Petra wallet is available
  useEffect(() => {
    const checkWallet = () => {
      const wallet = window.aptos || window.petra;
      setWalletAvailable(!!wallet);
      console.log("Wallet available:", !!wallet);
    };

    // Check immediately
    checkWallet();

    // Check again after a delay in case wallet loads later
    const timer = setTimeout(checkWallet, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
      }
    };

    if (showAccountDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountDropdown]);

  const connectWallet = async () => {
    try {
      setLoading(true);
      const wallet = window.aptos || window.petra;

      if (!wallet) {
        setShowModal(true);
        return;
      }

      const response = await wallet.connect();
      setConnected(true);
      setAddress(response.address);
      console.log("Connected to wallet:", response.address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const wallet = window.aptos || window.petra;
      if (wallet) {
        await wallet.disconnect();
      }
      setConnected(false);
      setAddress(null);
      setShowAccountDropdown(false);
      console.log("Disconnected from wallet");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    if (walletAvailable) {
      connectWallet();
    } else {
      setShowModal(true);
    }
  };

  const getConnectedButtonStyle = () => {
    switch (variant) {
      case "navbar":
        return "text-gray-900 font-bold font-display py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:opacity-80";
      case "mobile":
        return "w-full text-gray-900 font-bold font-display py-4 px-5 rounded-2xl transition-all duration-300 shadow-lg hover:opacity-80";
      case "hero":
        return "text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:opacity-80";
      default:
        return "bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-all duration-300";
    }
  };

  const getConnectedButtonBackground = () => {
    switch (variant) {
      case "navbar":
        return { background: "#99a3a3" };
      case "mobile":
        return { background: "#fdc500" };
      case "hero":
        return { background: "#ffee99" };
      default:
        return {};
    }
  };

  if (connected && address) {
    // For navbar variant, show address with dropdown
    if (variant === "navbar") {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className={`inline-flex items-center ${getConnectedButtonStyle()}`}
            style={getConnectedButtonBackground()}
          >
            {formatAddress(address)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {showAccountDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              <div className="p-3 border-b">
                <p className="text-sm text-gray-500">Connected Account</p>
                <p className="text-sm font-mono">{formatAddress(address)}</p>
              </div>
              <button
                onClick={disconnectWallet}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      );
    }

    // For other variants (hero, mobile), show "Connected" with dropdown
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowAccountDropdown(!showAccountDropdown)}
          className={`inline-flex items-center ${getConnectedButtonStyle()}`}
          style={getConnectedButtonBackground()}
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connected
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>

        {showAccountDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-3 border-b">
              <p className="text-sm text-gray-500">Connected Account</p>
              <p className="text-sm font-mono">{formatAddress(address)}</p>
            </div>
            <button
              onClick={disconnectWallet}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  const getConnectButtonStyle = () => {
    switch (variant) {
      case "navbar":
        return "text-gray-900 font-bold font-display py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:opacity-80";
      case "mobile":
        return "w-full text-gray-900 font-bold font-display py-4 px-5 rounded-2xl transition-all duration-300 shadow-lg hover:opacity-80";
      case "hero":
        return "text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:opacity-80";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all duration-300";
    }
  };

  const getConnectButtonBackground = () => {
    switch (variant) {
      case "navbar":
        return { background: "#99a3a3" };
      case "mobile":
        return { background: "#fdc500" };
      case "hero":
        return { background: "#ffee99" };
      default:
        return {};
    }
  };

  return (
    <>
      <button
        onClick={handleConnect}
        disabled={loading}
        className={`inline-flex items-center ${getConnectButtonStyle()} ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        style={getConnectButtonBackground()}
      >
        {variant !== "navbar" && <Wallet className="w-4 h-4 mr-2" />}
        {loading ? "Connecting..." : "Connect Wallet"}
      </button>

      {/* Wallet Installation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Install Petra Wallet</h3>
            <p className="text-gray-600 mb-4">
              To connect your wallet, you need to install Petra Wallet
              extension.
            </p>
            <div className="flex gap-3">
              <a
                href="https://petra.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center inline-flex items-center justify-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Install Petra
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleWalletConnection;
