# Coinsect Frontend (Vue 3 + Custom SSR)

이 저장소는 암호화폐 마켓 데이터 플랫폼인 [coinsect.io](https://coinsect.io)의 프론트엔드 코드베이스입니다. 

Nuxt가 안정화되기 이전 시기에 구현되었으며, 실 서비스의 까다로운 요구사항을 충족하기 위해 **Vue 3와 Express를 결합한 커스텀 SSR(Server Side Rendering) 아키텍처**를 직접 설계하고 구축했습니다. 단순 아키텍처를 넘어, 초당 수천 개의 데이터 패킷이 발생하는 환경에서의 **렌더링 최적화**와 **복잡한 도메인 로직**을 해결한 흔적을 담고 있습니다.

## 🚀 Technical Highlights

### 1. High-Performance Real-time Rendering
대용량 실시간 시세 데이터 처리를 위해 React의 `useMemo`나 `useCallback`과 같은 수동적인 최적화 대신, 데이터 흐름 자체를 제어하는 **Batching & Throttling** 전략을 사용했습니다.
- **Interval-based Recalculation**: 웹소켓 패킷이 발생할 때마다 리스트를 재정렬하는 대신, 사용자가 설정한 `sortInterval`(예: 1000ms) 주기로만 정렬 및 필터링(`recalcDisplayedList`)을 수행하여 브라우저의 메인 스레드 부하를 최소화했습니다. (`RealTimePrices.vue`) 이는 너무 잦은 실시간 수준의 정렬이 오히려 사용자 경험을 방해하기 때문이기도 합니다.
- **Reactive Sorter**: 다국어 지원, 초성 검색, 즐겨찾기 상태가 결합된 복잡한 정렬 기준을 가진 커스텀 소터를 구현했습니다.
- **CSS-driven Visual Feedback**: 가격 변동 시 발생하는 시각적 플래싱 효과를 JS 연산이 아닌 CSS 애니메이션(`price-flashing-up/down`)으로 처리하여 렌더링 성능을 확보했습니다.

### 2. Complex State Management & WebSocket
거래소별로 상이한 데이터 구조와 실시간 상태 변화를 안정적으로 관리합니다.
- **Bybit Orderbook Delta Sync**: Bybit V5 API의 Snapshot/Delta 구조를 수동으로 머징하는 로직(`bybit.ts`)을 구현했습니다. 특히 빈번한 호가 변화에도 데이터 무결성을 유지하며 효율적으로 Store 상태를 업데이트합니다.
- **Real-time PnL Engine**: 웹소켓 시세 변화(`instruments.bybit`)를 감시하여 사용자의 모든 포지션 수익률(PnL)을 실시간으로 자동 계산하는 반응형 엔진을 구축했습니다. (`real-time-position.ts`)

### 3. Production-Ready UI Assets
실제 상용 서비스 수준의 완성도를 위해 구현된 고급 인터랙션 및 기능들입니다.
- **Draggable Multi-Modal System**: 싱글톤 모달의 한계를 넘어, 여러 개의 트레이딩 뷰나 오더북 창을 동시에 띄우고 자유롭게 드래그할 수 있는 모달 시스템을 구축했습니다. (`AppModal.vue`, `useModalDraggable`)
- **Chat SEO & Link Preview**: 채팅창의 URL을 실시간 감지하여 메타데이터를 크롤링하고 리치한 프리뷰 카드를 생성하는 로직을 포함합니다. (`seo.ts`) 동시에 여러 사람이 API를 호출해도 중복 크롤링이 일어나지 않도록, 서버는 유니크한 URL에 대해 최초의 요청에 대해서만 크롤링을 수행하고 그 이후의 응답들에는 "크롤링 중" 또는 크롤된 결과물만 반환하도록 구현했습니다. 이 결과들은 Redis에 저장됩니다.
- **WYSIWYG & Media Integration**: `ToastUIEditor`를 커스터마이징하여 연동했으며, **AWS S3**의 Presigned URL을 통한 이미지 업로드 기능을 구현했습니다. 또한 클립보드 이미지를 붙여넣어 업로드하는 것도 가능하도록 구현했습니다. (`helpers/logic.ts` => `onPasteClipboardImage`)

## 🛠 Tech Stack

- **Framework**: Vue 3 (Composition API)
- **State Management**: Vuex 4 (Factory Pattern implementation)
- **Routing**: Vue Router 4
- **Language**: TypeScript
- **Server**: Node.js / Express (Custom SSR Engine)
- **Monitoring & Log**: Custom Logger with SSR Support
- **Media**: AWS S3 Integration

## 🏗 Architecture Details

### 1. Custom SSR Build & Run Pipeline
- **Entry Points**: `src/entry-client.ts`와 `src/entry-server.ts` 분리.
- **SSR-Safe Store**: 각 요청마다 `newStore()`를 호출하여 요청 간 상태가 오염되지 않도록 보장합니다.

### 2. WAS (Web Application Server) - `was/`
- **Controller & Router**: 요청 URL에 따른 Vue 컴포넌트 매칭 및 404/301 처리.
- **Proxy Headers**: SSR 환경에서도 클라이언트의 정확한 IP를 유지하기 위한 프록시 헤더 처리 로직.

## 📂 Project Structure

```text
.
├── was/                # Custom SSR Server (Express)
├── src/
│   ├── components/
│   │   ├── app/        # AppModal, ToastUIEditor 등 공통 앱 컴포넌트
│   │   ├── common/     # 도메인 공통 컴포넌트
│   │   └── views/      # 주요 기능별 뷰 (RealTimePrices, Board 등)
│   ├── hooks/
│   │   ├── websockets/ # 거래소별 웹소켓 핸들러 (upbit, bybit, etc.)
│   │   ├── modal/      # 드래그 가능 모달 등 UI 인터랙션 훅
│   │   └── seo.ts      # 채팅 SEO 파싱 훅
│   ├── services/       # S3 연동, API 통신 등 공통 서비스
│   └── store/          # Vuex 4 상태 관리 (SSR-safe)
└── deploy.sh           # Deployment Script (PM2)
```

## ⚙️ Running Locally

```bash
# SSR Mode (Recommended for testing production features)
npm run build:ssr
npm run serve:ssr

# CSR Mode (Development)
npm run serve
```

## 📄 License
This project was developed for the [coinsect.io](https://coinsect.io) service and is shared for technical review purposes.

---
> 대부분의 commit history를 보면 알 수 있듯이, AI agent 시대보다 까마득히 이전, 심지어 최초의 LLM인 ChatGPT가 등장하기 훨씬 이전에 모든 것이 구현된 코드베이스입니다. 물론 ~~지금은 낡았네요~~ 이제는 Vue보다는 현실적 이유로 Nextjs나 Sveltekit을 사용합니다. [Vue를 쓰더라도 Nuxt를 사용하지요.](https://blog.coinsect.io/posts/just-use-nuxt-for-vue-projects)

백엔드, 프론트엔드를 총괄한 전체적인 스펙은 [Notion](https://six-slope-e73.notion.site/coinsect-io-e3de1e20efe040b6ac0fb68a5802e568)에 정리되어 있습니다.