<script setup lang="ts">
import CaseChapter from './CaseChapter.vue'

defineProps<{ id: string }>()

const media = '/media/explore/digital-human'
const vrClip = '/media/vr-demo/vr-demo-3dgs.mp4'
</script>

<template>
  <div class="explore-case">
    <template v-if="id === '02'">
      <dl class="explore-facts">
        <div><dt>时间</dt><dd>2026.11</dd></div>
        <div><dt>引擎</dt><dd>UE5.8 · MetaHuman</dd></div>
        <div><dt>场景与工具</dt><dd>XGRIDS LCC 3DGS · Unreal MCP · Python · C++</dd></div>
      </dl>

      <div class="block">
        <p class="block-label">演示</p>
        <div class="block-body">
          <figure class="clip vr-clip"><video controls playsinline preload="none" :src="vrClip" aria-label="VR + 3DGS 数字人导览演示"></video><figcaption>3DGS 场景中的数字人导览</figcaption></figure>
        </div>
      </div>

      <div class="block">
        <p class="block-label">导览流程</p>
        <div class="block-body">
          <p>基础关卡 VRTemplateMap5 中，<code>BP_KellanGuide</code> 与三个 <code>PatrolPoint</code>、三个 <code>PointTarget</code> 配套：站位与指向对象分开配置，可以表达「角色站在通道中、指向侧面展品」。</p>
          <ol>
            <li>移动到当前展点</li>
            <li>抵达与站位处理</li>
            <li>玩家未靠近时循环播放等待提示并检查距离</li>
            <li>靠近后讲解并播放指向动作</li>
            <li>推进到下一展点</li>
            <li>移动失败或卡住时重试、跳过不可达点</li>
          </ol>
          <p>难点不在把角色送到点位，而在玩家是否跟上、导航失败后如何继续。</p>
        </div>
      </div>

      <div class="block">
        <p class="block-label">动画链路</p>
        <div class="block-body">
          <p>身体动作先在统一源骨架（UEFN Mannequin）上组织，经 <code>ABP_KellanGuide_Source</code> → <code>ABP_GenericRetarget</code> 驱动 MetaHuman Body；面部由 <code>Face_AnimBP</code> 与 DefaultSlot 上的 Montage 承载讲解表现，音频走 AudioComponent。</p>
          <p class="note">这里的「动画优化」是动画重定向、动画蓝图接线与局部动画资产修复，不包含自动生成蒙皮权重。</p>
        </div>
      </div>

      <div class="block">
        <p class="block-label">MCP 辅助重定向迁移</p>
        <div class="block-body">
          <p>迁移到 UE5.8 后，<code>ABP_GenericRetarget</code> 原先依赖 Retarget IK Goals 与控制器类型的参数更新方式需要适配。排查同时涉及操作栈、控制器转换和蓝图执行连线。</p>
          <p>三类工具各管一段：MCP 读取蓝图节点、引脚与连接关系，执行断线、连线与严格编译；Unreal Python 读取重定向资产、重建函数图、保存并输出检查报告；C++ 把参数处理封装为 <code>UpdateRetargetProfileFromCurves</code>，遍历 <code>FRetargetProfile</code> 时按操作设置的结构体类型处理 Blend to Source 与 Offset Goals。</p>
          <p><code>ChainCurveMap</code> 把目标骨骼链映射到动画曲线，按曲线权重更新对应链，未映射链与无关设置保留原值：</p>
          <ul>
            <li><code>BlendToSource = Lerp(原值, 1, w)</code></li>
            <li><code>LocalTranslationOffset = Lerp(原值, 零向量, w)</code></li>
          </ul>
          <p>迁移报告显示相关函数完成四节点重建并编译、保存成功；历史 PIE 日志检查在所检查的 123 行窗口内没有错误。参数覆盖逻辑另有原生自动化测试，覆盖链选择、设置保留、空实例、缺失操作与输入不被修改。</p>
          <p class="note">MCP 的连线修改与后续 C++ 迁移是两次迭代，早期脚本不等同于最终函数图结构。</p>
        </div>
      </div>

      <div class="block">
        <p class="block-label">跨骨架手势修复</p>
        <div class="block-body">
          <p>复用的指向动作能驱动角色，但手型与收手过渡仍不自然；左右手与不同骨架的局部轴差异，使直接复制旋转值不可靠。</p>
          <p>处理分两步：先从右手抓握参考动作采样姿态，构造手掌局部基底把参考手指方向映射到目标左手，只修复中指、无名指、小指与拇指共 12 个关节，保留食指指向；再把右臂替换为 Idle，左臂从第 45 帧用四元数插值平滑回 Idle。修复权重随抬臂程度与动作时间变化，在动作首尾回到零。</p>
          <p>原动作长度 2.7 秒、81 帧区间、82 个采样关键点；处理后非目标骨骼的局部平移差为零，最大旋转差约 0.0000024°，过渡时长 1.2 秒，最终快照引用 IdleArms_v3。</p>
          <p class="note">这些数字证明的是修改范围与数值一致性，动作是否自然仍需看实际画面。</p>
        </div>
      </div>

      <div class="block">
        <p class="block-label">可打断的导览交互</p>
        <div class="block-body">
          <p>实验在由 VRTemplateMap5 另存的 <code>GuideIntentLab</code> 中进行，角色与控制器使用副本，共享原地形、导航、音频与动画资源。为避免自动推进回调与实验控制竞争，副本中原有事件连线已断开，入口与运行状态由 <code>AGuideIntentLab</code> 管理。</p>
          <p>文字与语音共用一条执行链：文字输入或麦克风 → Silero VAD 检出开口（同时暂停当前动作）→ sherpa-onnx 流式识别 → 最终文本提交 → 有限意图解析 → 控制导航、音频与面部 Montage。中间识别结果不触发展点切换。</p>
          <table class="metrics">
            <thead><tr><th>问题</th><th>处理</th></tr></thead>
            <tbody>
              <tr><td>中间文本变化误触发导航</td><td>只有最终识别文本进入动作执行入口</td></tr>
              <tr><td>暂停面部更新破坏头身同步</td><td>只暂停讲解 Montage，继续更新 Face AnimBP</td></tr>
              <tr><td>暂停后切换展品仍带暂停标记</td><td>取消旧播放时显式清除音频暂停标记</td></tr>
              <tr><td>旧语音请求返回影响新会话</td><td>会话标识过滤旧请求，并维护事件游标</td></tr>
              <tr><td>远处说「继续」跳过等待</td><td>等待状态仍检查玩家与展点的水平距离</td></tr>
            </tbody>
          </table>
          <p>实验记录中，原生编译、20 条文字用例、7 项 PIE 控制检查、4 条合成语音到意图用例与 2 项语音会话隔离测试通过，另有头颈姿态、玩家朝向和第二展点等待播放的回归记录。</p>
          <p class="note">当前交互入口是桌面 PIE 面板；自由问答尚未实现，现为有限意图规则识别。真人噪声环境打断、头显内世界空间 UI 与打包交付仍需单独验收。</p>
        </div>
      </div>

      <div class="block">
        <p class="block-label">导航方向平滑</p>
        <div class="block-body">
          <p>自定义 <code>VRGsplatSmoothCrowdFollowingComponent</code> 对 Detour 预判转向的水平速度方向做指数平滑，同时限制与原请求方向的角度差：默认时间常数 0.08 s、最大方向滞后 15°，保留水平速度大小，临近终点、停止或穿越导航连接时绕过过滤。</p>
          <p class="note">现有材料没有转向抖动改善比例或路径成功率对照数据。</p>
        </div>
      </div>

      <div class="block">
        <p class="block-label">后续方向</p>
        <div class="block-body">
          <ol>
            <li>把实验入口扩展为头显内世界空间 UI，验证真实 VR 操作流程。</li>
            <li>用真人语音与噪声场景测量识别成功率、误打断率与响应延迟。</li>
            <li>补充动画修复前后录屏与人工评价，建立表现质量对照。</li>
            <li>为 MCP 编辑器任务记录耗时、失败情况与重复执行表现。</li>
            <li>有限意图执行层稳定后，再探索知识库问答或大模型兜底，并保留可取消的动作接口。</li>
          </ol>
        </div>
      </div>
    </template>

    <template v-else>
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
    </template>
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
.block-body ul,.block-body ol{margin:14px 0 0;padding-left:18px;font-size:13.5px;line-height:1.9;color:#4f4f47}
.block-body li+li{margin-top:6px}
.block-body ul+p,.block-body ol+p,.block-body table+p{margin-top:16px}
.block-body code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#4f4f47;background:#f1f0ec;padding:1px 4px}
.block-body .metrics{margin-top:16px}
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
figure.vr-clip video{aspect-ratio:16/9;height:auto}
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
