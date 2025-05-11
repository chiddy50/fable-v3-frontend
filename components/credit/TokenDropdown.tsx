"use client"

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Define the Token interface based on the provided data structure
interface Token {
    name: string;
    image: string;
    image2?: string;
    symbol: string;
    balance: number;
    decimals: number;
    usdc_price?: number;
    mint: string;
}

interface TokenDropdownProps {
    tokens: Token[] | [];
    onSelect?: (token: Token) => void;
    placeholder?: string;
}

export default function TokenDropdown({ tokens, onSelect, placeholder = "Select a token" }: TokenDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle token selection
    const handleSelectToken = (token: Token) => {
        setSelectedToken(token);
        setIsOpen(false);
        if (onSelect) onSelect(token);
    };

    // Format number with commas and limit decimal places
    const formatNumber = (num: number, maxDecimals: number = 6) => {
        if (num === 0) return '0';

        if (num < 0.000001) {
            return num.toExponential(2);
        }

        const fixedNum = num.toFixed(maxDecimals).replace(/\.?0+$/, '');
        return parseFloat(fixedNum).toLocaleString('en-US');
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-3 text-left bg-white border border-[#f0f0f0] rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#f0f0f0] focus:border-none"
            >
                {selectedToken ? (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 mr-3">
                            <img
                                src={selectedToken.image2}
                                alt={selectedToken.name}
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = selectedToken.image ?? "/icon/coins.svg";
                                }}
                            />
                        </div>
                        <div>
                            <div className="font-medium text-xs">{selectedToken.name}</div>
                            <div className="text-sm text-gray-500 text-[10px]">${selectedToken?.usdc_price ?? 0}</div>
                        </div>
                    </div>
                ) : (
                    <span className="text-gray-500 text-sm">{placeholder}</span>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isOpen
                        ? 'max-h-64 opacity-100'
                        : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="max-h-64 overflow-y-auto">
                    {tokens?.length > 0 ? (
                        tokens?.map((token) => (
                            <div
                                key={token.mint}
                                className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={() => handleSelectToken(token)}
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-7 h-7 mr-3">
                                        <img
                                            src={token.image2}
                                            alt={token.name}
                                            className="w-full h-full rounded-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =  token.image ?? "/icon/coins.svg";
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">{token.name}</div>
                                        <div className="text-[10px] text-gray-500">{token.symbol}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-sm">{formatNumber(token.balance)}</div>
                                    {token.usdc_price && (
                                        <div className="text-xs text-gray-500">
                                            ${token.usdc_price ? `${formatNumber(token.usdc_price, 4)}` : 0}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-center text-gray-500">No tokens available</div>
                    )}
                </div>
            </div>
        </div>
    );
}