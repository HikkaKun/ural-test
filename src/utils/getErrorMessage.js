const errorRecord = {
  ['Empty key!']: 'Не указан ключ покупателя',
  ['Invalid key client!']: 'Неверный ключ покупателя, покупатель не найден',
  ['Empty number goods!']: 'Не указан номер детали',
  ['Request quota exceeded!']: 'Вы превысили лимит запросов по грузовому ассортименту',
}

export function getErrorMessage(error) {
  return errorRecord[error] || error;
}