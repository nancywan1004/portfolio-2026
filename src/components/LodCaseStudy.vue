<script setup lang="ts">
import CaseStudy from './CaseStudy.vue'
const leafResults = [
  { leaves: '32,752', update: 49.8, frame: 99.9, clear: '6.503', points: '2.064' },
  { leaves: '16,384', update: 21.5, frame: 41.7, clear: '10.333', points: '2.190' },
  { leaves: '4,096', update: 6.2, frame: 17.2, clear: '11.900', points: '2.192' },
]
const renderResults = [
  { scale: 1, points: '4.01', fps: 97, first: '22.085', poses: '12.197 / 17.801 / 12.200', quality: '—' },
  { scale: 2, points: '3.26', fps: 106, first: '29.581', poses: '10.401 / 18.202 / 12.201', quality: '—' },
  { scale: 4, points: '1.86', fps: 120, first: '25.961', poses: '9.001 / 12.800 / 9.400', quality: '效果尚可' },
  { scale: 6, points: '1.24', fps: 120, first: '22.032', poses: '6.600 / 7.601 / 6.601', quality: '—' },
  { scale: 8, points: '0.84', fps: 120, first: '15.000', poses: '9.400 / 4.600 / 5.601', quality: '效果较糊' },
]
const budgetResults = [
  { budget: '6M', points: '5.84M', first: '29.7', fps: 45, clear: '59.2' },
  { budget: '4M', points: '3.92M', first: '25.1', fps: 59, clear: '48.0' },
  { budget: '2.5M', points: '2.42M', first: '18.9', fps: 60, clear: '32.4' },
]
</script>

<template>
  <CaseStudy class="lod-case">
    <header class="case-heading">
      <div class="problem-context">
        <div><span class="mini-label">背景与问题</span><p>亿级 3DGS 场景无法一次加载全部细节。原有浏览体验中，移动后画面长时间模糊、换档卡顿，首屏进度与实际画面状态也不一致。</p></div>
        <div><span class="mini-label">我的任务</span><p>负责 Viewer 端 LOD 调度与性能分析：在有限网络、点数和帧时间预算下，加快当前视野细化、减少运行时开销，并建立对标原始调度的评测与回归流程。</p></div>
      </div>
      <p class="intro">交付时间紧迫，先完成首轮加载体验改进；随后补齐评测，用每轮发现的问题决定下一步优化方向。</p>
    </header>

    <article class="round">
      <div class="round-label"><span>01</span><p>第一轮交付<br /><small>v4 阶段</small></p></div>
      <div class="round-body">
        <h4>视野优先调度：加快当前视野的细节恢复</h4>
        <p class="lead">优先下载视野内、尤其中心区域的细节；交互后短时提高加载与同步活跃度，并修正资源上屏与首屏进度。</p>
        <div class="process" aria-label="首轮调度流程">
          <div><b>视野优先</b><span>当前需求进入队列前部</span></div><i aria-hidden="true">→</i>
          <div><b>短时 burst</b><span>移动、缩放后集中细化</span></div><i aria-hidden="true">→</i>
          <div><b>及时上屏</b><span>下载与显示状态对齐</span></div>
        </div>
        <p class="round-outcome"><strong>交付与后续：</strong>完成视野优先、渐进细化和首屏进度调整。但当时尚无统一评测，无法判断不同场景的净收益，因此下一步先建立基线对照。</p>
        <details><summary>实现记录与版本</summary><div class="detail-content"><p>渐进拉取中间档位，修复旧请求占用下载槽位、并发槽不同步及首屏进度门控。v4 创建 v5 时的快照中，移动 / 缩放 / 解锁 burst 分别为 18 / 36 / 48 帧；这是历史参数，不能等同固定时长或当前默认值。</p><p class="source">提交：<code>c8841f9d</code>、<code>29a3837e</code>、<code>b85c6637</code>、<code>64516f18</code>、<code>2ae761f3</code>、<code>63ce4e3e</code>、<code>2a09cf62</code>。</p></div></details>
      </div>
    </article>

    <article class="round">
      <div class="round-label"><span>02</span><p>建立评测<br /><small>v5 及实验支线</small></p></div>
      <div class="round-body">
        <h4>基线评测体系：对标原始调度并验证单项改动</h4>
        <p class="lead">将测试流程固化为可复用 skill：固定资产、设备、后端、路线和缓存条件，对照原始 Supersplat-Viewer / PlayCanvas 原生 LOD，再做内部版本回归。</p>
        <div class="evaluation-grid">
          <div><span class="mini-label">对照对象</span><b>原始调度 → 自定义初版 → 后续迭代</b></div>
          <div><span class="mini-label">核心指标</span><b>首屏 / 变清晰时间 / 帧耗时 / 实际点数</b></div>
          <div><span class="mini-label">异常归因</span><b>benchmark HUD → 逐帧 Profiler → CPU Profile</b></div>
        </div>
        <div class="finding"><span class="mini-label">第一批测试的发现</span><h5>更快变清晰，并不一定更流畅。</h5><p>Poland 细粒度资产恢复细节较快，却有更高的运行时开销；粗粒度版本帧率更稳定，细节等待却更长。因此不再只增加预取与同步频率，先用 Profiler 区分运行时重复工作与资产管理成本。</p></div>
        <details><summary>评测约束与基线口径</summary><div class="detail-content"><p>工具在多轮测试中逐步完善。调度对比保持资产与画质目标一致；资产实验单独改变切分策略，并同步观察实际点负载。外部官方基线与内部上一稳定版分别记录。自定义 Viewer 内的 native 路径，需校验后才可作为官方基线的等价代理。</p><p class="source">依据：LOD benchmark、场景 profile skill、早期 PlayCanvas 2.20 评测文档。v5 于 6 月 18 日从 v4 创建。</p></div></details>
      </div>
    </article>

    <article class="round">
      <div class="round-label"><span>03</span><p>第二轮优化<br /><small>Profiler 驱动</small></p></div>
      <div class="round-body">
        <h4>增量更新机制：停止无效轮询，减少不必要的全量重建</h4>
        <p class="lead">定位到首屏完成后仍逐帧遍历整树，以及 LOD 同步过度触发全局 dirty。补上轮询退出条件，将增量 placement 更新与结构变化分开，并对同帧同步去重。</p>
        <figure class="cpu-figure">
          <figcaption><span>京东 · 首屏后轮询修复</span><span class="mini-label">累计 CPU 采样时间 / ms</span></figcaption>
          <div class="cpu-row"><div><b>viewer-bundle</b><span>约 −77%</span></div><div class="bar-pair"><div class="bar-track"><i class="before" style="width:100%"></i><span>修复前 7569.1</span></div><div class="bar-track"><i class="after" style="width:22.63%"></i><span>修复后 1713.0</span></div></div></div>
          <div class="cpu-row"><div><b>octree-lod</b><span>约 −95%</span></div><div class="bar-pair"><div class="bar-track"><i class="before" style="width:100%"></i><span>修复前 561.8</span></div><div class="bar-track"><i class="after" style="width:4.91%"></i><span>修复后 27.6</span></div></div></div>
          <p class="figure-note">累计采样时间下降，不代表 FPS 按同比例提升。</p>
        </figure>
        <p class="round-outcome"><strong>验证与后续：</strong>京东采样确认重复 CPU 工作下降，并检查增量更新后资源仍能上屏。运行时修复后，继续跨场景测试，区分剩余开销来自场景尺度还是叶块组织。</p>
        <details><summary>修复链与正确性验证</summary><div class="detail-content"><p>实验支线先以 <code>23cedcb6</code> 修正 WorkBuffer 重建与同步去重，<code>1e0bc0e9</code> 停止首屏后轮询。v5 主线再通过 <code>7cd481ca</code> 调整增量 World 更新，以 <code>c9fb62d4</code> 补入轮询退出与进度竞态修复。同步检查资源是否继续上屏，避免减少调用后遗漏更新。</p><p>两模块分别按各自修复前数值归一化；采样窗口约 29.425 / 28.925 秒。数据对应轮询修复阶段，不能单独归因为 <code>7cd481ca</code>。</p><p class="source">数据：chrome-cpu-profile-refinement-jingdong_bootstrapPoll 的 before / after 分析报告。</p></div></details>
      </div>
    </article>

    <article class="round">
      <div class="round-label"><span>04</span><p>第三轮验证<br /><small>多场景 / 资产与尺度</small></p></div>
      <div class="round-body">
        <h4>分块与尺度评测：区分叶块管理成本和场景尺度影响</h4>
        <p class="lead">多场景测试发现，固定距离选档难以适应不同尺度，Poland 的细碎叶块也增加管理开销。分别验证尺度选档与叶块梯度，观察帧耗时、点负载和细节恢复，避免将两类问题混为同一瓶颈。</p>
        <figure class="leaf-figure">
          <figcaption><span>Poland · 叶块梯度实验</span><span class="mini-label">budget 2.5M / WebGPU / 4 个静态点位</span></figcaption>
          <div class="leaf-grid">
            <div v-for="row in leafResults" :key="row.leaves" class="leaf-column"><span class="mini-label">逻辑叶块</span><b class="leaf-count">{{ row.leaves }}</b><div class="vertical-chart" :aria-label="`update P50 ${row.update} 毫秒`"><i :style="{ height: `${row.update / 49.8 * 100}%` }"></i><strong>{{ row.update }}<small> ms</small></strong></div><span class="chart-axis">update P50</span><dl><div><dt>frame P90</dt><dd>{{ row.frame }} ms</dd></div><div><dt>变清晰 P50</dt><dd>{{ row.clear }} s</dd></div><div><dt>实际点数 P50</dt><dd>{{ row.points }}M</dd></div></dl></div>
          </div>
          <p class="figure-note">减少叶块可以降低管理开销，但变清晰时间存在代价。这里改变了空间切分策略，不能归因为单个参数或认为画质完全相同。</p>
        </figure>
        <div class="decision-block"><span class="mini-label">尺度策略的尝试 / renderScale</span><h5>减少细化负载有效，但没有推广为默认。</h5><p>城建小学固定 budget 6M：rs=1 → 4，平均显示点数 4.01 → 1.86M，记录帧率 97 → 120；rs=8 已被记录为“效果较糊”。首屏没有单调变快，最终保留可选策略，默认仍使用 distance。</p></div>
        <p class="round-outcome"><strong>取舍与后续：</strong>控制过细切分，按场景权衡更新成本与细化速度；renderScale 保留可选。与这轮交叉进行的 HUD 测试又暴露预算利用不足，进一步检查视野外细档占用与预算反馈。</p>
        <details><summary>renderScale 五档实测结果</summary><div class="detail-content"><div class="table-wrap" role="region" aria-labelledby="lod-render-data" tabindex="0"><table><caption id="lod-render-data">城建小学 · 1762.3 万点 / budget 6M</caption><thead><tr><th scope="col">rs</th><th scope="col">平均点数</th><th scope="col">记录帧率</th><th scope="col">首屏 / s</th><th scope="col">点位 1 / 2 / 3 耗时 / s</th><th scope="col">原文评价</th></tr></thead><tbody><tr v-for="row in renderResults" :key="row.scale"><th scope="row">{{ row.scale }}</th><td>{{ row.points }}M</td><td>{{ row.fps }}</td><td>{{ row.first }}</td><td>{{ row.poses }}</td><td>{{ row.quality }}</td></tr></tbody></table></div><p class="figure-note">《本地大场景测试验证集》；帧率未注明统计方式，画质评价沿用当次记录。</p></div></details>
        <details><summary>资产策略与实验边界</summary><div class="detail-content"><p>逻辑叶块数量与物理 SOG 文件大小分别验证；通过 minChunkPoints 和 extent 分裂条件控制过细切分。武汉等反例说明，块并非越粗越好，还需检查单次上传成本与细节恢复。</p><p>尺度方面先尝试 lodScaleAlign，再验证代表 splat 的屏幕投影选档。renderScale 与后续预算实验有时间交叉；其运行时与离线 repScale 最终均默认关闭。</p><p class="source">叶块数据：2026-08-11 / poland-leaf-ladder / results.json。分位值来自四点位报告，不是多次重复运行的统计显著性结论。renderScale 默认关闭提交：<code>6f929a75</code>。</p></div></details>
      </div>
    </article>

    <article class="round">
      <div class="round-label"><span>05</span><p>预算迭代<br /><small>OOF / 设备档位</small></p></div>
      <div class="round-body">
        <h4>视锥外降档与预算配置：优先满足当前视野的精度需求</h4>
        <p class="lead">HUD 的 Budget / Center / Edge / Out 统计暴露出目标、下载与显示不一致，以及视野外细档持续占用。对齐下载目标与引擎预算，为视野外节点设置粗档目标，并修正降档反馈与切换顺序。</p>
        <details class="mechanism"><summary>视野外降档的处理流程</summary><figure><img src="/diagrams/lod-oof.svg" alt="视野外节点设置粗档目标，确认粗档可用后切换显示并回收残留细档的流程图" loading="lazy" /><figcaption class="figure-note">资产目标低于预算时无需强行顶满；减少活动点占用不等于全部显存立即释放。</figcaption></figure></details>
        <div class="table-wrap budget-table" role="region" aria-labelledby="lod-budget-data" tabindex="0"><table><caption id="lod-budget-data">南广场 · 预算梯度：更高精度对应更多加载与显示负载</caption><thead><tr><th scope="col">预算</th><th scope="col">平均显示</th><th scope="col">首屏 / s</th><th scope="col">记录帧率</th><th scope="col">点位 2 / s</th></tr></thead><tbody><tr v-for="row in budgetResults" :key="row.budget"><th scope="row">{{ row.budget }}</th><td>{{ row.points }}</td><td>{{ row.first }}</td><td>{{ row.fps }}</td><td>{{ row.clear }}</td></tr></tbody></table></div>
        <p class="figure-note">同组预算在城建小学记录为 59 / 60 / 60 FPS，收益依赖场景与显示点数。</p>
        <div class="defaults"><div><span class="mini-label">桌面默认性能档</span><b>2.5<small>M</small></b></div><div><span class="mini-label">移动默认性能档</span><b>1<small>M</small></b></div><p>首次启动默认性能模式；保留桌面 4M / 移动 2M 质量档，并沿用用户偏好和显式预算覆盖。</p></div>
        <p class="round-outcome"><strong>配置收敛：</strong>南广场降低预算后，首屏与点位等待缩短；城建小学收益较小，说明不存在通用最优值。桌面以 2.5M 作为默认性能档，同时保留质量档供用户选择。</p>
        <details><summary>预算实现与默认值依据</summary><div class="detail-content"><p>视野边缘保留最低请求权重；视野外先确认粗档可用，再切换并分批处理残留细档，避免反馈钳制引发振荡。验证由“总点数是否顶满”转为“当前视野是否追齐合理目标”。</p><p class="source">预算 / OOF：<code>bad91848</code>、<code>257aeb88</code>、<code>bde8e76f</code>。<code>d3559d7d</code> 将桌面性能档设为 2.5M，<code>4d56e994</code> 将无保存偏好的首次启动设为性能模式。</p></div></details>
      </div>
    </article>

    <section class="round result-round" aria-labelledby="lod-result-title">
      <div class="round-label"><span>06</span><p>结果汇总</p></div>
      <div class="round-body">
        <h4 id="lod-result-title">优化结果与工程沉淀</h4>
        <dl class="result-list">
          <div><dt>运行时 CPU</dt><dd><strong>约 −77%</strong><p>停止首屏后无效轮询，拆分增量更新与全量重建。京东轮询修复阶段，viewer-bundle 累计采样时间由 7569.1 降至 1713.0 ms。</p></dd></div>
          <div><dt>叶块管理开销</dt><dd><strong>49.8 → 6.2 <small>ms</small></strong><p>Poland 叶块由 32,752 减至 4,096，update P50 随之下降；变清晰 P50 同时由 6.503 增至 11.900 秒。切分粒度需要同时权衡管理成本与细节恢复。</p></dd></div>
          <div><dt>加载与精度取舍</dt><dd><strong>29.7 → 18.9 <small>s</small></strong><p>南广场预算从 6M 调到 2.5M，首屏耗时下降，记录帧率从 45 到 60；平均显示点数也从 5.84M 降到 2.42M。桌面默认采用 2.5M，并保留质量档；移动端默认配置为 1M。</p></dd></div>
          <div><dt>验证与回归</dt><dd><strong>从经验调参到基线对照</strong><p>建立原始调度对标、单变量实验、正确性检查与版本回归；每轮区分运行时修复、资产变化和画质取舍，结果用于决定下一轮动作。</p></dd></div>
        </dl>
        <p class="result-note">已收敛调度修复与设备默认配置，阶段收益如上；当前版本对官方 Viewer 的统一复测，以及部分场景的换档尾部问题，仍未完整闭环。</p>
      </div>
    </section>
  </CaseStudy>
</template>

