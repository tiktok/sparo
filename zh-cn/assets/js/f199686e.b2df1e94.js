"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[391],{4066:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>p,contentTitle:()=>l,default:()=>d,frontMatter:()=>i,metadata:()=>c,toc:()=>a});var r=s(678),o=s(4738);const i={title:"Sparo \u914d\u7f6e\u6587\u4ef6"},l=void 0,c={id:"pages/guide/sparo_profiles",title:"Sparo \u914d\u7f6e\u6587\u4ef6",description:"\u80cc\u666f",source:"@site/i18n/zh-cn/docusaurus-plugin-content-docs/current/pages/guide/sparo_profiles.md",sourceDirName:"pages/guide",slug:"/pages/guide/sparo_profiles",permalink:"/sparo/zh-cn/pages/guide/sparo_profiles",draft:!1,unlisted:!1,editUrl:"https://github.com/tiktok/sparo/tree/main/apps/website/docs/pages/guide/sparo_profiles.md",tags:[],version:"current",frontMatter:{title:"Sparo \u914d\u7f6e\u6587\u4ef6"},sidebar:"docsSidebar",previous:{title:"\u5165\u95e8\u6307\u5357",permalink:"/sparo/zh-cn/pages/guide/getting_started"},next:{title:"Git \u4f18\u5316",permalink:"/sparo/zh-cn/pages/reference/git_optimization"}},p={},a=[{value:"\u80cc\u666f",id:"\u80cc\u666f",level:2},{value:"Sparo \u6539\u8fdb\u4e86\u7a00\u758f\u68c0\u51fa",id:"sparo-\u6539\u8fdb\u4e86\u7a00\u758f\u68c0\u51fa",level:2},{value:"\u914d\u7f6e\u6587\u4ef6\u7684\u6700\u4f73\u5b9e\u8df5",id:"\u914d\u7f6e\u6587\u4ef6\u7684\u6700\u4f73\u5b9e\u8df5",level:2},{value:"\u7ec4\u5408\u914d\u7f6e\u6587\u4ef6",id:"\u7ec4\u5408\u914d\u7f6e\u6587\u4ef6",level:2},{value:"\u67e5\u8be2\u914d\u7f6e\u6587\u4ef6",id:"\u67e5\u8be2\u914d\u7f6e\u6587\u4ef6",level:2},{value:"\u53e6\u89c1",id:"\u53e6\u89c1",level:2}];function t(e){const n={a:"a",code:"code",em:"em",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"\u80cc\u666f",children:"\u80cc\u666f"}),"\n",(0,r.jsxs)(n.p,{children:["Git \u7684\u7a00\u758f\u68c0\u51fa\u529f\u80fd\u901a\u5e38\u4f9d\u8d56\u4e8e\u5b58\u50a8\u5728 ",(0,r.jsx)(n.code,{children:".git/info/sparse-checkout"})," \u914d\u7f6e\u6587\u4ef6\u4e2d\u7684\u4e00\u7ec4 glob \u6a21\u5f0f\u3002Git \u7ef4\u62a4\u8005\u53d1\u73b0\u5e38\u89c4\u7684 glob \u8bed\u6cd5\u6548\u7387\u592a\u4f4e\uff0c\u56e0\u6b64\u4ed6\u4eec\u5f15\u5165\u4e86\u4e00\u79cd",(0,r.jsx)(n.a,{href:"https://git-scm.com/docs/git-sparse-checkout#_internalsnon_cone_problems",children:'"\u9525\u5f62\u6a21\u5f0f"'}),"\u7684 glob \u89e3\u91ca\uff0c\u8fd9\u79cd\u6a21\u5f0f\u5ffd\u7565\u6587\u4ef6\u5339\u914d\u6a21\u5f0f\uff0c\u53ea\u5339\u914d\u76ee\u5f55\u3002"]}),"\n",(0,r.jsx)(n.p,{children:"\u8bed\u6cd5\u7c7b\u4f3c\u4e8e\u4ee5\u4e0b\u5185\u5bb9\uff1a"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:".git/info/sparse-checkout \u793a\u4f8b"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"/*\n!/*/\n/apps/\n!/apps/*/\n/apps/my-app/\n!/apps/my-app/*/\n/apps/my-app/_/\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u4e3a\u4e86\u7b80\u5316\u7ba1\u7406\uff0cGit \u8fd8\u63d0\u4f9b\u4e86 ",(0,r.jsx)(n.code,{children:"git sparse-checkout"})," \u547d\u4ee4\uff0c\u7528\u4e8e\u7b80\u5316\u4ece\u8be5\u6587\u4ef6\u4e2d\u6dfb\u52a0/\u5220\u9664\u6a21\u5f0f\u7684\u8bed\u6cd5\u3002\u7136\u800c\uff0c\u5728\u4e00\u4e2a\u5305\u542b\u6570\u767e\u4e2a\u9879\u76ee\u7684\u5927\u578b monorepo \u4e2d\uff0c\u7ba1\u7406\u8fd9\u4e9b globs \u4ecd\u7136\u4f1a\u4ee4\u4eba\u56f0\u60d1\u4e14\u5bb9\u6613\u51fa\u9519\u3002"]}),"\n",(0,r.jsx)(n.h2,{id:"sparo-\u6539\u8fdb\u4e86\u7a00\u758f\u68c0\u51fa",children:"Sparo \u6539\u8fdb\u4e86\u7a00\u758f\u68c0\u51fa"}),"\n",(0,r.jsxs)(n.p,{children:["Sparo \u901a\u8fc7\u4ece\u79f0\u4e3a ",(0,r.jsx)(n.strong,{children:"\u914d\u7f6e\u6587\u4ef6"})," \u7684\u914d\u7f6e\u6587\u4ef6\u81ea\u52a8\u751f\u6210 ",(0,r.jsx)(n.code,{children:".git/info/sparse-checkout"})," \u914d\u7f6e\uff0c\u4f7f\u751f\u6d3b\u53d8\u5f97\u66f4\u7b80\u5355\u3002\u8fd9\u5e26\u6765\u4e86\u8bb8\u591a\u597d\u5904\uff1a"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Sparo \u914d\u7f6e\u6587\u4ef6\u4f7f\u7528 ",(0,r.jsx)(n.a,{href:"https://rushjs.io/pages/developer/selecting_subsets/#--to",children:"\u9879\u76ee\u9009\u62e9\u5668"})," \u5b9a\u4e49\uff0c\u4f8b\u5982\uff1a",(0,r.jsxs)(n.em,{children:['"\u7ed9\u6211 ',(0,r.jsx)(n.strong,{children:"app1"}),"\u3001",(0,r.jsx)(n.strong,{children:"app2"}),'\uff0c\u4ee5\u53ca\u6240\u6709\u6784\u5efa\u5b83\u4eec\u6240\u9700\u7684\u9879\u76ee\u3002"']})," \u8fd9\u6bd4\u6307\u5b9a globs \u66f4\u7b80\u6d01\u4e14\u66f4\u6613\u7ef4\u62a4\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u914d\u7f6e\u6587\u4ef6\u5b58\u50a8\u5728\u914d\u7f6e\u6587\u4ef6\u4e2d\u5e76\u63d0\u4ea4\u5230 Git\u3002\u8fd9\u4f7f\u5f97\u4e0e\u56e2\u961f\u6210\u5458\u5171\u4eab\u5b83\u4eec\u53d8\u5f97\u5bb9\u6613\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(n.p,{children:"\u5728\u5206\u652f\u5207\u6362\u65f6\uff0c\u914d\u7f6e\u6587\u4ef6\u4f1a\u81ea\u52a8\u66f4\u65b0\uff0c\u786e\u4fdd\u786e\u5b9a\u6027\u7ed3\u679c\u3002\u4f8b\u5982\uff0c\u5728\u68c0\u51fa\u4e00\u4e2a\u975e\u5e38\u65e7\u7684\u5206\u652f\u65f6\uff0c\u60a8\u5e0c\u671b\u83b7\u5f97\u65e7\u7684\u914d\u7f6e\u6587\u4ef6\u5b9a\u4e49\uff0c\u800c\u4e0d\u662f\u4eca\u5929\u7684\u7248\u672c\u3002"}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["\u60a8\u53ef\u4ee5\u5c06\u591a\u4e2a\u914d\u7f6e\u6587\u4ef6\u7ec4\u5408\u5728\u4e00\u8d77\uff08",(0,r.jsx)(n.code,{children:"sparo checkout --profile team1 --profile team2"}),"\uff09\uff0c\u9009\u62e9\u5b83\u4eec\u9879\u76ee\u7684\u5e76\u96c6\u3002\u8fd9\u5728\u4fee\u6539\u4e00\u4e2a\u88ab\u591a\u4e2a\u5176\u4ed6\u56e2\u961f\u7684\u9879\u76ee\u4f7f\u7528\u7684\u5e93\u9879\u76ee\u65f6\u975e\u5e38\u6709\u7528\u3002\u5f53\u7136\uff0c\u60a8\u53ef\u4ee5\u4f7f\u7528 ",(0,r.jsx)(n.code,{children:"--from the-library"})," \u68c0\u51fa\u8fd9\u4e9b\u9879\u76ee\uff0c\u4f46\u5176\u4ed6\u56e2\u961f\u53ef\u80fd\u5df2\u7ecf\u5728\u4ed6\u4eec\u7684\u914d\u7f6e\u6587\u4ef6\u4e2d\u5305\u62ec\u4e86\u5176\u4ed6\u76f8\u5173\u9879\u76ee\u3002"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Sparo \u901a\u8fc7\u65bd\u52a0 ",(0,r.jsx)(n.code,{children:"git sparse-checkout"})," \u4e4b\u5916\u7684\u989d\u5916\u9650\u5236\u6765\u907f\u514d\u5e38\u89c1\u9519\u8bef\u3002\u8fd9\u53ef\u4ee5\u907f\u514d\u8bf8\u5982\u5c1d\u8bd5\u5207\u6362\u5230\u7f3a\u5c11\u5305\u542b\u672c\u5730\u4fee\u6539\u6587\u4ef6\u7684\u9879\u76ee\u6587\u4ef6\u5939\u7684\u914d\u7f6e\u6587\u4ef6\u7b49\u9519\u8bef\u3002\u7528\u6237\u6700\u597d\u5148\u6682\u5b58\u6216\u63d0\u4ea4\u6b64\u7c7b\u4fee\u6539\u3002"]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"\u914d\u7f6e\u6587\u4ef6\u7684\u6700\u4f73\u5b9e\u8df5",children:"\u914d\u7f6e\u6587\u4ef6\u7684\u6700\u4f73\u5b9e\u8df5"}),"\n",(0,r.jsx)(n.p,{children:"\u60a8\u53ef\u4ee5\u5411\u914d\u7f6e\u6587\u4ef6\u4e2d\u6dfb\u52a0 JSON \u6ce8\u91ca\u3002\u5728\u5927\u578b\u5171\u4eab\u4ee3\u7801\u5e93\u4e2d\uff0c\u6211\u4eec\u5efa\u8bae\u5728\u6587\u4ef6\u9876\u90e8\u6dfb\u52a0\u4e00\u4e2a\u6807\u51c6\u5316\u7684\u6807\u9898\uff0c\u6307\u793a\u5b83\u4eec\u7684\u6240\u6709\u6743\u548c\u7528\u9014\u3002\u7c7b\u4f3c\u4e8e\u4ee5\u4e0b\u5185\u5bb9\uff1a"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"common/sparo-profiles/example-profile.json"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:'/**\n * \u6240\u6709\u8005:   \u5ba2\u6237\u670d\u52a1\u56e2\u961f\n * \u76ee\u7684:     \u5728\u5904\u7406\u5ba2\u6237\u670d\u52a1\u5e94\u7528\u7a0b\u5e8f\u65f6\u4f7f\u7528\u6b64\u914d\u7f6e\u6587\u4ef6\u3002\n */\n{\n  "$schema": "https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json",\n\n  /**\n   * \u4e00\u4e2a Rush \u9879\u76ee\u9009\u62e9\u5668\u5217\u8868\uff0c\u6307\u793a\u8981\u5305\u542b\u5728\u7a00\u758f\u68c0\u51fa\u4e2d\u7684\u9879\u76ee\u6587\u4ef6\u5939\u3002\n   * \u9009\u62e9\u5668\u5c06\u7ec4\u5408\u4ee5\u6784\u6210\u9879\u76ee\u7684\u5e76\u96c6\u3002\u8be6\u60c5\u8bf7\u53c2\u9605 Rush \u9009\u62e9\u5668\u6587\u6863\uff1a\n   * https://rushjs.io/pages/developer/selecting_subsets/\n   */\n  "selections": [\n     {\n        "selector": "--to",\n        "argument": "tag:cs-dashboard"\n     },\n     {\n        "selector": "--to",\n        "argument": "tag:cs-tools"\n     }\n  ]\n}\n'})}),"\n",(0,r.jsx)(n.h2,{id:"\u7ec4\u5408\u914d\u7f6e\u6587\u4ef6",children:"\u7ec4\u5408\u914d\u7f6e\u6587\u4ef6"}),"\n",(0,r.jsxs)(n.p,{children:["\u7ec4\u5408\u914d\u7f6e\u6587\u4ef6\u7684\u7b80\u5355\u65b9\u6cd5\u662f\u591a\u6b21\u6307\u5b9a ",(0,r.jsx)(n.code,{children:"--profile"}),"\u3002\u4f8b\u5982\uff1a"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:"# \u68c0\u51fa team-a.json\u3001team-b.json\u3001team-c.json \u914d\u7f6e\u6587\u4ef6\u7684\u5e76\u96c6\n# \u6ce8\u610f: \u8fd9\u5c06\u66ff\u6362\u5df2\u68c0\u51fa\u7684\u4efb\u4f55\u914d\u7f6e\u6587\u4ef6\u9009\u62e9\u3002\nsparo checkout --profile team-a --profile team-b --profile team-c\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u60a8\u8fd8\u53ef\u4ee5\u4f7f\u7528 ",(0,r.jsx)(n.code,{children:"--add-profile"})," \u6765\u9010\u6b65\u7ec4\u5408\u5b83\u4eec\u3002\u4f8b\u5982\uff1a"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"# \u8fd9\u4e09\u4e2a\u547d\u4ee4\u7b49\u540c\u4e8e\u4e0a\u8ff0\u547d\u4ee4\u3002\nsparo checkout --profile team-a\nsparo checkout --add-profile team-b\nsparo checkout --add-profile team-c\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u5982\u4f55\u5b8c\u5168\u4e0d\u68c0\u51fa\u4efb\u4f55\u914d\u7f6e\u6587\u4ef6\uff1f\u4e5f\u5c31\u662f\u8bf4\uff0c\u5982\u4f55\u8fd4\u56de\u5230\u4ec5\u5305\u542b",(0,r.jsx)(n.a,{href:"/sparo/zh-cn/pages/reference/skeleton_folders",children:"\u9aa8\u67b6"}),"\u6587\u4ef6\u5939\u7684\u5e72\u51c0 ",(0,r.jsx)(n.code,{children:"sparo clone"})," \u7684\u521d\u59cb\u72b6\u6001\uff1f\u7b54\u6848\u662f\u4f7f\u7528 ",(0,r.jsx)(n.code,{children:"--no-profile"})," \u53c2\u6570\uff1a"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"# \u5c1a\u672a\u5b9e\u73b0 - \u4ec5\u68c0\u51fa\u9aa8\u67b6\u6587\u4ef6\u5939\n# \u800c\u4e0d\u5e94\u7528\u4efb\u4f55\u914d\u7f6e\u6587\u4ef6\nsparo checkout --no-profile\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u5982\u679c ",(0,r.jsx)(n.code,{children:"sparo checkout"})," \u4e0d\u5e26 ",(0,r.jsx)(n.code,{children:"--profile"})," \u6216 ",(0,r.jsx)(n.code,{children:"--add-profile"})," \u6216 ",(0,r.jsx)(n.code,{children:"--no-profile"}),"\uff0c\u5219\u4fdd\u7559\u73b0\u6709\u7684\u914d\u7f6e\u6587\u4ef6\u9009\u62e9\u3002\u6362\u53e5\u8bdd\u8bf4\uff0c\u60a8\u7684\u914d\u7f6e\u6587\u4ef6\u9009\u62e9\u901a\u5e38\u5728\u547d\u4ee4\u4e4b\u95f4\u662f\u201c\u7c98\u6027\u7684\u201d\u3002"]}),"\n",(0,r.jsx)(n.h2,{id:"\u67e5\u8be2\u914d\u7f6e\u6587\u4ef6",children:"\u67e5\u8be2\u914d\u7f6e\u6587\u4ef6"}),"\n",(0,r.jsxs)(n.p,{children:["\u7528\u6237\u53ef\u4ee5\u901a\u8fc7\u8c03\u7528 ",(0,r.jsx)(n.a,{href:"/sparo/zh-cn/pages/commands/sparo_list-profiles",children:"sparo list-profiles"})," \u547d\u4ee4\u53d1\u73b0\u5f53\u524d\u5206\u652f\u4e2d\u7684\u53ef\u7528\u914d\u7f6e\u6587\u4ef6\u3002",(0,r.jsx)(n.code,{children:"--project"})," \u53c2\u6570\u4f7f\u60a8\u53ef\u4ee5\u67e5\u8be2\u7ed9\u5b9a\u9879\u76ee\u7684\u76f8\u5173\u914d\u7f6e\u6587\u4ef6\u3002\u4f8b\u5982\uff1a"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:'# \u5047\u8bbe\u60a8\u9700\u8981\u4e3a "example-app" \u9879\u76ee\u8fdb\u884c\u4fee\u590d\u3002\n\n# \u54ea\u4e9b\u7a00\u758f\u68c0\u51fa\u914d\u7f6e\u6587\u4ef6\u5305\u542b "example-app" \u9879\u76ee\uff1f\nsparo list-profiles --project example-app\n\n# \u5f88\u597d\uff0c\u8ba9\u6211\u4eec\u5c06 "example-profile" \u7ed3\u679c\u6dfb\u52a0\u5230\u6211\u4eec\u5f53\u524d\u7684\u68c0\u51fa\u4e2d\n# \uff08\u4e0e\u73b0\u6709\u914d\u7f6e\u6587\u4ef6\u7ec4\u5408\uff09\u3002\nsparo checkout --add-profile example-profile\n'})}),"\n",(0,r.jsx)(n.h2,{id:"\u53e6\u89c1",children:"\u53e6\u89c1"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.a,{href:"/sparo/zh-cn/pages/configs/profile_json",children:"<profile-name>.json"})," \u914d\u7f6e\u6587\u4ef6"]}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(t,{...e})}):t(e)}},4738:(e,n,s)=>{s.d(n,{R:()=>l,x:()=>c});var r=s(6166);const o={},i=r.createContext(o);function l(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:l(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);