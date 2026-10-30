export function isEmptyGoods(goods) {
  return !goods || ((!goods.goodsID || goods.goodsID === '00000000-0000-0000-0000-000000000000') && !goods.brand && !goods.name && !goods.price);
}
