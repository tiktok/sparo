"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[655],{2657:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>a,default:()=>l,frontMatter:()=>s,metadata:()=>c,toc:()=>p});var o=r(678),n=r(4738);const s={title:"sparo checkout"},a=void 0,c={id:"pages/commands/sparo_checkout",title:"sparo checkout",description:"",source:"@site/docs/pages/commands/sparo_checkout.md",sourceDirName:"pages/commands",slug:"/pages/commands/sparo_checkout",permalink:"/sparo/pages/commands/sparo_checkout",draft:!1,unlisted:!1,editUrl:"https://github.com/tiktok/sparo/tree/main/apps/website/docs/pages/commands/sparo_checkout.md",tags:[],version:"current",frontMatter:{title:"sparo checkout"},sidebar:"docsSidebar",previous:{title:"sparo auto-config",permalink:"/sparo/pages/commands/sparo_auto-config"},next:{title:"sparo clone",permalink:"/sparo/pages/commands/sparo_clone"}},i={},p=[];function d(e){const t={code:"code",pre:"pre",...(0,n.R)(),...e.components};return(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{children:'sparo checkout [branch] [start-point]\r\n\r\nUpdates files in the working tree to match the version in the index or the\r\nspecified tree. If no pathspec was given, git checkout will also update HEAD to\r\nset the specified branch as the current branch.\r\n\r\nPositionals:\r\n  branch                                                                [string]\r\n  start-point                                                           [string]\r\n\r\nOptions:\r\n      --help         Show help                                         [boolean]\r\n  -b                 Create a new branch and start it at <start-point> [boolean]\r\n  -B                 Create a new branch and start it at <start-point>; if it\r\n                     already exists, reset it to <start-point>         [boolean]\r\n      --profile      Checkout projects by specified profile(s). The profiles\r\n                     will be recorded and reused by other sparo commands. For\r\n                     example, running "sparo checkout <branch>" sparse checkout\r\n                     based on the reused profiles after running "git checkout"\r\n                                                           [array] [default: []]\r\n      --add-profile  Checkout projects with recorded profile(s) and the\r\n                     specified added profile(s). Adds the specified added\r\n                     profile(s) to sparo recorded profiles [array] [default: []]\r\n      --no-profile   Checkout projects without any profiles and clear all\r\n                     recorded profiles                                 [boolean]\r\n      --to           Checkout projects up to (and including) project <to..>, can\r\n                     be used together with option --profile/--add-profile to\r\n                     form a union selection of the two options. The projects\r\n                     selectors here will never replace what have been checked\r\n                     out by profiles                       [array] [default: []]\r\n      --from         Checkout projects downstream from (and including itself and\r\n                     all its dependencies) project <from..>, can be used\r\n                     together with option --profile/--add-profile to form a\r\n                     union selection of the two options. The projects selectors\r\n                     here will never replace what have been checked out by\r\n                     profiles                              [array] [default: []]\n'})})}function l(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},4738:(e,t,r)=>{r.d(t,{R:()=>a,x:()=>c});var o=r(6166);const n={},s=o.createContext(n);function a(e){const t=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:a(e.components),o.createElement(s.Provider,{value:t},e.children)}}}]);