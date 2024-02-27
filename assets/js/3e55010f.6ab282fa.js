"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[818],{613:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>n,metadata:()=>a,toc:()=>c});var r=o(678),i=o(6655);const n={title:"Git optimization"},s=void 0,a={id:"pages/reference/git_optimization",title:"Git optimization",description:"By default git clone will download every file in your Git repository, as well as the complete history of every file. For small repositories, that's no big deal. But as your monorepo accumulates projects and years of history, Git operations become slower and slower, until one day git status is taking 10 seconds or more. What to do?",source:"@site/docs/pages/reference/git_optimization.md",sourceDirName:"pages/reference",slug:"/pages/reference/git_optimization",permalink:"/sparo/pages/reference/git_optimization",draft:!1,unlisted:!1,editUrl:"https://github.com/tiktok/sparo/tree/main/apps/website/docs/pages/reference/git_optimization.md",tags:[],version:"current",frontMatter:{title:"Git optimization"},sidebar:"docsSidebar",previous:{title:"Sparo profiles",permalink:"/sparo/pages/guide/sparo_profiles"},next:{title:"Skeleton folders",permalink:"/sparo/pages/reference/skeleton_folders"}},l={},c=[];function d(e){const t={code:"code",li:"li",p:"p",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(t.p,{children:["By default ",(0,r.jsx)(t.code,{children:"git clone"})," will download every file in your Git repository, as well as the complete history of every file. For small repositories, that's no big deal. But as your monorepo accumulates projects and years of history, Git operations become slower and slower, until one day ",(0,r.jsx)(t.code,{children:"git status"})," is taking 10 seconds or more. What to do?"]}),"\n",(0,r.jsx)(t.p,{children:"Git provides these basic solutions that are easy to use in a medium sized repository:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Shallow clone"})," allows cloning only a few commits, but is generally only suitable for throwaway clones such as a CI job."]}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Partial clone"})," allows cloning without file contents (",(0,r.jsx)(t.strong,{children:"blobless"})," clone) or even commit details (",(0,r.jsx)(t.strong,{children:"treeless"})," clone), greatly accelerating your ",(0,r.jsx)(t.code,{children:"git clone"})," time and allowing such details to be fetched during ",(0,r.jsx)(t.code,{children:"git checkout"}),"."]}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Large file storage (LFS)"})," can move binary files to a separate server, downloading them on demand during checkout. Configuration of LFS is tricky however and if done incorrectly may cause worse performance."]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"However, achieving good performance in a large repository requires more complex Git features such as:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:["Git ",(0,r.jsx)(t.strong,{children:"filesystem monitor"})," and ",(0,r.jsx)(t.strong,{children:"background maintenance"}),' are background processes that watch for changes and periodically prefetch server data. The user must manually register/unregister working directories and remember to "pause" the service when not needed.']}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Git worktrees"})," allow multiple working directories on your computer to share a single ",(0,r.jsx)(t.code,{children:".git"})," folder, avoiding the cost of multiple clones. However this feature comes with awkward limitations, for example the same branch can't be checked out in two worktrees, and Git hooks are also shared."]}),"\n"]}),"\n",(0,r.jsxs)(t.li,{children:["\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(t.strong,{children:"Sparse checkout"})," allows ",(0,r.jsx)(t.code,{children:"git checkout"}),' to extract a subset of files instead of the entire directory structure. Combined with partial clone, sparse checkout is the "battle axe" of Git optimization: although irrelevant projects and history will accumulate, your wait time will be proportional to the files you actually need.']}),"\n"]}),"\n"]})]})}function u(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},6655:(e,t,o)=>{o.d(t,{R:()=>s,x:()=>a});var r=o(6166);const i={},n=r.createContext(i);function s(e){const t=r.useContext(n);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(n.Provider,{value:t},e.children)}}}]);