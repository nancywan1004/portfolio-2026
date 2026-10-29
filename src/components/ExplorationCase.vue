<script setup lang="ts">
import CaseChapter from './CaseChapter.vue'

const media = '/media/explore/digital-human'
</script>

<template>
  <div class="explore-case">
    <section class="case-opening" aria-labelledby="explore-heading">
      <p class="eyebrow">探索 01 / 生成式建模与角色动画</p>
      <h2 id="explore-heading" tabindex="-1">AI 辅助数字人<br><span class="serif">建模与动画工作流</span></h2>
      <p class="case-lead">以同一份古风数字人三视图为输入，逐环节记录基模生成、四肢绑定与面部动画的可用方案，并保留每一步的面数、贴图与文件体积，作为后续正式流程的取舍依据。</p>
      <dl class="project-facts">
        <div><dt>时间</dt><dd>2026.09</dd></div>
        <div><dt>输入</dt><dd>古风数字人三视图</dd></div>
        <div><dt>工具链</dt><dd>GPT · Blender MCP · Hyper3D · Rodin · Astra</dd></div>
        <div><dt>验证方式</dt><dd>同一参考图下的方案对比与实机检查</dd></div>
      </dl>
    </section>

    <section class="chapter-group" aria-label="探索记录章节">
      <p class="eyebrow">测试记录</p>

      <CaseChapter id="reference" number="01" title="参考图与提示词" description="先由 GPT Image 生成古风数字人三视图，作为后续建模的唯一参考输入。" :cover="media + '/01-ref-sheet.webp'" cover-alt="古风数字人三视图参考图" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">GPT Image / 提示词</p>
          <div class="block-body">
            <blockquote class="prompt">我希望你帮我生成一个古风数字人的三视图。形象为一位古风女性，作为博物馆导览形象，风格为卡通 / 动漫，作为 3D 建模的参考图。绑带等装饰能尽量简化，因为建模侧需要对这里进行优化。</blockquote>
            <div class="figures two">
              <figure><img :src="media + '/01-ref-sheet.webp'" alt="古风数字人三视图参考图" loading="lazy" /><figcaption><span>三视图参考图</span><span>建模输入</span></figcaption></figure>
              <figure><img :src="media + '/02-gpt-image-alt.webp'" alt="同批次另一张数字人生图" loading="lazy" /><figcaption><span>同批次备选生图</span><span>造型与装饰差异</span></figcaption></figure>
            </div>
            <p class="note">提示词把「可建模」写进约束：卡通比例、导览形象、装饰尽量简化，减少后续重拓扑与绑带处理的返工。</p>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="base-model" number="02" title="基模生成：两条路径" description="同一份参考图下比较「GPT 直接调用 Blender MCP 建模」与「Hyper3D 生成基模后再回 Blender 拆件绑定」。" :cover="media + '/03-method1-blender-mcp.webp'" cover-alt="Blender MCP 直接生成的基模" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">方法一 / GPT + Blender MCP 直接生成</p>
          <div class="block-body">
            <p>提示词加参考图，直接让 GPT 调用 Blender MCP 建模。</p>
            <ul class="results">
              <li>约 2.26 万三角面、无贴图、GLB 文件约 1.22 MB。</li>
              <li>初版拆件与骨骼绑定相对完善，但视觉与参考图差距较大。</li>
            </ul>
            <figure><img :src="media + '/03-method1-blender-mcp.webp'" alt="Blender MCP 直接生成的基模截图" loading="lazy" /><figcaption><span>方法一 / 直接生成结果</span><span>2.26 万三角面 · 无贴图 · 1.22 MB</span></figcaption></figure>
          </div>
        </div>

        <div class="block">
          <p class="block-label">方法二 / GPT + Blender MCP + Hyper3D MCP</p>
          <div class="block-body">
            <p>流程改为 GPT → Blender → Hyper3D 生成基模，再由 GPT 调用 Blender MCP 完成拆件与骨骼绑定。</p>
            <ul class="results">
              <li>初版未做拆件，Hyper3D 直接生成了头身一体的模型。</li>
              <li>第二版改用 Hyper3D 的 Bang 自动化拆件；骨骼由 GPT 生成脚本估算关节坐标、建立父子关节关系并刷蒙皮。</li>
              <li>约 5.57 万三角面，3 张 2048 × 2048 贴图，GLB 文件约 11.61 MB。</li>
            </ul>
            <div class="figures two">
              <figure><img :src="media + '/04-method2-hyper3d-v1.webp'" alt="Hyper3D 首版头身一体模型" loading="lazy" /><figcaption><span>Hyper3D 首版</span><span>头身一体 · 未拆件</span></figcaption></figure>
              <figure><img :src="media + '/05-method2-hyper3d-v2.webp'" alt="Hyper3D 第二版自动拆件结果" loading="lazy" /><figcaption><span>Bang 拆件后</span><span>5.57 万三角面 · 2K 贴图</span></figcaption></figure>
            </div>
            <figure><img :src="media + '/06-method2-rig-detail.webp'" alt="关节与蒙皮细节" loading="lazy" /><figcaption><span>关节坐标与蒙皮</span><span>脚本估算关节后建立父子关系</span></figcaption></figure>
          </div>
        </div>

        <div class="block">
          <p class="block-label">对比 / 主要指标</p>
          <div class="block-body">
            <table class="metrics">
              <thead><tr><th>路径</th><th>三角面</th><th>贴图</th><th>GLB 体积</th></tr></thead>
              <tbody>
                <tr><td>GPT + Blender MCP</td><td>约 2.26 万</td><td>无</td><td>约 1.22 MB</td></tr>
                <tr><td>叠加 Hyper3D MCP</td><td>约 5.57 万</td><td>3 × 2048²</td><td>约 11.61 MB</td></tr>
              </tbody>
            </table>
            <p class="note">直接生成体积更轻、绑定初版更完整；叠加 Hyper3D 后外观更接近参考图，代价是面数、贴图与文件体积显著上升。</p>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="tpose" number="03" title="角色动画基模与 TPose" description="改用 Rodin Gen 2.5 生成的 TPose 基模作为动画测试起点，导入 Blender 后进入四肢与面部环节。" :cover="media + '/07-tpose-front.webp'" cover-alt="旗袍数字人导览员 TPose 正面" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">01 / 生成基模</p>
          <div class="block-body">
            <p>Rodin Gen 2.5：5 万面、2K 贴图。</p>
            <div class="figures two">
              <figure><img :src="media + '/07-tpose-front.webp'" alt="旗袍数字人导览员 TPose 正面" loading="lazy" /><figcaption><span>TPose / 正面</span><span>动画测试起点</span></figcaption></figure>
              <figure><img :src="media + '/08-rodin-base.webp'" alt="Rodin Gen 2.5 生成结果" loading="lazy" /><figcaption><span>Rodin Gen 2.5</span><span>5 万面 · 2K 贴图</span></figcaption></figure>
            </div>
          </div>
        </div>
        <div class="block">
          <p class="block-label">02 / Blender 导入</p>
          <div class="block-body">
            <p>导入 Blender 后检查层级、材质与比例，再分别测试四肢与面部方案。</p>
            <figure><img :src="media + '/09-blender-import.webp'" alt="基模导入 Blender 后的视图" loading="lazy" /><figcaption><span>Blender / 导入后</span><span>层级与材质检查</span></figcaption></figure>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="limbs" number="04" title="四肢动画：绑定方案对比" description="自动估算骨骼加 Rigify 与 Mixamo 绑定的实际效果差异。" :cover="media + '/15-arms-rigify-poster.webp'" cover-alt="Rigify 手臂动画对比" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">方法一 / Astra 自动估算骨骼 + Rigify <span class="badge no">未采用</span></p>
          <div class="block-body">
            <p>不穿模，但动作略生硬，后续需要多轮优化。</p>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/15-arms-rigify-poster.webp'" aria-label="Rigify 绑定后的手臂动画对比"><source :src="media + '/15-arms-rigify.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/15-arms-rigify.mp4'">打开录屏</a>。</video><figcaption><span>手臂动画 / Rigify</span><span>动作生硬 · 需多轮优化</span></figcaption></figure>
          </div>
        </div>
        <div class="block">
          <p class="block-label">方法二 / Mixamo 绑骨骼 + 动画 <span class="badge ok">采用</span></p>
          <div class="block-body">
            <p>动作自然度明显优于自动估算方案。</p>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/16-walk-mixamo-poster.webp'" aria-label="Mixamo 绑定后的走路动画"><source :src="media + '/16-walk-mixamo.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/16-walk-mixamo.mp4'">打开录屏</a>。</video><figcaption><span>走路动画 / Mixamo</span><span>自然度满足后续演示</span></figcaption></figure>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="facial" number="05" title="面部动画：眼嘴两种实现" description="Astra 直接构建眼嘴，与 Rodin Chat Avatar 重建头部后生成口型、眨眼动画的对比。" :cover="media + '/12-rodin-chat-avatar.webp'" cover-alt="Rodin Chat Avatar 生成的面部结构" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">方法一 / Astra 直接实现眼嘴 <span class="badge no">未采用</span></p>
          <div class="block-body">
            <blockquote class="prompt">请你基于 source_studio.blend 中的版本只将头部暂时独立出来做一次优化：嘴部需要重拓扑以保证自然流畅的口型动画；眼睛尝试两种方案，一种是带眼球、重拓扑后单独制作眼球以支持自然眨眼，另一种是直接按简单拓扑做贴图层面的眨眼动画，用于简化但需要在 VR 中不穿帮，两种方案需要对比。</blockquote>
            <p class="sub-label">构造真实眼球</p>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/17-face-a-eyeball-poster.webp'" aria-label="带眼球的 A 版面部动画"><source :src="media + '/17-face-a-eyeball.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/17-face-a-eyeball.mp4'">打开录屏</a>。</video><figcaption><span>A / 真实眼球</span><span>眨眼与口型测试</span></figcaption></figure>
            <figure><img :src="media + '/10-face-eyeball.webp'" alt="A 版面部拓扑截图" loading="lazy" /><figcaption><span>A 版拓扑</span><span>眼嘴区域</span></figcaption></figure>
            <p class="note">嘴部没有构建出口腔，只有牙；嘴部与下颌的拓扑问题较大，眼睛、嘴及其周边过渡都十分生硬。</p>
            <p class="sub-label">贴图动画模拟眨眼</p>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/18-face-b-texture-poster.webp'" aria-label="贴图模拟眨眼的 B 版面部动画"><source :src="media + '/18-face-b-texture.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/18-face-b-texture.mp4'">打开录屏</a>。</video><figcaption><span>B / 贴图模拟眨眼</span><span>简化方案，近距离易穿帮</span></figcaption></figure>
            <figure><img :src="media + '/11-face-texture-blink.webp'" alt="B 版贴图眨眼截图" loading="lazy" /><figcaption><span>B 版贴图</span><span>眼周过渡留待评估</span></figcaption></figure>
          </div>
        </div>
        <div class="block">
          <p class="block-label">方法二 / Rodin Chat Avatar 重新生成头部 <span class="badge ok">采用</span></p>
          <div class="block-body">
            <p>Rodin Chat Avatar 可以生成结构完整、合理的面部，自带口腔、眼球与 blendshape。</p>
            <figure><img :src="media + '/12-rodin-chat-avatar.webp'" alt="Rodin Chat Avatar 生成的面部结构" loading="lazy" /><figcaption><span>Chat Avatar / 面部结构</span><span>含口腔、眼球与 52 个 Shape Key</span></figcaption></figure>
            <p>Astra 再根据现有 blendshape 的 shape key 构建说话与眨眼动画。</p>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/19-face-blendshape-poster.webp'" aria-label="基于 blendshape 的说话与眨眼动画"><source :src="media + '/19-face-blendshape.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/19-face-blendshape.mp4'">打开录屏</a>。</video><figcaption><span>说话与眨眼</span><span>基于 shape key 驱动</span></figcaption></figure>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="merge" number="06" title="新头部接入原角色身体" description="整头直接迁移与局部拓扑移植两种接入方式的结果差异。" :cover="media + '/14-head-topology-transplant.webp'" cover-alt="局部拓扑移植后的头部" base="#labs/01" group="explore-chapters">
        <div class="block">
          <p class="block-label">整头直接迁移 <span class="badge no">未采用</span></p>
          <div class="block-body">
            <p>新头部直接迁移到原角色身体，与原模型头发和身体出现明显空腔与错位，Astra 也很难修复。</p>
            <figure><img :src="media + '/13-head-swap-gap.webp'" alt="整头替换后的空腔与错位" loading="lazy" /><figcaption><span>整头替换</span><span>发型与颈部空腔错位</span></figcaption></figure>
          </div>
        </div>
        <div class="block">
          <p class="block-label">局部拓扑移植 <span class="badge ok">采用</span></p>
          <div class="block-body">
            <p>只把头部的嘴部与眼睛局部拓扑移植到原头部，保留原发型、后脑与颈部。</p>
            <figure><img :src="media + '/14-head-topology-transplant.webp'" alt="局部拓扑移植后的头部" loading="lazy" /><figcaption><span>局部移植</span><span>眼嘴区域替换，其余保持原模型</span></figcaption></figure>
            <figure class="clip"><video controls playsinline preload="none" :poster="media + '/20-head-final-poster.webp'" aria-label="最终版本头部动画"><source :src="media + '/20-head-final.mp4'" type="video/mp4" />浏览器不支持视频，请<a :href="media + '/20-head-final.mp4'">打开录屏</a>。</video><figcaption><span>V4 / 最终版</span><span>说话与眨眼效果</span></figcaption></figure>
          </div>
        </div>
      </CaseChapter>

      <CaseChapter id="workflow" number="07" title="头部局部拓扑移植流程" description="以原模型头部为主体、只移植眼嘴局部拓扑的完整八步流程。" :cover="media + '/10-face-eyeball.webp'" cover-alt="眼嘴局部拓扑细节" base="#labs/01" group="explore-chapters">
        <ol class="workflow">
          <li>
            <h4>以原模型为主体</h4>
            <p>使用 <code>Wenya_Avatar_Adapted</code> 的原始头部作为基础，保留脸型与头颅轮廓、耳朵与后脑颈部、原发型与发饰、原身体骨架及头部权重、现有 UV 与外观特征。</p>
            <p>这样避免了整颗头重新适配后，发际线、后脑和脖子全部需要返工。</p>
          </li>
          <li>
            <h4>分析 Rodin ChatAvatar 原生拓扑</h4>
            <p>从生成的 <code>blendshapes_with_components</code> 中识别需要迁移的部位：</p>
            <ul><li>左右眼眶边界与眼睑环线</li><li>内外唇环线</li><li>眼球与泪线</li><li>上下牙、牙龈</li><li>舌头及口腔组件</li><li>52 个 Avatar Shape Keys</li></ul>
            <p>眼睛各保留 10 圈原生拓扑，嘴部保留 18 圈，范围足以覆盖实际发生形变的眼睑、嘴唇与嘴角区域。</p>
          </li>
          <li>
            <h4>在数字人原头上开孔</h4>
            <p>根据文雅脸部的实际坐标，分别切除左眼、右眼与嘴部的局部网格。</p>
            <p>切口仅覆盖需要动画的区域，不改变鼻子、脸颊主体、下颌轮廓与头发。</p>
          </li>
          <li>
            <h4>对局部拓扑做空间配准</h4>
            <p>调整嘴眼宽度、高度与中心位置，沿面部深度匹配原皮肤表面，口腔组件后移约 4.5 毫米、眼球后移约 3.3 毫米，并保留 Avatar 各组件之间的相对关系。</p>
            <p>这些深度不是凭视觉猜测，而是通过面部交叉检测逐步确定。</p>
          </li>
          <li>
            <h4>建立连续过渡拓扑</h4>
            <p>局部外环与切口顶点数量不同，使用三角化过渡带桥接。过渡区域共用顶点，不依赖遮挡片。</p>
            <p>随后重新计算面法线，并在材质中混合局部几何法线，消除早期版本中眉下、嘴角与下巴附近的锯齿接缝。</p>
          </li>
          <li>
            <h4>迁移 Shape Keys</h4>
            <p>完整保留嘴眼 Shape Keys，并把局部变形映射到新网格。</p>
            <p>为避免局部边界固定后产生折叠，又把嘴眼变形通过网格邻接关系平滑传递到周围的原面部；张嘴时会带动下巴与脸颊轻微变化，而不是只有嘴唇孤立运动。</p>
          </li>
          <li>
            <h4>重建口腔连接</h4>
            <p>从内唇环向内部扩展连续口腔壁，并封闭口腔后方，解决侧面观察时看到头部内部的问题。</p>
            <p>同时重新区分牙冠、牙龈、舌头与深色口腔内壁；牙齿、牙龈与嘴唇沿用同一套变形关系。</p>
          </li>
          <li>
            <h4>迁移并混合贴图</h4>
            <p>局部嘴眼区域使用 Avatar UV，以保留唇纹、眼睑与眼部细节；外围逐渐混回数字人原本的皮肤颜色与法线。</p>
            <p>头发、后脑与非移植面部继续使用原贴图，避免整头重新烘焙导致发型纹理损失。</p>
          </li>
        </ol>
      </CaseChapter>

      <CaseChapter id="references" number="08" title="其他相关调研" description="同一方向的外部参考，用于对照其他工具链组合。" :cover="media + '/05-method2-hyper3d-v2.webp'" cover-alt="基模与绑定结果" base="#labs/01" group="explore-chapters">
        <ul class="links">
          <li><a href="https://mp.weixin.qq.com/s/yK65CvMwzhQqu5_E5EfVVQ" target="_blank" rel="noreferrer">GPT6 操控 Blender 建不同类型的网格对比 ↗</a><span>微信公众号</span></li>
          <li><a href="https://xhslink.cn/o/2XlHBMaTMS5" target="_blank" rel="noreferrer">GPT6 + Tripo + AutoRigPro 路径 ↗</a><span>小红书</span></li>
        </ul>
        <p class="note">两条外部记录用于对照「生成基模 + 自动绑定」的另一种组合方式，本页结论仍基于上述自测结果。</p>
      </CaseChapter>
    </section>
  </div>
</template>

<style scoped>
.explore-case{padding-top:56px}
.block{display:grid;grid-template-columns:22% 1fr;gap:0 32px;padding:36px 0;border-top:1px solid var(--rule)}
.block:first-of-type{border-top:0;padding-top:0}
.block-label{font-size:10px;line-height:1.7;letter-spacing:.05em;color:#5f6058;display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}
.block-body{max-width:720px}
.block-body>p{font-size:14px;line-height:1.95;color:#4f4f47}
.block-body>p+p{margin-top:12px}
.block-body>p.note{font-size:12.5px;line-height:1.9;color:#807d73;margin-top:18px;padding-left:14px;border-left:1px solid var(--rule)}
.block-body>p.sub-label{font-size:10px;letter-spacing:.05em;color:#8c8d81;margin:26px 0 12px}
.prompt{margin:0 0 22px;padding:2px 0 2px 18px;border-left:1px solid #b9b9af;font-size:13.5px;line-height:1.95;color:#56564d}
.results{list-style:none;margin:14px 0 0;display:grid;gap:8px;font-size:13.5px;line-height:1.85;color:#6f6f66}
.results li{position:relative;padding-left:14px}
.results li:before{content:'';position:absolute;left:0;top:.85em;width:6px;height:1px;background:#b3b0a5}
.badge{font-size:9px;letter-spacing:.06em;color:#8c8d81;border:1px solid var(--rule);padding:2px 7px;white-space:nowrap}
.badge.ok{color:#4c5a3f;border-color:#c0c7b4}
.badge.no{color:#8b5849;border-color:#d7c5bd}
.figures{display:grid;gap:24px;margin-top:6px}
.figures.two{grid-template-columns:1fr 1fr;gap:20px}
figure{margin:20px 0 0}
.figures figure{margin:0}
figure img{display:block;width:100%;height:auto;background:#efeeea}
figcaption{display:flex;justify-content:space-between;gap:16px;margin-top:9px;padding-top:9px;border-top:1px solid var(--rule);font-size:10px;line-height:1.7;color:#83817a}
figcaption span:last-child{color:#a09d93;text-align:right}
figure.clip video{display:block;width:100%;height:auto;background:#1b1b19}
.metrics{width:100%;border-collapse:collapse;margin-top:6px;font-size:12.5px;color:#57574f}
.metrics th{text-align:left;font-weight:400;font-size:9px;letter-spacing:.105em;text-transform:uppercase;color:#8c8d81;padding:0 14px 10px 0;border-bottom:1px solid #b9b9af}
.metrics td{padding:12px 14px 12px 0;border-bottom:1px solid var(--rule);font-variant-numeric:tabular-nums}
.workflow{list-style:none;counter-reset:step;display:grid;gap:0;margin:0;padding:0}
.workflow>li{counter-increment:step;display:grid;grid-template-columns:52px 1fr;gap:0 24px;padding:26px 0;border-top:1px solid var(--rule)}
.workflow>li:first-child{border-top:0;padding-top:0}
.workflow>li:before{content:counter(step,decimal-leading-zero);font-size:12px;color:#9b988e;font-variant-numeric:tabular-nums;padding-top:5px}
.workflow>li>*{grid-column:2}
.workflow h4{font-size:15px;font-weight:400;letter-spacing:-.01em;margin:0 0 8px}
.workflow p{font-size:13.5px;line-height:1.9;color:#63635a}
.workflow p+p{margin-top:8px}
.workflow ul{margin:10px 0 0;padding-left:16px;font-size:13px;line-height:1.85;color:#6f6f66}
.workflow ul+p{margin-top:10px}
.workflow code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#4f4f47;background:#f1f0ec;padding:1px 4px}
.links{list-style:none;margin:0;padding:0;display:grid;gap:16px}
.links li{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px;font-size:13.5px;line-height:1.8;border-bottom:1px solid var(--rule);padding-bottom:14px}
.links a{border-bottom:1px solid #b9b9af;padding-bottom:1px;transition:border-color .2s}
.links a:hover{border-color:currentColor}
.links span{font-size:10px;color:#a09d93;letter-spacing:.04em}
@media(max-width:900px){.block{grid-template-columns:1fr;gap:14px}.block-body{max-width:none}.figures.two{grid-template-columns:1fr}}
@media(max-width:600px){.explore-case{padding-top:34px}.workflow>li{grid-template-columns:34px 1fr;gap:0 14px;padding:22px 0}}
</style>
