# Living Personal Site

강민재의 정체성, 공개 기록, 만든 결과, 그리고 이를 떠받치는 비공개 기반 시스템을 설명하는 개인 사이트다. 페이지들은 하나의 은유로 묶지 않고 각자의 성격을 가장 잘 표현하는 레이아웃을 가진다(ADR-0002). 공통점은 디테일 문법(헤어라인, 영문 단독 섹션 제목, 점 표기 날짜)이다.

## Language

**About**:
방문자가 가장 먼저 만나는 공개 자기소개 영역. 강민재가 누구이며 무엇을 이해하고 해결하는 사람인지 짧고 분명하게 전달한다.
_Avoid_: Home, Profile

**Writing**:
개인적인 경험과 지식을 다른 사람이 읽고 사용할 수 있도록 변환한 공개 기록.
_Avoid_: Blog, Archive

**Writing Lens**:
글이 독자에게 제공하는 주된 가치를 나타내는 관점. `Understand`, `Solve`, `Reflect` 중 하나를 주된 관점으로 갖는다.
_Avoid_: Category, Content Type

**Understand**:
개념, 원리, 구조를 이해할 수 있게 만드는 Writing Lens.
_Avoid_: Learn, Study

**Solve**:
구체적인 문제와 해결 과정을 재사용할 수 있게 만드는 Writing Lens.
_Avoid_: Build, How-to

**Reflect**:
경험에서 얻은 판단, 변화, 다음 질문을 공유하는 Writing Lens.
_Avoid_: Log, Diary

**Projects**:
세상에 내놓은 작업과 그 작업이 만든 변화를 설명하는 공개 결과 영역. 항목 하나는 문제, 판단, 결과, 관련 Writing이 연결된 형태로 표현한다. URL 은 `/portfolio` 를 유지한다(ADR-0002 — 라벨 교체이지 이주가 아니다).
_Avoid_: Portfolio, Showcase

**Roots**:
공개 활동을 지속시키는 비공개 기반 시스템들. 별도 영역이 아니라 Projects 항목으로 다룬다(ADR-0001). 설계와 판단은 공개하고 인터페이스와 데이터는 공개하지 않는다.
_Avoid_: Dashboard, Agent OS Monitor

**Visibility**:
Projects 항목의 소스와 인터페이스가 공개되어 있는지를 나타내는 값. `public` 또는 `private`. `private`이어도 문제, 판단, 결과는 공개한다. 링크 목록이 비어 있는 것이 정상 상태다.
_Avoid_: Secret, Hidden

**Root System**:
생각하고 기록하고 만드는 일을 지속적으로 축적시키는 private-first 시스템. Agent OS와 dref가 이에 해당한다.
_Avoid_: Tool, Utility

**Private Interface**:
Root System을 관찰하거나 사용하는 비공개 화면. Tailscale 같은 사설 접근 경계 안에서만 제공한다.
_Avoid_: Public Dashboard, Root