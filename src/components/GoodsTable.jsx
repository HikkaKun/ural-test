import { useMemo, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import SelectHeader from './SelectHeader';
import { toFiniteNumber } from '../utils/parseNumber';
import classNames from 'classnames';

const COLUMNS = [
  { key: 'brand', title: 'Бренд', width: '20%', filter: 'brand' },
  { key: 'name', title: 'Название', width: '40%' },
  { key: 'price', title: 'Цена', width: '7.5%', sortable: true, align: 'end' },
  { key: 'count', title: 'Остаток', width: '7.5%', sortable: true, align: 'end' },
  { key: 'notRefund', title: 'Невозвратность', width: '15%', filter: 'notRefund' },
];

function GoodsTable({ title, goods }) {
  const [sort, setSort] = useState(null);
  const [brandFilter, setBrandFilter] = useState('');
  const [notRefundFilter, setNotRefundFilter] = useState('');

  const onSort = (key) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' }
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  }

  const brandsWithCounts = useMemo(() => {
    const map = new Map();
    for (const g of goods) {
      if (!g.brand) continue;
      map.set(g.brand, (map.get(g.brand) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [goods]);

  const filtered = useMemo(() => {
    let result = goods;
    if (brandFilter) result = result.filter(g => g.brand === brandFilter);
    if (notRefundFilter) {
      const bool = notRefundFilter === 'true';
      result = result.filter(g => g.notRefund == bool);
    }

    return result;
  }, [goods, brandFilter, notRefundFilter]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const copy = filtered.slice();
    copy.sort((a, b) => {
      const c = toFiniteNumber(a[sort.key]) - toFiniteNumber(b[sort.key]);
      return sort.dir === 'asc' ? c : -c;
    });
    return copy;
  }, [filtered, sort]);

  const sortIcon = (key) => {
    if (!sort || sort.key !== key) return ' ⇅';
    return sort.dir === 'asc' ? ' ↑' : ' ↓';
  }

  const brandHeader = (
    <SelectHeader
      value={brandFilter}
      onChange={e => setBrandFilter(e.target.value)}
      title='Фильтр по бренду'
    >
      <option value="">Бренд: все ({goods.length})</option>
      {brandsWithCounts.map(([b, cnt]) => (
        <option key={b} value={b}>
          {b} ({cnt})
        </option>
      ))}
    </SelectHeader>
  );

  const notRefundHeader = (
    <SelectHeader
      value={notRefundFilter}
      onChange={e => setNotRefundFilter(e.target.value)}
      title={'Фильтр по невозвратным позициям'}
    >
      <option value="">Невозврат: все</option>
      <option value="true">Невозврат: да</option>
      <option value="false">Невозврат: нет</option>
    </SelectHeader>
  );

  const customHeaders = {
    brand: brandHeader,
    notRefund: notRefundHeader,
  }

  return (
    <Card className="mt-3 mb-5">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span className="text-truncate">{title}</span>
        <small className="text-muted fw-normal ms-2 flex-shrink-0">
          {sorted.length} из {goods.length}
        </small>
      </Card.Header>

      <Table responsive striped bordered hover className="mb-0">
        <colgroup>
          {COLUMNS.map((c) => (
            <col key={c.key} style={{ width: c.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                className={classNames({ 'text-end': c.align === 'end', 'user-select-none': c.sortable })}
                style={c.sortable ? { cursor: 'pointer' } : undefined}
                onClick={c.sortable ? () => onSort(c.key) : undefined}
                title={c.sortable ? 'Нажмите для сортировки' : undefined}
              >
                {customHeaders[c.filter] || (<>{c.title}{c.sortable && sortIcon(c.key)}</>)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="text-center text-muted py-3">
                Нет данных по фильтру
              </td>
            </tr>
          ) : (
            sorted.map((g, i) => (
              <tr key={`${g.goodsID}-${g.brand}-${i}`}>
                {COLUMNS.map((c) => (
                  <td key={c.key} className={c.align === 'end' ? 'text-end' : ''}>
                    {c.key === 'notRefund' ? (g[c.key] ? 'Да' : 'Нет') : g[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card>
  );
}

export default GoodsTable;