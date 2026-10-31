import { Navbar, Container, Nav } from 'react-bootstrap';
import GitHubIcon from '../assets/GitHub_Invertocat_White.svg?react';

const REPO_URL = 'https://github.com/HikkaKun/ural-test';

export default function Header({ repoUrl = REPO_URL }) {
  return (
    <Navbar bg="dark" variant="dark" className="shadow-sm mb-4">
      <Container
        fluid
        style={{ maxWidth: 1200 }}
        className="d-flex justify-content-between align-items-center"
      >
        <Navbar.Brand className="fw-semibold mb-0">
          Поиск товаров
        </Navbar.Brand>

        <Nav>
          <Nav.Link
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center gap-2"
            title="Открыть репозиторий на GitHub"
          >
            <GitHubIcon width={20} height={20} style={{ display: 'block' }} aria-hidden="true" focusable="false" />
            <span className="d-none d-sm-inline">Source: HikkaKun/ural-test</span>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}