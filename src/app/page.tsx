"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ArrowUpRight, Download, Mail, MapPin } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import WorkSection from "@/components/section/work-section";
import profile from "@/data/profile.json";
import { withBasePath } from "@/lib/site.mjs";
export default function Page() {
  const [filter, setFilter] = useState("全部");
  return (
    <main id="main-content" className="personal-magic">
      <header className="magic-top">
        <a href="#main-content">{profile.englishName}</a>
        <a href={withBasePath("/resume.html")}>
          简历 <ArrowUpRight size={14} />
        </a>
      </header>
      <BlurFade>
        <section className="magic-hero">
          <div>
            <p className="magic-eyebrow">{profile.heroTagline}</p>
            <h1>
              你好，我是{profile.name}
              <span>{profile.englishName}</span>
            </h1>
            <p className="magic-lead">
              {profile.heroLines.map((line, i) => (
                <span style={{ display: "block" }} key={i}>
                  {line}
                </span>
              ))}
            </p>
            <p className="magic-bio">{profile.summary}</p>
            <div className="magic-meta">
              <MapPin size={14} />
              {profile.location}
              <span>{profile.education[0].school} · 电机电子工程</span>
            </div>
            <div className="magic-actions">
              <a className="magic-button" href={withBasePath("/resume.pdf")} download>
                <Download size={15} />
                下载简历
              </a>
              <a className="magic-secondary" href={"mailto:" + profile.email}>
                <Mail size={15} />
                联系我
              </a>
            </div>
          </div>
          <img
            className="magic-avatar"
            src={withBasePath("/assets/monogram.svg")}
            width="104"
            height="104"
            alt={profile.englishName + " 字母标识"}
          />
        </section>
      </BlurFade>
      <section id="projects">
        <div className="magic-section-head">
          <h2>精选项目</h2>
          <span>模型、系统与真实交付</span>
        </div>
        <div className="magic-filters" role="group" aria-label="筛选项目">
          {["全部", "视觉算法", "边缘部署", "多模态"].map((x) => (
            <button key={x} aria-pressed={filter === x} onClick={() => setFilter(x)}>
              {x}
            </button>
          ))}
        </div>
        <div className="magic-projects">
          {profile.projects
            .filter((p) => filter === "全部" || p.category === filter)
            .map((p) => (
              <article className="magic-project" id={p.id} key={p.id}>
                <img
                  src={withBasePath("/assets/" + p.image)}
                  alt={p.title + "架构示意，非实测预测"}
                  width="900"
                  height="480"
                />
                <div className="magic-project-body">
                  <div className="magic-status">
                    {p.category}
                    <span>{p.status}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="magic-tags">
                    {p.stack.slice(0, 4).map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  <details>
                    <summary>
                      贡献与验证范围 <ArrowUpRight size={13} />
                    </summary>
                    <ul>
                      {p.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <p className="case-evidence">{p.evidence}</p>
                    <p className="case-boundary">{p.boundary}</p>
                  </details>
                </div>
              </article>
            ))}
        </div>
        <p className="figure-note">配图为流程示意，不代表模型预测。</p>
      </section>
      <section id="work">
        <div className="magic-section-head">
          <h2>实习经历</h2>
          <span>从实验到现场</span>
        </div>
        <WorkSection />
      </section>
      <section id="education">
        <div className="magic-section-head">
          <h2>教育经历</h2>
        </div>
        <div className="magic-education">
          {profile.education.map((e) => (
            <article key={e.school}>
              <span className="school-mark">{e.logo}</span>
              <div>
                <h3>{e.school}</h3>
                <p>{e.degree}</p>
                <small>{e.detail}</small>
              </div>
              <time>{e.dates}</time>
            </article>
          ))}
        </div>
      </section>
      <section id="skills">
        <div className="magic-section-head">
          <h2>技术实践</h2>
        </div>
        <div className="magic-skills">
          {profile.skills.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </section>
      <section className="magic-contact" id="contact">
        <h2>一起聊聊视觉与机器人。</h2>
        <p>欢迎交流算法工程、边缘推理与多模态应用。</p>
        <a href={"mailto:" + profile.email}>
          {profile.email}
          <ArrowUpRight size={16} />
        </a>
        <a className="magic-print" href={withBasePath("/resume.html")}>
          查看可打印简历
        </a>
      </section>
      <footer className="magic-footer">
        <span>
          {profile.name} · {new Date().getFullYear()}
        </span>
        <a href="https://github.com/magicuidesign/portfolio" target="_blank" rel="noreferrer">
          Based on Magic UI Portfolio
        </a>
      </footer>
    </main>
  );
}
