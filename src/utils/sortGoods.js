export function sortGoods(goods) {
  return goods.sort((a, b) => a.goodsID.localeCompare(b.goodsID));
}