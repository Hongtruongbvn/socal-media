import React from 'react';
import type { ShopItem } from '../types/Shop';
import Button from '../../../components/common/Button';
import './ShopItemCard.scss';

interface ShopItemCardProps {
  item: ShopItem;
  owned?: boolean;
  onPurchase: (itemId: string) => void;
  disabled?: boolean;
}

const PLACEHOLDER = 'https://placehold.co/300x170/1e293b/48D1CC?text=Item';

const ShopItemCard: React.FC<ShopItemCardProps> = ({
  item, owned = false, onPurchase, disabled
}) => {
  const staticUrl = import.meta.env.VITE_API_STATIC_URL || '';

  const imgSrc = item.assetUrl
    ? (item.assetUrl.startsWith('http')
        ? item.assetUrl
        : `${staticUrl}${item.assetUrl}`)
    : PLACEHOLDER;

  return (
    <div className="shop-item-card">
      <div className="item-preview">
        <img
          className="plain-asset"
          src={imgSrc}
          alt={item.name}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
        />
      </div>

      <div className="item-details">
        <h4>{item.name}</h4>
        <p>{item.description || 'Không có mô tả'}</p>

        <div className="item-footer">
          <span className="price">🪙 {item.price.toLocaleString()} Coin</span>

          {owned ? (
            <Button disabled variant="secondary">✅ Đã sở hữu</Button>
          ) : (
            <Button disabled={disabled} onClick={() => onPurchase(item._id)}>
              🛒 Mua ngay
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopItemCard;