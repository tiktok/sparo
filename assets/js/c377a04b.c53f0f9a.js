"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[742],{7457:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>d,contentTitle:()=>c,default:()=>u,frontMatter:()=>l,metadata:()=>a,toc:()=>h});var n=r(678),t=r(4738),i=(r(6166),r(6920));const o=e=>{let{srcLight:s,srcDark:r,alt:t,title:o,style:l}=e;const{colorMode:c}=(0,i.G)(),a="dark"===c?r:s;return(0,n.jsx)("div",{style:{display:"flex",justifyContent:"center",alignItems:"center"},children:(0,n.jsx)("img",{src:a,alt:t,title:o,style:l})})},l={title:"Overview",hide_title:!0,custom_edit_url:null},c=void 0,a={id:"index",title:"Overview",description:"<ThemedImage",source:"@site/docs/index.md",sourceDirName:".",slug:"/",permalink:"/sparo/",draft:!1,unlisted:!1,editUrl:null,tags:[],version:"current",frontMatter:{title:"Overview",hide_title:!0,custom_edit_url:null},sidebar:"docsSidebar",next:{title:"Getting started",permalink:"/sparo/pages/guide/getting_started"}},d={},h=[{value:"Clone faster!",id:"clone-faster",level:2},{value:"Key features",id:"key-features",level:2},{value:"Quick demo",id:"quick-demo",level:2}];function p(e){const s={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("div",{style:{display:"flex",justifyContent:"center",alignItems:"center"},children:(0,n.jsx)(o,{srcLight:"images/site/sparo-logo.svg",srcDark:"images/site/sparo-logo-dark.svg",alt:"Sparo",title:"Sparo",style:{width:"380px",paddingTop:"30px"}})}),"\n",(0,n.jsx)(s.h2,{id:"clone-faster",children:"Clone faster!"}),"\n",(0,n.jsx)(s.p,{children:"Sparo optimizes performance of Git operations for your large frontend monorepo."}),"\n",(0,n.jsx)(s.h2,{id:"key-features",children:"Key features"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"Familiar interface:"})," The ",(0,n.jsx)(s.code,{children:"sparo"})," command-line interface (CLI) wrapper offers ",(0,n.jsx)(s.strong,{children:"better defaults"})," and ",(0,n.jsx)(s.strong,{children:"performance suggestions"})," without altering the familiar ",(0,n.jsx)(s.code,{children:"git"})," syntax. (The native ",(0,n.jsx)(s.code,{children:"git"})," CLI is also supported.)"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"A proven solution:"})," Git provides ",(0,n.jsx)(s.a,{href:"https://tiktok.github.io/sparo/pages/reference/git_optimization/",children:"quite a lot of ingredients"})," for optimizing very large repos; Sparo is your recipe for combining these features intelligently."]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"Simplified sparse checkout:"})," Work with sparse checkout ",(0,n.jsx)(s.a,{href:"https://tiktok.github.io/sparo/pages/guide/sparo_profiles/",children:"profiles"}),' instead of confusing "cones" and globs']}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"Frontend integration:"})," Sparo leverages ",(0,n.jsx)(s.a,{href:"https://rushjs.io/",children:"Rush"})," and ",(0,n.jsx)(s.a,{href:"https://pnpm.io/",children:"PNPM"})," workspace configurations, including the ability to automatically checkout project dependencies"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"Dual workflows:"})," The ",(0,n.jsx)(s.code,{children:"sparo-ci"})," tool implements a specialized checkout model optimized for continuous integration (CI) pipelines"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"Extra safeguards"}),": Avoid common Git mistakes such as checkouts with staged files outside the active view"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"Go beyond Git hooks:"})," Optionally collect anonymized Git timing metrics in your monorepo, enabling your build team to set data-driven goals for ",(0,n.jsx)(s.em,{children:"local"})," developer experience (not just CI!)"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.em,{children:"(Metrics are transmitted to your own service and are not accessible by any other party.)"})}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(s.h2,{id:"quick-demo",children:"Quick demo"}),"\n",(0,n.jsx)(s.p,{children:"Try out Sparo in 5 easy steps:"}),"\n",(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.em,{children:(0,n.jsx)(s.strong,{children:"Upgrade to the latest Git version!"})})," For macOS, we recommend to use ",(0,n.jsx)(s.a,{href:"https://git-scm.com/download/mac",children:"brew install git"}),".  For other operating systems, see the ",(0,n.jsx)(s.a,{href:"https://git-scm.com/book/en/v2/Getting-Started-Installing-Git",children:"Git documentation"})," for instructions."]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:["For this demo, we'll use the Azure SDK which is a large public ",(0,n.jsx)(s.a,{href:"https://rushjs.io/",children:"RushJS"})," monorepo from GitHub.  The following command will check out the ",(0,n.jsx)(s.a,{href:"/sparo/pages/reference/skeleton_folders",children:"skeleton folders"})," but not the source code:"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-shell",children:"sparo clone https://github.com/Azure/azure-sdk-for-js.git\r\n\r\ncd azure-sdk-for-js\n"})}),"\n",(0,n.jsxs)(s.blockquote,{children:["\n",(0,n.jsx)(s.p,{children:"\ud83d\udca1 Support for PNPM and Yarn workspaces is planned but not implemented yet. Contributions welcome!"}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:["Define a ",(0,n.jsx)(s.a,{href:"/sparo/pages/configs/profile_json",children:"Sparo profile"})," describing the subset of repository folders for Git sparse checkout."]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-shell",children:"# Writes a template to common/sparo-profiles/my-team.json\r\nsparo init-profile --profile my-team\n"})}),"\n",(0,n.jsxs)(s.p,{children:["Edit the created ",(0,n.jsx)(s.strong,{children:"my-team.json"})," file to add this selector:"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.strong,{children:"common/sparo-profiles/my-team.json"})}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-json",children:'{\r\n  "selections": [\r\n     {\r\n       // This demo profile will check out the "@azure/arm-commerce" project\r\n       // and all of its dependencies:\r\n       "selector": "--to",\r\n       "argument": "@azure/arm-commerce"\r\n     }\r\n  ]\r\n}\n'})}),"\n",(0,n.jsxs)(s.p,{children:["The ",(0,n.jsx)(s.code,{children:"--to"})," ",(0,n.jsx)(s.a,{href:"https://rushjs.io/pages/developer/selecting_subsets/#--to",children:"project selector"})," instructs Sparo to checkout all dependencies in the workspace that are required to build ",(0,n.jsx)(s.code,{children:"my-rush-project"}),"."]}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:["After saving your changes to ",(0,n.jsx)(s.strong,{children:"my-team.json"}),", now it's time to apply it:"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-shell",children:"sparo checkout --profile my-team\n"})}),"\n",(0,n.jsx)(s.p,{children:"Try it out!  For example:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-shell",children:"rush install\r\n\r\n# The build should succeed because Sparo ensured that dependency projects\r\n# were included in the sparse checkout:\r\nrush build --to @azure/arm-commerce\n"})}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsxs)(s.p,{children:["For everyday work, consider choosing ",(0,n.jsx)(s.a,{href:"/sparo/pages/commands/overview",children:"mirrored subcommands"})," such as ",(0,n.jsx)(s.code,{children:"sparo revert"})," instead of ",(0,n.jsx)(s.code,{children:"git revert"}),". The Sparo wrapper provides (1) better defaults, (2) suggestions for better performance, and (3) optional anonymized performance metrics."]}),"\n",(0,n.jsx)(s.p,{children:"Examples:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-shell",children:'sparo pull\r\n\r\nsparo commit -m "Example command"\n'})}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(s.p,{children:["\ud83d\udc4d\ud83d\udc4d This concludes the ",(0,n.jsx)(s.strong,{children:"Quick Demo."}),"  For a more detailed walkthrough, proceed to ",(0,n.jsx)(s.a,{href:"/sparo/pages/guide/getting_started",children:"Getting Started"}),"."]})]})}function u(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(p,{...e})}):p(e)}},4738:(e,s,r)=>{r.d(s,{R:()=>o,x:()=>l});var n=r(6166);const t={},i=n.createContext(t);function o(e){const s=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function l(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),n.createElement(i.Provider,{value:s},e.children)}}}]);