export const featureFlags = { assistant: false }
export const profile = {
  name: '万乐琪',
  role: 'XR / 三维图形开发工程师',
  location: '',
  email: 'nancywan1004@gmail.com',
  phone: '(+86) 17813278350',
  github: 'https://github.com/nancywan1004'
}

// 简历下载：文件实体位于 public/resume/，必须保持普通 Git 对象（不能进 LFS），
// 否则 Vercel 部署后拿到的是指针文件。filename 仅决定浏览器保存时的文件名。
export const resume = {
  href: '/resume/wan-leqi-resume-2026-10.pdf',
  filename: '万乐琪简历_2026.10.pdf',
  meta: 'PDF · 2026.10 · 2.2 MB'
}

export type ProjectKind = 'work' | 'personal'
export type ProjectStatus = 'published' | 'draft'
export type Project = {
  id: string
  kind: ProjectKind
  title: string
  category: string
  year: string
  tags: string
  description: string
  detail: string
  status: ProjectStatus
}

export const projects: Project[] = [
  {
    id: '01', kind: 'work', title: 'Universe', category: '三维重建与创作平台', year: '2026',
    tags: 'PlayCanvas · 3DGS · GLSL / WGSL',
    description: '面向 3DGS 场景重建、编辑与交互的 SaaS 平台。负责三维前端开发，工作包括重光照、大场景 LOD 流式调度与 Shader 特效系统。',
    detail: '三维前端开发 / 重光照 · 大场景 LOD · Shader 特效',
    status: 'published'
  },
  {
    id: '02', kind: 'work', title: 'AI + AR 随身导览', category: '大模型问答与空间定位', year: '2024 — 至今',
    tags: '小程序 · 大模型 · VPS AR · 流式问答',
    description: '面向文旅场景的 AI + AR 导览小程序，集成大模型问答与 VPS AR 定位，支撑现场示范应用落地。',
    detail: '案例整理中：将补充技术选型、流式问答链路、YUV 转换与端上性能处理。',
    status: 'draft'
  },
  {
    id: '03', kind: 'work', title: 'YumeGO AR', category: '移动端 AR 游戏', year: '2022 — 2024',
    tags: 'iOS / Android · Unity · AR Foundation · Lua',
    description: '与时尚品牌合作的多人多地 AR 寻宝游戏，融合协作解谜玩法与 AI 对话体验，已在全球上线。',
    detail: '案例整理中：将补充多人同步、玩法编排与上线迭代过程。',
    status: 'draft'
  },
  {
    id: '04', kind: 'work', title: 'Yumebau VR', category: 'Meta Quest 自研游戏', year: '2022 — 2024',
    tags: 'Unity · Meta Quest · VR UI · 中台工具',
    description: '自研 VR 游戏 IP 的内容配置系统、腕带 UI 菜单与中台软件包研发。',
    detail: '案例整理中：将补充内容管线、运行时热补丁与编辑器扩展。',
    status: 'draft'
  },
  {
    id: '05', kind: 'personal', title: 'WebGPU Shader 实验', category: '实时图形', year: '进行中',
    tags: 'WebGPU · WGSL · 计算着色器',
    description: '以 WGSL 编写的着色实验，用于验证 WebGPU 渲染管线与计算着色器的表达能力。',
    detail: '实验整理中：将补充管线搭建、与 WebGL 实现的对照及可视化记录。',
    status: 'draft'
  },
  {
    id: '06', kind: 'personal', title: '视角覆盖分析器', category: '图形工具', year: '进行中',
    tags: 'TypeScript · 几何计算 · 可视化',
    description: '分析三维场景的相机视角覆盖情况，解决视角不全与二维投影到三维的多视角一致性问题。',
    detail: '工具整理中：将补充覆盖判定方法、投影一致性校验与结果可视化。',
    status: 'draft'
  },
]

export type Exploration = {
  id: string
  title: string
  topic: string
  status: string
  summary: string
  notes: string[]
}

export const explorations: Exploration[] = [
  {
    id: '01', title: 'WebGPU 渲染管线', topic: '实时图形 / 管线迁移', status: '待补充',
    summary: '对照 WebGPU 与 WebGL 在 3DGS 渲染与后处理链路中的可行性、限制与迁移成本。',
    notes: [
      '待补充：计算着色器与存储缓冲区的适用边界',
      '待补充：与现有 WebGL 后处理并行维护的取舍',
      '待补充：同一场景的可比指标与测试条件',
    ]
  },
  {
    id: '02', title: '3DGS 重光照与阴影', topic: '实时图形 / 光照', status: '待补充',
    summary: '世界空间亮度场的烘焙方式、同源重投影与相关回归项，整理已验证与仍未闭环的部分。',
    notes: [
      '待补充：笔刷半径与世界空间亮度体积的映射',
      '待补充：相机时序、近景点阵与预览提交跳变的回归清单',
    ]
  },
  {
    id: '03', title: 'AR 空间定位（VPS）', topic: '空间计算 / 定位', status: '待补充',
    summary: 'VPS 定位精度、弱网降级与端上性能的验证方法，以及现场部署中出现的边界情况。',
    notes: [
      '待补充：定位精度与重定位耗时的测试条件',
      '待补充：资产预加载、内存与环境贴图的端上表现',
    ]
  },
]

export const experience = [
  {
    period: '05/24 — 至今',
    title: '高级三维工程师',
    place: '北京数原数字化城市研究中心',
    description: '城市场景多元三维技术栈探索与项目落地，涉及 3D Gaussian Splatting（3DGS）渲染与创作、AI + AR 小程序等方向。',
    points: [
      'Web 端 3DGS 渲染 + 创作平台：搭建基于 PlayCanvas 的 3DGS 渲染与编辑创作链路；负责自研高斯重光照（点光源 / 聚光灯 / 手电筒）系统与特效系统，并搭建多种光影特效混合渲染管线；集成代理网格以实现高斯的物理碰撞与阴影管线。',
      '大场景 LOD 渲染优化：面向千万至亿级高斯场景（三里屯 SOHO 演示场景 9,434 万高斯点），优化八叉树 LOD 调度、中心优先预取与增量更新，减少重复同步和缓冲区重建；在 WebGPU 管线的部分场景实测中，播放段帧率中位数由 20 提升至 35 FPS。',
      'AI + AR：主导 AI + AR 随身导览小程序的研发，集成大模型 AI 问答与 VPS AR 定位功能；实现流式问答响应机制，接入阿里云 ASR/TTS；优化 YUV→RGB 毫秒级转换、资产预加载、内存与环境贴图渲染，支撑水峪嘴村示范应用成功落地。',
    ],
  },
  {
    period: '09/22 — 04/24',
    title: 'XR 内容与系统工程师',
    place: 'Yumebau Inc.',
    description: '参与两个从 0-1 落地的完整项目：iOS/Android AR 应用与 Meta Quest VR 自研游戏。',
    points: [
      '主持与 ACRNYM（一机能时尚品牌）合作的 YumeGO AR“寻宝游戏”开发，融合多人多地协作 DDoS 解谜玩法与 AI 图灵测试对话体验，成功在全球上线。',
      '设计并实现自研 VR 游戏 IP 的内容配置系统与编辑器扩展工具，支持资产保存、编辑及运行时服务器端热补丁，保障内容一致性与完整性。',
      '负责 VR 游戏中台软件包的研发，涵盖 Swagger API 自动化 DLL 集成、Oculus 登录系统与 UGC 库存管理。',
      '研发 VR 腕带 UI 菜单系统，实现数据驱动的子菜单（网络、库存等）；基于 Unity UI Toolkit 构建调试工具，支持服务器环境配置、网络性能与版本信息测试。',
    ],
  },
  {
    period: '01/22 — 04/22',
    title: 'Unity 主程',
    place: 'Yumebau 行业项目',
    description: '研究生期间参与行业毕设项目，负责 AR 游戏玩法设计与 SDK 技术选代。',
    points: [
      '与客户、UX 与游戏设计师合作，研发可交互积木组件新机制（UI 控制、弹道模拟、充电模块等），提升交互体验。',
      '推动 YumeGO Lua SDK 优化，新增 Coroutine 支持、跨脚本通信、可定制弹窗 UI 等功能，增强可扩展性。',
      '基于 Unity AR Foundation 的自研 SDK，开发 iOS 平台 Roblox 风格创造性构建 AR 迷你游戏；使用 Lua + xLua 编写行为脚本，实现玩法逻辑。',
      '完成场景与素材 AB 包配置，并接入 YumeGO App 与 YMS AR 内容云平台，实现端到端交付。',
    ],
  },
  {
    period: '05/20 — 08/20',
    title: '软件开发实习生',
    place: 'RBC（加拿大皇家银行）',
    description: '基于 Stencil.js + Node.js 构建中间件微服务，用于管理聊天机器人知识库；集成 Azure Cognitive API 与 AWS S3，提升知识管理与存储能力。',
    points: [
      '与 UX 设计师和产品合作，为公司内部网站开发并封装功能性 UI 组件；根据用户反馈持续迭代，并向高级管理层展示 PoC 验证，推动产品优化方向。',
    ],
  },
  {
    period: '09/19 — 04/20',
    title: 'iXP 前端开发实习生',
    place: 'SAP Inc.（思爱普）',
    description: '主导序列标记显示 / 隐藏增强功能的设计与交付；与 UX 团队协作定义使用场景，并与团队高级工程师沟通，确保实现的质量与一致性。',
    points: [
      '在基于 TypeScript + SAP UI5 的大型 monorepo 中，负责 SAP HANA Analytics Cloud 图表 UI 的质量保障（错误追踪、修复、回归分析），提升系统稳定性与用户体验。',
    ],
  },
]
export const education = [
  { period: '09/21 — 12/22', title: '数字媒体硕士', place: '英属哥伦比亚大学 数字媒体中心（CGPA: 4.2/4.3）', description: '课程：虚拟现实用户体验、游戏设计、数字媒体基础' },
  { period: '09/16 — 08/21', title: '计算机与统计学理学荣誉学士', place: '英属哥伦比亚大学', description: '课程：算法与数据结构、软件架构、计算机视觉、机器学习、数据库、操作系统' },
]
export const skills = [
  { label: '编程语言', items: ['JS / TS', 'C#', 'Python', 'C++'] },
  { label: '软件', items: ['Unity', 'IsaacSim', 'UE5'] },
  { label: '硬件', items: ['Meta Quest 2 / 3', 'Pico 4 UE'] },
  { label: 'AI 工具', items: ['Codex / GPT', 'Cursor', 'CodeBuddy'] },
  { label: '技术资质', items: ['Unity Certified Professional Programmer 官方认证', 'Microsoft Azure Fundamentals'] },
  { label: '语言', items: ['英语（十分流利，雅思 7.5）', '日语（初中级，N5 水平）'] },
]
