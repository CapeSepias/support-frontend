// ----- Imports ----- //
import { CommonState } from 'helpers/page/commonReducer';
import { getGlobal, getProductPrices } from 'helpers/globals';
import { PromotionTerms } from 'helpers/productPrice/promotions';
import { ProductPrices } from 'helpers/productPrice/productPrices';
import { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { detect } from 'helpers/internationalisation/countryGroup';
export type PromotionTermsPropTypes = {
  productPrices: ProductPrices;
  promotionTerms: PromotionTerms;
  countryGroupId: CountryGroupId;
};
export type State = {
  common: CommonState;
  page: PromotionTermsPropTypes;
}; // ----- Export ----- //

export default () => {
  const productPrices = getProductPrices();
  const terms = getGlobal('promotionTerms');
  const expires = terms && terms.expires ? new Date(terms.expires) : null;
  const starts = terms ? new Date(terms.starts) : null;
  const countryGroupId = detect();
  return {
    productPrices,
    promotionTerms: { ...terms, starts, expires },
    countryGroupId,
  };
};
