"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[774],{5286:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>c});var o=n(678),t=n(4738);const s={title:"<profile-name>.json"},a=void 0,i={id:"pages/configs/profile_json",title:"<profile-name>.json",description:"To initialize a new Sparo profile, you can copy and paste the contents of this template.",source:"@site/docs/pages/configs/profile_json.md",sourceDirName:"pages/configs",slug:"/pages/configs/profile_json",permalink:"/sparo/pages/configs/profile_json",draft:!1,unlisted:!1,editUrl:"https://github.com/tiktok/sparo/tree/main/apps/website/docs/pages/configs/profile_json.md",tags:[],version:"current",frontMatter:{title:"<profile-name>.json"},sidebar:"docsSidebar",previous:{title:"Security",permalink:"/sparo/pages/reference/security"},next:{title:"Overview",permalink:"/sparo/pages/commands/overview"}},l={},c=[{value:"See also",id:"see-also",level:2}];function p(e){const r={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r.p,{children:"To initialize a new Sparo profile, you can copy and paste the contents of this template."}),"\n",(0,o.jsx)(r.p,{children:(0,o.jsx)(r.strong,{children:"common/sparo-profiles/<profile-name>.json"})}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-js",children:'/**\r\n * OWNER:   <your team name>\r\n * PURPOSE: <what you use this profile for>\r\n */\r\n{\r\n  "$schema": "https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json",\r\n\r\n  /**\r\n   * A list of Rush project selectors indicating the project folders to be\r\n   * included for sparse checkout.  The selectors will be combined to make\r\n   * the union superset of projects.  See the Rush selector docs for details:\r\n   * https://rushjs.io/pages/developer/selecting_subsets/\r\n   */\r\n  "selections": [\r\n    /**\r\n     * For example, include all Rush projects tagged with "tag:my-team"\r\n     * as well as the dependency workspace projects needed to build them.\r\n     * To learn about Rush project tags, see this documentation:\r\n     * https://rushjs.io/pages/developer/project_tags/\r\n     */\r\n    // {\r\n    //   "selector": "--to",\r\n    //   "argument": "tag:my-team"\r\n    // },\r\n    /**\r\n     * For example, include the project called "my-library", as well as all\r\n     * projects that are impacted by changes to it, as well as the dependency\r\n     * projects needed to build everything.\r\n     */\r\n    // {\r\n    //   "selector": "--from",\r\n    //   "argument": "my-library"\r\n    // }\r\n  ],\r\n\r\n  /**\r\n   * A list of arbitrary additional folders to be included for checkout,\r\n   * not necessarily corresponding to any workspace project.\r\n   * The paths should use forward slashes, without a leading slash, and should be to the \r\n   * root folder of the monorepo.  Wildcards and glob patterns are not supported for\r\n   * performance reasons.\r\n   */\r\n  "includeFolders": [\r\n    // "path/to/include"\r\n  ],\r\n\r\n  /**\r\n   * A list of folders to be excluded from the checkout.  This field takes precedence\r\n   * over the "includeFolders" and "selections" fields, guaranteeing that the\r\n   * specified path will definitely not be included.\r\n   * The paths should use forward slashes, without a leading slash, and should be to the \r\n   * root folder of the monorepo.  Wildcards and glob patterns are not supported for\r\n   * performance reasons.\r\n   */\r\n  "excludeFolders": [\r\n    // "path/to/exclude"\r\n  ]\r\n}\n'})}),"\n",(0,o.jsx)(r.h2,{id:"see-also",children:"See also"}),"\n",(0,o.jsxs)(r.ul,{children:["\n",(0,o.jsx)(r.li,{children:(0,o.jsx)(r.a,{href:"/sparo/pages/guide/sparo_profiles",children:"Sparo profiles"})}),"\n"]})]})}function d(e={}){const{wrapper:r}={...(0,t.R)(),...e.components};return r?(0,o.jsx)(r,{...e,children:(0,o.jsx)(p,{...e})}):p(e)}},4738:(e,r,n)=>{n.d(r,{R:()=>a,x:()=>i});var o=n(6166);const t={},s=o.createContext(t);function a(e){const r=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function i(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),o.createElement(s.Provider,{value:r},e.children)}}}]);