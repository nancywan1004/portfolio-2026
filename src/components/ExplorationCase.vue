<script setup lang="ts">
import CaseChapter from './CaseChapter.vue'

const media = '/media/explore/digital-human'
</script>

<template>
  <div class="explore-case">
    <dl class="explore-facts">
      <div><dt>时间</dt><dd>2026.09</dd></div>
      <div><dt>输入</dt><dd>古风数字人三视图</dd></div>
      <div><dt>工具链</dt><dd>GPT · Blender · Hyper3D · Rodin · Astra</dd></div>
    </dl>

    <section class="chapter-group" aria-label="探索记录章节">

      <CaseChapter id="reference" number="01" title="参考图与提示词" description="建模输入与原始提示词。" :cover="media + '/01-ref-sheet.webp'" cover-alt="古风数字人三视图" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">提示词</p>
          <div class="block-body">
            <blockquote class="prompt">我希望你帮我生成一个古风数字人的三视图。形象为一位古风女性，作为博物馆导览形象，风格为卡通 / 动漫，作为 3D 建模的参考图。绑带等装饰能尽量简化，因为建模侧需要对这里进行优化。</blockquote>
            <div class="figures two">
              <figure><img :src="media + '/01-ref-sheet.webp'" alt="古风数字人三视图参考图" loading="lazy" /><figcaption>三视图参考</figcaption></figure>
              <figure><img :src="media + '/02-gpt-image-alt.webp'" alt="同批次另一张数字人生图" loading="lazy" /><figcaption>同批备选</figcaption></figure>
            </div>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="base-model" number="02" title="基模：两条路径" description="两条路径的结果对比。" :cover="media + '/03-method1-blender-mcp.webp'" cover-alt="Blender MCP 生成的基模" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">方法一 · Blender MCP</p>
          <div class="block-body">
            <p>拆件与绑定初版可用，外形差距明显。</p>
            <figure><img :src="media + '/03-method1-blender-mcp.webp'" alt="Blender MCP 直接生成的基模截图" loading="lazy" /><figcaption>直接生成</figcaption></figure>
          </div>
        </div>

        <div class="block">
          <p class="block-label">方法二 · 加 Hyper3D</p>
          <div class="block-body">
            <p>首版头身一体；第二版用 Bang 自动拆件，关节与蒙皮由脚本估算。</p>
            <div class="figures two">
              <figure><img :src="media + '/04-method2-hyper3d-v1.webp'" alt="Hyper3D 首版头身一体模型" loading="lazy" /><figcaption>首版 · 头身一体</figcaption></figure>
              <figure><img :src="media + '/05-method2-hyper3d-v2.webp'" alt="Hyper3D 第二版自动拆件结果" loading="lazy" /><figcaption>Bang 拆件后</figcaption></figure>
            </div>
            <figure><img :src="media + '/06-method2-rig-detail.webp'" alt="关节与蒙皮细节" loading="lazy" /><figcaption>关节与蒙皮</figcaption></figure>
          </div>
        </div>

        <div class="block">
          <p class="block-label">对比</p>
          <div class="block-body">
            <table class="metrics">
              <thead><tr><th>路径</th><th>三角面</th><th>贴图</th><th>GLB</th></tr></thead>
              <tbody>
                <tr><td>Blender MCP</td><td>2.26 万</td><td>无</td><td>1.22 MB</td></tr>
                <tr><td>+ Hyper3D</td><td>5.57 万</td><td>3 × 2048²</td><td>11.61 MB</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="tpose" number="03" title="基模与 TPose" description="动画测试的起点与导入检查。" :cover="media + '/07-tpose-front.webp'" cover-alt="旗袍数字人 TPose" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">基模</p>
          <div class="block-body">
            <div class="figures two">
              <figure><img :src="media + '/07-tpose-front.webp'" alt="旗袍数字人导览员 TPose 正面" loading="lazy" /><figcaption>TPose</figcaption></figure>
              <figure><img :src="media + '/08-rodin-base.webp'" alt="Rodin Gen 2.5 生成结果" loading="lazy" /><figcaption>5 万面 · 2K 贴图</figcaption></figure>
            </div>
          </div>
        </div>
        <div class="block">
          <p class="block-label">导入 Blender</p>
          <div class="block-body">
            <figure><img :src="media + '/09-blender-import.webp'" alt="基模导入 Blender 后的视图" loading="lazy" /><figcaption>检查层级与材质</figcaption></figure>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="limbs" number="04" title="四肢动画" description="两条绑定路径的动作效果。" :cover="media + '/15-arms-rigify-poster.webp'" cover-alt="Rigify 手臂动画" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">Rigify <span class="badge no">未采用</span></p>
          <div class="block-body">
            <p>不穿模，但动作生硬。</p>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/15-arms-rigify-poster.webp'" aria-label="Rigify 绑定后的手臂动画"><source :src="media + '/15-arms-rigify.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/15-arms-rigify.mp4'">打开录屏</a>。</video><figcaption>手臂动画</figcaption></figure>
          </div>
        </div>
        <div class="block">
          <p class="block-label">Mixamo <span class="badge ok">采用</span></p>
          <div class="block-body">
            <p>动作自然。</p>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/16-walk-mixamo-poster.webp'" aria-label="Mixamo 绑定后的走路动画"><source :src="media + '/16-walk-mixamo.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/16-walk-mixamo.mp4'">打开录屏</a>。</video><figcaption>走路动画</figcaption></figure>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="facial" number="05" title="面部动画" description="Astra 直建眼嘴，与 Chat Avatar 重建头部。" :cover="media + '/12-rodin-chat-avatar.webp'" cover-alt="Chat Avatar 生成的面部" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">Astra 直建 <span class="badge no">未采用</span></p>
          <div class="block-body">
            <blockquote class="prompt">基于 source_studio.blend 只将头部独立出来做一次优化：嘴部重拓扑以保证口型自然；眼睛尝试两种方案——带眼球并单独制作，或直接用贴图模拟眨眼，需要在 VR 中不穿帮。</blockquote>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/17-face-a-eyeball-poster.webp'" aria-label="带眼球的 A 版面部动画"><source :src="media + '/17-face-a-eyeball.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/17-face-a-eyeball.mp4'">打开录屏</a>。</video><figcaption>A · 真实眼球</figcaption></figure>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/18-face-b-texture-poster.webp'" aria-label="贴图模拟眨眼的 B 版面部动画"><source :src="media + '/18-face-b-texture.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/18-face-b-texture.mp4'">打开录屏</a>。</video><figcaption>B · 贴图眨眼</figcaption></figure>
            <p class="note">没有口腔，只有牙；嘴部与下颌拓扑问题较大，过渡生硬。</p>
          </div>
        </div>
        <div class="block">
          <p class="block-label">Chat Avatar <span class="badge ok">采用</span></p>
          <div class="block-body">
            <p>口腔、眼球与面部结构完整，含 52 个 Shape Key。</p>
            <figure><img :src="media + '/12-rodin-chat-avatar.webp'" alt="Chat Avatar 生成的面部结构" loading="lazy" /><figcaption>Chat Avatar</figcaption></figure>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/19-face-blendshape-poster.webp'" aria-label="基于 blendshape 的说话与眨眼"><source :src="media + '/19-face-blendshape.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/19-face-blendshape.mp4'">打开录屏</a>。</video><figcaption>说话与眨眼</figcaption></figure>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="merge" number="06" title="新头部接入" description="整头替换与局部拓扑移植的结果差异。" :cover="media + '/14-head-topology-transplant.webp'" cover-alt="局部拓扑移植后的头部" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">整头替换 <span class="badge no">未采用</span></p>
          <div class="block-body">
            <p>与原发型和身体出现空腔错位，难以修复。</p>
            <figure><img :src="media + '/13-head-swap-gap.webp'" alt="整头替换后的空腔与错位" loading="lazy" /><figcaption>空腔与错位</figcaption></figure>
          </div>
        </div>
        <div class="block">
          <p class="block-label">局部移植 <span class="badge ok">采用</span></p>
          <div class="block-body">
            <p>只替换眼嘴局部拓扑，保留原发型、后脑与颈部。</p>
            <figure><img :src="media + '/14-head-topology-transplant.webp'" alt="局部拓扑移植后的头部" loading="lazy" /><figcaption>移植后</figcaption></figure>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/20-head-final-poster.webp'" aria-label="最终版本头部动画"><source :src="media + '/20-head-final.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/20-head-final.mp4'">打开录屏</a>。</video><figcaption>V4 效果</figcaption></figure>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="workflow" number="07" title="局部移植流程" description="八步完成眼嘴的局部替换。" :cover="media + '/10-face-eyeball.webp'" cover-alt="眼嘴局部拓扑细节" base="#labs/01" group="explore-chapters">
        <ol class="workflow">
          <li>
            <h4>以原模型为主体</h4>
            <p>保留原头部的脸型、耳朵与后脑颈部、发型与发饰、身体骨架与头部权重、现有 UV。</p>
          </li>
          <li>
            <h4>分析原生拓扑</h4>
            <p>从 <code>blendshapes_with_components</code> 识别眼眶与眼睑环线、内外唇环线、眼球与泪线、牙与牙龈、舌头与口腔组件，以及 52 个 Shape Key。</p>
            <ul><li>眼睛各保留 10 圈</li><li>嘴部保留 18 圈</li></ul>
          </li>
          <li>
            <h4>原头开孔</h4>
            <p>按实际坐标切除左眼、右眼与嘴部，不改变鼻子、脸颊、下颌与头发。</p>
          </li>
          <li>
            <h4>空间配准</h4>
            <p>调整嘴眼宽高与中心，沿面部深度贴合皮肤；口腔后移约 4.5 mm、眼球后移约 3.3 mm，由面部交叉检测确定。</p>
          </li>
          <li>
            <h4>连续过渡拓扑</h4>
            <p>外环与切口顶点数不同，用三角化过渡带桥接并共用顶点；重算法线，混合局部几何法线消除眉下、嘴角与下巴的锯齿接缝。</p>
          </li>
          <li>
            <h4>迁移 Shape Keys</h4>
            <p>保留嘴眼 Shape Keys 并映射到新网格，变形沿网格邻接平滑传递到周围原面部。</p>
          </li>
          <li>
            <h4>重建口腔</h4>
            <p>从内唇环向内扩展口腔壁并封闭后方，区分牙冠、牙龈、舌头与内壁，沿用同一套变形。</p>
          </li>
          <li>
            <h4>贴图混合</h4>
            <p>局部用 Avatar UV 保留唇纹与眼睑细节，向外渐变回原皮肤；头发与后脑继续用原贴图。</p>
          </li>
        </ol>
      </CaseChapter>
    </section>
  </div>
</template>

<style scoped>
.explore-case{padding-top:44px}
.explore-facts{display:grid;grid-template-columns:1fr 1fr 1.7fr;gap:16px 24px;margin:0 0 34px;padding-bottom:22px;border-bottom:1px solid var(--rule)}
.explore-facts dt{font-size:9px;letter-spacing:.105em;text-transform:uppercase;color:#8c8d81;margin:0 0 6px}
.explore-facts dd{margin:0;font-size:11px;line-height:1.7;color:#5f6058}
.block{display:grid;grid-template-columns:22% 1fr;gap:0 32px;padding:36px 0;border-top:1px solid var(--rule)}
.block:first-of-type{border-top:0;padding-top:0}
.block-label{font-size:10px;line-height:1.7;letter-spacing:.05em;color:#5f6058;display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}
.block-body{max-width:720px}
.block-body>p{font-size:14px;line-height:1.95;color:#4f4f47}
.block-body>p+p{margin-top:12px}
.block-body>p.note{font-size:12.5px;line-height:1.9;color:#807d73;margin-top:14px;padding-left:14px;border-left:1px solid var(--rule)}
.prompt{margin:0 0 20px;padding:2px 0 2px 18px;border-left:1px solid #b9b9af;font-size:13.5px;line-height:1.95;color:#56564d}
.badge{font-size:9px;letter-spacing:.06em;color:#8c8d81;border:1px solid var(--rule);padding:2px 7px;white-space:nowrap}
.badge.ok{color:#4c5a3f;border-color:#c0c7b4}
.badge.no{color:#8b5849;border-color:#d7c5bd}
.figures{display:grid;gap:22px;margin-top:4px}
.figures.two{grid-template-columns:1fr 1fr;gap:20px}
figure{margin:18px 0 0}
.figures figure{margin:0}
figure img{display:block;width:100%;height:auto;background:#efeeea}
figcaption{margin-top:8px;padding-top:8px;border-top:1px solid var(--rule);font-size:10px;line-height:1.7;color:#939087;letter-spacing:.02em}
figure.clip video{display:block;width:100%;height:auto;background:#1b1b19}
.metrics{width:100%;border-collapse:collapse;margin-top:4px;font-size:12.5px;color:#57574f}
.metrics th{text-align:left;font-weight:400;font-size:9px;letter-spacing:.105em;text-transform:uppercase;color:#8c8d81;padding:0 14px 10px 0;border-bottom:1px solid #b9b9af}
.metrics td{padding:11px 14px 11px 0;border-bottom:1px solid var(--rule);font-variant-numeric:tabular-nums}
.workflow{list-style:none;counter-reset:step;display:grid;gap:0;margin:0;padding:0}
.workflow>li{counter-increment:step;display:grid;grid-template-columns:52px 1fr;gap:0 24px;padding:24px 0;border-top:1px solid var(--rule)}
.workflow>li:first-child{border-top:0;padding-top:0}
.workflow>li:before{content:counter(step,decimal-leading-zero);font-size:12px;color:#9b988e;font-variant-numeric:tabular-nums;padding-top:5px}
.workflow>li>*{grid-column:2}
.workflow h4{font-size:15px;font-weight:400;letter-spacing:-.01em;margin:0 0 7px}
.workflow p{font-size:13.5px;line-height:1.9;color:#63635a}
.workflow ul{margin:9px 0 0;padding-left:16px;font-size:13px;line-height:1.8;color:#6f6f66}
.workflow ul+p{margin-top:10px}
.workflow code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#4f4f47;background:#f1f0ec;padding:1px 4px}
.links{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.links li{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px;font-size:13.5px;line-height:1.8;border-bottom:1px solid var(--rule);padding-bottom:12px}
.links a{border-bottom:1px solid #b9b9af;padding-bottom:1px;transition:border-color .2s}
.links a:hover{border-color:currentColor}
.links span{font-size:10px;color:#a09d93;letter-spacing:.04em}
@media(max-width:900px){.block{grid-template-columns:1fr;gap:14px}.block-body{max-width:none}.figures.two{grid-template-columns:1fr}}
@media(max-width:600px){.explore-case{padding-top:28px}.workflow>li{grid-template-columns:34px 1fr;gap:0 14px;padding:20px 0}}
</style>
