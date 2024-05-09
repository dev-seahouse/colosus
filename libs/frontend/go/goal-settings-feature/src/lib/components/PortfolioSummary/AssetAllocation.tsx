import PercentageText from './PercentageText';
import type { GetModelPortfoliosData } from '@bambu/go-core';

export interface AssetAllocationProps {
  assets: GetModelPortfoliosData[number]['assetClassAllocation'];
}

export const AssetAllocation = ({ assets }: AssetAllocationProps) => {
  const activeAssets = assets.filter(
    (asset) => asset.included && Number(asset.percentOfPortfolio) !== 0
  );

  if (activeAssets.length === 0) {
    return null;
  }

  return (
    <>
      {activeAssets.map((asset, i) => {
        const lastItem = i === activeAssets.length - 1;

        return (
          <span key={asset.assetClass}>
            <PercentageText
              value={Number(asset.percentOfPortfolio)}
              suffix={`% ${asset.assetClass}`}
            />
            {`${!lastItem ? ', ' : ''}`}
          </span>
        );
      })}
    </>
  );
};

export default AssetAllocation;
