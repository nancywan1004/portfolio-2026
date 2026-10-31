<script setup lang="ts">
import CaseStudy from './CaseStudy.vue'
</script>

<template>
  <div class="aiar-case">
    <section class="case-opening" aria-labelledby="aiar-heading">
      <p class="eyebrow">项目 02 / AI + AR</p>
      <h2 id="aiar-heading" tabindex="-1">AI + AR 随身导览<br><span class="serif">小程序空间导览</span></h2>
      <p class="case-lead">为利用微信小程序的传播性，选用具备 6DoF 世界追踪与实时位姿能力的官方 XR-Frame。复用 Unity 版 Unicity App 生产的地图与 Anchor，在村史馆验证 AI+AR 导览，再将 VPS 定位与 AR 体验用于水峪嘴村。</p>
      <dl class="project-facts"><div><dt>职责重点</dt><dd>图像处理 / 空间对齐 / 资产加载</dd></div><div><dt>采集与放置端</dt><dd>Unicity · Unity 移动端 App</dd></div><div><dt>对外交付</dt><dd>水峪嘴村 · AR 打卡与合影</dd></div><div><dt>技术环境</dt><dd>微信小程序 · XR-Frame · WASM</dd></div></dl>
    </section>

    <section class="project-media" aria-labelledby="aiar-media-title">
      <div class="media-heading"><p class="eyebrow">项目影像</p><h3 id="aiar-media-title">原型演示与现场画面</h3></div>
      <figure class="prototype-video">
        <div class="media-context"><p class="eyebrow">内部原型 / 中关村村史馆</p><h4>空间导览与 AI 对话</h4></div>
        <div><video controls playsinline preload="none" poster="/media/aiar/museum-ai-ar-poster.jpg" aria-label="中关村村史馆 AI 与 AR 空间导览原型演示"><source src="/media/aiar/museum-ai-ar-demo.mp4" type="video/mp4">浏览器不支持视频，请<a href="/media/aiar/museum-ai-ar-demo.mp4">打开原型演示</a>。</video></div>
      </figure>
      <div class="onsite-heading"><p class="eyebrow">对外体验 / 水峪嘴村</p></div>
      <div class="onsite-gallery">
        <figure><img src="/media/aiar/gudao.png" width="420" height="290" alt="京西古道实景中的 AR 驼队，保留小程序合影水印" loading="lazy"><figcaption>京西古道</figcaption></figure>
        <figure><img src="/media/aiar/qiusiting.png" width="420" height="290" alt="秋思亭与山景的小程序内置截图，保留原始水印" loading="lazy"><figcaption>秋思亭</figcaption></figure>
        <figure><img src="/media/aiar/niujiaolingguancheng.png" width="420" height="290" alt="牛角岭关城实景中的 AR 人物和驼队，保留小程序合影水印" loading="lazy"><figcaption>牛角岭关城</figcaption></figure>
      </div>
    </section>

    <CaseStudy>
      <section class="breakthroughs" aria-label="AI 与 AR 技术难点">
        <p class="eyebrow breakthrough-heading">技术难点</p>
        <article id="alignment" class="round breakthrough" tabindex="-1">
          <div class="round-label"><span>01</span><p>空间对齐</p></div>
          <div class="round-body">
            <h3>坐标系适配：复用 Unity 采集端的地图与 Anchor</h3>
            <p class="challenge"><strong>问题：</strong>Unicity App 基于 Unity，小程序采用 XR-Frame；两端的初始化姿态与坐标约定存在差异，地图中的 Anchor 不能直接用于小程序渲染。</p>
            <p class="approach"><strong>处理：</strong>标定初始化基底，统一轴向、四元数和角度单位，再利用 VPS 与会话中的相机位姿求取地图变换，将其应用于 Anchor 的位置和朝向。</p>
            <p class="round-outcome"><strong>结果：</strong>将采集端 Anchor 映射到 XR-Frame 的 SLAM 会话，最终对齐对象为内容，相机继续由 SLAM 驱动。</p>
            <details><summary>坐标转换细节</summary><div class="detail-content"><p>固定基底旋转为 <code>R(0, −270°, 180°)⁻¹</code>；轴向处理采用 <code>Fy · P · Fy</code>，Fy 为 Y 轴镜像。旋转本身不改变手性，轴向转换需与初始化基底一起处理。</p></div></details>
          </div>
        </article>
        <article id="capture" class="round breakthrough" tabindex="-1">
          <div class="round-label"><span>02</span><p>转换加速</p></div>
          <div class="round-body">
            <h3>WASM 转换：缩短定位前的图像处理等待</h3>
            <p class="challenge"><strong>问题：</strong>VPS 需要上传相机图像，而原有 YUV→RGB 转换经常超过 7 秒，成为定位流程中的明显等待。</p>
            <p class="approach"><strong>处理：</strong>用 C 实现逐像素转换，经 emsdk 的 Emscripten 工具链编译为 WASM，在小程序中调用后继续完成图像编码与上传。</p>
            <div class="compact-metric" aria-label="YUV 转 RGB 的阶段耗时结果"><div><span>优化前转换耗时</span><b>7 s+</b></div><i aria-hidden="true">→</i><div><span>优化后转换耗时</span><b>约为原来的 1/10</b></div></div>
            <p class="round-outcome"><strong>结果：</strong>减少定位前的图像转换等待。以上为项目阶段记录，收益对应 YUV→RGB 转换，不含网络上传与 VPS 服务耗时。</p>
            <details><summary>C 实现与小程序接入</summary><div class="detail-content"><p><code>yuvToImageC/yuv_to_rgb.c</code> 读取 Y 与交织 UV，逐像素计算 RGB、钳制到 0–255，并写入 RGBA。目录包含 Emscripten 生成的 JS 和 O2 / O3 等 WASM 产物；上线加载器引用 <code>yuv_to_rgb_O2.wasm</code>。</p><p>emsdk 是编译工具链，运行时执行的是 WASM。原型用共享视图取回输出，上线版则复制到独立数组以解耦生命周期。本次未重新复测阶段耗时，也不由产物文件名推定 SIMD 或多线程已启用。</p></div></details>
          </div>
        </article>
        <article id="resources" class="round breakthrough" tabindex="-1">
          <div class="round-label"><span>03</span><p>资产与运行</p></div>
          <div class="round-body">
            <h3>资产优化：减少加载等待与渲染负担</h3>
            <p class="challenge"><strong>问题：</strong>角色模型和高分辨率贴图增加加载时长与渲染资源占用，需要适配小程序的性能和稳定性约束。</p>
            <p class="approach"><strong>处理：</strong>降低贴图分辨率并压缩图像与几何；进入阶段预加载、按资产状态复用模型。渲染侧补充环境光照，运行时将内存告警接入资源清理。</p>
            <div class="compact-metric" aria-label="马致远 GLB 文件体积对比"><div><span>原始模型</span><b>41.75 <small>MiB</small></b></div><i aria-hidden="true">→</i><div><span>压缩模型</span><b>1.34 <small>MiB</small></b></div></div>
            <p class="round-outcome"><strong>结果：</strong>马致远样本体积减少 96.8%，三张贴图由 4K PNG 降至 1K JPEG；以更小的资产服务加载与渲染，三角形数保持不变。</p>
            <details><summary>压缩、加载与运行防护</summary><div class="detail-content"><p>压缩版使用 glTF-Transform 并加入 Draco；三角形均为 499,929。贴图像素量降至原来的 1/16，纹理存储需求随之降低，但文件缩小不直接等于 FPS 提升；当前是本地资产样本对比。</p><p>资产清单按 ID 去重并预加载，挂载前查已有状态，Anchor 串行生成。场景通过 env-data / xr-env 补充环境光照，保留 ambient、关闭固定方向光；使用预置环境数据，不做实时光照估计。</p><p>系统内存告警时清理截图及 YUV / WASM 引用，退出时释放模型资产、停止追踪并解除场景引用，支持时尝试 GC。监控中的调度频率是性能提示依据，不作为 XR 渲染帧率实测。</p></div></details>
          </div>
        </article>
      </section>
    </CaseStudy>

  </div>
</template>

<style scoped>
.project-media{margin:0 0 45px}.media-heading{display:grid;grid-template-columns:22% 1fr;gap:20px 0;align-items:baseline;padding:14px 0 28px}.media-heading h3{font-size:26px;font-weight:400;line-height:1.5}.prototype-video{display:grid;grid-template-columns:22% minmax(0,1fr);gap:0;margin:0 0 36px}.media-context{padding-right:24px}.media-context h4{font-size:20px;font-weight:400;line-height:1.6;margin:16px 0 12px}.media-context>p:not(.eyebrow){font-size:14px;color:var(--muted);line-height:1.9}.media-context>span{display:block;font-size:10px;color:var(--muted);line-height:1.8;margin-top:18px}.prototype-video video{display:block;width:100%;max-width:960px;aspect-ratio:15/7;background:#deded5}.prototype-video figcaption{font-size:11px;color:var(--muted);line-height:1.8;margin-top:12px}.onsite-heading{display:flex;justify-content:space-between;align-items:baseline;gap:14px;border-top:1px solid var(--rule);padding-top:25px;margin-bottom:20px}.onsite-heading>p:last-child{font-size:11px;color:var(--muted);line-height:1.8}.onsite-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.onsite-gallery figure{margin:0;min-width:0}.onsite-gallery img{display:block;width:100%;max-width:420px;height:auto}.onsite-gallery figcaption{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:var(--muted);line-height:1.8;margin-top:12px}
@media(max-width:850px){.prototype-video{grid-template-columns:1fr;gap:20px}.media-context{padding-right:0}.onsite-gallery{gap:15px}.onsite-gallery figcaption{display:block}.onsite-gallery figcaption span{display:block}}
@media(max-width:600px){.media-heading{display:block;padding-top:0}.media-heading h3{font-size:22px;margin-top:16px}.media-context h4{font-size:19px;margin:12px 0 8px}.media-context>span{margin-top:10px}.onsite-heading{display:block}.onsite-heading>p:last-child{margin-top:10px}.onsite-gallery{grid-template-columns:1fr;gap:26px}.onsite-gallery figure{max-width:420px}.onsite-gallery figcaption{display:flex}.project-media{margin-bottom:35px}}

.aiar-case{padding-top:65px}#aiar-heading{scroll-margin-top:90px}#aiar-heading:focus,.breakthrough:focus{outline:none}.breakthrough{scroll-margin-top:30px}.breakthrough-heading{padding:16px 0 22px}.breakthrough h3{font-size:clamp(21px,2.2vw,29px);font-weight:400;line-height:1.5;letter-spacing:-.025em;margin:0 0 18px}.challenge,.approach{font-size:15px;line-height:1.95;max-width:870px;color:#585a52;margin:0 0 16px}.challenge strong,.approach strong{font-weight:500;color:var(--ink)}.compact-metric{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;padding:22px 0;border-block:1px solid var(--line);margin:22px 0}.compact-metric span{font-size:11px;color:var(--muted)}.compact-metric b{display:block;font-size:clamp(23px,2.4vw,34px);font-weight:400;line-height:1.6;margin-top:6px}.compact-metric small{font-size:13px}.compact-metric i{font-style:normal;color:var(--muted)}
@media(max-width:600px){.aiar-case{padding-top:40px}.challenge,.approach{font-size:14px}.breakthrough h3{font-size:22px}.compact-metric{gap:10px}.compact-metric b{font-size:22px}.compact-metric small{font-size:10px}}
</style>
