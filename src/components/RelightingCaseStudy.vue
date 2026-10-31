<script setup lang="ts">
import CaseStudy from './CaseStudy.vue'
</script>

<template>
  <CaseStudy>
    <header class="case-heading">
      <div class="problem-context">
        <div><span class="mini-label">背景与问题</span><p>夜游、建筑亮灯和交互探索需要改变扫描场景的明暗。但当前 3DGS 渲染主要呈现采集色彩，直接放置引擎灯光无法获得所需的 splat 光照响应。</p></div>
        <div><span class="mini-label">我的任务</span><p>负责 Viewer 侧实时重光照与交互接入：让全局调光、局部灯和笔刷亮灯可编辑，在大场景中控制逐 splat 成本，并将灯与区域配置传递到观看态。</p></div>
      </div>
      <p class="intro">先让笔刷选区成为可跨视角复用的空间数据，再打通调亮、局部辉光与交付管线，处理过程中暴露的时序和色彩回归。</p>
    </header>

    <article class="round">
      <div class="round-label"><span>01</span><p>着色接入<br /><small>全局与局部</small></p></div>
      <div class="round-body">
        <h4>重光照着色：独立控制昼夜与局部灯光</h4>
        <p class="lead">仅压暗 splat 会造成天空与场景割裂；当前输入又没有可直接用于常规表面光照的面法线。以统一昼夜参数同步 splat、主光和天空，再用视线方向近似局部灯的光照响应。</p>
        <div class="lighting-controls" aria-label="全局调光和局部光照分开控制">
          <div><span class="mini-label">统一昼夜参数</span><b>splat · 主光 · 天空</b><p>保持全局明暗变化一致</p></div>
          <div><span class="mini-label">独立局部光源</span><b>点光 · 聚光</b><p>白天也能单独启用灯光</p></div>
        </div>
        <p class="round-outcome"><strong>实现与下一步：</strong>获得连续调光和独立局部照明；但摆灯难以准确点亮建筑选区，继续补充笔刷式局部编辑。</p>
        <details><summary>着色近似与容量约束</summary><div class="detail-content"><p>从 night-mode 示例拆解颜色注入点，在线性空间处理颜色，补上 NaN 防护。局部灯采用视线方向作伪法线，叠加距离与锥形衰减；这是视角相关的视觉近似，不是恢复采集场景的物理光照。</p><p>原文实现限制为 10 个点光与 10 个聚光，按遍历顺序取灯，超过容量时不保证选灯稳定。</p></div></details>
      </div>
    </article>

    <article class="round">
      <div class="round-label"><span>02</span><p>局部亮灯<br /><small>数据表示调整</small></p></div>
      <div class="round-body">
        <h4>世界空间亮灯区域：从笔刷烘焙到局部辉光</h4>
        <p class="lead">屏幕上的笔触只能描述当前视图。通过拾取保存世界位置与影响半径，再将已提交区域烘焙为亮度场：splat 按世界坐标查表，Bloom 掩码也从同一空间数据生成，换视角后仍能定位原来的区域。</p>
        <figure class="volume-comparison">
          <figcaption>已提交区域：世界数据保持稳定，屏幕掩码随视角重建</figcaption>
          <picture><source media="(max-width: 600px)" srcset="/diagrams/relighting-world-space-mobile.svg" /><img class="spatial-diagram" src="/diagrams/relighting-world-space.svg" alt="世界点集烘焙亮度场，分别用于高斯调亮与当前相机的Bloom掩码，最后在屏幕空间合成辉光" loading="lazy" /></picture>
          <div><span>原方案</span><b>每个 splat × 遍历笔刷点</b><small>运行时 O(splat × points)</small></div>
          <div><span>调整后</span><b>点集 → 64³ 亮度场 → 空间采样</b><small>运行时 O(splat)；点集变化后另行烘焙</small></div>
          <p class="figure-note">64³ 体积打包为 64 × 4096 的 R8 图集，属于实现规格，未据此换算 FPS 收益。</p>
        </figure>
        <h5>跨视角与提交时的回归修复</h5>
        <dl class="bloom-fixes">
          <div><dt>辉光随镜头滑动</dt><dd>frameupdate 时相机尚未更新；将重投影与掩码传参移到 framerender，并用相机和内容签名控制重绘。</dd></div>
          <div><dt>近景出现点阵亮斑</dt><dd>体素投影过于离散；按屏幕体素尺寸调整采样步长、投影半径并平滑掩码。</dd></div>
          <div><dt>预览与提交后跳亮</dt><dd>预览与已提交亮度重复叠加；仅对未提交区应用预览，提交后统一进入体积路径。</dd></div>
          <div><dt>阈值起步产生硬边</dt><dd>将硬阈值改为 smoothstep 与自适应 knee，平滑辉光进入过程。</dd></div>
        </dl>
        <p class="round-outcome"><strong>结果与取舍：</strong>以同一世界空间数据串起调亮和局部辉光，处理镜头滑动、近景点阵与提交跳变；已提交点集移出逐 splat 循环。仍需承担体积烘焙、投影与平滑成本，固定体素精度和屏幕空间遮挡也有边界。</p>
        <details><summary>绘制预览、提交烘焙与纹理生命周期</summary><div class="detail-content"><p>以内容签名缓存体积，稳定区域不重复烘焙；笔划松手或 FINISH 触发提交更新。多区域和草稿内容变化也可能触发重建，不能概括为所有模式只在松手时烘焙。</p><p>绘制中的新笔触尚未进入已提交体积，实时掩码使用点投影；提交后改走体积重投影。重建期间保证 sampler 有有效绑定，避免旧纹理销毁后仍被采样。</p><p>这里烘焙的是空间亮度数据，并非把屏幕 Bloom 结果离线固化为世界空间光照。多区域还维护独立颜色数据，不能把整套系统概括为只有一张纹理。</p></div></details>
        <details><summary>关键修复与缓存取舍</summary><div class="detail-content"><p>当前实现由 renderWorldSpaceMaskFromVolume 重投影已提交体积；绘制时使用实时点投影。相机签名过细会频繁重绘，过粗则跟屏滑动，当前采用有限精度缓存。</p><p>近景采样与平滑对应 <code>477ebe35</code>；阈值软化对应 <code>3beae67c</code>。代码与历史差异可证明实现路径，本轮未重新测量这些改动的运行收益。</p></div></details>
      </div>
    </article>

    <article class="round">
      <div class="round-label"><span>03</span><p>管线回归<br /><small>编辑与观看</small></p></div>
      <div class="round-body">
        <h4>后处理管线适配：保持色彩与编辑观看输出一致</h4>
        <p class="lead">接入 CameraFrame 后，问题从局部光效扩展到整个输出链：辉光静默关闭、Reveal 首帧闪光，以及未开启 Bloom 却改变整场色调。分别收敛启用条件、初始化时序和颜色空间。</p>
        <dl class="bloom-fixes">
          <div><dt>Bloom 参数正确却失效</dt><dd>先设置 HDR renderFormats，再启用 CameraFrame，避免回退格式后静默关闭辉光。</dd></div>
          <div><dt>开场首帧局部光提前出现</dt><dd>Viewer 早于 Reveal 构造，状态尚未就绪；初始化按 settings 判断待播放开场，解锁前统一门控亮度场与掩码。</dd></div>
          <div><dt>没开效果也改变整场色调</dt><dd>遗留非零参数误启后处理；按有效开关、局部区域与笔刷需求决定是否挂载管线，编辑与观看共用判断。</dd></div>
          <div><dt>画面发灰、资产色彩不一致</dt><dd>修正线性空间中的 tone mapping 与输出编码，统一相关材质路径；只在 CameraFrame 生效期间应用补丁，退出恢复原状态。</dd></div>
        </dl>
        <p class="round-outcome"><strong>交付收敛：</strong>将“局部效果能显示”推进到“按需启用、正确交接、编辑观看同链路”。Bloom 强度保持单一配置入口，夜景只控制自身明暗，不再重复改写辉光强度。</p>
        <details><summary>回归依据与 Shader 职责边界</summary><div class="detail-content"><p>开场门控对应 <code>60d37a96</code>，按需启用后处理对应 <code>0959a9a4</code>，颜色空间与材质回归修复对应 <code>1ec97211</code>。依据当前代码核对，不将已移除的历史 warmup 尝试写成当前方案。</p><p>本节说明 Bloom 输出链的接入与回归；通用 Shader 所有权、仲裁与材质重挂机制集中见 Shader 章节。</p></div></details>
      </div>
    </article>

    <article class="round">
      <div class="round-label"><span>04</span><p>交互手电筒<br /><small>深度与拾取</small></p></div>
      <div class="round-body">
        <h4>交互手电筒：处理指针跟随、遮挡与拾取竞争</h4>
        <p class="lead">随鼠标移动的光斑还不足以支撑夜游：光束可能穿墙，异步高斯拾取与同步 mesh 拾取也会导致热点跳动。通过解析式锥光和场景深度做遮挡，并统一命中优先级。</p>
        <dl class="bloom-fixes">
          <div><dt>墙体遮挡</dt><dd>Fill 铺底光与 Hotspot 亮斑分层，采样场景深度判断可见性。</dd></div>
          <div><dt>命中结果跳动</dt><dd>mesh 同步命中优先，取消冲突中的高斯拾取，并增加滞回。</dd></div>
          <div><dt>热点停留在旧视角</dt><dd>相机变化后清空旧热点深度，避免沿用过期命中结果。</dd></div>
        </dl>
        <p class="round-outcome"><strong>交付与边界：</strong>将静态局部照明扩展为指针交互。无法取得深度图时关闭遮挡以保留照明，不能保证该降级状态仍防穿墙。</p>
        <a class="demo-link" href="https://www.xiaohongshu.com/discovery/item/6a4f7ae100000000160272f7" target="_blank" rel="noopener noreferrer">查看手电筒应用演示 ↗</a>
        <details><summary>开关反馈与会话状态</summary><div class="detail-content"><p>开关即时响应、不插值，也不写入持久化配置；热点深度和强度单独平滑。深度遮挡依赖当前屏幕可见信息，存在屏幕空间方法的边界。</p></div></details>
      </div>
    </article>

  </CaseStudy>
</template>

<style scoped>
.spatial-diagram{display:block;width:640px;max-width:100%;height:auto;margin:0 auto 18px}
.lighting-controls{display:grid;grid-template-columns:1fr 1fr;gap:22px;border-block:1px solid var(--line);padding:20px 0}.lighting-controls span,.lighting-controls b{display:block}.lighting-controls b{font-size:16px;font-weight:400;margin-top:7px}.lighting-controls p{font-size:12px;color:var(--muted);margin:5px 0 0}.volume-comparison{margin:24px 0;padding:22px 24px;background:#efefe8;border:1px solid #e3e3d9}.volume-comparison figcaption{font-size:12px;margin-bottom:16px}.volume-comparison>div{display:grid;grid-template-columns:70px minmax(0,1fr);gap:5px 14px;padding:14px 0;border-top:1px solid var(--line)}.volume-comparison>div>span{font-size:11px;color:var(--muted)}.volume-comparison b{font-size:15px;font-weight:400;overflow-wrap:anywhere}.volume-comparison small{grid-column:2;font-size:11px;color:var(--muted)}.bloom-fixes{margin:22px 0;font-size:12px}.bloom-fixes>div{display:grid;grid-template-columns:150px minmax(0,1fr);gap:20px;padding:13px 0;border-top:1px solid var(--line)}.bloom-fixes dt{color:var(--muted)}.bloom-fixes dd{margin:0;color:#5d5f56}.demo-link{display:inline-block;font-size:12px;color:var(--ink);padding-bottom:4px;border-bottom:1px solid var(--muted);text-decoration:none}
@media(max-width:600px){.lighting-controls{grid-template-columns:1fr;gap:16px}.lighting-controls b{font-size:14px}.volume-comparison{padding:17px 14px}.volume-comparison>div{grid-template-columns:52px minmax(0,1fr);gap:6px 10px}.volume-comparison b{font-size:13px}.volume-comparison small{font-size:10px}.bloom-fixes>div{grid-template-columns:1fr;gap:5px}}
</style>
