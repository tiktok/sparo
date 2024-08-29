"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[744],{5711:(n,e,s)=>{s.r(e),s.d(e,{assets:()=>a,contentTitle:()=>i,default:()=>u,frontMatter:()=>r,metadata:()=>c,toc:()=>l});var o=s(678),t=s(4738);const r={title:"<profile-name>.json"},i=void 0,c={id:"pages/configs/profile_json",title:"<profile-name>.json",description:"\u8981\u521d\u59cb\u5316\u4e00\u4e2a\u65b0\u7684 Sparo \u914d\u7f6e\u6587\u4ef6\uff0c\u60a8\u53ef\u4ee5\u590d\u5236\u5e76\u7c98\u8d34\u6b64\u6a21\u677f\u7684\u5185\u5bb9\u3002",source:"@site/i18n/zh-cn/docusaurus-plugin-content-docs/current/pages/configs/profile_json.md",sourceDirName:"pages/configs",slug:"/pages/configs/profile_json",permalink:"/sparo/zh-cn/pages/configs/profile_json",draft:!1,unlisted:!1,editUrl:"https://github.com/tiktok/sparo/tree/main/apps/website/docs/pages/configs/profile_json.md",tags:[],version:"current",frontMatter:{title:"<profile-name>.json"},sidebar:"docsSidebar",previous:{title:"\u5b89\u5168\u6027",permalink:"/sparo/zh-cn/pages/reference/security"},next:{title:"\u6982\u8ff0",permalink:"/sparo/zh-cn/pages/commands/overview"}},a={},l=[{value:"\u53e6\u89c1",id:"\u53e6\u89c1",level:2}];function p(n){const e={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...n.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(e.p,{children:"\u8981\u521d\u59cb\u5316\u4e00\u4e2a\u65b0\u7684 Sparo \u914d\u7f6e\u6587\u4ef6\uff0c\u60a8\u53ef\u4ee5\u590d\u5236\u5e76\u7c98\u8d34\u6b64\u6a21\u677f\u7684\u5185\u5bb9\u3002"}),"\n",(0,o.jsx)(e.p,{children:(0,o.jsx)(e.strong,{children:"common/sparo-profiles/<profile-name>.json"})}),"\n",(0,o.jsx)(e.pre,{children:(0,o.jsx)(e.code,{className:"language-js",children:'/**\n * \u6240\u6709\u8005:   <\u60a8\u7684\u56e2\u961f\u540d\u79f0>\n * \u76ee\u7684:     <\u60a8\u4f7f\u7528\u6b64\u914d\u7f6e\u6587\u4ef6\u7684\u76ee\u7684>\n */\n{\n  "$schema": "https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json",\n\n  /**\n   * \u4e00\u4e2a Rush \u9879\u76ee\u9009\u62e9\u5668\u5217\u8868\uff0c\u6307\u793a\u8981\u5305\u542b\u5728\u7a00\u758f\u68c0\u51fa\u4e2d\u7684\u9879\u76ee\u6587\u4ef6\u5939\u3002\n   * \u9009\u62e9\u5668\u5c06\u7ec4\u5408\u4ee5\u6784\u6210\u9879\u76ee\u7684\u5e76\u96c6\u3002\u8be6\u60c5\u8bf7\u53c2\u9605 Rush \u9009\u62e9\u5668\u6587\u6863\uff1a\n   * https://rushjs.io/pages/developer/selecting_subsets/\n   */\n  "selections": [\n    /**\n     * \u4f8b\u5982\uff0c\u5305\u542b\u6240\u6709\u6807\u8bb0\u4e3a "tag:my-team" \u7684 Rush \u9879\u76ee\n     * \u4ee5\u53ca\u6784\u5efa\u5b83\u4eec\u6240\u9700\u7684\u4f9d\u8d56\u5de5\u4f5c\u533a\u9879\u76ee\u3002\n     * \u8981\u4e86\u89e3\u6709\u5173 Rush \u9879\u76ee\u6807\u7b7e\u7684\u4fe1\u606f\uff0c\u8bf7\u53c2\u9605\u6b64\u6587\u6863\uff1a\n     * https://rushjs.io/pages/developer/project_tags/\n     */\n    // {\n    //   "selector": "--to",\n    //   "argument": "tag:my-team"\n    // },\n    /**\n     * \u4f8b\u5982\uff0c\u5305\u542b\u540d\u4e3a "my-library" \u7684\u9879\u76ee\uff0c\u4ee5\u53ca\u6240\u6709\n     * \u53d7\u5176\u66f4\u6539\u5f71\u54cd\u7684\u9879\u76ee\uff0c\u4ee5\u53ca\u6784\u5efa\u6240\u6709\u9879\u76ee\u6240\u9700\u7684\u4f9d\u8d56\u9879\u76ee\u3002\n     */\n    // {\n    //   "selector": "--from",\n    //   "argument": "my-library"\n    // }\n  ],\n\n  /**\n   * \u8981\u5305\u542b\u5728\u68c0\u51fa\u4e2d\u7684\u4efb\u610f\u5176\u4ed6\u6587\u4ef6\u5939\u5217\u8868\uff0c\n   * \u4e0d\u4e00\u5b9a\u5bf9\u5e94\u4e8e\u4efb\u4f55\u5de5\u4f5c\u533a\u9879\u76ee\u3002\n   * \u8def\u5f84\u5e94\u4f7f\u7528\u6b63\u659c\u6760\uff0c\u4e0d\u5e26\u524d\u5bfc\u659c\u6760\uff0c\u5e76\u4e14\u5e94\u6307\u5411 monorepo \u7684\u6839\u6587\u4ef6\u5939\u3002\n   * \u51fa\u4e8e\u6027\u80fd\u539f\u56e0\uff0c\u4e0d\u652f\u6301\u901a\u914d\u7b26\u548c glob \u6a21\u5f0f\u3002\n   */\n  "includeFolders": [\n    // "path/to/include"\n  ],\n\n  /**\n   * \u8981\u4ece\u68c0\u51fa\u4e2d\u6392\u9664\u7684\u6587\u4ef6\u5939\u5217\u8868\u3002\u6b64\u5b57\u6bb5\u4f18\u5148\u4e8e\n   * "includeFolders" \u548c "selections" \u5b57\u6bb5\uff0c\u786e\u4fdd\u6307\u5b9a\u7684\u8def\u5f84\u7edd\u5bf9\u4e0d\u4f1a\u88ab\u5305\u542b\u3002\n   * \u8def\u5f84\u5e94\u4f7f\u7528\u6b63\u659c\u6760\uff0c\u4e0d\u5e26\u524d\u5bfc\u659c\u6760\uff0c\u5e76\u4e14\u5e94\u6307\u5411 monorepo \u7684\u6839\u6587\u4ef6\u5939\u3002\n   * \u51fa\u4e8e\u6027\u80fd\u539f\u56e0\uff0c\u4e0d\u652f\u6301\u901a\u914d\u7b26\u548c glob \u6a21\u5f0f\u3002\n   */\n  "excludeFolders": [\n    // "path/to/exclude"\n  ]\n}\n'})}),"\n",(0,o.jsx)(e.h2,{id:"\u53e6\u89c1",children:"\u53e6\u89c1"}),"\n",(0,o.jsxs)(e.ul,{children:["\n",(0,o.jsx)(e.li,{children:(0,o.jsx)(e.a,{href:"/sparo/zh-cn/pages/guide/sparo_profiles",children:"Sparo \u914d\u7f6e\u6587\u4ef6"})}),"\n"]})]})}function u(n={}){const{wrapper:e}={...(0,t.R)(),...n.components};return e?(0,o.jsx)(e,{...n,children:(0,o.jsx)(p,{...n})}):p(n)}},4738:(n,e,s)=>{s.d(e,{R:()=>i,x:()=>c});var o=s(6166);const t={},r=o.createContext(t);function i(n){const e=o.useContext(r);return o.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function c(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(t):n.components||t:i(n.components),o.createElement(r.Provider,{value:e},n.children)}}}]);