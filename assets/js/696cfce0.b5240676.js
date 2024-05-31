"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[739],{4699:(e,s,o)=>{o.r(s),o.d(s,{assets:()=>l,contentTitle:()=>t,default:()=>h,frontMatter:()=>n,metadata:()=>a,toc:()=>c});var i=o(678),r=o(4738);const n={title:"Sparo profiles"},t=void 0,a={id:"pages/guide/sparo_profiles",title:"Sparo profiles",description:"Background",source:"@site/docs/pages/guide/sparo_profiles.md",sourceDirName:"pages/guide",slug:"/pages/guide/sparo_profiles",permalink:"/sparo/preview-chore-website-preview/pages/guide/sparo_profiles",draft:!1,unlisted:!1,editUrl:"https://github.com/tiktok/sparo/tree/main/apps/website/docs/pages/guide/sparo_profiles.md",tags:[],version:"current",frontMatter:{title:"Sparo profiles"},sidebar:"docsSidebar",previous:{title:"Getting started",permalink:"/sparo/preview-chore-website-preview/pages/guide/getting_started"},next:{title:"Git optimization",permalink:"/sparo/preview-chore-website-preview/pages/reference/git_optimization"}},l={},c=[{value:"Background",id:"background",level:2},{value:"Sparo improves sparse checkout",id:"sparo-improves-sparse-checkout",level:2},{value:"Best practices for profiles",id:"best-practices-for-profiles",level:2},{value:"Combining profiles",id:"combining-profiles",level:2},{value:"Querying profiles",id:"querying-profiles",level:2},{value:"See also",id:"see-also",level:2}];function p(e){const s={a:"a",code:"code",em:"em",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.h2,{id:"background",children:"Background"}),"\n",(0,i.jsxs)(s.p,{children:["Git's sparse checkout feature normally relies on a collection of glob patterns that are stored in the ",(0,i.jsx)(s.code,{children:".git/info/sparse-checkout"})," config file.  The Git maintainers found that regular glob syntax was too inefficient, so they introduced a ",(0,i.jsx)(s.a,{href:"https://git-scm.com/docs/git-sparse-checkout#_internalsnon_cone_problems",children:'"cone mode"'})," glob interpretation that ignores file-matching patterns and only matches directories."]}),"\n",(0,i.jsx)(s.p,{children:"The syntax looks something like this:"}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:".git/info/sparse-checkout  example"})}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{children:"/*\n!/*/\n/apps/\n!/apps/*/\n/apps/my-app/\n!/apps/my-app/*/\n/apps/my-app/_/\n"})}),"\n",(0,i.jsxs)(s.p,{children:["To simplify management, Git also provides a ",(0,i.jsx)(s.code,{children:"git sparse-checkout"})," command that simplifies the syntax for adding/removing patterns from this file.  However, in a large monorepo with hundreds of projects, managing these globs would nonetheless be confusing and error-prone."]}),"\n",(0,i.jsx)(s.h2,{id:"sparo-improves-sparse-checkout",children:"Sparo improves sparse checkout"}),"\n",(0,i.jsxs)(s.p,{children:["Sparo makes life easier by generating the ",(0,i.jsx)(s.code,{children:".git/info/sparse-checkout"})," configuration automatically from config files called ",(0,i.jsx)(s.strong,{children:"profiles."}),"  This offers many benefits:"]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["Sparo profiles are defined using ",(0,i.jsx)(s.a,{href:"https://rushjs.io/pages/developer/selecting_subsets/#--to",children:"project selectors"}),", for example: ",(0,i.jsxs)(s.em,{children:['"Give me ',(0,i.jsx)(s.strong,{children:"app1"}),", ",(0,i.jsx)(s.strong,{children:"app2"}),', and all the projects needed to build them."']})," This is more concise and maintainable than specifying globs."]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsx)(s.p,{children:"Profiles are stored in a config file and committed to Git.  This makes it easy to share them with your teammates."}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsx)(s.p,{children:"Profiles are automatically updated when switching between branches, which ensures deterministic results.  For example, when checking out a very old branch, you want the old profile definition, not today's version of it."}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["You can combine multiple profiles together (",(0,i.jsx)(s.code,{children:"sparo checkout --profile team1 --profile team2"}),"), which selects the union of their projects.  This is useful for example when modifying a library project that is consumed by projects belonging to several other teams.  You could check out their projects using ",(0,i.jsx)(s.code,{children:"--from the-library"})," of course, but it's likely those other teams will have included other relevant projects in their profiles."]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["Sparo avoids common mistakes by imposing additional restrictions beyond ",(0,i.jsx)(s.code,{children:"git sparse-checkout"}),".  This avoids mistakes such as trying to switch to a profile that is missing a project folder containing files that are locally modified. It is better for users to stash or commit such modifications first."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.h2,{id:"best-practices-for-profiles",children:"Best practices for profiles"}),"\n",(0,i.jsx)(s.p,{children:"You an add JSON comments to your profile config files.  In a large shared codebase, we recommend adding a standardized header to the top of your files indicating their ownership and purpose.  Something like this:"}),"\n",(0,i.jsx)(s.p,{children:(0,i.jsx)(s.strong,{children:"common/sparo-profiles/example-profile.json"})}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-js",children:'/**\n * OWNER:   Customer service team\n * PURPOSE: Use this profile when working on the customer service apps.\n */\n{\n  "$schema": "https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json",\n\n  /**\n   * A list of Rush project selectors indicating the project folders to be\n   * included for sparse checkout.  The selectors will be combined to make\n   * the union superset of projects.  See the Rush selector docs for details:\n   * https://rushjs.io/pages/developer/selecting_subsets/\n   */\n  "selections": [\n     {\n        "selector": "--to",\n        "argument": "tag:cs-dashboard"\n     },\n     {\n        "selector": "--to",\n        "argument": "tag:cs-tools"\n     }\n  ]\n}\n'})}),"\n",(0,i.jsx)(s.h2,{id:"combining-profiles",children:"Combining profiles"}),"\n",(0,i.jsxs)(s.p,{children:["The simple way to combine profiles is to specify ",(0,i.jsx)(s.code,{children:"--profile"})," multiple times.  For example:"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-sh",children:"# Check out the union of profiles team-a.json, team-b.json, team-c.json\n# NOTE: This will replace whatever profile selection was already checked out.\nsparo checkout --profile team-a --profile team-b --profile team-c\n"})}),"\n",(0,i.jsxs)(s.p,{children:["You can also use ",(0,i.jsx)(s.code,{children:"--add-profile"})," to incrementally combine them.  For example:"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-shell",children:"# These three commands are equivalent to the above command.\nsparo checkout --profile team-a\nsparo checkout --add-profile team-b\nsparo checkout --add-profile team-c\n"})}),"\n",(0,i.jsxs)(s.p,{children:["How to checkout no profile at all? That is, how to return to the initial state of a clean ",(0,i.jsx)(s.code,{children:"sparo clone"})," that only includes the ",(0,i.jsx)(s.a,{href:"/sparo/preview-chore-website-preview/pages/reference/skeleton_folders",children:"skeleton"})," folders?  The answer is to use the ",(0,i.jsx)(s.code,{children:"--no-profile"})," parameter:"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-shell",children:"# NOT IMPLEMENTED YET - check out just the skeleton folders\n# without applying any profiles\nsparo checkout --no-profile\n"})}),"\n",(0,i.jsxs)(s.p,{children:["If ",(0,i.jsx)(s.code,{children:"sparo checkout"})," without ",(0,i.jsx)(s.code,{children:"--profile"})," or ",(0,i.jsx)(s.code,{children:"--add-profile"})," or ",(0,i.jsx)(s.code,{children:"--no-profile"}),', then the existing profile selection is preserved.  In other words, your profile choices are generally "sticky" across commands.']}),"\n",(0,i.jsx)(s.h2,{id:"querying-profiles",children:"Querying profiles"}),"\n",(0,i.jsxs)(s.p,{children:["Users can discover available profiles in the current branch by invoking the ",(0,i.jsx)(s.a,{href:"/sparo/preview-chore-website-preview/pages/commands/sparo_list-profiles",children:"sparo list-profiles"})," command.  The ",(0,i.jsx)(s.code,{children:"--project"})," parameter enables you to query relevant profiles for a given project.  For example:"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-shell",children:'# Suppose you need to make a fix for the "example-app" project.\n\n# Which sparse checkout profiles include the "example-app" project?\nsparo list-profiles --project example-app\n\n# Great, let\'s add the "example-profile" result to our current checkout\n# (combining it with the existing profile).\nsparo checkout --add-profile example-profile\n'})}),"\n",(0,i.jsx)(s.h2,{id:"see-also",children:"See also"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.a,{href:"/sparo/preview-chore-website-preview/pages/configs/profile_json",children:"<profile-name>.json"})," config file"]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},4738:(e,s,o)=>{o.d(s,{R:()=>t,x:()=>a});var i=o(6166);const r={},n=i.createContext(r);function t(e){const s=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:t(e.components),i.createElement(n.Provider,{value:s},e.children)}}}]);