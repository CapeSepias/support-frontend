// ----- Imports ----- //
import { CommonState } from "helpers/page/commonReducer";
import { ProductPrices } from "helpers/productPrice/productPrices";
import { getProductPrices, getPromotionCopy } from "helpers/globalsAndSwitches/globals";
import { PromotionCopy } from "helpers/productPrice/promotions";
export type State = {
  common: CommonState;
  page: {
    productPrices: ProductPrices;
    promotionCopy: PromotionCopy | null | undefined;
    orderIsAGift: boolean;
  };
};
const {
  orderIsAGift
} = window.guardian; // ----- Export ----- //

export default (() => ({
  productPrices: getProductPrices(),
  promotionCopy: getPromotionCopy(),
  orderIsAGift
}));