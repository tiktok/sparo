"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[421],{9917:(e,s,r)=>{r.r(s),r.d(s,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>t,metadata:()=>c,toc:()=>a});var o=r(678),n=r(4738);const t={title:"Getting started"},i=void 0,c={id:"pages/guide/getting_started",title:"Getting started",description:"In this tutorial we'll revisit the Quick Demo steps, but this time examining the Sparo workflow in more detail.",source:"@site/docs/pages/guide/getting_started.md",sourceDirName:"pages/guide",slug:"/pages/guide/getting_started",permalink:"/sparo/preview-chore-website-preview/pages/guide/getting_started",draft:!1,unlisted:!1,editUrl:"https://github.com/tiktok/sparo/tree/main/apps/website/docs/pages/guide/getting_started.md",tags:[],version:"current",frontMatter:{title:"Getting started"},sidebar:"docsSidebar",previous:{title:"Overview",permalink:"/sparo/preview-chore-website-preview/"},next:{title:"Sparo profiles",permalink:"/sparo/preview-chore-website-preview/pages/guide/sparo_profiles"}},l={},a=[{value:"Step 1: Upgrade Git",id:"step-1-upgrade-git",level:2},{value:"Step 2: Clone your Rush monorepo",id:"step-2-clone-your-rush-monorepo",level:2},{value:"Step 3: Create a sparse profile",id:"step-3-create-a-sparse-profile",level:2},{value:"Step 4: Check out your Sparo profile",id:"step-4-check-out-your-sparo-profile",level:2},{value:"Step 5: Use the mirrored subcommands",id:"step-5-use-the-mirrored-subcommands",level:2}];function p(e){const s={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,n.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(s.p,{children:["In this tutorial we'll revisit the ",(0,o.jsx)(s.a,{href:"/sparo/preview-chore-website-preview/#quick-demo",children:"Quick Demo"})," steps, but this time examining the Sparo workflow in more detail."]}),"\n",(0,o.jsx)(s.h2,{id:"step-1-upgrade-git",children:"Step 1: Upgrade Git"}),"\n",(0,o.jsx)(s.p,{children:"Remember to upgrade to the latest Git version! Many Git optimizations are relatively new and not available in older versions of the software."}),"\n",(0,o.jsxs)(s.p,{children:["For macOS, we recommend to use ",(0,o.jsx)(s.a,{href:"https://git-scm.com/download/mac",children:"brew install git"}),".  For other operating systems, see the ",(0,o.jsx)(s.a,{href:"https://git-scm.com/book/en/v2/Getting-Started-Installing-Git",children:"Git documentation"})," for instructions."]}),"\n",(0,o.jsx)(s.h2,{id:"step-2-clone-your-rush-monorepo",children:"Step 2: Clone your Rush monorepo"}),"\n",(0,o.jsxs)(s.p,{children:["Clone your ",(0,o.jsx)(s.a,{href:"https://rushjs.io/",children:"RushJS"})," monorepo:"]}),"\n",(0,o.jsx)(s.pre,{children:(0,o.jsx)(s.code,{className:"language-shell",children:"sparo clone https://github.com/my-company/my-monorepo.git\n\ncd my-monorepo\n"})}),"\n",(0,o.jsxs)(s.p,{children:["\ud83d\udc49 ",(0,o.jsx)(s.em,{children:"For a real world demo, try cloning this repo:"}),"\n",(0,o.jsx)(s.a,{href:"https://github.com/Azure/azure-sdk-for-js.git",children:"https://github.com/Azure/azure-sdk-for-js.git"})]}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.strong,{children:'How "sparo clone" optimizes:'})}),"\n",(0,o.jsxs)(s.ul,{children:["\n",(0,o.jsxs)(s.li,{children:["\n",(0,o.jsxs)(s.p,{children:["Only the default branch is fetched (typically the ",(0,o.jsx)(s.code,{children:"main"})," branch).  This significantly reduces the download size."]}),"\n"]}),"\n",(0,o.jsxs)(s.li,{children:["\n",(0,o.jsxs)(s.p,{children:["Git blobless ",(0,o.jsx)(s.a,{href:"/sparo/preview-chore-website-preview/pages/reference/git_optimization",children:"partial clone"})," is enabled to postpone downloading file contents."]}),"\n"]}),"\n",(0,o.jsxs)(s.li,{children:["\n",(0,o.jsxs)(s.p,{children:["Git ",(0,o.jsx)(s.a,{href:"https://git-scm.com/docs/git-sparse-checkout",children:"sparse checkout"})," is used to clone only the ",(0,o.jsx)(s.a,{href:"/sparo/preview-chore-website-preview/pages/reference/skeleton_folders",children:'"skeleton" folders'}),", which includes all workspace ",(0,o.jsx)(s.strong,{children:"package.json"})," files, but excludes the source code subfolders."]}),"\n"]}),"\n",(0,o.jsxs)(s.li,{children:["\n",(0,o.jsxs)(s.p,{children:["Sparse checkout is configured for the more efficient ",(0,o.jsx)(s.a,{href:"https://git-scm.com/docs/git-sparse-checkout#_internalsnon_cone_problems",children:'"cone mode"'}),"."]}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(s.p,{children:[(0,o.jsx)(s.strong,{children:"Tip:"})," To inspect what actions and Git operations are being performed, invoke ",(0,o.jsx)(s.code,{children:"sparo --debug clone"})," instead of ",(0,o.jsx)(s.code,{children:"sparo clone"}),"."]}),"\n",(0,o.jsxs)(s.blockquote,{children:["\n",(0,o.jsx)(s.p,{children:"\ud83d\udca1 Support for PNPM and Yarn workspaces is planned but not implemented yet. Contributions welcome!"}),"\n"]}),"\n",(0,o.jsx)(s.h2,{id:"step-3-create-a-sparse-profile",children:"Step 3: Create a sparse profile"}),"\n",(0,o.jsxs)(s.p,{children:["Define a ",(0,o.jsx)(s.a,{href:"/sparo/preview-chore-website-preview/pages/configs/profile_json",children:"Sparo profile"})," describing the subset of repository folders for Git sparse checkout."]}),"\n",(0,o.jsx)(s.pre,{children:(0,o.jsx)(s.code,{className:"language-shell",children:"# Writes a template to common/sparo-profiles/my-team.json\nsparo init-profile --profile my-team\n"})}),"\n",(0,o.jsxs)(s.p,{children:["Edit the created ",(0,o.jsx)(s.strong,{children:"my-team.json"})," file to add a selector. For example:"]}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.strong,{children:"common/sparo-profiles/my-team.json"})}),"\n",(0,o.jsx)(s.pre,{children:(0,o.jsx)(s.code,{className:"language-json",children:'{\n  "selections": [\n    {\n      "selector": "--to",\n      "argument": "my-rush-project"\n    }\n  ]\n}\n'})}),"\n",(0,o.jsxs)(s.p,{children:["\ud83d\udc49 ",(0,o.jsxs)(s.em,{children:["If you're demoing ",(0,o.jsx)(s.strong,{children:"azure-sdk-for-js"}),", replace ",(0,o.jsx)(s.code,{children:"my-rush-project"})," with ",(0,o.jsx)(s.code,{children:"@azure/arm-commerce"}),"."]})]}),"\n",(0,o.jsxs)(s.p,{children:["In the above example, the ",(0,o.jsx)(s.code,{children:"--to"})," ",(0,o.jsx)(s.a,{href:"https://rushjs.io/pages/developer/selecting_subsets/#--to",children:"project selector"})," instructs Sparo to checkout all dependencies in the workspace that are required to build ",(0,o.jsx)(s.code,{children:"my-rush-project"}),"."]}),"\n",(0,o.jsx)(s.pre,{children:(0,o.jsx)(s.code,{className:"language-shell",children:'# Commit your profile to Git.  (This step was skipped in the Quick Demo.)\n# Sparo profiles should generally be stored in Git, since this enables\n# you to move between branches without worrying about which projects\n# exist in a given branch.\nsparo add .\nsparo commit -m "Created a new Sparo profile"\n'})}),"\n",(0,o.jsx)(s.h2,{id:"step-4-check-out-your-sparo-profile",children:"Step 4: Check out your Sparo profile"}),"\n",(0,o.jsxs)(s.p,{children:["The ",(0,o.jsx)(s.code,{children:"--profile"})," parameter can be included with ",(0,o.jsx)(s.code,{children:"sparo checkout"})," (and in the future also ",(0,o.jsx)(s.code,{children:"sparo clone"})," and ",(0,o.jsx)(s.code,{children:"sparo pull"}),").  This parameter specifies the name of the JSON file to be selected.  You can also combine multiple profiles (",(0,o.jsx)(s.code,{children:"sparo checkout --profile p1 --profile p2"}),"), in which case the union of their selections will be used.  Combining profiles is an advanced scenario, but useful for example if your pull request will impact sets of projects belonging to multiple teams."]}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.strong,{children:"Sparse checkout based on common/sparo-profiles/my-team.json"})}),"\n",(0,o.jsx)(s.pre,{children:(0,o.jsx)(s.code,{className:"language-shell",children:"sparo checkout --profile my-team\n"})}),"\n",(0,o.jsx)(s.p,{children:(0,o.jsx)(s.strong,{children:'More about "sparo checkout":'})}),"\n",(0,o.jsxs)(s.ul,{children:["\n",(0,o.jsxs)(s.li,{children:["\n",(0,o.jsxs)(s.p,{children:["Sparo automatically generates Git's ",(0,o.jsx)(s.code,{children:"$GIT_DIR/info/sparse-checkout"})," ",(0,o.jsx)(s.a,{href:"https://git-scm.com/docs/git-sparse-checkout#_internalssparse_checkout",children:"config file"})," based on your profile selections.  To avoid conflicts, do not edit this file directly or rewrite it using other tools such as ",(0,o.jsx)(s.code,{children:"git sparse-checkout"}),".  (Doing so won't break anything, but it may interfere with Sparo operations.)"]}),"\n"]}),"\n",(0,o.jsxs)(s.li,{children:["\n",(0,o.jsxs)(s.p,{children:["To checkout just the skeleton (returning to the initial state from Step 1 where no profile is chosen yet), specify ",(0,o.jsx)(s.code,{children:"--no-profile"})," instead of ",(0,o.jsx)(s.code,{children:"--profile NAME"}),"."]}),"\n"]}),"\n",(0,o.jsxs)(s.li,{children:["\n",(0,o.jsxs)(s.p,{children:["To add more profiles, combining with your existing selection, use ",(0,o.jsx)(s.code,{children:"--add-profile NAME"})," instead of ",(0,o.jsx)(s.code,{children:"--profile NAME"}),".  For example, these two commands produce the same result as ",(0,o.jsx)(s.code,{children:"sparo checkout --profile p1 --profile p2"}),":"]}),"\n",(0,o.jsx)(s.pre,{children:(0,o.jsx)(s.code,{className:"language-shell",children:"sparo checkout --profile p1\nsparo checkout --add-profile p2\n"})}),"\n"]}),"\n"]}),"\n",(0,o.jsx)(s.h2,{id:"step-5-use-the-mirrored-subcommands",children:"Step 5: Use the mirrored subcommands"}),"\n",(0,o.jsxs)(s.p,{children:["For everyday work, consider choosing ",(0,o.jsx)(s.a,{href:"/sparo/preview-chore-website-preview/pages/commands/overview",children:"mirrored subcommands"})," such as ",(0,o.jsx)(s.code,{children:"sparo revert"})," instead of ",(0,o.jsx)(s.code,{children:"git revert"}),". The Sparo wrapper provides (1) better defaults, (2) suggestions for better performance, and (3) optional anonymized performance metrics."]}),"\n",(0,o.jsx)(s.p,{children:"Examples:"}),"\n",(0,o.jsx)(s.pre,{children:(0,o.jsx)(s.code,{className:"language-shell",children:'sparo pull\n\nsparo commit -m "Example command"\n'})})]})}function d(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,o.jsx)(s,{...e,children:(0,o.jsx)(p,{...e})}):p(e)}},4738:(e,s,r)=>{r.d(s,{R:()=>i,x:()=>c});var o=r(6166);const n={},t=o.createContext(n);function i(e){const s=o.useContext(t);return o.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),o.createElement(t.Provider,{value:s},e.children)}}}]);