(this["webpackJsonpnews-app"]=this["webpackJsonpnews-app"]||[]).push([[0],{119:function(e,t,n){"use strict";n.r(t);var a,r=n(0),c=n.n(r),o=n(16),i=n.n(o),l=(n(91),n(17)),u=n(28),s=n(74);!function(e){e.IS_ERROR="IS_ERROR",e.REQUEST_ARTICLES="REQUEST_ARTICLES",e.RECEIVE_ARTICLES="RECEIVE_ARTICLES"}(a||(a={}));var E,m=function(e){var t="\n        {\n            getNews(category: ".concat(e,") {\n                source,\n                author,\n                title,\n                description,\n                url,\n                urlToImage,\n                publishedAt,\n                content\n            }\n        }\n    ");return function(e){return e({type:a.REQUEST_ARTICLES}),fetch("https://www.xiaoxihome.com/api/news?query="+encodeURIComponent(t)).then((function(e){return e.json()})).then((function(t){t.errors?e({type:a.IS_ERROR}):e(function(e){return{type:a.RECEIVE_ARTICLES,articles:e.slice()}}(t.data.getNews))}))}};!function(e){e.HEADLINE="HEADLINE",e.BUSINESS="BUSINESS",e.ENTERTAINMENT="ENTERTAINMENT",e.HEALTH="HEALTH",e.SCIENCE="SCIENCE",e.SPORTS="SPORTS",e.TECHNOLOGY="TECHNOLOGY"}(E||(E={}));var f,h=["HEADLINE","BUSINESS","ENTERTAINMENT","HEALTH","SCIENCE","SPORTS","TECHNOLOGY"];!function(e){e.SET_CATEGORY="SET_CATEGORY"}(f||(f={}));var d=function(e){return function(t){t(function(e){return{type:f.SET_CATEGORY,category:e}}(e)),t(m(e))}};var b={category:E.HEADLINE,articles:{isError:!1,isFetching:!0,articles:[]},copyLinkSnackBar:{isActive:!1}};var p=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b.category,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case f.SET_CATEGORY:return E[t.category];default:return e}};var v,g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b.articles,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case a.IS_ERROR:return Object.assign({},e,{isError:!0});case a.REQUEST_ARTICLES:return Object.assign({},e,{isError:!1,isFetching:!0});case a.RECEIVE_ARTICLES:return Object.assign({},{isError:!1,isFetching:!1,articles:t.articles.slice()});default:return e}};!function(e){e.CLOSE_SNACKBAR="CLOSE_SNACKBAR",e.OPEN_SNACKBAR="OPEN_SNACKBAR"}(v||(v={}));var O=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b.copyLinkSnackBar;switch((arguments.length>1?arguments[1]:void 0).type){case v.CLOSE_SNACKBAR:return{isActive:!1};case v.OPEN_SNACKBAR:return{isActive:!0};default:return e}},y=Object(u.c)({category:p,articles:g,copyLinkSnackBar:O}),S=b;var L,j=n(156),T=n(153),w=n(5),C=n(81),N=n(160),R=Object(C.a)({palette:{primary:{main:"#333333",contrastText:"#fff"},secondary:{main:"#1EB980",contrastText:"#fff"}}});(R=Object(N.a)(R)).typography.h1=(L={fontFamily:["Anton","sans-serif"].join(","),fontWeight:400,fontSize:"2rem"},Object(w.a)(L,R.breakpoints.up("md"),{fontSize:"2.5rem"}),Object(w.a)(L,"fontStyle","normal"),Object(w.a)(L,"color","inherit"),L);var A=R,I=n(77),k=n(141),x=n(157),B=n(137),_=n(138),H=n(139),D=n(122),F=n(158),U=n(140),M=n(11),P=n(15);var X,G=function(e){var t=Date.now();return function(){var n=Date.now();return n-t>e&&(t=n,!0)}};!function(e){e.FIXED="FIXED",e.RELATIVE="RELATIVE"}(X||(X={}));var W=function(e){return Object(M.a)({},{FIXED:{position:"fixed",top:0,left:0,width:"100%"},RELATIVE:{position:"relative",width:"100%"}}[e])};var z=function(e){var t=Object(r.useState)(X.RELATIVE),n=Object(P.a)(t,2),a=n[0],c=n[1],o=Object(r.useState)(!1),i=Object(P.a)(o,2),l=i[0],u=i[1],s=G(10);function E(){if(s()){var t=window.scrollY;t>=e&&a!==X.FIXED?(c(X.FIXED),u(!0)):t<e&&a!==X.RELATIVE&&(c(X.RELATIVE),u(!1))}}return Object(r.useEffect)((function(){return document.addEventListener("scroll",E),function(){document.removeEventListener("scroll",E)}}),[a]),{style:W(a),isFixed:l}},Y=function(e){var t=z(e.fixedStartHeight),n=t.style,a=t.isFixed,o=Object(r.useRef)(document.createElement("div"));return c.a.createElement(c.a.Fragment,null,a&&c.a.createElement("div",{style:{visibility:"hidden"}},e.children),c.a.createElement("div",{style:Object(M.a)({},n,{zIndex:e.zIndex?e.zIndex:"auto"}),ref:o},e.children))},V=Object(I.a)((function(e){return{tab:{flexShrink:0,flexGrow:1,color:e.palette.primary.contrastText},toolbar:{textTransform:"uppercase"}}}));var K=function(e){var t=V(),n=Object(l.c)(),a=Object(r.useRef)(document.createElement("div")),o=function(e){n(function(e){return function(t,n){n().category!==e&&t(d(e))}}(e))};return c.a.createElement(c.a.Fragment,null,c.a.createElement(B.a,{color:"primary",position:"static",ref:a},c.a.createElement(_.a,null,c.a.createElement(H.a,null,c.a.createElement(D.a,{align:"center",className:t.toolbar,variant:"h1",component:"h1"},"News Canada")))),c.a.createElement(Y,{fixedStartHeight:null!==a?a.current.getBoundingClientRect().height:50,zIndex:1100},c.a.createElement(B.a,{color:"primary",position:"static"},c.a.createElement(F.a,{value:e.headers.indexOf(e.category),indicatorColor:"secondary",textColor:"secondary",variant:"scrollable",scrollButtons:"auto"},e.headers.map((function(e,n){return c.a.createElement(U.a,{label:e,key:n,className:t.tab,onClick:function(){return o(E[e])}})}))))))},Q=n(142),J=n(143),q=n(144),$=n(145),Z=n(35),ee=n(146),te=n(147),ne=n(148),ae=n(150),re=n(152),ce=n(149);var oe,ie,le=function(e){var t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="absolute",t.style.left="-9999px",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t)};!function(e){e.NULL="NULL",e.LEFT="LEFT",e.RIGHT="RIGHT"}(oe||(oe={})),function(e){e.NULL="NULL",e.SWIPE="SWIPE",e.SCROLL="SCROLL"}(ie||(ie={}));var ue=10;var se=function(e,t){var n=Object(r.useState)(0),a=Object(P.a)(n,2),c=a[0],o=a[1],i=Object(r.useState)(0),l=Object(P.a)(i,2),u=l[0],s=l[1],E=Object(r.useState)(ie.NULL),m=Object(P.a)(E,2),f=m[0],h=m[1],d=Object(r.useState)(oe.NULL),b=Object(P.a)(d,2),p=b[0],v=b[1],g=Object(r.useState)(0),O=Object(P.a)(g,2),y=O[0],S=O[1],L=G(ue);function j(e){o(e.changedTouches[0].clientX),s(e.changedTouches[0].clientY)}function T(e){if(L()){var t=e.changedTouches[0].clientX,n=e.changedTouches[0].clientY;"SWIPE"===f?(e.cancelable&&e.preventDefault(),S(e.changedTouches[0].clientX-c)):"NULL"===f&&Math.abs(t-c)>Math.abs(n-u)?h(ie.SWIPE):"NULL"===f&&Math.abs(t-c)<=Math.abs(n-u)&&h(ie.SCROLL)}}function w(e){var n=e.changedTouches[0].clientX,a=e.changedTouches[0].clientY;Math.abs(n-c)>Math.abs(a-u)&&Math.abs(n-c)>t&&f===ie.SWIPE&&v(n>c?oe.RIGHT:oe.LEFT),S(0),h(ie.NULL)}return Object(r.useEffect)((function(){var t=e.current;if(t)return t.addEventListener("touchstart",j),function(){t.removeEventListener("touchstart",j)}}),[e]),Object(r.useEffect)((function(){var t=e.current;if(t)return t.addEventListener("touchmove",T),function(){t.removeEventListener("touchmove",T)}}),[u,f,e]),Object(r.useEffect)((function(){var t=e.current;if(t)return t.addEventListener("touchend",w),function(){t.removeEventListener("touchend",w)}}),[u,f,e]),{direction:p,dragDistance:y,resetSwipeStatus:function(){v(oe.NULL)}}};var Ee=Object(l.b)(null,(function(e){return{goPrevious:function(){return e((function(e,t){var n=t().category,a=h.indexOf(n);e(d(0===a?E[h[h.length-1]]:E[h[a-1]]))}))},goNext:function(){return e((function(e,t){var n=t().category,a=h.indexOf(n),r=a===h.length-1;e(d(r?E[h[0]]:E[h[a+1]]))}))}}}))((function(e){var t=Object(r.useRef)(null),n=se(t,50),a=n.direction,o=n.dragDistance,i=n.resetSwipeStatus;return Object(r.useEffect)((function(){return a===oe.RIGHT?e.goPrevious():a===oe.LEFT&&e.goNext(),function(){i()}}),[a]),c.a.createElement("div",{style:{width:"100%",transform:"translateX(".concat(o,"px)")},ref:t},e.children)})),me=Object(I.a)((function(e){return Object(k.a)(Object(w.a)({wrapper:{width:"calc(100% - 40px)",margin:"20px"}},e.breakpoints.down("sm"),{wrapper:{width:"calc(100% - 16px)",margin:"8px"}}))}));function fe(e,t,n){return"calc(".concat(e," * ").concat(n.typography[t].fontSize," * ").concat(n.typography[t].lineHeight,")")}function he(e,t){return Object(k.a)({root:{position:"relative","&:after":{content:"''",position:"absolute",bottom:0,right:0,width:"20%",height:fe(1,e,t),backgroundImage:"linear-gradient(to right, rgba(255, 255, 255, 0) , rgba(255, 255, 255, 1))",zIndex:10}}})}var de={width:"100%",overflow:"hidden",position:"relative"},be=Object(I.a)((function(e){return Object(k.a)(Object(w.a)({media:Object(M.a)({height:"550px"},de),skeleton:Object(M.a)({height:"550px"},de),title:Object(M.a)({height:fe(1,"body1",e)},he("body1",e).root,{},de),source:Object(M.a)({height:fe(1,"body2",e)},de),articleContent:Object(M.a)({height:fe(2,"body2",e)},he("body2",e).root,{},de),buttons:Object(M.a)({},de)},e.breakpoints.down("sm"),{media:{height:"200px"},skeleton:{height:"200px"}}))})),pe=Object(I.a)((function(e){return Object(k.a)(Object(w.a)({media:Object(M.a)({height:"200px"},de),skeleton:Object(M.a)({height:"200px"},de),title:Object(M.a)({height:fe(2,"body1",e)},he("body1",e).root,{},de),source:Object(M.a)({height:fe(1,"body2",e)},de),articleContent:Object(M.a)({height:fe(3,"body2",e)},he("body2",e).root,{},de),buttons:Object(M.a)({},de)},e.breakpoints.down("sm"),{}))}));function ve(e){return c.a.createElement(Q.a,{className:e.className},c.a.createElement(J.a,{href:e.url,target:"_blank",rel:"noopener",underline:"none"},c.a.createElement(q.a,{size:"small",color:"primary"},"Learn more")),c.a.createElement(q.a,{size:"small",color:"primary",onClick:function(){le(e.url),e.openCopyLinkSnackBar()}},"Share"))}function ge(e){var t=Object(r.useRef)(null),n=function(e){var t=Object(r.useState)(!1),n=Object(P.a)(t,2),a=n[0],c=n[1],o=Date.now()-1e3;function i(){var t=Date.now();if(!(t-o<20)&&(o=t,e.current)){var n=e.current.getBoundingClientRect(),a=n.top+n.height<0,r=n.top>window.innerHeight;a||r||c(!0)}}return Object(r.useEffect)((function(){if(!a)return i(),document.addEventListener("scroll",i),function(){document.removeEventListener("scroll",i)}})),a}(t),a=Object(r.useState)(!1),o=Object(P.a)(a,2),i=o[0],l=o[1],u=!Object($.a)(Object(Z.a)().breakpoints.down("sm")),s=0===e.id||1===e.id,E=be(),m=pe(),f=s?E:m;Object(r.useEffect)((function(){u&&setTimeout((function(){return l(!0)}),225)}),[]);var h=c.a.createElement(ee.a,{item:!0,xs:12,md:s?6:3,ref:t},c.a.createElement(te.a,{raised:!0},n&&e.urlToImage?c.a.createElement(ne.a,{component:"img",alt:e.title,className:f.media,image:e.urlToImage,title:e.title}):c.a.createElement(ce.a,{variant:"rect",className:f.skeleton}),c.a.createElement(ae.a,null,c.a.createElement(D.a,{gutterBottom:!0,variant:"body1",component:"h2",className:f.title},c.a.createElement(x.a,{fontWeight:700},e.title)),c.a.createElement(D.a,{variant:"body2",color:"textSecondary",component:"p",className:f.source},c.a.createElement(x.a,{component:"span",fontWeight:700},e.source?e.source+" - ":e.author?e.author+" - ":"",function(e){var t=Date.now()-e.getTime();if(t<0)return"now";var n=Math.floor(t/6e4);if(n<=59)return"".concat(n," ").concat(1===n?"minute":"minutes"," ago");var a=Math.floor(t/36e5);if(a<=23)return"".concat(a," ").concat(1===a?"hour":"hours"," ago");var r=Math.floor(t/864e5);if(r<=30)return"".concat(r," ").concat(1===r?"day":"days"," ago");var c=Math.floor(t/2592e6);if(c<=12)return"".concat(c," ").concat(1===c?"month":"months"," ago");var o=Math.floor(t/31536e6);return"".concat(o," ").concat(1===o?"year":"years"," ago")}(new Date(e.publishedAt)))),c.a.createElement(D.a,{variant:"body2",color:"textSecondary",component:"p",className:f.articleContent},e.content&&e.content.replace(/\[\+[0-9]+\schars\]/gi,""))),c.a.createElement(ve,{url:e.url,className:f.buttons,openCopyLinkSnackBar:e.openCopyLinkSnackBar})));return u?c.a.createElement(re.a,{in:!i||n},h):h}function Oe(e){return c.a.createElement(c.a.Fragment,null,e.articles.map((function(t,n){return c.a.createElement(ge,Object.assign({},t,{key:n,id:n,openCopyLinkSnackBar:e.openCopyLinkSnackBar}))})))}var ye=function(e){var t,n=me();return Object(r.useEffect)((function(){window.scrollTo(0,0)})),t=e.articles.isError?c.a.createElement("div",{style:{width:"100%",minHeight:"100vh"}},"error"):e.articles.isFetching?c.a.createElement(c.a.Fragment,null,Array.from(Array(10),(function(e,t){return c.a.createElement(ee.a,{item:!0,key:t},c.a.createElement(x.a,{width:500,height:300,maxWidth:"100%"},c.a.createElement(ce.a,{variant:"rect",width:500,height:200}),c.a.createElement(ce.a,{width:500}),c.a.createElement(ce.a,{width:500})))}))):c.a.createElement(Oe,{articles:e.articles.articles,openCopyLinkSnackBar:e.openCopyLinkSnackBar}),c.a.createElement(Ee,null,c.a.createElement(x.a,{className:n.wrapper},c.a.createElement(ee.a,{container:!0,direction:"row",alignContent:"center",justify:"center",spacing:2},t)))};var Se=Object(l.b)(null,(function(e){return{openCopyLinkSnackBar:function(){return e({type:v.OPEN_SNACKBAR})}}}))(ye),Le=n(161),je=n(162);var Te=function(){return c.a.createElement(x.a,{mt:10,mb:2,mx:2},c.a.createElement(ee.a,{container:!0,direction:"row",spacing:2},c.a.createElement(ee.a,{item:!0},c.a.createElement(J.a,{href:"https://www.xiaoxihome.com/",target:"_blank",rel:"noopener",underline:"none"},c.a.createElement(Le.a,{avatar:c.a.createElement(je.a,null,"X"),label:"\ud83d\udd27 with \u2764\ufe0f by XiaoxiHome",color:"primary",clickable:!0}))),c.a.createElement(ee.a,{item:!0},c.a.createElement(J.a,{href:"https://newsapi.org/",target:"_blank",rel:"noopener",underline:"none"},c.a.createElement(Le.a,{avatar:c.a.createElement(je.a,null,"N"),label:"News data courtesy of NewsAPI.org",color:"secondary",clickable:!0})))))},we=n(159),Ce=n(154),Ne=n(155),Re=n(80),Ae=n.n(Re),Ie=n(52),ke=n(79),xe=n.n(ke)()((function(){return Object(k.a)({successSnackBar:{backgroundColor:Ie.a[600]}})}));var Be=function(e){var t=xe();function n(){e.closeCopyLinkSnackBar()}return c.a.createElement(we.a,{anchorOrigin:{vertical:"bottom",horizontal:"center"},open:e.isActive,autoHideDuration:3e3,onClose:n},c.a.createElement(Ce.a,{className:t.successSnackBar,message:c.a.createElement("span",{id:"client-snackbar"},"Link copied to clipboard"),action:[c.a.createElement(Ne.a,{key:"close","aria-label":"close",color:"inherit",onClick:n},c.a.createElement(Ae.a,null))]}))};var _e=Object(l.b)((function(e){return{isActive:e.copyLinkSnackBar.isActive}}),(function(e){return{closeCopyLinkSnackBar:function(){return e({type:v.CLOSE_SNACKBAR})}}}))(Be),He=Object(I.a)((function(e){return Object(k.a)({root:{width:"100vw",maxWidth:"100%",minHeight:"100vh",overflowX:"hidden",paddingBottom:"10px"}})}));var De=Object(l.b)((function(e){return{category:e.category,articles:e.articles}}),(function(e){return{fetchArticlesAfterMount:function(){return e(m(E.HEADLINE))}}}))((function(e){var t=He();return Object(r.useEffect)((function(){e.fetchArticlesAfterMount()}),[]),c.a.createElement(x.a,{className:t.root},c.a.createElement(K,{headers:h,category:e.category}),c.a.createElement(Se,{articles:e.articles}),c.a.createElement(Te,null),c.a.createElement(_e,null))})),Fe=Object(u.d)(y,S,Object(u.a)(s.a));var Ue=function(){return c.a.createElement(l.a,{store:Fe},c.a.createElement(T.a,{theme:A},c.a.createElement(j.a,null),c.a.createElement(De,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(c.a.createElement(Ue,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},86:function(e,t,n){e.exports=n(119)},91:function(e,t,n){}},[[86,1,2]]]);
//# sourceMappingURL=main.c03e4c31.chunk.js.map