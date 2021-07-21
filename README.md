# Coinsect Mall Frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Conventions (꼭 읽어주세요: 수정 제안 환영합니다!)
- [모든 컴포넌트명은 가능하다면 반드시 2단어 이상으로 짓는다.](https://vuejs.org/v2/style-guide/#Multi-word-component-names-essential)
- [id는 섹션으로의 바로가기 기능이나 프로젝트 전체를 통틀어 단 한 번 밖에 사용되지 않을게 확실한 등의 특수한 경우 아니면 가급적 쓰지 않는다.](https://dev.to/clairecodes/reasons-not-to-use-ids-in-css-4ni4)
- 가급적 scss 변수($)가 아닌 네이티브 css 변수를 활용한다.(런타임시 변경 가능하다는 장점이 있고(테마 구현 용이), vue 파일 내에서도 별도의 variables.scss 임포트 없이 사용 가능함)
- 라우트는 'View'라고 칭하기로 하고, 라우트에 해당하는 컴포넌트들은 이름 앞에 'View'라는 prefix를 붙여준다.
- vue 파일명은 프로젝트 전체에서 파일명을 검색해보고 없는 것으로 짓고,(중복되면 스타일링 혼란) CamelCase로 한다.
- vue 파일의 root element는 반드시 파일명에 대한 dash case로 클래스명을 준다.<br>
(예: ImportFeeSalesTax.vue => import-fee-sales-tax)
- 각 vue 파일 하단의 `<style>`태그를 최대한 활용하기로 하며 (단, 다른 곳에 영향을 주지 않기 위해 scoped로 사용하거나, 자식에게 공통으로 상속하고 싶은게 있을 경우라면 scoped를 빼더라도 템플릿 루트 엘리먼트의 클래스명으로 감싸는 등으로 최대한 격리), 별도의 scss 파일로 빼서 관리하고 싶다면 @/assets/styles/ 안의 적절한 위치를 찾아 최대한 컴포넌트의 위치와 일치하게 작성한다.<br>
- [BEM은 사용하지 않는다.](https://medium.com/@jescalan/bem-is-terrible-f421495d093a)
- eslint & prettier: [AirBNB](https://github.com/airbnb/javascript) + no-semicolon (노세미는 제 취향인데 무조건 찍는 쪽으로 하자고 해도 됩니다)
- [defineAsyncComponent를 잘 활용하자. (code-split)](https://blog.logrocket.com/how-async-components-can-optimize-performance-in-vue-apps/)
- 되도록이면 기존의 options API 대신 composition API를 사용한다.
- 디자인에 반복적인 요소가 보인다면 템플릿보다는 최대한 스크립트쪽을 활용한다.
- [모든 단위는 px만 사용한다. (em, rem, pt... (X))](https://stackoverflow.com/questions/11799236/should-i-use-px-or-rem-value-units-in-my-css/11803273)
- 크기, 여백 등에 사용하는 px은 가능하다면 최대한 4의 배수, 내지는 짝수만 사용하도록 한다. (border등은 무관)
- .m-, .f- 등의 dom에 직접 클래스를 붙여 스타일링하는 경우는 그 방식이 요긴한 상황이 아니라면 가급적 피한다.
- String은 가급적 single quote(')를 사용한다. (템플릿에서는 String을 위해 '를 쓰는게 강제되는 상황이 많아서 프로젝트 전체적으로 통일하기 위함)
- 링크 이동은 가급적 <RouterLink>를 활용하거나, <a :href="값" @click.prevent="$router.push(path)">를 활용하여 실제 <a href>로 렌더링될 수 있도록 한다. (SEO)

### etc
- components/app => 앱의 기능적인 특성들(Modal, Toast 등...)에 관련된 전역 컴포넌트들로, 비즈니스 로직(db)과 무관.
- components/common => 비즈니스 로직이나, 여러 화면들에 공통으로 사용되는 레이아웃 등이 해당되는 공통 컴포넌트들. 사실 이 중에는 app에 들어가야 하는지 common에 들어가야 하는지 모호한 것들도 있을 듯 하다.
- 디자이너의 요구 사항을 최대한 반영하되, 변수의 추가는 최소한으로 한다. 이를테면 색이 대표적인데, rgba(122, 112, 195, 0.25);가 코드상에 존재하는데 zeplin에는 rgba(122, 112, 195, 0.32);가 있고 이건 우리가 기존에 가지고 있지 않던 변수라면, 이것을 새로 추가해서 사용하기보다는 기존의 0.25 변수를 사용하는 것으로 합의를 시도(?)해보고, 디자이너나 기획자가 구체적 근거를 들어 반드시 추가되어야 한다고 할 경우에만 추가한다.
- fontawesome.scss에서 기본적으로 모든 값은 주석처리하고, 사용할 것만 풀어서 사용하여 번들 사이즈를 줄인다.
- props는 가급적 []보다는 {}로 사용하고, 최소한 각 항목의 type 정도는 표기하여 사용하도록 한다. 받을 수 있는 값이 한정된 케이스라면 validator를 사용한다.
- scss에서 hierarchy를 깊게 사용하면 가독성에는 도움이 될 수 있으나 중복이 많아져 생성되는 번들의 크기가 증가하므로, 부모 안에 넣지 않아도 고유하게 select가 가능한 항목들은 적절히 밖으로 꺼내서 적는 것도 무방하다.
- @media 구분 기준들은 현재 768, 992, 1200, 1440의 4개이며, min-width는 그대로, max-width는 이 값들에서 - 1을 하여 사용한다.
- 가급적 함수 이름 자체가 주석이 될 수 있도록 코드를 작성하고, 나중에 본인이 다시 봐도 잘 모르겠다 싶을 정도로 구현이 복잡한 경우에만 '어떤 기능을 하는 함수인가?' 정도만 적어둔다.
- store에서 '단수' 상태명은 detail (models/:id)의 response에 매칭되며, '복수' 상태명은 all (models)의 response와 매칭된다.

### recommended vscode extensions
- Vetur
- GitLens
- Vue Peek (jsconfig.json에서 `"@/*": ["src/*"]` 이걸 알려줘도 vue파일은 import시에 끝에 .vue를 붙이지 않으면 찾지 못하는데, 이 문제를 해결해준다.)