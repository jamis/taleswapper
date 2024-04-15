var e={};
/*! @license DOMPurify 3.1.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.1.0/LICENSE */(function(t,n){e=n()})(0,(function(){const{entries:e,setPrototypeOf:t,isFrozen:n,getPrototypeOf:o,getOwnPropertyDescriptor:a}=Object;let{freeze:r,seal:i,create:l}=Object;let{apply:c,construct:s}=typeof Reflect!=="undefined"&&Reflect;r||(r=function freeze(e){return e});i||(i=function seal(e){return e});c||(c=function apply(e,t,n){return e.apply(t,n)});s||(s=function construct(e,t){return new e(...t)});const u=unapply(Array.prototype.forEach);const f=unapply(Array.prototype.pop);const d=unapply(Array.prototype.push);const m=unapply(String.prototype.toLowerCase);const p=unapply(String.prototype.toString);const h=unapply(String.prototype.match);const T=unapply(String.prototype.replace);const g=unapply(String.prototype.indexOf);const y=unapply(String.prototype.trim);const E=unapply(Object.prototype.hasOwnProperty);const S=unapply(RegExp.prototype.test);const _=unconstruct(TypeError);
/**
   * Creates a new function that calls the given function with a specified thisArg and arguments.
   *
   * @param {Function} func - The function to be wrapped and called.
   * @returns {Function} A new function that calls the given function with a specified thisArg and arguments.
   */function unapply(e){return function(t){for(var n=arguments.length,o=new Array(n>1?n-1:0),a=1;a<n;a++)o[a-1]=arguments[a];return c(e,t,o)}}
/**
   * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
   *
   * @param {Function} func - The constructor function to be wrapped and called.
   * @returns {Function} A new function that constructs an instance of the given constructor function with the provided arguments.
   */function unconstruct(e){return function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return s(e,n)}}
/**
   * Add properties to a lookup table
   *
   * @param {Object} set - The set to which elements will be added.
   * @param {Array} array - The array containing elements to be added to the set.
   * @param {Function} transformCaseFunc - An optional function to transform the case of each element before adding to the set.
   * @returns {Object} The modified set with added elements.
   */function addToSet(e,o){let a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:m;t&&t(e,null);let r=o.length;while(r--){let t=o[r];if(typeof t==="string"){const e=a(t);if(e!==t){n(o)||(o[r]=e);t=e}}e[t]=true}return e}
/**
   * Clean up an array to harden against CSPP
   *
   * @param {Array} array - The array to be cleaned.
   * @returns {Array} The cleaned version of the array
   */function cleanArray(e){for(let t=0;t<e.length;t++){const n=E(e,t);n||(e[t]=null)}return e}
/**
   * Shallow clone an object
   *
   * @param {Object} object - The object to be cloned.
   * @returns {Object} A new object that copies the original.
   */function clone(t){const n=l(null);for(const[o,a]of e(t)){const e=E(t,o);e&&(Array.isArray(a)?n[o]=cleanArray(a):a&&typeof a==="object"&&a.constructor===Object?n[o]=clone(a):n[o]=a)}return n}
/**
   * This method automatically checks if the prop is function or getter and behaves accordingly.
   *
   * @param {Object} object - The object to look up the getter function in its prototype chain.
   * @param {String} prop - The property name for which to find the getter function.
   * @returns {Function} The getter function found in the prototype chain or a fallback function.
   */function lookupGetter(e,t){while(e!==null){const n=a(e,t);if(n){if(n.get)return unapply(n.get);if(typeof n.value==="function")return unapply(n.value)}e=o(e)}function fallbackValue(){return null}return fallbackValue}const A=r(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]);const N=r(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]);const b=r(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]);const w=r(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]);const R=r(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]);const D=r(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]);const k=r(["#text"]);const C=r(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]);const O=r(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]);const L=r(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]);const v=r(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]);const x=i(/\{\{[\w\W]*|[\w\W]*\}\}/gm);const M=i(/<%[\w\W]*|[\w\W]*%>/gm);const I=i(/\${[\w\W]*}/gm);const U=i(/^data-[\-\w.\u00B7-\uFFFF]/);const P=i(/^aria-[\-\w]+$/);const F=i(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);const H=i(/^(?:\w+script|data):/i);const z=i(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);const G=i(/^html$/i);const B=i(/^[a-z][.\w]*(-[.\w]+)+$/i);var W=Object.freeze({__proto__:null,MUSTACHE_EXPR:x,ERB_EXPR:M,TMPLIT_EXPR:I,DATA_ATTR:U,ARIA_ATTR:P,IS_ALLOWED_URI:F,IS_SCRIPT_OR_DATA:H,ATTR_WHITESPACE:z,DOCTYPE_NAME:G,CUSTOM_ELEMENT:B});const Y=function getGlobal(){return typeof window==="undefined"?null:window};
/**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param {TrustedTypePolicyFactory} trustedTypes The policy factory.
   * @param {HTMLScriptElement} purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
   * @return {TrustedTypePolicy} The policy created (or null, if Trusted Types
   * are not supported or creating the policy failed).
   */const j=function _createTrustedTypesPolicy(e,t){if(typeof e!=="object"||typeof e.createPolicy!=="function")return null;let n=null;const o="data-tt-policy-suffix";t&&t.hasAttribute(o)&&(n=t.getAttribute(o));const a="dompurify"+(n?"#"+n:"");try{return e.createPolicy(a,{createHTML(e){return e},createScriptURL(e){return e}})}catch(e){console.warn("TrustedTypes policy "+a+" could not be created.");return null}};function createDOMPurify(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Y();const DOMPurify=e=>createDOMPurify(e);DOMPurify.version="3.1.0";DOMPurify.removed=[];if(!t||!t.document||t.document.nodeType!==9){DOMPurify.isSupported=false;return DOMPurify}let{document:n}=t;const o=n;const a=o.currentScript;const{DocumentFragment:i,HTMLTemplateElement:c,Node:s,Element:x,NodeFilter:M,NamedNodeMap:I=t.NamedNodeMap||t.MozNamedAttrMap,HTMLFormElement:U,DOMParser:P,trustedTypes:H}=t;const z=x.prototype;const B=lookupGetter(z,"cloneNode");const X=lookupGetter(z,"nextSibling");const q=lookupGetter(z,"childNodes");const V=lookupGetter(z,"parentNode");if(typeof c==="function"){const e=n.createElement("template");e.content&&e.content.ownerDocument&&(n=e.content.ownerDocument)}let $;let K="";const{implementation:Z,createNodeIterator:J,createDocumentFragment:Q,getElementsByTagName:ee}=n;const{importNode:te}=o;let ne={};DOMPurify.isSupported=typeof e==="function"&&typeof V==="function"&&Z&&Z.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:oe,ERB_EXPR:ae,TMPLIT_EXPR:re,DATA_ATTR:ie,ARIA_ATTR:le,IS_SCRIPT_OR_DATA:ce,ATTR_WHITESPACE:se,CUSTOM_ELEMENT:ue}=W;let{IS_ALLOWED_URI:fe}=W;let de=null;const me=addToSet({},[...A,...N,...b,...R,...k]);let pe=null;const he=addToSet({},[...C,...O,...L,...v]);let Te=Object.seal(l(null,{tagNameCheck:{writable:true,configurable:false,enumerable:true,value:null},attributeNameCheck:{writable:true,configurable:false,enumerable:true,value:null},allowCustomizedBuiltInElements:{writable:true,configurable:false,enumerable:true,value:false}}));let ge=null;let ye=null;let Ee=true;let Se=true;let _e=false;let Ae=true;let Ne=false;let be=true;let we=false;let Re=false;let De=false;let ke=false;let Ce=false;let Oe=false;let Le=true;let ve=false;const xe="user-content-";let Me=true;let Ie=false;let Ue={};let Pe=null;const Fe=addToSet({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let He=null;const ze=addToSet({},["audio","video","img","source","image","track"]);let Ge=null;const Be=addToSet({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]);const We="http://www.w3.org/1998/Math/MathML";const Ye="http://www.w3.org/2000/svg";const je="http://www.w3.org/1999/xhtml";let Xe=je;let qe=false;let Ve=null;const $e=addToSet({},[We,Ye,je],p);let Ke=null;const Ze=["application/xhtml+xml","text/html"];const Je="text/html";let Qe=null;let et=null;const tt=n.createElement("form");const nt=function isRegexOrFunction(e){return e instanceof RegExp||e instanceof Function};
/**
     * _parseConfig
     *
     * @param  {Object} cfg optional config literal
     */const ot=function _parseConfig(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!et||et!==e){e&&typeof e==="object"||(e={});e=clone(e);Ke=Ze.indexOf(e.PARSER_MEDIA_TYPE)===-1?Je:e.PARSER_MEDIA_TYPE;Qe=Ke==="application/xhtml+xml"?p:m;de=E(e,"ALLOWED_TAGS")?addToSet({},e.ALLOWED_TAGS,Qe):me;pe=E(e,"ALLOWED_ATTR")?addToSet({},e.ALLOWED_ATTR,Qe):he;Ve=E(e,"ALLOWED_NAMESPACES")?addToSet({},e.ALLOWED_NAMESPACES,p):$e;Ge=E(e,"ADD_URI_SAFE_ATTR")?addToSet(clone(Be),e.ADD_URI_SAFE_ATTR,Qe):Be;He=E(e,"ADD_DATA_URI_TAGS")?addToSet(clone(ze),e.ADD_DATA_URI_TAGS,Qe):ze;Pe=E(e,"FORBID_CONTENTS")?addToSet({},e.FORBID_CONTENTS,Qe):Fe;ge=E(e,"FORBID_TAGS")?addToSet({},e.FORBID_TAGS,Qe):{};ye=E(e,"FORBID_ATTR")?addToSet({},e.FORBID_ATTR,Qe):{};Ue=!!E(e,"USE_PROFILES")&&e.USE_PROFILES;Ee=e.ALLOW_ARIA_ATTR!==false;Se=e.ALLOW_DATA_ATTR!==false;_e=e.ALLOW_UNKNOWN_PROTOCOLS||false;Ae=e.ALLOW_SELF_CLOSE_IN_ATTR!==false;Ne=e.SAFE_FOR_TEMPLATES||false;be=e.SAFE_FOR_XML!==false;we=e.WHOLE_DOCUMENT||false;ke=e.RETURN_DOM||false;Ce=e.RETURN_DOM_FRAGMENT||false;Oe=e.RETURN_TRUSTED_TYPE||false;De=e.FORCE_BODY||false;Le=e.SANITIZE_DOM!==false;ve=e.SANITIZE_NAMED_PROPS||false;Me=e.KEEP_CONTENT!==false;Ie=e.IN_PLACE||false;fe=e.ALLOWED_URI_REGEXP||F;Xe=e.NAMESPACE||je;Te=e.CUSTOM_ELEMENT_HANDLING||{};e.CUSTOM_ELEMENT_HANDLING&&nt(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(Te.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck);e.CUSTOM_ELEMENT_HANDLING&&nt(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(Te.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck);e.CUSTOM_ELEMENT_HANDLING&&typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements==="boolean"&&(Te.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements);Ne&&(Se=false);Ce&&(ke=true);if(Ue){de=addToSet({},k);pe=[];if(Ue.html===true){addToSet(de,A);addToSet(pe,C)}if(Ue.svg===true){addToSet(de,N);addToSet(pe,O);addToSet(pe,v)}if(Ue.svgFilters===true){addToSet(de,b);addToSet(pe,O);addToSet(pe,v)}if(Ue.mathMl===true){addToSet(de,R);addToSet(pe,L);addToSet(pe,v)}}if(e.ADD_TAGS){de===me&&(de=clone(de));addToSet(de,e.ADD_TAGS,Qe)}if(e.ADD_ATTR){pe===he&&(pe=clone(pe));addToSet(pe,e.ADD_ATTR,Qe)}e.ADD_URI_SAFE_ATTR&&addToSet(Ge,e.ADD_URI_SAFE_ATTR,Qe);if(e.FORBID_CONTENTS){Pe===Fe&&(Pe=clone(Pe));addToSet(Pe,e.FORBID_CONTENTS,Qe)}Me&&(de["#text"]=true);we&&addToSet(de,["html","head","body"]);if(de.table){addToSet(de,["tbody"]);delete ge.tbody}if(e.TRUSTED_TYPES_POLICY){if(typeof e.TRUSTED_TYPES_POLICY.createHTML!=="function")throw _('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof e.TRUSTED_TYPES_POLICY.createScriptURL!=="function")throw _('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');$=e.TRUSTED_TYPES_POLICY;K=$.createHTML("")}else{$===void 0&&($=j(H,a));$!==null&&typeof K==="string"&&(K=$.createHTML(""))}r&&r(e);et=e}};const at=addToSet({},["mi","mo","mn","ms","mtext"]);const rt=addToSet({},["foreignobject","desc","title","annotation-xml"]);const it=addToSet({},["title","style","font","a","script"]);const lt=addToSet({},[...N,...b,...w]);const ct=addToSet({},[...R,...D]);
/**
     * @param  {Element} element a DOM element whose namespace is being checked
     * @returns {boolean} Return false if the element has a
     *  namespace that a spec-compliant parser would never
     *  return. Return true otherwise.
     */const st=function _checkValidNamespace(e){let t=V(e);t&&t.tagName||(t={namespaceURI:Xe,tagName:"template"});const n=m(e.tagName);const o=m(t.tagName);return!!Ve[e.namespaceURI]&&(e.namespaceURI===Ye?t.namespaceURI===je?n==="svg":t.namespaceURI===We?n==="svg"&&(o==="annotation-xml"||at[o]):Boolean(lt[n]):e.namespaceURI===We?t.namespaceURI===je?n==="math":t.namespaceURI===Ye?n==="math"&&rt[o]:Boolean(ct[n]):e.namespaceURI===je?!(t.namespaceURI===Ye&&!rt[o])&&(!(t.namespaceURI===We&&!at[o])&&(!ct[n]&&(it[n]||!lt[n]))):!(Ke!=="application/xhtml+xml"||!Ve[e.namespaceURI]))};
/**
     * _forceRemove
     *
     * @param  {Node} node a DOM node
     */const ut=function _forceRemove(e){d(DOMPurify.removed,{element:e});try{e.parentNode.removeChild(e)}catch(t){e.remove()}};
/**
     * _removeAttribute
     *
     * @param  {String} name an Attribute name
     * @param  {Node} node a DOM node
     */const ft=function _removeAttribute(e,t){try{d(DOMPurify.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){d(DOMPurify.removed,{attribute:null,from:t})}t.removeAttribute(e);if(e==="is"&&!pe[e])if(ke||Ce)try{ut(t)}catch(e){}else try{t.setAttribute(e,"")}catch(e){}};
/**
     * _initDocument
     *
     * @param  {String} dirty a string of dirty markup
     * @return {Document} a DOM, filled with the dirty markup
     */const dt=function _initDocument(e){let t=null;let o=null;if(De)e="<remove></remove>"+e;else{const t=h(e,/^[\r\n\t ]+/);o=t&&t[0]}Ke==="application/xhtml+xml"&&Xe===je&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");const a=$?$.createHTML(e):e;if(Xe===je)try{t=(new P).parseFromString(a,Ke)}catch(e){}if(!t||!t.documentElement){t=Z.createDocument(Xe,"template",null);try{t.documentElement.innerHTML=qe?K:a}catch(e){}}const r=t.body||t.documentElement;e&&o&&r.insertBefore(n.createTextNode(o),r.childNodes[0]||null);return Xe===je?ee.call(t,we?"html":"body")[0]:we?t.documentElement:r};
/**
     * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
     *
     * @param  {Node} root The root element or node to start traversing on.
     * @return {NodeIterator} The created NodeIterator
     */const mt=function _createNodeIterator(e){return J.call(e.ownerDocument||e,e,M.SHOW_ELEMENT|M.SHOW_COMMENT|M.SHOW_TEXT|M.SHOW_PROCESSING_INSTRUCTION|M.SHOW_CDATA_SECTION,null)};
/**
     * _isClobbered
     *
     * @param  {Node} elm element to check for clobbering attacks
     * @return {Boolean} true if clobbered, false if safe
     */const pt=function _isClobbered(e){return e instanceof U&&(typeof e.nodeName!=="string"||typeof e.textContent!=="string"||typeof e.removeChild!=="function"||!(e.attributes instanceof I)||typeof e.removeAttribute!=="function"||typeof e.setAttribute!=="function"||typeof e.namespaceURI!=="string"||typeof e.insertBefore!=="function"||typeof e.hasChildNodes!=="function")};
/**
     * Checks whether the given object is a DOM node.
     *
     * @param  {Node} object object to check whether it's a DOM node
     * @return {Boolean} true is object is a DOM node
     */const ht=function _isNode(e){return typeof s==="function"&&e instanceof s};
/**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode node to work on with the hook
     * @param  {Object} data additional hook parameters
     */const Tt=function _executeHook(e,t,n){ne[e]&&u(ne[e],(e=>{e.call(DOMPurify,t,n,et)}))};
/**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   {Node} currentNode to check for permission to exist
     * @return  {Boolean} true if node was killed, false if left alive
     */const gt=function _sanitizeElements(e){let t=null;Tt("beforeSanitizeElements",e,null);if(pt(e)){ut(e);return true}const n=Qe(e.nodeName);Tt("uponSanitizeElement",e,{tagName:n,allowedTags:de});if(e.hasChildNodes()&&!ht(e.firstElementChild)&&S(/<[/\w]/g,e.innerHTML)&&S(/<[/\w]/g,e.textContent)){ut(e);return true}if(e.nodeType===7){ut(e);return true}if(be&&e.nodeType===8&&S(/<[/\w]/g,e.data)){ut(e);return true}if(!de[n]||ge[n]){if(!ge[n]&&Et(n)){if(Te.tagNameCheck instanceof RegExp&&S(Te.tagNameCheck,n))return false;if(Te.tagNameCheck instanceof Function&&Te.tagNameCheck(n))return false}if(Me&&!Pe[n]){const t=V(e)||e.parentNode;const n=q(e)||e.childNodes;if(n&&t){const o=n.length;for(let a=o-1;a>=0;--a)t.insertBefore(B(n[a],true),X(e))}}ut(e);return true}if(e instanceof x&&!st(e)){ut(e);return true}if((n==="noscript"||n==="noembed"||n==="noframes")&&S(/<\/no(script|embed|frames)/i,e.innerHTML)){ut(e);return true}if(Ne&&e.nodeType===3){t=e.textContent;u([oe,ae,re],(e=>{t=T(t,e," ")}));if(e.textContent!==t){d(DOMPurify.removed,{element:e.cloneNode()});e.textContent=t}}Tt("afterSanitizeElements",e,null);return false};
/**
     * _isValidAttribute
     *
     * @param  {string} lcTag Lowercase tag name of containing element.
     * @param  {string} lcName Lowercase attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid, otherwise false.
     */const yt=function _isValidAttribute(e,t,o){if(Le&&(t==="id"||t==="name")&&(o in n||o in tt))return false;if(Se&&!ye[t]&&S(ie,t));else if(Ee&&S(le,t));else if(!pe[t]||ye[t]){if(!(Et(e)&&(Te.tagNameCheck instanceof RegExp&&S(Te.tagNameCheck,e)||Te.tagNameCheck instanceof Function&&Te.tagNameCheck(e))&&(Te.attributeNameCheck instanceof RegExp&&S(Te.attributeNameCheck,t)||Te.attributeNameCheck instanceof Function&&Te.attributeNameCheck(t))||t==="is"&&Te.allowCustomizedBuiltInElements&&(Te.tagNameCheck instanceof RegExp&&S(Te.tagNameCheck,o)||Te.tagNameCheck instanceof Function&&Te.tagNameCheck(o))))return false}else if(Ge[t]);else if(S(fe,T(o,se,"")));else if(t!=="src"&&t!=="xlink:href"&&t!=="href"||e==="script"||g(o,"data:")!==0||!He[e]){if(_e&&!S(ce,T(o,se,"")));else if(o)return false}else;return true};
/**
     * _isBasicCustomElement
     * checks if at least one dash is included in tagName, and it's not the first char
     * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
     *
     * @param {string} tagName name of the tag of the node to sanitize
     * @returns {boolean} Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
     */const Et=function _isBasicCustomElement(e){return e!=="annotation-xml"&&h(e,ue)};
/**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param  {Node} currentNode to sanitize
     */const St=function _sanitizeAttributes(e){Tt("beforeSanitizeAttributes",e,null);const{attributes:t}=e;if(!t)return;const n={attrName:"",attrValue:"",keepAttr:true,allowedAttributes:pe};let o=t.length;while(o--){const a=t[o];const{name:r,namespaceURI:i,value:l}=a;const c=Qe(r);let s=r==="value"?l:y(l);n.attrName=c;n.attrValue=s;n.keepAttr=true;n.forceKeepAttr=void 0;Tt("uponSanitizeAttribute",e,n);s=n.attrValue;if(n.forceKeepAttr)continue;ft(r,e);if(!n.keepAttr)continue;if(!Ae&&S(/\/>/i,s)){ft(r,e);continue}Ne&&u([oe,ae,re],(e=>{s=T(s,e," ")}));const d=Qe(e.nodeName);if(yt(d,c,s)){if(ve&&(c==="id"||c==="name")){ft(r,e);s=xe+s}if($&&typeof H==="object"&&typeof H.getAttributeType==="function")if(i);else switch(H.getAttributeType(d,c)){case"TrustedHTML":s=$.createHTML(s);break;case"TrustedScriptURL":s=$.createScriptURL(s);break}try{i?e.setAttributeNS(i,r,s):e.setAttribute(r,s);f(DOMPurify.removed)}catch(e){}}}Tt("afterSanitizeAttributes",e,null)};
/**
     * _sanitizeShadowDOM
     *
     * @param  {DocumentFragment} fragment to iterate over recursively
     */const _t=function _sanitizeShadowDOM(e){let t=null;const n=mt(e);Tt("beforeSanitizeShadowDOM",e,null);while(t=n.nextNode()){Tt("uponSanitizeShadowNode",t,null);if(!gt(t)){t.content instanceof i&&_sanitizeShadowDOM(t.content);St(t)}}Tt("afterSanitizeShadowDOM",e,null)};
/**
     * Sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} cfg object
     */DOMPurify.sanitize=function(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};let n=null;let a=null;let r=null;let l=null;qe=!e;qe&&(e="\x3c!--\x3e");if(typeof e!=="string"&&!ht(e)){if(typeof e.toString!=="function")throw _("toString is not a function");e=e.toString();if(typeof e!=="string")throw _("dirty is not a string, aborting")}if(!DOMPurify.isSupported)return e;Re||ot(t);DOMPurify.removed=[];typeof e==="string"&&(Ie=false);if(Ie){if(e.nodeName){const t=Qe(e.nodeName);if(!de[t]||ge[t])throw _("root node is forbidden and cannot be sanitized in-place")}}else if(e instanceof s){n=dt("\x3c!----\x3e");a=n.ownerDocument.importNode(e,true);a.nodeType===1&&a.nodeName==="BODY"||a.nodeName==="HTML"?n=a:n.appendChild(a)}else{if(!ke&&!Ne&&!we&&e.indexOf("<")===-1)return $&&Oe?$.createHTML(e):e;n=dt(e);if(!n)return ke?null:Oe?K:""}n&&De&&ut(n.firstChild);const c=mt(Ie?e:n);while(r=c.nextNode())if(!gt(r)){r.content instanceof i&&_t(r.content);St(r)}if(Ie)return e;if(ke){if(Ce){l=Q.call(n.ownerDocument);while(n.firstChild)l.appendChild(n.firstChild)}else l=n;(pe.shadowroot||pe.shadowrootmode)&&(l=te.call(o,l,true));return l}let f=we?n.outerHTML:n.innerHTML;we&&de["!doctype"]&&n.ownerDocument&&n.ownerDocument.doctype&&n.ownerDocument.doctype.name&&S(G,n.ownerDocument.doctype.name)&&(f="<!DOCTYPE "+n.ownerDocument.doctype.name+">\n"+f);Ne&&u([oe,ae,re],(e=>{f=T(f,e," ")}));return $&&Oe?$.createHTML(f):f};
/**
     * Public method to set the configuration once
     * setConfig
     *
     * @param {Object} cfg configuration object
     */DOMPurify.setConfig=function(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};ot(e);Re=true};DOMPurify.clearConfig=function(){et=null;Re=false};
/**
     * Public method to check if an attribute value is valid.
     * Uses last set config, if any. Otherwise, uses config defaults.
     * isValidAttribute
     *
     * @param  {String} tag Tag name of containing element.
     * @param  {String} attr Attribute name.
     * @param  {String} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
     */DOMPurify.isValidAttribute=function(e,t,n){et||ot({});const o=Qe(e);const a=Qe(t);return yt(o,a,n)};
/**
     * AddHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint entry point for the hook to add
     * @param {Function} hookFunction function to execute
     */DOMPurify.addHook=function(e,t){if(typeof t==="function"){ne[e]=ne[e]||[];d(ne[e],t)}};
/**
     * RemoveHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint entry point for the hook to remove
     * @return {Function} removed(popped) hook
     */DOMPurify.removeHook=function(e){if(ne[e])return f(ne[e])};
/**
     * RemoveHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint entry point for the hooks to remove
     */DOMPurify.removeHooks=function(e){ne[e]&&(ne[e]=[])};DOMPurify.removeAllHooks=function(){ne={}};return DOMPurify}var X=createDOMPurify();return X}));var t=e;export{t as default};

