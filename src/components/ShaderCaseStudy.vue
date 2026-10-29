<script setup lang="ts">
import CaseStudy from './CaseStudy.vue'
</script>

<template>
  <CaseStudy>
    <header class="case-heading">
      <div class="problem-context">
        <div><span class="mini-label">背景与问题</span><p>平台需要在重建场景上配置画风、场景动态和开场动画。但 3DGS 缺少面片法线，多个效果又会争用同一个着色槽；单独实现效果，无法保证组合、切换和开场交接时的渲染状态一致。</p></div>
        <div><span class="mini-label">我的任务</span><p>负责 Shader 特效系统：建立着色所有权和生命周期规则，实现代表性风格算法，处理开场门控、着色交接与卸载恢复。</p></div>
      </div>
      <p class="intro">先明确着色修改的接入规则，再实现画风算法，最后处理开场与其他效果的交接。</p>
    </header>

    <article id="shader-ownership" class="round" tabindex="-1">
      <div class="round-label"><span>01</span><p>所有权与仲裁</p></div>
      <div class="round-body">
        <h4>Composer 机制：让多个效果通过同一入口修改着色逻辑</h4>
        <p class="lead">夜景、形变、点彩与开场可能同时写入 <code>gsplatModifyVS</code>。将分散写入收敛到 Composer，由贡献者声明作用域、优先级和独占需求，统一决定生效内容。</p>
        <div class="ownership-map" aria-label="贡献者经统一仲裁后生成着色逻辑">
          <div><b>效果贡献</b><span>光照 / 形变 / 点彩 / 开场</span></div>
          <span aria-hidden="true">→</span><div><b>Composer 仲裁</b><span>作用域 · 优先级 · 容量</span></div>
          <span aria-hidden="true">→</span><div><b>统一合成与下发</b><span>GLSL / WGSL 着色逻辑</span></div>
        </div>
        <p class="round-outcome"><strong>结果与边界：</strong>将“谁覆盖谁”变为显式规则；开场整段接管时，其他分层贡献让位，结束后恢复。组合能力受独占与容量约束，不以任意叠加为目标。</p>
        <details><summary>作用层、仲裁规则与光照接入</summary><div class="detail-content"><p>按修改对象区分材质 chunk、unified work buffer、独立 Layer 与全屏 post，避免把所有效果塞进顶点槽。Composer 对分层贡献按优先级拼接；完整着色逻辑与分层逻辑不混排，冲突或超容量时输出诊断。</p><p>重光照作为贡献者参与同一协议；一次性 reveal 接管时延后夜景应用，交接结束再恢复。着色结构变化参与 signature，逐帧 uniform 变化不作为结构变更，避免无意义重编译。</p></div></details>
      </div>
    </article>

    <article class="round">
      <div class="round-label"><span>02</span><p>代表算法</p></div>
      <div class="round-body">
        <h4>风格化算法：用方向场与投影补偿实现钢笔和点彩</h4>
        <p class="lead">钢笔排线不能直接依赖表面法线；点彩又跨越 splat、全屏和天空三种投影路径。分别用图像方向场与跨层点径补偿处理这两个问题。</p>
        <div class="algorithm-pair">
          <div><span class="mini-label">钢笔 / 图像空间</span><b>结构张量 → 方向场 → 分层排线</b><p>从画面梯度提取笔触方向，以置信度回退、角度量化和加权模糊抑制方向跳变。</p></div>
          <div><span class="mini-label">点彩 / 跨层一致性</span><b>屏幕点径 → 投影换算 → 天空补偿</b><p>让近远点径、稀疏密度与天空笔触协调，并保护笔触不被后处理抹平。</p></div>
        </div>
        <a class="effect-preview" href="https://www.xiaohongshu.com/discovery/item/6a5f4954000000000301d9e1" target="_blank" rel="noopener noreferrer"><img src="/media/universe/demo-06.webp" alt="公园钢笔速写效果演示封面" loading="lazy" /><span>钢笔速写 · 查看效果演示 ↗</span></a>
        <p class="round-outcome"><strong>结果与取舍：</strong>形成图像后处理与 splat 混合两条画风路径。钢笔分析链使用低分辨率控制采样成本；平坦区域依赖回退方向，点彩跨层补偿仍需联合调参。</p>
        <details><summary>算法细节与渲染边界</summary><div class="detail-content"><p>钢笔以邻域梯度构建结构张量，取等照度线方向排线；方向分析链运行在 0.25 分辨率，主绘制回到全分辨率。方向置信度低时回退，并结合角度量化、收笔和羽化控制笔触。</p><p>点彩以像素点径反算投影斜率，配合世界空间哈希抽稀；天空走独立着色路径，以视觉尺度补偿、保护和回混与 splat 协调。风格化避免改动 center 以减少排序干扰，波形位移仍有排序边界。</p></div></details>
      </div>
    </article>

    <article class="round">
      <div class="round-label"><span>03</span><p>开场生命周期</p></div>
      <div class="round-body">
        <h4>开场生命周期：统一播放门控、着色交接与状态恢复</h4>
        <p class="lead">固定传播速度在不同尺度下可能提前结束或覆盖不全，开场结束时又可能与夜景恢复冲突。通过场景范围反算时长，将完成判定、内容放行和着色交接集中管理。</p>
        <div class="ownership-map reveal-map" aria-label="开场播放与交接顺序"><div><b>准备与接管</b><span>首帧前装载 Shader</span></div><span aria-hidden="true">→</span><div><b>播放与门控</b><span>按场景范围反算时长</span></div><span aria-hidden="true">→</span><div><b>完成与恢复</b><span>frameend 清理并交还</span></div></div>
        <p class="round-outcome"><strong>结果与取舍：</strong>开场完成后放行标注、资产与动画；卸载和夜景恢复延至 <code>frameend</code>，处理同帧覆盖的黑闪，代价是一帧交接延迟和初始化顺序约束。</p>
        <details><summary>开场尺度适配与交接修复</summary><div class="detail-content"><p>固定传播速度在不同尺度下可能提前结束或覆盖不全。由 bbox 推导有效半径，补偿速度并反算完成时间；统一完成谓词用于动画门控与夜景延后，覆盖范围仍取决于场景和参数。</p><p>立即恢复夜景可能被同帧卸载覆盖，因此在 frameend 清理并恢复，保留初始化顺序约束。开场 sketch 是一次性揭示，常驻 pen-sketch 是全屏风格化，生命周期和注入路径分别管理。</p></div></details>
        <details><summary>渲染状态恢复与后端适配</summary><div class="detail-content"><p>卸载效果时，对 chunk、Layer、背景色、曝光、雾和自动渲染等副作用进行快照与恢复。</p><p>全屏滤镜主要复用 GLSL 经引擎转译；点彩的 splat、片元与天空路径分别适配 GLSL / WGSL。跨后端需处理指针参数、类型转换和图像 UV 差异，不以“一份代码自动覆盖全部路径”概括。</p></div></details>
      </div>
    </article>

    <section class="round result-round" aria-labelledby="shader-result-title">
      <div class="round-label"><span>04</span><p>结果汇总</p></div>
      <div class="round-body">
        <h4 id="shader-result-title">着色仲裁、画风算法与开场交接的交付结果</h4>
        <dl class="result-list">
          <div><dt>可控组合</dt><dd><strong>统一所有权与交接</strong><p>分层注入与贡献者仲裁明确覆盖关系；开场接管、内容放行和夜景恢复使用统一生命周期规则。</p></dd></div>
          <div><dt>画风实现</dt><dd><strong>方向场与跨层投影</strong><p>用图像结构生成钢笔排线，以点径换算和天空补偿处理点彩一致性，明确图像退化与排序边界。</p></dd></div>
          <div><dt>开场交接</dt><dd><strong>尺度适配与延后恢复</strong><p>按场景范围反算播放时长，完成后放行内容；在 frameend 清理并交还着色控制，处理同帧卸载覆盖夜景恢复的问题。</p></dd></div>
        </dl>
        <p class="result-note">以上对应系统与算法交付；效果组合、跨尺度播放和双后端表现仍需按具体路径验证。</p>
      </div>
    </section>
  </CaseStudy>
</template>

<style scoped>
.ownership-map{display:grid;grid-template-columns:1fr auto 1.15fr auto 1fr;align-items:center;gap:15px;padding:22px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.ownership-map b,.ownership-map div span{display:block}.ownership-map b{font-size:13px;font-weight:500}.ownership-map div span{font-size:11px;color:var(--muted);margin-top:5px}.ownership-map>span{color:var(--muted)}.algorithm-pair{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:22px}.algorithm-pair>div{border-top:1px solid var(--line);padding-top:16px}.algorithm-pair b{display:block;font-size:14px;font-weight:500;margin:10px 0}.algorithm-pair p{font-size:12px;color:var(--muted);margin:0}.effect-preview{display:grid;grid-template-columns:minmax(0,180px) 1fr;align-items:center;gap:20px;border:1px solid var(--line);text-decoration:none;color:inherit}.effect-preview img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}.effect-preview span{font-size:12px;padding:12px}.effect-preview:focus-visible{outline:1px solid var(--ink);outline-offset:4px}
@media(max-width:600px){.ownership-map{grid-template-columns:1fr;gap:10px}.ownership-map>span{transform:rotate(90deg);width:15px}.algorithm-pair{grid-template-columns:1fr;gap:20px}.effect-preview{grid-template-columns:110px 1fr;gap:6px}}
</style>
