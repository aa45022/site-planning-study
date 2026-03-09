import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

/* ═══════════════════════════════════════════════════
   設定區 — 部署前請修改
   ═══════════════════════════════════════════════════ */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'arch2025';
const DATA_DIR = join(__dirname, '..', 'data');

/* ═══ Middleware ═══ */
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 確保 data 目錄存在
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

/* ═══════════════════════════════════════════════════
   API 路由
   ═══════════════════════════════════════════════════ */

// 管理員驗證
app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: '密碼錯誤' });
  }
});

// 讀取資料
app.get('/api/data/:key', (req, res) => {
  const key = req.params.key;
  const filePath = join(DATA_DIR, `${key}.json`);

  if (!existsSync(filePath)) {
    // 如果是 sp-topics 且不存在，回傳種子資料
    if (key === 'sp-topics') {
      const seedPath = join(DATA_DIR, 'seed.json');
      if (existsSync(seedPath)) {
        const seed = JSON.parse(readFileSync(seedPath, 'utf-8'));
        // 自動寫入作為初始資料
        writeFileSync(filePath, JSON.stringify(seed, null, 2), 'utf-8');
        return res.json(seed);
      }
    }
    return res.status(404).json(null);
  }

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json(null);
  }
});

// 寫入資料
app.post('/api/data/:key', (req, res) => {
  const key = req.params.key;
  const filePath = join(DATA_DIR, `${key}.json`);

  try {
    writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ═══ 靜態檔案（Production）═══ */
const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback — 所有非 API 路由都導向 index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(distPath, 'index.html'));
    }
  });
}

/* ═══ 啟動 ═══ */
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║  敷地計畫與都市設計 — 知識庫伺服器            ║
║  Server running on http://localhost:${PORT}      ║
║  Data directory: ${DATA_DIR}
║  Admin: 網址加 ?admin 進入管理               ║
╚══════════════════════════════════════════════╝
  `);
});
