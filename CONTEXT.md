# Living Personal Site

강민재의 정체성, 공개 기록, 만든 결과, 그리고 이를 떠받치는 비공개 기반 시스템을 하나의 살아 있는 세계로 설명하는 개인 사이트다.

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

**Portfolio**:
세상에 내놓은 작업과 그 작업이 만든 변화를 설명하는 공개 결과 영역.
_Avoid_: Projects, Showcase

**Constellation**:
하나의 Portfolio 항목을 문제, 판단, 결과, 관련 Writing이 연결된 형태로 표현한 단위.
_Avoid_: Project Card, Star

**Roots**:
공개 활동을 지속시키는 비공개 기반 시스템들. 별도 영역이 아니라 Portfolio 항목으로 다룬다(ADR-0001). 설계와 판단은 공개하고 인터페이스와 데이터는 공개하지 않는다.
_Avoid_: Dashboard, Agent OS Monitor

**Visibility**:
Portfolio 항목의 소스와 인터페이스가 공개되어 있는지를 나타내는 값. `public` 또는 `private`. `private`이어도 문제, 판단, 결과는 공개한다. 링크 목록이 비어 있는 것이 정상 상태다.
_Avoid_: Secret, Hidden

**Root System**:
생각하고 기록하고 만드는 일을 지속적으로 축적시키는 private-first 시스템. Agent OS와 dref가 이에 해당한다.
_Avoid_: Tool, Utility

**Private Interface**:
Root System을 관찰하거나 사용하는 비공개 화면. Tailscale 같은 사설 접근 경계 안에서만 제공한다.
_Avoid_: Public Dashboard, Root

**Living Tree**:
About을 줄기, Portfolio를 마디, Writing을 가지와 잎으로 연결하는 사이트의 중심 은유. 일러스트로 그리지 않고 레이아웃으로 구현한다. [[Rail]] 참고.
_Avoid_: Site Map, Menu Tree

**Rail**:
사이트 전체를 관통하는 고정 x좌표의 세로선. 왼쪽 거터에는 섹션 라벨, 연도, 날짜 같은 좌표만 놓고 오른쪽에 본문을 둔다. 라우트가 나뉘어도 좌표계가 바뀌지 않으므로 하나의 사이트로 읽힌다. 좌표가 하나뿐인 면(글 상세)에는 쓰지 않는다 — 거터가 빈 여백이 된다.
_Avoid_: Sidebar, Gutter Nav
