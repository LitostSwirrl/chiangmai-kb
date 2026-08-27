# 清邁知識庫

為了在清邁生活而整理的文化與語言筆記：歷史、人群、信仰與習俗、節慶與曆法、語言與社交、日常生活與空間，共六個主軸、76 條筆記。筆記之間以連結互相參照，網站把這個關聯結構做成可瀏覽的形式──反向連結、hover 預覽、關係圖。

## 內容原則

- 每條事實都有可驗證的來源，附在各條目的來源清單
- 來源之間有衝突時並列各方說法，不擅自裁決

## 授權

- 筆記內容（`content/`）：CC BY-NC-SA 4.0，見 [LICENSE-CONTENT](LICENSE-CONTENT)
- 程式碼：MIT，見 [LICENSE](LICENSE)

## 本機開發

```bash
npm install
npm run dev      # 開發伺服器（會先跑內容管線）
npm test         # vitest
npm run build    # 產出 dist/（會先跑內容管線與斷鏈驗證）
```
