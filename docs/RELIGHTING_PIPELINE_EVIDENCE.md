# 世界空间笔刷与局部 Bloom：实现及回归依据

核对日期：2026-10-28。Viewer HEAD：`2aeb02aad8496fc3c73d08a63676f024760a30e3`。只读当前源码和历史差异，未运行该 Viewer 的功能或性能复测。

## 数据职责

1. 屏幕笔刷经拾取得到世界位置与世界影响半径，保存为区域点集。
2. 提交内容烘焙为64³世界空间亮度场，打包R8图集；多区域另维护颜色数据。
3. splat以世界位置采样亮度场，进行局部调亮/调暗。
4. 已提交状态下，将同一体积按当前相机重投影为屏幕mask；绘制中的新点尚未进入体积，使用点投影预览。
5. CameraFrame做屏幕亮部提取/模糊，compose以mask和brightPass约束辉光合成。

因此：**烘焙的是世界空间选区/亮度数据；换视角重建屏幕mask，Bloom本身仍是屏幕空间后处理。** 不能写成将Bloom结果烘焙为世界空间光照，也不能承诺完整遮挡或任意视角物理正确。

机制图源为`public/diagrams/relighting-world-space.mmd`，静态SVG由固定Mermaid版本渲染，图中仅表达已提交区域路径，不是性能数据。

## 源码入口（相对Viewer根目录）

| 入口 | 职责 |
| --- | --- |
| `src/vfx/bloom/bloom-brush-flow.ts:123–140` | 世界命中、世界半径和点集存储 |
| `src/vfx/bloom/committed-brightness-volume.ts:35,169` | 单/多区域亮度体积烘焙 |
| `src/vfx/bloom/bloom.ts:1237–1347` | 同源体积投影mask、近景采样及平滑 |
| `src/vfx/bloom/bloom.ts:1386–1429` | 体积/实时点路径选择、内容与相机缓存 |
| `src/vfx/bloom/bloom.ts:354–378` | 相机更新后的framerender重投影和传参 |
| `src/vfx/bloom/bloom.ts:36–84` | compose中的mask、brightPass、smoothstep与knee |
| `src/vfx/bloom/bloom.ts:728–745` | 多区域/草稿内容签名与重建 |
| `src/vfx/lighting/night-mode.ts:479–497` | 预览与已提交区域去重，避免重复乘亮 |
| `src/viewer.ts:256–275,1310–1337` | 实际管线需求、色彩补丁与HDR启用顺序 |
| `src/render/camera-frame-tone-patch.ts:5–26,65–87,116–182` | 线性解码、tone mapping、编码与材质快照恢复 |

行号定位当前核对版本，不作为永久公开GitHub地址。

## 回归与修复

| 回归表现 | 原因 / 处理 | 依据 |
| --- | --- | --- |
| 换视角后亮区随镜头滑动 | frameupdate时相机未更新；改在framerender重投影；相机与内容签名控制缓存粒度 | 当前源码与STAR阶段4 |
| 调亮与辉光范围不一致、近景体素点阵 | 同源体积重投影；按屏幕体素尺寸选择stride与投影半径，并平滑2D mask | `e6083197`、`477ebe35`及当前函数 |
| 预览与松手/SET后跳亮 | 仅在未提交区叠加预览，提交后走统一体积路径 | night-mode与brush状态实现 |
| 阈值起步产生硬边 | step改为smoothstep和自适应knee | `3beae67c` |
| 参数正确但Bloom无效 | renderFormats晚于enable导致HDR回退、Bloom静默关闭；调换初始化顺序 | viewer与STAR |
| Reveal首帧局部光/辉光误开 | Viewer先构造，Reveal状态未就绪；由settings提前推断并门控体积/mask与Bloom | `60d37a96` |
| 没开Bloom却变色，编辑/观看不一致 | 遗留非零参数误挂CameraFrame；按有效开关、区域、笔刷需求决定是否启用 | `0959a9a4` |
| CameraFrame后发灰、mesh/splat色彩不一致 | 修正线性空间tone mapping和输出编码、相关材质路径；启用期间应用，退出按快照恢复 | `1ec97211` |

Bloom强度由配置侧单一入口维护，NightMode不重复改写；该状态分工属于本章管线问题。通用shader所有权、贡献者仲裁、变体签名与材质重挂集中在Shader章节。

## 不能沿用的旧概括

- 不绝对说所有模式只pointerup重烘焙：草稿、多区域内容变化也会触发，稳定内容依签名缓存。
- 旧falloff参数与当前实现有差异，不复用旧公式作为当前参数。
- `76b28501`的一帧warmup仅为历史尝试，当前HEAD已无对应策略，不放进当前实现叙事。
- mask采用体素投影与平滑，没有完整场景深度遮挡；不写成无漏光保证。
- 这些证据支持实现与排查过程，不提供本轮实测性能增幅。
