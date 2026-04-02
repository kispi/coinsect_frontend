# Coinsect Frontend (Vue 3 + Custom SSR)

이 저장소는 암호화폐 마켓 데이터 플랫폼인 [coinsect.io](https://coinsect.io)의 프론트엔드 코드베이스입니다. 

Nuxt가 안정화되기 이전 시기에 구현되었으며, 실 서비스의 까다로운 요구사항을 충족하기 위해 **Vue 3와 Express를 결합한 커스텀 SSR(Server Side Rendering) 아키텍처**를 직접 설계하고 구축했습니다. AI 에이전트나 자동화 도구의 도움 없이 순수 엔지니어링 역량으로 구현된 프로덕션급 코드베이스로, 복잡한 상태 관리와 검색 엔진 최적화(SEO), 그리고 실시간 데이터 처리 패턴을 담고 있습니다.

## 🚀 Key Highlights

- **Custom SSR Engine**: Nuxt와 같은 프레임워크에 의존하지 않고, Vue 3의 `@vue/server-renderer`와 Express를 활용하여 독자적인 Server Side Rendering 환경을 구축했습니다.
- **SSR-Safe State Management**: SSR 환경에서 흔히 발생하는 싱글톤 오염 문제를 방지하기 위해 Vuex 4를 팩토리 패턴(`newStore`)으로 구현하여 요청별 독립적인 상태를 보장합니다.
- **Production-Grade SEO**: 검색 엔진 최적화를 위해 서버 사이드에서 메타데이터를 주입하고, 기존 경로의 변경에 대응하는 301 리다이렉트 및 404 핸들링 로직을 WAS 레이어에서 구현했습니다.
- **Modular Architecture**: 관심사 분리(SoC)를 위해 API 레이어, 서비스 로직, 공통 모듈, Composition API 기반의 Hooks를 엄격하게 구분하여 관리합니다.

## 🛠 Tech Stack

- **Framework**: Vue 3 (Composition API)
- **State Management**: Vuex 4
- **Routing**: Vue Router 4
- **Language**: TypeScript
- **Server**: Node.js / Express (for SSR & WAS)
- **Build Tool**: Vue CLI (Custom Webpack Config)
- **HTTP Client**: Axios (with SSR Proxy Header Support)

## 🏗 Architecture Details

### 1. Custom SSR Build & Run Pipeline
단순한 정적 빌드가 아닌, 클라이언트용 번들과 서버용 번들을 각각 빌드하여 노드 서버에서 렌더링하는 구조입니다.
- **Entry Points**: `src/entry-client.ts`와 `src/entry-server.ts`를 통해 환경별로 다른 초기화 절차를 수행합니다.
- **Hydration**: 서버에서 렌더링된 HTML과 데이터를 클라이언트에서 자연스럽게 연결(Hydrate)하여 초기 로딩 속도와 사용자 경험을 극대화합니다.

### 2. WAS (Web Application Server) - `was/`
SSR을 수행하는 전용 서버 레이어입니다.
- **HTML Renderer**: `renderToString`을 호출하여 가상 DOM을 HTML 문자열로 변환합니다.
- **Controller & Router**: 요청된 URL에 맞는 Vue 컴포넌트를 매칭하고, 필요한 데이터를 서버 사이드에서 미리 Prefetch합니다.
- **Proxy Headers**: 클라이언트의 IP와 User-Agent를 정확하게 전달하기 위해 Axios 헤더 프록시 로직을 포함하고 있습니다.

### 3. Store Management Strategy
서버 환경에서의 인스턴스 공유 문제를 해결하기 위해 다음과 같은 패턴을 사용합니다.
```typescript
// src/store/index.ts (Example Pattern)
export const newStore = () => {
  return createStore({
    // modules, state, mutations, actions
  })
}
```
각 요청마다 새로운 Store 인스턴스를 생성하여 데이터 충돌을 원천 차단합니다.

## 📂 Project Structure

```text
.
├── was/                # SSR 전용 Express 서버 및 렌더링 로직
│   ├── ssr.js          # SSR 설정 및 미들웨어
│   ├── html-renderer.js # Vue SSR 렌더링 엔진
│   └── controllers.js  # 라우트 매칭 및 응답 처리
├── src/                # Vue 3 프론트엔드 소스
│   ├── api/            # 외부 API 정의
│   ├── components/     # UI 컴포넌트 (Atomic Design 지향)
│   ├── hooks/          # 재사용 가능한 Composition API logic
│   ├── modules/        # 공통 모듈 (Axios 인스턴스 등)
│   ├── services/       # 비즈니스 로직 서비스 레이어
│   ├── store/          # Vuex 4 상태 관리
│   └── main.ts         # 앱 엔트리 (SSR/Client 공용)
├── vue.config.js       # SSR 빌드를 위한 커스텀 Webpack 설정
└── deploy.sh           # PM2 기반 배포 스크립트
```

## ⚙️ Running Locally

### Development
```bash
# Frontend serving (CSR Mode)
npm run serve

# SSR Mode serving (WAS Server)
npm run serve-dev:ssr
```

### Production Build
```bash
# SSR Full Build (Client + Server bundles)
npm run build:ssr

# Start Production Server
npm run serve:ssr
```

## 📄 License
This project was developed for the [coinsect.io](https://coinsect.io) service and is shared for technical review purposes.
