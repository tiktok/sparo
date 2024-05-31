"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[712],{5009:(e,i,r)=>{r.r(i),r.d(i,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>n,metadata:()=>a,toc:()=>l});var s=r(678),t=r(4738);const n={title:"Overview"},o=void 0,a={id:"pages/ci_commands/overview",title:"Overview",description:"Everyday development involves a variety of Git operations such as switching between branches, fetching incremental changes from the server, and browsing history.  By contrast, when a continuous integration (CI) pipeline checks out a Git branch, it is typically a much simpler operation. The folder or entire virtual machine image may be discarded as soon as the job completes.  Therefore, different approaches for optimizing Git require required for these two use cases.",source:"@site/docs/pages/ci_commands/overview.md",sourceDirName:"pages/ci_commands",slug:"/pages/ci_commands/overview",permalink:"/sparo/preview-chore-website-preview/pages/ci_commands/overview",draft:!1,unlisted:!1,editUrl:"https://github.com/tiktok/sparo/tree/main/apps/website/docs/pages/ci_commands/overview.md",tags:[],version:"current",frontMatter:{title:"Overview"},sidebar:"docsSidebar",previous:{title:"sparo list-profiles",permalink:"/sparo/preview-chore-website-preview/pages/commands/sparo_list-profiles"},next:{title:"sparo-ci checkout",permalink:"/sparo/preview-chore-website-preview/pages/ci_commands/sparo-ci_checkout"}},c={},l=[];function p(e){const i={a:"a",code:"code",em:"em",li:"li",p:"p",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(i.p,{children:"Everyday development involves a variety of Git operations such as switching between branches, fetching incremental changes from the server, and browsing history.  By contrast, when a continuous integration (CI) pipeline checks out a Git branch, it is typically a much simpler operation. The folder or entire virtual machine image may be discarded as soon as the job completes.  Therefore, different approaches for optimizing Git require required for these two use cases."}),"\n",(0,s.jsxs)(i.p,{children:["Sparo provides a separate command line ",(0,s.jsx)(i.code,{children:"sparo-ci"})," that is specifically optimized for CI pipelines.  The current implementation takes this approach:"]}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:["\n",(0,s.jsxs)(i.p,{children:["It uses ",(0,s.jsx)(i.a,{href:"https://github.blog/2020-12-21-get-up-to-speed-with-partial-clone-and-shallow-clone/",children:"treeless clone"})," instead of ",(0,s.jsx)(i.strong,{children:"blobless clone"}),", under the assumption that Git history will be rarely needed."]}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.em,{children:"Shallow clone is a common alternative, however it has trouble supporting operations such as incremental build or publishing that require comparison with a base branch."})}),"\n"]}),"\n",(0,s.jsxs)(i.li,{children:["\n",(0,s.jsxs)(i.p,{children:["Sparse checkout is configured, and the ",(0,s.jsx)(i.a,{href:"/sparo/preview-chore-website-preview/pages/reference/skeleton_folders",children:"skeleton folders"})," are included."]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(i.p,{children:"Currently two subcommands are supported for CI:"}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"sparo-ci checkout"})}),"\n",(0,s.jsx)(i.li,{children:(0,s.jsx)(i.code,{children:"sparo-ci clone"})}),"\n"]})]})}function h(e={}){const{wrapper:i}={...(0,t.R)(),...e.components};return i?(0,s.jsx)(i,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},4738:(e,i,r)=>{r.d(i,{R:()=>o,x:()=>a});var s=r(6166);const t={},n=s.createContext(t);function o(e){const i=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function a(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),s.createElement(n.Provider,{value:i},e.children)}}}]);