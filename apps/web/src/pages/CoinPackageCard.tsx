import React from 'react';
import './CoinPackageCard.scss';

export interface CoinPackage {
  _id: string;
  packageId: string;
  name: string;
  coinsAmount: number;
  price: number;
  currency: string;
}

interface CoinPackageCardProps {
  coinPackage: CoinPackage;
  isSelected: boolean;
  onSelect: () => void;
}

const CoinPackageCard: React.FC<CoinPackageCardProps> = ({ coinPackage, isSelected, onSelect }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: coinPackage.currency,
  }).format(coinPackage.price);

  return (
    <div className={`coin-package-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="coin-icon">🪙</div>
      <div className="coin-info">
        <h3>{coinPackage.coinsAmount.toLocaleString()} Coin</h3>
        <div className="price">{formattedPrice}</div>
      </div>
      <button>{isSelected ? '✅ Đã chọn' : '🎯 Chọn gói'}</button>
    </div>
  );
};

export default CoinPackageCard;