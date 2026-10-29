# LOD 证据核查 / 2026-10-28

核查本地 HEAD，未确认其是否等于线上发布版本。本轮未运行新的 GPU 性能实验。代码、实际 vendor 文件、资产元数据及原始报告的 SHA-256 见 `lod-evidence-snapshot.json`；重新提取运行 `python3 scripts/audit_lod_evidence.py`。外部源仓库未作修改。

## 版本与结论边界

- Viewer：2aeb02aa（2026-10-21）；transform：16c9f36（2026-09-07）。历史报告主要在 7–8 月，早于目前代码。
- public/index.html 的 import map 使用 public/vendor/playcanvas-2.20.0.js，已记录该文件哈希，并核对其中预算、pendingDecrements、allocation diff 路径；不只依据 npm 版本号推断运行时。
- 现有报告没有与当前源码、vendor 和资产载荷哈希组成可验证的版本链。元数据的生成器 v3.3.0 标签也不等于对应某个 Git 提交。

## 当前实现确认

### 分块数量

transform/src/lib/lod/lod-plan.ts:80 默认 chunkCount=96，单位是 1024 个高斯，即约 98,304 点的打包单位，不是全场景 96 块。

write-lod.ts:1388–1395 以点数超限强制切分，或在空间跨度超过 chunkExtent 且点数超过 minChunkPoints 时继续切分。默认 minChunkPoints=8192 是空间切分停止条件，不保证每个叶块至少 8192 点。当前计划中的 targetLeaves 只是参考量，不能宣称严格叶数上限；32768 叶块阈值只告警。

lod-plan.ts:469 起按 ceil(points/binSize) 估算最粗两级各不超过 4 个文件，并在最大 LOD 限制内延长层级链。这不是整个场景文件数上限；实际打包还有离散叶段与空间约束，仍需检查生成后的文件数。write-lod.ts:1230 起按 Morton 顺序将多个叶段打包成 SOG，物理文件与逻辑叶块不是一一对应。

本地元数据：sanlitun 为 4400 个带 LOD 的叶节点、924 个物理文件；soho-restore 为 6501 个叶节点、2119 个文件。仅说明该资产快照，未证明它们使用当前自动规划重新生成。两者记录 chunkExtent=10，不能当作大场景自动 extent=0 的效果样本。

### 为什么早期预算驱动不足

23117d5e 的父版本中，下载队列调用 computeOptimalLodIndex 计算距离目标，而读取的 engine optimal 主要用于差异统计。引擎本身已有预算平衡，不等于下载策略也遵守同一目标。后续曾加入引擎目标及回退逻辑，b012c9be 再移除本地 rawOptimal；所以不能笼统声称所有旧版都不支持预算。

当前 refinement-controller.ts:1990 起读取引擎 optimalLod，2160 起无引擎目标则跳过正常细化下载，并通过 effective target 与 ladder 推进。Bootstrap 阶段另有策略，不能用一句“全部完全相同”概括。

排查链路应比较 raw/distance target（旧版）、engine optimal、current、资源 loaded 与下载 pending，区分：多下载了细档、细档已加载却未上屏、预算目标本身发生抖动。相关 HUD 和记录字段是定位依据；单看 pending=0 不代表达到清晰目标。代码证实目标来源已调整，但收益大小需要当前版消融实验。

### 视野外与 Buffer

out-of-frustum-downgrade.ts 默认开启 OOF 降档。evaluate 后将 OOF 目标钳到 bootstrap，仍返回钳制前总量，避免预算反馈因系统性欠填而把 scale 拉高；apply 前处理实际仍细的 OOF，粗档未加载时先确保资源，idle drip 继续处理残留。

引擎 applyLodChanges 在替代资源就绪后才修改 current / 减少旧引用；pendingDecrements 会暂留旧档。世界状态再通过 interval allocation diff 回收不再使用的分配。因此必须分别检查目标降档、current 切换、旧 interval 消失、缓存资源与纹理容量；不能把目标变粗或 VRAM 不下降直接当作 Buffer 处理完成或失效。当前存在实现，不等于所有场景都已实测无残留。

## 历史证据筛选

| 历史实验 | 观察 | 可支持 / 不可支持 |
| --- | --- | --- |
| Poland leaf ladder 08-11，2.5M budget，WebGPU | 叶数 4096 / 16384 / 32752；实际 splats P50 2.19 / 2.19 / 2.06M；update P50 6.2 / 21.5 / 49.8ms，帧时间 P50 16.7 / 25.7 / 66.7ms | 接近点负载时，细叶与显著 CPU 更新成本相关；不是最新版本因果证明，不推断普适最佳叶数 |
| 同实验 | blur P50 11.900 / 10.333 / 6.503s；P90 21.158 / 27.630 / 26.061s | 中位恢复与尾部恢复有取舍，细分并非各项都好；帧样本不等于独立重复 |
| Chengjian budget repeats 08-12，9 次 | 4M 组首帧 97.419 / 3.868 / 3.684s，同参数相差极大；2.5M 组 kf1 1/3 超时 | 不能把相同配置 r1/r2/r3 解释为优化前后。保留异常和超时，不删后声称提速 |
| Poland pack-hard 08-10 | 10→60 FPS 同时实际点数约 3.00→0.23M | 负载不一致，不能作为纯算法效率提升 |
| Wuhan min-chunk 07-29 | 粗化后帧时间 P50 均约 16.7ms，尾部和变清并非全面改善 | 不能把减少块数当作所有场景必然获益 |

原始 results.json 保留在源仓库；本地快照提取完整 ladder 统计与 repeat waypoints，包括 null / 超时。历史 BDA 单轮 A/B 与 STAR 汇总数字撤下主成果推荐。STAR 的 2/1429 与 postFix 的 5/1488 轮次未对齐，暂不发布。

## 最新版本可发表指标的补测协议

1. 冻结 Viewer、实际 vendor、transform、输入及输出资产哈希、启动参数、后端、设备/驱动、视口/DPR、网络和缓存条件。当前 HEAD 不自动代表部署版本。
2. 先选高密度小场景与大尺度场景，固定路线、停留时间和清晰判定。先每配置至少 5 次独立运行，交错顺序；冷/暖缓存分开；保留全部失败、超时和异常。若变异仍大，增加次数。报告逐次值、运行级中位数与范围；少量重复不强行给出可靠置信区间。
3. 分块梯度只改变 extent/minChunk，保持输入、LOD 点链与预算；同时测中心/边缘画质，避免点数相近就宣称视觉质量一致。统计实际叶数、文件数、interval 数、CPU update P95/P99、清晰时间及超时率。
4. 单项消融分别测试下载目标策略和 OOF 开关，其他逻辑固定。记录目标/当前 OOF 点数、pendingCoarse、旧 interval 释放延时、上传量、资源缓存和 WorkBuffer 容量。旧行为需要可复现的版本/隔离开关，不能用新旧多个改动混合对比归因单项。
5. 只把跨重复和适用场景一致、且没有画质/超时回退的观察写成规律；场景依赖和代价一并保留。网页本轮先呈现机制与体验视频，不公布当前性能提升数字。
