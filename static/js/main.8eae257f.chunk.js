(this["webpackJsonpnews-app"]=this["webpackJsonpnews-app"]||[]).push([[0],{63:function(e,t,a){e.exports=a(76)},68:function(e,t,a){},76:function(e,t,a){"use strict";a.r(t);var n,r=a(0),o=a.n(r),c=a(14),i=a.n(c),l=(a(68),a(5)),s=a(41),u=a(23),m=a(52);!function(e){e.HEADLINE="HEADLINE",e.BUSINESS="BUSINESS",e.ENTERTAINMENT="ENTERTAINMENT",e.HEALTH="HEALTH",e.SCIENCE="SCIENCE",e.SPORTS="SPORTS",e.TECHNOLOGY="TECHNOLOGY"}(n||(n={}));var E,h,d=["HEADLINE","BUSINESS","ENTERTAINMENT","HEALTH","SCIENCE","SPORTS","TECHNOLOGY"];!function(e){e.SET_CATEGORY="SET_CATEGORY"}(E||(E={})),function(e){e.IS_ERROR="IS_ERROR",e.REQUEST_ARTICLES="REQUEST_ARTICLES",e.RECEIVE_ARTICLES="RECEIVE_ARTICLES"}(h||(h={}));var b="https://www.xiaoxihome.com/api/news?query=";function p(e){var t="\n        {\n            getNews(category: ".concat(e,") {\n                source,\n                author,\n                title,\n                description,\n                url,\n                urlToImage,\n                publishedAt,\n                content\n            }\n        }\n    ");return function(e){return e({type:h.REQUEST_ARTICLES}),fetch(b+encodeURIComponent(t)).then((function(e){return e.json()})).then((function(t){t.errors?e({type:h.IS_ERROR}):e(function(e){return{type:h.RECEIVE_ARTICLES,articles:e.slice()}}(t.data.getNews))}))}}var f={category:n.HEADLINE,articles:{isError:!1,isFetching:!0,articles:[]}};var g=Object(u.c)({category:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f.category,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case E.SET_CATEGORY:return t.category;default:return e}},articles:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f.articles,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case h.IS_ERROR:return Object.assign({},e,{isError:!0});case h.REQUEST_ARTICLES:return Object.assign({},e,{isError:!1,isFetching:!0});case h.RECEIVE_ARTICLES:return Object.assign({},{isError:!1,isFetching:!1,articles:t.articles.slice()});default:return e}}}),y=f;var O=a(116),v=a(115),w=a(58),j=a(119),S=a(114),T=a(19),C=a(55),N=a(98),R=a(99),I=a(100),x=a(78),k=a(117),A=a(101),L=Object(C.a)((function(e){return{tab:{flexShrink:0,flexGrow:1,color:e.palette.primary.contrastText},toolbar:{textTransform:"uppercase"}}}));var H=function(e){var t=L(),a=Object(r.useState)(0),n=Object(T.a)(a,2),c=n[0],i=n[1];return o.a.createElement(N.a,{color:"primary",position:"static"},o.a.createElement(R.a,null,o.a.createElement(I.a,null,o.a.createElement(x.a,{align:"center",className:t.toolbar,variant:"h1",component:"h1"},"News Canada"))),o.a.createElement(k.a,{value:c,indicatorColor:"secondary",textColor:"secondary",variant:"scrollable",scrollButtons:"auto"},e.headers.map((function(a,n){return o.a.createElement(A.a,{label:a,key:n,className:t.tab,onClick:function(){return function(t){t!==c&&(i(t),e.dispatcher(p(e.headers[t])))}(n)}})}))))},_=a(13),B=a(120),D=a(102),M=a(103),U=a(104),z=a(118),F=a(105),G=a(106),W=a(107),Y=a(108),P=a(109),Q=a(111),V=a(112),J=a(26),X=a(113),q=a(57),$=a.n(q),K=a(38),Z=a(110);var ee=function(e){var t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="absolute",t.style.left="-9999px",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)},te=Object(C.a)((function(e){return Object(B.a)(Object(l.a)({successSnackBar:{backgroundColor:K.a[600]},wrapper:{width:"calc(100% - 40px)",margin:"20px"}},e.breakpoints.down("sm"),{wrapper:{width:"calc(100% - 16px)",margin:"8px"}}))}));function ae(e,t,a){return"calc(".concat(e," * ").concat(a.typography[t].fontSize," * ").concat(a.typography[t].lineHeight,")")}function ne(e,t){return Object(B.a)({root:{position:"relative","&:after":{content:"''",position:"absolute",bottom:0,right:0,width:"20%",height:ae(1,e,t),backgroundImage:"linear-gradient(to right, rgba(255, 255, 255, 0) , rgba(255, 255, 255, 1))",zIndex:10}}})}var re={width:"100%",overflow:"hidden",position:"relative"},oe=Object(C.a)((function(e){return Object(B.a)(Object(l.a)({media:Object(_.a)({height:"550px"},re),skeleton:Object(_.a)({height:"550px"},re),title:Object(_.a)({height:ae(1,"body1",e)},ne("body1",e).root,{},re),source:Object(_.a)({height:ae(1,"body2",e)},re),articleContent:Object(_.a)({height:ae(2,"body2",e)},ne("body2",e).root,{},re),buttons:Object(_.a)({},re)},e.breakpoints.down("sm"),{media:{height:"200px"},skeleton:{height:"200px"}}))})),ce=Object(C.a)((function(e){return Object(B.a)(Object(l.a)({media:Object(_.a)({height:"200px"},re),skeleton:Object(_.a)({height:"200px"},re),title:Object(_.a)({height:ae(2,"body1",e)},ne("body1",e).root,{},re),source:Object(_.a)({height:ae(1,"body2",e)},re),articleContent:Object(_.a)({height:ae(3,"body2",e)},ne("body2",e).root,{},re),buttons:Object(_.a)({},re)},e.breakpoints.down("sm"),{}))}));function ie(e){var t=te(),a=Object(r.useState)(!1),n=Object(T.a)(a,2),c=n[0],i=n[1];function l(){i(!1)}return o.a.createElement(D.a,{className:e.className},o.a.createElement(M.a,{href:e.url,target:"_blank",rel:"noopener",underline:"none"},o.a.createElement(U.a,{size:"small",color:"primary"},"Learn more")),o.a.createElement(U.a,{size:"small",color:"primary",onClick:function(){ee(e.url),i(!0)}},"Share"),o.a.createElement(z.a,{anchorOrigin:{vertical:"bottom",horizontal:"center"},open:c,autoHideDuration:3e3,onClose:l},o.a.createElement(F.a,{className:t.successSnackBar,message:o.a.createElement("span",{id:"client-snackbar"},"Link copied to clipboard"),action:[o.a.createElement(G.a,{key:"close","aria-label":"close",color:"inherit",onClick:l},o.a.createElement($.a,null))]})))}function le(e){var t=Object(r.useRef)(null),a=function(e){var t=Object(r.useState)(!1),a=Object(T.a)(t,2),n=a[0],o=a[1],c=Date.now()-1e3;function i(){if(e.current){var t=Date.now();if(!(t-c<20)){c=t;var a=e.current.getBoundingClientRect(),n=a.top+a.height<0,r=a.top>window.innerHeight;n||r||o(!0)}}}return Object(r.useEffect)((function(){if(!n)return i(),document.addEventListener("scroll",i),function(){document.removeEventListener("scroll",i)}}),[n]),n}(t),n=0===e.id||1===e.id,c=oe(),i=ce(),l=n?c:i,s=o.a.createElement(W.a,{item:!0,xs:12,md:n?6:3,ref:t},o.a.createElement(Y.a,{raised:!0},a&&e.urlToImage?o.a.createElement(P.a,{component:"img",alt:e.title,className:l.media,image:e.urlToImage,title:e.title}):o.a.createElement(Z.a,{variant:"rect",className:l.skeleton}),o.a.createElement(Q.a,null,o.a.createElement(x.a,{gutterBottom:!0,variant:"body1",component:"h2",className:l.title},o.a.createElement(O.a,{fontWeight:700},e.title)),o.a.createElement(x.a,{variant:"body2",color:"textSecondary",component:"p",className:l.source},o.a.createElement(O.a,{component:"span",fontWeight:700},e.source?e.source+" - ":e.author?e.author+" - ":"",function(e){var t=Date.now()-e.getTime();if(t<0)return"now";var a=Math.floor(t/6e4);if(a<=59)return"".concat(a," ").concat(1===a?"minute":"minutes"," ago");var n=Math.floor(t/36e5);if(n<=23)return"".concat(n," ").concat(1===n?"hour":"hours"," ago");var r=Math.floor(t/864e5);if(r<=30)return"".concat(r," ").concat(1===r?"day":"days"," ago");var o=Math.floor(t/2592e6);if(o<=12)return"".concat(o," ").concat(1===o?"month":"months"," ago");var c=Math.floor(t/31536e6);return"".concat(c," ").concat(1===c?"year":"years"," ago")}(new Date(e.publishedAt)))),o.a.createElement(x.a,{variant:"body2",color:"textSecondary",component:"p",className:l.articleContent},e.content&&e.content.replace(/\[\+[0-9]+\schars\]/gi,""))),o.a.createElement(ie,{url:e.url,className:l.buttons})));return Object(V.a)(Object(J.a)().breakpoints.down("md"))?s:o.a.createElement(X.a,{in:a},s)}function se(e){return o.a.createElement(o.a.Fragment,null,e.articles.map((function(e,t){return o.a.createElement(le,Object.assign({},e,{key:t,id:t}))})))}var ue=function(e){var t,a=te();return t=e.articles.isError?o.a.createElement("div",null,"error"):e.articles.isFetching?o.a.createElement(o.a.Fragment,null,Array.from(Array(10),(function(e,t){return o.a.createElement(W.a,{item:!0,key:t},o.a.createElement(O.a,{width:500,height:300,maxWidth:"100%"},o.a.createElement(Z.a,{variant:"rect",width:500,height:200}),o.a.createElement(Z.a,{width:500}),o.a.createElement(Z.a,{width:500})))}))):o.a.createElement(se,{articles:e.articles.articles}),o.a.createElement(O.a,{className:a.wrapper},o.a.createElement(W.a,{container:!0,direction:"row",alignContent:"center",justify:"center",spacing:2},t))},me=a(121),Ee=a(122);var he,de=function(){return o.a.createElement(O.a,{mt:10,mb:2,mx:2},o.a.createElement(W.a,{container:!0,direction:"row",spacing:2},o.a.createElement(W.a,{item:!0},o.a.createElement(M.a,{href:"https://www.xiaoxihome.com/",target:"_blank",rel:"noopener",underline:"none"},o.a.createElement(me.a,{avatar:o.a.createElement(Ee.a,null,"X"),label:"\ud83d\udd27 with \u2764\ufe0f by XiaoxiHome",color:"primary",clickable:!0}))),o.a.createElement(W.a,{item:!0},o.a.createElement(M.a,{href:"https://newsapi.org/",target:"_blank",rel:"noopener",underline:"none"},o.a.createElement(me.a,{avatar:o.a.createElement(Ee.a,null,"N"),label:"News data courtesy of NewsAPI.org",color:"secondary",clickable:!0})))))},be=Object(u.d)(g,y,Object(u.a)(m.a));var pe=Object(s.b)((function(e){return e}))((function(e){return Object(r.useEffect)((function(){e.dispatch(p(n.HEADLINE))}),[]),o.a.createElement(O.a,{width:"100vw",minHeight:"100vh",maxWidth:"100%"},o.a.createElement(H,{headers:d,dispatcher:e.dispatch}),o.a.createElement(ue,{articles:e.articles}),o.a.createElement(de,null))})),fe=Object(w.a)({palette:{primary:{main:"#333333",contrastText:"#fff"},secondary:{main:"#1EB980",contrastText:"#fff"}}});(fe=Object(j.a)(fe)).typography.h1=(he={fontFamily:["Anton","sans-serif"].join(","),fontWeight:400,fontSize:"2rem"},Object(l.a)(he,fe.breakpoints.up("md"),{fontSize:"2.5rem"}),Object(l.a)(he,"fontStyle","normal"),Object(l.a)(he,"color","inherit"),he);var ge=function(){return o.a.createElement(s.a,{store:be},o.a.createElement(S.a,{theme:fe},o.a.createElement(v.a,null),o.a.createElement(pe,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(ge,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[63,1,2]]]);
//# sourceMappingURL=main.8eae257f.chunk.js.map