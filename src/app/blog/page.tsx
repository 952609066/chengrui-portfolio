import { allPosts } from "content-collections";
import Link from "next/link";
export const metadata = { title: "工程复盘" };
export default function Blog() {
  return (
    <main id="main-content" className="personal-magic">
      <header className="magic-section-head">
        <h1 style={{ fontSize: 30 }}>工程复盘</h1>
        <Link href="/">返回首页</Link>
      </header>
      <p className="magic-bio">记录模型、数据与系统之间的选择。</p>
      {allPosts.map((post) => (
        <article className="magic-contact" style={{ textAlign: "left" }} key={post._meta.path}>
          <h2 style={{ fontSize: 22 }}>
            <Link href={"/blog/" + post._meta.path.replace(/\.mdx$/, "") + "/"}>{post.title}</Link>
          </h2>
          <p>{post.summary}</p>
          <small>{post.publishedAt}</small>
        </article>
      ))}
    </main>
  );
}
