module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},83083,e=>{"use strict";let t=e.i(17676).BIAS_CATALOGUE.map(e=>`- ${e.key}: ${e.characterName} (${e.biasNameOriginal})`).join("\n"),r=`
너는 "뇌피셜" Step 1의 적응형 질문 생성기다.

목표:
- 사용자의 최근 답변과 지금까지의 대화 흐름을 바탕으로 다음 질문 1개를 만든다.
- 질문은 일상적이고 구체적이어야 하며, 사용자가 "나 얘기를 듣고 있네"라는 느낌을 받아야 한다.
- 질문은 심리 상담처럼 무겁지 말고, 가벼운 모바일 대화 톤으로 작성한다.
- 항상 4개의 선택지를 만든다.
- 선택지는 서로 겹치지 않아야 하고, 모두 그럴듯해야 한다.
- 정답이 있는 테스트처럼 보이면 안 된다.
- 각 선택지 문장은 가능하면 한 문장, 최대 34자 안쪽으로 짧게 쓴다.

편향 키 참고:
${t}

출력 규칙:
- 반드시 JSON만 출력한다.
- 아래 형식을 정확히 따른다.
{
  "prompt": "질문 본문",
  "helper": "짧은 안내 문장",
  "options": [
    {
      "label": "선택지 문장",
      "primary_bias_key": "bias-key",
      "secondary_bias_key": "bias-key or null"
    }
  ]
}

제약:
- options는 반드시 4개다.
- primary_bias_key는 위 편향 키 중 하나여야 한다.
- secondary_bias_key는 null 또는 위 편향 키 중 하나여야 한다.
- 선택지 문장은 모바일에서 읽기 쉽게 한두 문장 길이로 유지한다.
- 선택지 한 개가 카드에서 3줄을 넘길 정도로 길어지면 안 된다.
- 이전 질문과 거의 같은 의미를 반복하지 않는다.
`.trim();function s(e){let t=0===e.history.length?"- 아직 대화 없음":e.history.slice(-4).map((e,t)=>`${t+1}. 질문: ${e.question}
   답변: ${e.answer}`).join("\n"),r=e.knownTopSignals.length>0?e.knownTopSignals.join(", "):"아직 뚜렷한 신호 없음";return`
현재까지 답변 수: ${e.answeredTurns}
현재 강하게 보이는 편향 신호: ${r}

최근 대화 흐름:
${t}

요청:
- 다음 질문 1개와 4개 선택지를 만들어라.
- 사용자의 최근 답변을 실제로 반영해라.
- 추상적인 질문보다, 생활 장면이 떠오르는 질문을 선호한다.
- 같은 질문을 다시 묻지 마라.
- helper는 사용자를 안심시키는 짧은 문장으로 작성해라.
`.trim()}e.s(["STEP1_CHAT_SYSTEM_PROMPT",0,r,"buildStep1ChatUserPrompt",()=>s])},59519,e=>{"use strict";function t(e){return`
다음 Top 3 캐릭터를 바탕으로 결과 요약을 만들어라.

${e.top3.map((e,t)=>`${t+1}. ${e.characterName} / ${e.subtitle} / score=${e.score}`).join("\n")}

응답 JSON 형식:
{
  "share_line": "짧은 공유 문구",
  "overall_insight": "2~3문장 종합 인사이트"
}
`.trim()}e.s(["STEP1_RESULT_SYSTEM_PROMPT",0,`
너는 "뇌피셜" Step 1 결과 요약 작성기다.

목표:
- Top 3 캐릭터를 자연스러운 한국어로 요약한다.
- 사용자가 결과를 가볍게 공유하고 싶어지도록 짧고 선명하게 쓴다.
- 진단 확정처럼 말하지 않고, 생각 패턴을 설명하는 톤을 유지한다.

제약:
- 공격적이거나 평가하는 말투 금지
- 너무 장황한 설명 금지
- JSON만 출력
`.trim(),"buildStep1ResultUserPrompt",()=>t])},69340,e=>e.a(async(t,r)=>{try{var s=e.i(66680),n=e.i(17676),a=e.i(71994),i=e.i(83083),o=e.i(59519),l=e.i(97379),u=e.i(16963),p=t([a,u]);[a,u]=p.then?(await p)():p;let m=new Set(n.BIAS_CATALOGUE.map(e=>e.key)),_=new Set([0,3,6]);async function c(e,t){var r;let o;if(!(0,a.hasGeminiConfig)()||"in_progress"!==e.step1_status)return;let p=(e.current_question?.id??"").startsWith("ai-");if((t||!p)&&(r=e.answers.length,(o=process.env.STEP1_AI_TURNS?.split(",").map(e=>Number.parseInt(e.trim(),10)).filter(e=>Number.isFinite(e)))&&o.length>0?new Set(o).has(r):_.has(r)))try{let t=await (0,a.generateGeminiJson)({model:process.env.GEMINI_MODEL_STEP1||"gemini-2.5-flash-lite",systemPrompt:i.STEP1_CHAT_SYSTEM_PROMPT,source:"step1_question",userPrompt:(0,i.buildStep1ChatUserPrompt)({answeredTurns:e.answers.length,history:(0,l.getStep1ConversationHistory)(e),knownTopSignals:n.BIAS_CATALOGUE.map(t=>({key:t.key,characterName:t.characterName,score:e.bias_scores[t.key]??0})).sort((e,t)=>t.score-e.score).filter(e=>e.score>0).slice(0,5).map(e=>`${e.characterName}(${e.key})`)})}),r=function(e){let t=e.prompt?.trim(),r=e.helper?.trim(),n=e.options?.slice(0,4)??[];if(!t||!r||4!==n.length)return null;let a=`ai-${(0,s.randomUUID)()}`,i=n.map((e,t)=>{let r,s=e.label?.trim(),n=e.primary_bias_key?.trim(),i=e.secondary_bias_key?.trim()||void 0;return s&&n&&m.has(n)&&(!i||m.has(i))?{id:`${a}-${t+1}`,label:(r=s.replace(/\s+/g," ").trim()).length<=34?r:`${r.slice(0,33).trim()}…`,bias_map:{[n]:3,...i&&i!==n?{[i]:1}:{}}}:null});if(i.some(e=>!e))return null;let o=new Set(i.map(e=>e.label));return 4!==o.size?null:{id:a,prompt:t,helper:r,interaction:"choice",options:i}}(t);if(!r)return;e.current_question=r,e.asked_question_ids.push(r.id),(0,l.saveSession)(e),await (0,u.persistSessionRecord)(e)}catch(e){console.error("Step 1 Gemini question fallback:",e)}}async function d(e){let t=await (0,u.getOrCreateSessionRecord)(e.session_id),r=!!(e.selected_option_id||e.input_text?.trim());r&&((0,l.validateAndStoreStep1Answer)(t,e),await (0,u.persistSessionRecord)(t)),await c(t,r||0===t.answers.length&&!t.current_question?.id.startsWith("ai-"));let s=(0,l.getCurrentStep1Question)(t);return{session_id:t.id,status:t.step1_status,question:s,history:(0,l.getStep1ConversationHistory)(t),answered_turns:t.answers.length,recommended_min_turns:7,progress:s?.progress??100}}async function h(e){let t=await (0,u.getSessionRecord)(e.session_id);if(!t)throw Error("유효한 Step 1 session_id가 필요합니다.");if(t.step1_result?.bias_breakdown?.length===n.BIAS_CATALOGUE.length&&t.step1_result.top3?.length===3)return t.step1_result;let r=(0,l.buildStep1Result)(t);if(await (0,u.persistSessionRecord)(t),!(0,a.hasGeminiConfig)())return r;try{let e=await (0,a.generateGeminiJson)({model:process.env.GEMINI_MODEL_STEP1||"gemini-2.5-flash-lite",systemPrompt:o.STEP1_RESULT_SYSTEM_PROMPT,source:"step1_result",userPrompt:(0,o.buildStep1ResultUserPrompt)({top3:r.top3.map(e=>({characterName:e.character_name,subtitle:e.subtitle,score:e.score}))})}),s={...r,overall_insight:e.overall_insight||r.overall_insight,share_line:e.share_line||r.share_line};return t.step1_result=s,await (0,u.persistSessionRecord)(t),s}catch{return r}}e.s(["runStep1Chat",()=>d,"runStep1Result",()=>h]),r()}catch(e){r(e)}},!1),19699,e=>e.a(async(t,r)=>{try{var s=e.i(89171),n=e.i(16963),a=e.i(69340),i=t([n,a]);async function o(e){try{let t=await e.json().catch(()=>null);if(!t||"object"!=typeof t)return s.NextResponse.json({message:"유효한 요청 형식이 아닙니다."},{status:400});let r="string"==typeof t.session_id?t.session_id.slice(0,128):void 0,i=await (0,n.getSessionRecord)(r);if(!i)return s.NextResponse.json({message:"유효한 Step 1 session_id가 필요합니다."},{status:404});if("ready_for_result"!==i.step1_status)return s.NextResponse.json({message:"Step 1 진단이 아직 끝나지 않았습니다."},{status:409});let o=await (0,a.runStep1Result)({session_id:i.id});return s.NextResponse.json(o)}catch(e){return console.error("Step 1 result error:",e),s.NextResponse.json({message:"Step 1 결과를 생성하지 못했습니다."},{status:400})}}[n,a]=i.then?(await i)():i,e.s(["POST",()=>o]),r()}catch(e){r(e)}},!1),9579,e=>e.a(async(t,r)=>{try{var s=e.i(47909),n=e.i(74017),a=e.i(96250),i=e.i(59756),o=e.i(61916),l=e.i(74677),u=e.i(19163),p=e.i(16795),c=e.i(87718),d=e.i(95169),h=e.i(47587),m=e.i(66012),_=e.i(70101),g=e.i(26937),R=e.i(10372),S=e.i(93695);e.i(52474);var y=e.i(220),w=e.i(19699),f=t([w]);[w]=f.then?(await f)():f;let E=new s.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/step1/result/route",pathname:"/api/step1/result",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/step1/result/route.ts",nextConfigOutput:"",userland:w}),{workAsyncStorage:b,workUnitAsyncStorage:T,serverHooks:C}=E;function v(){return(0,a.patchFetch)({workAsyncStorage:b,workUnitAsyncStorage:T})}async function x(e,t,r){E.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let s="/api/step1/result/route";s=s.replace(/\/index$/,"")||"/";let a=await E.prepare(e,t,{srcPage:s,multiZoneDraftMode:!1});if(!a)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:w,params:f,nextConfig:v,parsedUrl:x,isDraftMode:b,prerenderManifest:T,routerServerContext:C,isOnDemandRevalidate:P,revalidateOnlyGenerated:A,resolvedPathname:N,clientReferenceManifest:k,serverActionsManifest:O}=a,$=(0,u.normalizeAppPath)(s),U=!!(T.dynamicRoutes[$]||T.routes[N]),j=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,x,!1):t.end("This page could not be found"),null);if(U&&!b){let e=!!T.routes[N],t=T.dynamicRoutes[$];if(t&&!1===t.fallback&&!e){if(v.experimental.adapterPath)return await j();throw new S.NoFallbackError}}let q=null;!U||E.isDev||b||(q=N,q="/index"===q?"/":q);let I=!0===E.isDev||!U,M=U&&!I;O&&k&&(0,l.setManifestsSingleton)({page:s,clientReferenceManifest:k,serverActionsManifest:O});let H=e.method||"GET",D=(0,o.getTracer)(),G=D.getActiveScopeSpan(),L={params:f,prerenderManifest:T,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:I,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:v.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,s,n)=>E.onRequestError(e,t,s,n,C)},sharedContext:{buildId:w}},B=new p.NodeNextRequest(e),F=new p.NodeNextResponse(t),K=c.NextRequestAdapter.fromNodeNextRequest(B,(0,c.signalFromNodeResponse)(t));try{let a=async e=>E.handle(K,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=D.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${s}`)}),l=!!(0,i.getRequestMeta)(e,"minimalMode"),u=async i=>{var o,u;let p=async({previousCacheEntry:n})=>{try{if(!l&&P&&A&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await a(i);e.fetchMetrics=L.renderOpts.fetchMetrics;let o=L.renderOpts.pendingWaitUntil;o&&r.waitUntil&&(r.waitUntil(o),o=void 0);let u=L.renderOpts.collectedTags;if(!U)return await (0,m.sendResponse)(B,F,s,L.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(s.headers);u&&(t[R.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,n=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:s,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:P})},!1,C),t}},c=await E.handleResponse({req:e,nextConfig:v,cacheKey:q,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:A,responseGenerator:p,waitUntil:r.waitUntil,isMinimalMode:l});if(!U)return null;if((null==c||null==(o=c.value)?void 0:o.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(u=c.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});l||t.setHeader("x-nextjs-cache",P?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),b&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,_.fromNodeOutgoingHttpHeaders)(c.value.headers);return l&&U||d.delete(R.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,g.getCacheControlHeader)(c.cacheControl)),await (0,m.sendResponse)(B,F,new Response(c.value.body,{headers:d,status:c.value.status||200})),null};G?await u(G):await D.withPropagatedContext(e.headers,()=>D.trace(d.BaseServerSpan.handleRequest,{spanName:`${H} ${s}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},u))}catch(t){if(t instanceof S.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:$,routeType:"route",revalidateReason:(0,h.getRevalidateReason)({isStaticGeneration:M,isOnDemandRevalidate:P})},!1,C),U)throw t;return await (0,m.sendResponse)(B,F,new Response(null,{status:500})),null}}e.s(["handler",()=>x,"patchFetch",()=>v,"routeModule",()=>E,"serverHooks",()=>C,"workAsyncStorage",()=>b,"workUnitAsyncStorage",()=>T]),r()}catch(e){r(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__8930f806._.js.map