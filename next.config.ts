import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 인덱스 3개만 /writing 으로 합친다.
   *
   * 개별 글의 permalink(/insight/:slug 등 18개)는 건드리지 않는다.
   * RSS guid, sitemap, Giscus 스레드가 전부 거기에 묶여 있다.
   * 인덱스 페이지는 개별 글에 비해 외부 인바운드 가치가 사실상 0이라
   * 옮겨도 잃는 게 없다.
   *
   * 나중에 글 URL 까지 /writing/:slug 로 옮기고 싶으면 velite transform 의
   * permalink 한 줄과 여기 와일드카드 세 줄이면 된다. 모든 컴포넌트가
   * 이미 lens 를 읽고 있다.
   */
  async redirects() {
    return [
      { source: "/insight", destination: "/writing", permanent: true },
      { source: "/memo", destination: "/writing", permanent: true },
      { source: "/log", destination: "/writing", permanent: true },
    ];
  },
};

export default nextConfig;
