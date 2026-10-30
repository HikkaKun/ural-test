import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Row, Col, Form, Button,
  ListGroup, Alert, Spinner, Card,
} from 'react-bootstrap';
import {
  setGoodsID, selectBrand,
  requestSearchAnalogues,
  requestSearchGoods,
} from '../store/store';
import { isEmptyGoods } from '../utils/isEmptyGoods';
import GoodsTable from './GoodsTable';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function GoodsPage() {
  const dispatch = useDispatch();
  const {
    goodsID, status, error, errorStatus, goods, notFound,
    selectedBrand, analoguesStatus, analoguesError, analoguesErrorStatus, analogues,
  } = useSelector((s) => s.goods);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = goodsID.trim();
    if (!id) return;
    dispatch(requestSearchGoods(id));
  };

  const handleBrandClick = (brand) => {
    if (brand === selectedBrand) return;
    dispatch(selectBrand(brand));
    dispatch(requestSearchAnalogues({ goodsID: goodsID.trim(), brand }));
  };

  // Уникальные бренды из ответа
  const brands = useMemo(() => {
    const set = new Set();
    goods.forEach((g) => { if (g.brand) set.add(g.brand); });
    return Array.from(set);
  }, [goods]);

  const isLoading = status === 'loading';
  const analoguesEmpty =
    analogues.length === 0 ||
    (analogues.length === 1 && isEmptyGoods(analogues[0]));

  return (
    <Container className="mt-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-3">Поиск товара</h3>

      <Form onSubmit={handleSubmit} className="mb-3">
        <Row className="g-2">
          <Col xs={12} md={7}>
            <Form.Control
              type="text"
              placeholder="Номер товара"
              value={goodsID}
              onChange={(e) => dispatch(setGoodsID(e.target.value))}
              disabled={isLoading}
            />
          </Col>
          <Col xs={12} md="auto">
            <Button type="submit" disabled={isLoading || !goodsID.trim()}>
              {isLoading
                ? <><Spinner size="sm" animation="border" className="me-2" />Загрузка…</>
                : 'Найти бренды'}
            </Button>
          </Col>
        </Row>
      </Form>

      {status === 'error' && (
        <Alert variant={errorStatus === 403 ? 'warning' : 'danger'}>
          <strong>
            {errorStatus === 403 ? 'Доступ запрещён: ' : 'Ошибка: '}
          </strong>
          {getErrorMessage(error)}
        </Alert>
      )}

      {status === 'success' && notFound && (
        <Alert variant="warning">Товар не найден</Alert>
      )}

      {status === 'success' && !notFound && brands.length > 0 && (
        <Card className="mb-3">
          <Card.Header>Выберите бренд</Card.Header>
          <Card.Body className="p-0">
            <ListGroup variant="flush">
              {brands.map((brand) => (
                <ListGroup.Item
                  key={brand}
                  action
                  active={selectedBrand === brand}
                  onClick={() => handleBrandClick(brand)}
                >
                  {brand}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      {selectedBrand && (
        <>
          {analoguesStatus === 'loading' && (
            <div className="my-3">
              <Spinner animation="border" size="sm" className="me-2" />
              Загрузка товаров и аналогов…
            </div>
          )}

          {analoguesStatus === 'error' && (
            <Alert variant={analoguesErrorStatus === 403 ? 'warning' : 'danger'}>
              <strong>
                {analoguesErrorStatus === 403 ? 'Доступ запрещён: ' : 'Ошибка: '}
              </strong>
              {getErrorMessage(analoguesError)}
            </Alert>
          )}

          {analoguesStatus === 'success' && (
            analoguesEmpty
              ? <Alert variant="info">Аналоги не найдены</Alert>
              : (
                <GoodsTable
                  title={`Товары и аналоги для бренда «${selectedBrand}»`}
                  goods={analogues}
                />
              )
          )}
        </>
      )}
    </Container>
  );
}