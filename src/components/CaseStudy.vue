<template>
  <div class="technical-study"><slot /></div>
</template>

<style scoped>

:deep(.problem-context){display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:24px}
:deep(.problem-context p){font-size:14px;line-height:1.95;color:#585a52;margin:10px 0 0}
:deep(.round-outcome){font-size:12px;line-height:1.95;color:#62665b;margin:20px 0;padding-left:15px;border-left:2px solid var(--line)}
:deep(.round-outcome strong){font-weight:500;color:var(--ink)}
@media(max-width:600px){
:deep(.problem-context){grid-template-columns:1fr;gap:20px}
:deep(.problem-context p){font-size:13px}}
:deep(.table-wrap:focus-visible){outline:1px solid var(--muted);outline-offset:4px}
.technical-study{--ink:#252622;--muted:#72736a;--line:#d9d9d0;--soft:#eeeee6;color:var(--ink);font-size:14px;line-height:1.8}
:deep(.case-heading){max-width:900px;margin-bottom:3rem}
:deep(.mini-label){text-transform:uppercase;font-size:10px;letter-spacing:.11em;color:var(--muted)}
:deep(.intro){font-size:16px;max-width:750px;color:#585a52;margin:0}
:deep(.round){display:grid;grid-template-columns:140px minmax(0,1fr);gap:28px;border-top:1px solid var(--line);padding:36px 0}
:deep(.round-label){display:flex;align-items:flex-start;gap:15px}
:deep(.round-label>span){font-size:30px;line-height:1.2;font-weight:300;color:#96978b;font-variant-numeric:tabular-nums}
:deep(.round-label p){font-size:11px;line-height:1.8;margin:0}
:deep(.round-label small){font-size:9px;color:var(--muted)}
:deep(.round-body){min-width:0}
:deep(.round h4){font-size:clamp(21px,2.2vw,29px);line-height:1.5;font-weight:400;letter-spacing:-.025em;margin:0 0 12px}
:deep(.lead){color:#5d5f56;max-width:850px;margin:0 0 25px}
:deep(h5){font-size:20px;font-weight:400;line-height:1.5;margin:8px 0 12px}
:deep(.process){display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:20px;padding:24px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
:deep(.process b),:deep(.process span){display:block}
:deep(.process b){font-weight:500;font-size:14px}
:deep(.process span){font-size:11px;color:var(--muted);margin-top:5px}
:deep(.process i){color:#a1a391;align-self:center;font-style:normal}
:deep(.next-question){font-size:12px;color:var(--muted);margin:18px 0}
:deep(.evaluation-grid){display:grid;grid-template-columns:1fr;gap:0;border-top:1px solid var(--line)}
:deep(.evaluation-grid>div){display:grid;grid-template-columns:100px 1fr;gap:15px;padding:13px 0;border-bottom:1px solid var(--line)}
:deep(.evaluation-grid b){font-size:13px;font-weight:400}
:deep(.finding){border-left:2px solid #878a76;padding:4px 0 4px 22px;margin-top:24px}
:deep(.finding p),:deep(.decision-block p){color:#5d5f56;margin:0;font-size:13px}
:deep(.cpu-figure),:deep(.leaf-figure){margin:0 0 20px;padding:22px 24px;background:#efefe8;border:1px solid #e3e3d9}
:deep(figcaption){display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:12px;margin-bottom:22px}
:deep(.cpu-row){display:grid;grid-template-columns:135px 1fr;gap:22px;padding:14px 0}
:deep(.cpu-row>div:first-child b),:deep(.cpu-row>div:first-child span){display:block}
:deep(.cpu-row b){font-size:12px;font-weight:500}
:deep(.cpu-row>div:first-child span){font-size:18px;margin-top:4px}
:deep(.bar-pair){display:grid;gap:7px}
:deep(.bar-track){height:24px;background:#e4e5dc;position:relative;overflow:hidden}
:deep(.bar-track i){position:absolute;left:0;top:0;height:100%}
:deep(.bar-track .before){background:#c3c5b8}
:deep(.bar-track .after){background:#898d77}
:deep(.bar-track>span){position:relative;display:block;padding:2px 9px;color:#30332a;font-size:10px;line-height:20px}
:deep(.figure-note){font-size:10px;line-height:1.8;color:var(--muted);margin:16px 0 0}
:deep(.leaf-grid){display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}
:deep(.leaf-column){min-width:0}
:deep(.leaf-count){display:block;font-size:28px;font-weight:400;line-height:1.4;font-variant-numeric:tabular-nums}
:deep(.vertical-chart){height:135px;position:relative;display:flex;align-items:flex-end;margin:22px 0 0;border-bottom:1px solid #b4b6a7}
:deep(.vertical-chart i){display:block;background:#a3a78f;width:100%;max-width:100px;min-height:7px}
:deep(.vertical-chart strong){position:absolute;left:8px;bottom:5px;font-size:17px;font-weight:400;line-height:1.3;color:#252822;background:rgba(239,239,232,.85);padding:1px 4px}
:deep(.vertical-chart small){font-size:10px}
:deep(.chart-axis){font-size:9px;color:var(--muted)}
:deep(dl){margin:14px 0 0;font-size:10px}
:deep(dl>div){display:flex;justify-content:space-between;gap:5px;border-top:1px solid #d7d9cc;padding:6px 0}
:deep(dt){color:var(--muted)}
:deep(dd){margin:0;font-variant-numeric:tabular-nums;white-space:normal}
:deep(.decision-block){margin:25px 0;padding:0 0 0 22px;border-left:2px solid #878a76}
:deep(.decision-block h5){font-size:19px}
:deep(.table-wrap){max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
:deep(table){width:100%;border-collapse:collapse;font-size:11px;text-align:left;font-variant-numeric:tabular-nums;white-space:nowrap}
:deep(caption){text-align:left;font-size:11px;color:var(--muted);padding:0 0 14px;white-space:normal}
:deep(th),:deep(td){font-weight:400;padding:12px 14px 12px 0;border-bottom:1px solid var(--line)}
:deep(thead th){font-size:10px;color:var(--muted)}
:deep(tbody th){font-weight:500}
:deep(tbody tr:last-child){background:rgba(135,140,114,.06)}
:deep(.budget-table){margin-top:24px}
:deep(.defaults){display:grid;grid-template-columns:1fr 1fr 1.3fr;align-items:center;gap:25px;margin:26px 0;padding:22px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
:deep(.defaults span),:deep(.defaults b){display:block}
:deep(.defaults b){font-size:43px;line-height:1.3;font-weight:400;letter-spacing:-.04em}
:deep(.defaults b small){font-size:19px;margin-left:3px}
:deep(.defaults p){font-size:11px;color:var(--muted);margin:0}
:deep(details){border-top:1px solid var(--line);margin-top:12px}
:deep(summary){cursor:pointer;list-style:none;padding:13px 23px 13px 0;font-size:11px;position:relative;color:#626658}
:deep(summary::-webkit-details-marker){display:none}
:deep(summary:after){content:'+';position:absolute;right:2px;top:10px;font-size:16px}
:deep(details[open]>summary:after){content:'−'}
:deep(summary:focus-visible){outline:1px solid #72775f;outline-offset:4px}
:deep(.detail-content){padding:0 0 12px;color:#686b60;font-size:12px}
:deep(.detail-content p){margin:9px 0}
:deep(.source){font-size:10px;overflow-wrap:anywhere}
:deep(code){font-family:monospace;font-size:10px;background:#ecece4;padding:2px 4px;color:#59604c}
:deep(.mechanism figure){margin:6px 0 20px}
:deep(.mechanism img){display:block;width:515px;max-width:100%;height:auto;margin:0 auto}
@media(max-width:850px){
:deep(.round){grid-template-columns:100px minmax(0,1fr);gap:20px}
:deep(.round-label){display:block}
:deep(.round-label p){margin-top:8px}
:deep(.cpu-figure),:deep(.leaf-figure){padding:18px}
:deep(.leaf-grid){gap:15px}
:deep(.defaults){grid-template-columns:1fr 1fr}
:deep(.defaults p){grid-column:1/-1}
:deep(.cpu-row){grid-template-columns:110px 1fr;gap:12px}
:deep(dl>div){display:block}
:deep(dd){margin-top:2px}}
@media(max-width:600px){
.technical-study{font-size:13px}
:deep(.case-heading){margin-bottom:28px}
:deep(.intro){font-size:14px}
:deep(.round){display:block;padding:25px 0}
:deep(.round-label){display:flex;gap:13px;margin-bottom:18px;align-items:center}
:deep(.round-label>span){font-size:25px}
:deep(.round-label p){margin:0;font-size:10px;line-height:1.6}
:deep(.round-label br){display:none}
:deep(.round-label small){margin-left:12px}
:deep(.round h4){font-size:22px}
:deep(.lead){font-size:13px;margin-bottom:20px}
:deep(.process){gap:8px;padding:18px 0}
:deep(.process b){font-size:11px}
:deep(.process span){font-size:9px;line-height:1.6}
:deep(.evaluation-grid>div){grid-template-columns:75px 1fr;gap:8px}
:deep(.evaluation-grid b){font-size:11px}
:deep(.mini-label){font-size:9px}
:deep(.cpu-figure),:deep(.leaf-figure){padding:16px 13px}
:deep(.cpu-row){grid-template-columns:1fr;gap:8px}
:deep(.cpu-row>div:first-child){display:flex;justify-content:space-between;align-items:baseline}
:deep(.cpu-row>div:first-child span){font-size:15px;margin:0}
:deep(.cpu-figure figcaption),:deep(.leaf-figure figcaption){margin-bottom:13px}
:deep(.leaf-grid){gap:10px}
:deep(.leaf-count){font-size:22px}
:deep(.vertical-chart){height:115px;margin-top:15px}
:deep(.vertical-chart strong){left:2px;font-size:14px;padding:1px 2px}
:deep(.vertical-chart small){font-size:8px}
:deep(.chart-axis){font-size:8px}
:deep(dl){font-size:9px}
:deep(dl>div){padding:7px 0}
:deep(.figure-note){font-size:9px}
:deep(.finding),:deep(.decision-block){padding-left:15px}
:deep(.finding h5),:deep(.decision-block h5){font-size:18px}
:deep(.defaults){gap:16px}
:deep(.defaults b){font-size:38px}
:deep(th),:deep(td){padding-right:16px}
:deep(summary){font-size:11px}}

</style>
