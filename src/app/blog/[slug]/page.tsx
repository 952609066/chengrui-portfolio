import { allPosts } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";
import { mdxComponents } from "@/mdx-components";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import profile from "@/data/profile.json";
import { absoluteUrl } from "@/lib/site.mjs";

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post._meta.path.replace(/\.mdx$/, "") }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((post) => post._meta.path.replace(/\.mdx$/, "") === slug);
  if (!post) return {};
  const url = absoluteUrl(`/blog/${slug}/`);
  return {
    title: post.title,
    description: post.summary,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt,
      ...(url ? { url } : {}),
    },
  };
}
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find((post) => post._meta.path.replace(/\.mdx$/, "") === slug);
  if (!post) notFound();
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    description: post.summary,
    url: absoluteUrl(`/blog/${slug}/`),
    author: { "@type": "Person", name: profile.name },
  }).replace(/</g, "\u003c");
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Link className="magic-secondary" href="/blog/">
        返回工程复盘
      </Link>
      <header style={{ margin: "32px 0" }}>
        <p className="figure-note">
          {post.publishedAt} / {profile.name}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight" style={{ lineHeight: 1.5 }}>
          {post.title}
        </h1>
        <p className="magic-bio" style={{ marginTop: 14 }}>
          {post.summary}
        </p>
      </header>
      <article className="prose dark:prose-invert max-w-none">
        <MDXContent code={post.mdx} components={mdxComponents} />
      </article>
    </main>
  );
}
