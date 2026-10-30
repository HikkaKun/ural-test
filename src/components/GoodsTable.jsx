import { useMemo, useState } from 'react';
import { Card,  Table } from 'react-bootstrap';

const COLUMNS = [
  { key: 'brand', title: 'Бренд', width: '25%', filter: 'brand' },
  { key: 'name', title: 'Название', width: '40%' },
  { key: 'price', title: 'Цена', width: '17.5%', sortable: true, align: 'end' },
  { key: 'count', title: 'Остаток', width: '17.5%', sortable: true, align: 'end' },
];

function GoodsTable({ title, goods }) {
  const [sort, setSort] = useState(null);
  const [brandFilter, setBrandFilter] = useState('');

  const handleSort = (key) => {
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

  const filtered = useMemo(
    () => (brandFilter ? goods.filter((g) => g.brand === brandFilter) : goods),
    [goods, brandFilter]
  );

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const na = Number(a[sort.key]);
      const nb = Number(b[sort.key]);
      const c = (Number.isFinite(na) ? na : 0) - (Number.isFinite(nb) ? nb : 0);
      return sort.dir === 'asc' ? c : -c;
    });
    return copy;
  }, [filtered, sort]);

  const sortIcon = (key) => {
    if (!sort || sort.key !== key) return ' ⇅';
    return sort.dir === 'asc' ? ' ↑' : ' ↓';
  }

  const brandHeader = (
    <select
      value={brandFilter}
      onChange={(e) => setBrandFilter(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="form-select form-select-sm border-0 shadow-none bg-transparent"
      style={{
        cursor: 'pointer',
        width: '100%',
        padding: 0,
        paddingRight: '1.1rem', // место под стрелку
        backgroundPosition: 'right center',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        color: 'inherit',
      }}
      aria-label="Фильтр по бренду"
      title="Фильтр по бренду"
    >
      <option value="">Бренд: все ({goods.length})</option>
      {brandsWithCounts.map(([b, cnt]) => (
        <option key={b} value={b}>
          {b} ({cnt})
        </option>
      ))}
    </select>
  );

  return (
    <Card className="mt-3">
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
                className={[
                  c.align === 'end' ? 'text-end' : '',
                  c.sortable ? 'user-select-none' : '',
                ].join(' ').trim() || undefined}
                style={c.sortable ? { cursor: 'pointer' } : undefined}
                onClick={c.sortable ? () => handleSort(c.key) : undefined}
                title={c.sortable ? 'Нажмите для сортировки' : undefined}
              >
                {c.filter === 'brand' ? brandHeader : (
                  <>
                    {c.title}
                    {c.sortable && sortIcon(c.key)}
                  </>
                )}
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
                    {g[c.key]}
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