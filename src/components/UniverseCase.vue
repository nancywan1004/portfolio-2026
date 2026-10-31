<script setup lang="ts">
import MediaPreviewCard from './MediaPreviewCard.vue'
import LodCaseStudy from './LodCaseStudy.vue'
import RelightingCaseStudy from './RelightingCaseStudy.vue'
import ShaderCaseStudy from './ShaderCaseStudy.vue'
import CaseChapter from './CaseChapter.vue'
const demos = [
  { n: '01', type: '平台概览', title: '平台介绍与功能概览', description: '了解 Universe 的产品目标与创作流程。', url: 'https://weixin.qq.com/sph/AEYrd9MRaQ' },
  { n: '02', type: '综合创作', title: '重光照 × 特效 × 资产放置', description: '在重建场景中组合光照、视觉效果与三维资产。', cover: '/media/universe/demo-02.webp', url: 'https://www.xiaohongshu.com/discovery/item/6a4cc945000000001c027a21?source=webshare&xhsshare=pc_web&xsec_token=ABm2xeTCWD8tFWd9IQrEYs1ZBDGZ17_4FTToSv6KyAB4I=&xsec_source=pc_share' },
  { n: '03', type: '综合创作', title: '场景重光照与资产编辑演示', description: '通过光照和资产编排，探索场景的二次创作。', cover: '/media/universe/demo-03.webp', url: 'https://www.xiaohongshu.com/discovery/item/6a4b76060000000011006727?source=webshare&xhsshare=pc_web&xsec_token=ABA_ezy8Rldt6LG73YgDI5bYNptGJ0px4N0L82TfSgAhw=&xsec_source=pc_share' },
  { n: '04', type: '交互光照', title: '手电筒交互与场景探索演示', description: '手电筒交互，让真实场景成为寻宝体验。', cover: '/media/universe/demo-04.webp', url: 'https://www.xiaohongshu.com/discovery/item/6a4f7ae100000000160272f7?source=webshare&xhsshare=pc_web&xsec_token=ABIYy1-bwF4sMiTkAP4sXW6O5wiXKXh9QGNUh-xjDl-F8=&xsec_source=pc_share' },
  { n: '05', type: '风格化特效', title: '3DGS 风格化特效演示', description: '观察高斯场景在视觉特效下的不同表达。', cover: '/media/universe/demo-05.webp', url: 'https://www.xiaohongshu.com/discovery/item/6a59fd3f000000000100d0ac?source=webshare&xhsshare=pc_web&xsec_token=ABmxYAKfEVbP8joL076aDzFmizkMhk3YY7E4qI1LdynYk=&xsec_source=pc_share' },
  { n: '06', type: '钢笔速写', title: '钢笔速写风格渲染演示', description: '从真实场景，到三渲二的风格化画面。', cover: '/media/universe/demo-06.webp', url: 'https://www.xiaohongshu.com/discovery/item/6a5f4954000000000301d9e1?source=webshare&xhsshare=pc_web&xsec_token=ABe9tX8SCxSG6KMiMdRf50EVDcaWl1KBgZrtNycgnG0iA=&xsec_source=pc_share' },
]
</script>

<template>
  <div class="universe-case">
    <section class="case-opening" aria-labelledby="universe-heading">
      <p class="eyebrow">项目 01 / UNIVERSE</p>
      <h2 id="universe-heading" tabindex="-1">三维重建<br><span class="serif">与创作 SaaS 平台</span></h2>
      <p class="case-lead">平台面向相机采集后的三维场景重建与二次编辑，支持重光照、视觉特效、资产放置及交互体验制作。</p>
      <dl class="project-facts"><div><dt>时间</dt><dd>2026</dd></div><div><dt>我的角色</dt><dd>三维前端开发</dd></div><div><dt>工作重点</dt><dd>重光照 / 大场景 LOD / Shader</dd></div><div><dt>技术环境</dt><dd>PlayCanvas · 3DGS · GLSL / WGSL</dd></div></dl>
    </section>
    <section class="chapter-group" aria-label="项目技术专题">
      <p class="eyebrow chapter-group-label">核心工作</p>
      <CaseChapter id="relighting" number="01" title="3DGS 场景重光照" description="扩展高斯材质着色路径，支持全局亮度、局部灯光、亮灯笔刷与交互手电筒。" cover="/media/universe/demo-04.webp" cover-alt="交互手电筒演示封面">
        <RelightingCaseStudy />
      </CaseChapter>
      <CaseChapter id="lod" number="02" title="大场景 LOD 调度优化" description="从视野优先加载到运行时修复，结合多场景评测，验证叶块粒度与预算分配的取舍。演示场景三里屯 SOHO 为 9,434 万高斯点。" cover="/media/universe/sanlitun-poster.jpg" cover-alt="三里屯 SOHO 三维场景">
        <LodCaseStudy />
        <details class="scene-demo"><summary>三里屯 SOHO 场景漫游 · 9,434 万高斯点</summary><figure class="tour-media"><div class="scene-scale"><p class="eyebrow">演示场景 / 三里屯 SOHO</p><p class="scale-value">9,434<small>万高斯点</small></p><p class="scale-note">本段漫游演示使用的重建场景规模；性能结论另见上方 LOD 各轮评测。</p></div><video controls playsinline preload="none" poster="/media/universe/sanlitun-poster.jpg" aria-label="三里屯 SOHO 三维场景漫游（9,434 万高斯点）"><source src="/media/universe/sanlitun-tour.mp4" type="video/mp4">浏览器不支持视频，请<a href="/media/universe/sanlitun-tour.mp4">打开漫游视频</a>。</video><figcaption><span>三里屯 SOHO / 大场景漫游</span><span>9,434 万高斯点 · 体验演示 · 原速 · 非性能对照实验</span></figcaption></figure></details>
      </CaseChapter>
      <CaseChapter id="shader" number="03" title="Shader 特效系统" description="统一着色所有权与贡献者仲裁，实现风格化算法，处理开场门控与着色交接。" cover="/media/universe/demo-06.webp" cover-alt="钢笔速写风格渲染演示封面">
        <ShaderCaseStudy />
      </CaseChapter>
    </section>
    <section class="demo-collection" aria-labelledby="demo-title">
      <div class="demo-heading"><p class="eyebrow">UNIVERSE / DEMOS</p><h3 id="demo-title">功能演示与项目视频</h3></div>
      <div class="media-preview-grid"><MediaPreviewCard v-for="demo in demos" :key="demo.n" :title="demo.title" :description="demo.description" :category="demo.type" :url="demo.url" :cover="'cover' in demo ? demo.cover : undefined" :platform="demo.n === '01' ? '微信视频号' : '小红书'"/></div>
    </section>
  </div>
</template>

<style scoped>
.platform-media{margin:0}.platform-media>img{display:block;width:100%;height:auto}.platform-media figcaption{padding:14px 0;font-size:10px;line-height:1.8;color:var(--muted)}.scene-demo{margin-top:20px;border-block:1px solid var(--rule)}.scene-demo>summary{cursor:pointer;list-style:none;font-size:12px;line-height:1.8;padding:18px 24px 18px 0;position:relative}.scene-demo>summary::-webkit-details-marker{display:none}.scene-demo>summary:after{content:'+';position:absolute;right:2px}.scene-demo[open]>summary:after{content:'−'}
.scene-scale{display:grid;grid-template-columns:1fr auto;align-items:baseline;gap:0 24px;padding:28px 0 24px;border-bottom:1px solid var(--rule);margin-bottom:22px}
.scene-scale>.eyebrow{grid-column:1;grid-row:1}
.scale-value{grid-column:1;grid-row:2;margin-top:12px;font-size:clamp(32px,3.2vw,46px);line-height:.98;letter-spacing:-.04em}
.scale-value small{font-size:.28em;letter-spacing:0;margin-left:8px;color:var(--muted)}
.scale-note{grid-column:2;grid-row:1/3;align-self:end;max-width:230px;text-align:right;font-size:10px;line-height:1.7;color:var(--muted)}
@media(max-width:760px){.scene-scale{grid-template-columns:1fr}.scale-value{font-size:clamp(30px,9vw,38px)}.scale-note{grid-column:1;grid-row:3;text-align:left;margin-top:10px;max-width:none}}
.chapter-group{margin:40px 0 55px}
.chapter-group-label{padding-bottom:22px}
</style>
