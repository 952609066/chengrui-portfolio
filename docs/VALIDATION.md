# Validation

验证日期：2026-10-24。

| 检查                                    | 结果                                                                 |
| --------------------------------------- | -------------------------------------------------------------------- |
| 4 项路径与静态导出回归检查              | 通过                                                                 |
| Next.js 生产构建、TypeScript 和静态导出 | 根路径与 `/preview-portfolio` 均通过                                 |
| 本机 Chrome 浏览验证                    | 两种路径各检查桌面 1440×1000、手机 390×844                           |
| 页面交互                                | 项目筛选、详情、明暗主题、博客列表与文章返回正常                     |
| 资源                                    | 图片解码、下载链接、样式与脚本无失败响应                             |
| 简历                                    | 打印页、PDF 下载正常；对外 PDF 从最终打印页生成，共两页              |
| SEO                                     | robots 正常；配置网站地址时生成 canonical、Open Graph URL 与 sitemap |
| 静态页面 404                            | 返回正确的 404 状态                                                  |
| 格式检查                                | Prettier 通过                                                        |

修复了 Windows 本地导出中部分 App Router 数据文件路径与浏览器请求不一致的问题，并加入静态文件路径回归检查。Linux 已扁平输出无需改动。

原始浏览记录：[根路径](verification-root.json)、[项目路径](verification-project-path.json)。截图：[桌面](preview-desktop.png)、[手机](preview-mobile.png)。

GitHub Actions 配置依据 GitHub 官方 Pages 工作流准备；本次未上传仓库或执行远程发布。真实仓库开启 Pages 后，由工作流取得实际网址与路径并重新构建。
