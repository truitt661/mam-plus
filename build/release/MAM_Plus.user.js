// ==UserScript==
// @name         MAM Plus
// @namespace    https://github.com/gardenshade
// @version      3.0.8
// @description  Lots of tiny fixes for MAM
// @author       GardenShade
// @include      https://myanonamouse.net/*
// @include      https://www.myanonamouse.net/*
// @icon         http://i.imgur.com/dX44pSv.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_info
// ==/UserScript==
var MP={},MP_DEBUG=!!GM_getValue("mp_debug");try{var MP_CHECK;MP_CHECK={version:function(){!0===MP_DEBUG&&(console.group("MP_CHECK.version()"),console.log("PREV_VER: "+MP.PREV_VER),console.log("VERSION: "+MP.VERSION)),MP.PREV_VER!==MP.VERSION&&(!0===MP_DEBUG&&console.log("Dif versions; making notification..."),MP.PREV_VER?(!0===MP_DEBUG&&console.log("Not a first-time run"),!0===MP_DEBUG&&console.log("mp_alerts: "+GM_getValue("mp_alerts")),!0===GM_getValue("mp_alerts")&&MP.triggerNote("update")):(!0===MP_DEBUG&&console.log("First-time run"),GM_setValue("mp_gr_btns",!0),GM_setValue("mp_alerts",!0),MP.triggerNote("firstRun")),GM_setValue("mp_version",MP.VERSION),!0===MP_DEBUG&&console.groupEnd())},page:function(e){var t,o,n;if(MP_PAGE.global(),o=e.split("/")[1],n=e.split("/")[2],t={"":MP_PAGE.home,shoutbox:MP_PAGE.shoutbox,t:MP_PAGE.torrent,preferences:MP_PAGE.settings,u:MP_PAGE.user,tor:function(){if(0===n.indexOf("browse")&&MP_PAGE.browse("browse"),0===n.indexOf("request"))return MP_PAGE.browse("requests")},millionaires:function(){if(0===n.indexOf("pot")&&MP_PAGE.vault("pot"),0===n.indexOf("donate"))return MP_PAGE.vault("donate")}},t[o])return t[o]()}};var MP_HELPERS;MP_HELPERS={setAttr:function(e,t){var o;for(o in t)e.setAttribute(o,t[o])},insertAfter:function(e,t){return t.parentNode.insertBefore(e,t.nextSibling)},count:function(e,t){var o,n,r;for(r=[-1,0],o=r[0],n=r[1];-1!==n;)n=e.indexOf(t,n+1),o++;return o},reportCount:function(e,t,o){return 1!==t&&(o+="s"),console.log(">",e,t,o)},redoSpaces:function(e){return this.arrToStr(this.strToArr(e,"ws"),!0)},arrToStr:function(e,t){var o,n,r;for(n=[0,""],o=n[0],r=n[1];o<e.length;)r+=e[o],t&&o+1!==e.length&&(r+=" "),o++;return r},strToArr:function(e,t){var o,n,r,i;for(i=[],e=null!=t&&"ws"!==t?e.split(t):e=e.match(/\S+/g)||[],n=0,r=e.length;n<r;n++)o=e[n],i.push(o);return i},trimStr:function(e,t){return e.length>t&&(e=e.substring(0,t+1),e=e.substring(0,Math.min(e.length,e.lastIndexOf(" ")))),e},bracketRemover:function(e){return e.replace(/{+.*?}+/g,"").replace(/\[\[|\]\]/g,"").replace(/<.*?>/g,"").replace(/\(.*?\)/g,"").trim()},pageLoad:function(e,t){var o,n,r;r=!1,n=setTimeout(function(){return!0===MP_DEBUG&&console.log("Page has timed out"),r=!0,e()},t);try{return document.onreadystatechange=function(){if("completed"===document.readyState)return!0===MP_DEBUG&&console.log("Page has loaded"),clearTimeout(n),e()}}catch(e){if(o=e,!0===MP_DEBUG)return console.warn(o)}}};var MP_PAGE;MP_PAGE={global:function(){var e,t;return console.group("Applying Global settings..."),t=document.querySelector("#millionInfo"),document.querySelector("#preNav .tP"),GM_getValue("mp_hide_banner")&&(document.body.classList.add("mp_hide_banner"),console.log("[M+] Hid the banner image!")),GM_getValue("mp_hide_home")&&(document.body.classList.add("mp_hide_home"),console.log("[M+] Hid the home button!")),GM_getValue("mp_hide_browse")&&(document.body.classList.add("mp_hide_browse"),console.log("[M+] Hid the browse button!")),GM_getValue("mp_vault_link")&&(t.setAttribute("href","/millionaires/donate.php"),console.log("[M+] Made the vault text link to the donate page!")),GM_getValue("mp_short_info")&&(e=parseInt(t.textContent.split(":")[1].split(" ")[1].replace(/,/g,"")),e=(e/1e6).toFixed(3),t.textContent="Vault: "+e+" million",console.log("[M+] Shortened the vault number!")),console.groupEnd()},home:function(){return console.group("Applying Home settings..."),MP.initShoutbox(),console.groupEnd()},shoutbox:function(){return console.group("Applying Shoutbox settings..."),MP.initShoutbox(),console.groupEnd()},browse:function(e){return console.group("Applying ("+e+") settings..."),"browse"===e&&MP.processResults(),"requests"===e&&console.log("No functions for requests"),console.groupEnd()},torrent:function(){var e,t,o,n,r,i,s,l,a,c;if(console.group("Applying Torrent settings..."),e=document.querySelectorAll("#mainBody tr:nth-child(2) td:last-of-type a"),i=document.querySelector("#mainBody h1"),l=document.querySelector("#mainBody tr:nth-child(3) td:last-of-type a"),t=document.querySelector("#posterImage"),c=Number(MP.pagePath.split("/")[2]),o=MP_HELPERS.redoSpaces(i.textContent),!0===MP_DEBUG)for(s=[e,i,l,t,c,o],n=0,r=s.length;n<r;n++)a=s[n],console.log("Extracting...",a);return GM_getValue("mp_gr_btns")&&MP.addGoodreadsBtns(e,o,l),GM_getValue("mp_move_bookmark")&&(MP.moveBookmark(i,c),setInterval(function(){return MP.moveBookmark(i,c)},100),console.log("[M+] Updated the bookmark icon!")),GM_getValue("mp_placeholder_covers")&&!t.querySelector("img")&&MP.fakeCover(t,"missing"),"false"!==GM_getValue("mp_simple_download")&&void 0!==GM_getValue("mp_simple_download")&&MP.simpleDownload(GM_getValue("mp_simple_download")),console.groupEnd()},settings:function(){var e;if(console.group("Applying Preference Page settings..."),e=window.location.href,!0!==e.endsWith("preferences/index.php")&&!0!==e.endsWith("?view=general"))throw"Page is "+e;return!0===MP_DEBUG&&console.log("On General Settings page"),MP.insertSettings(),console.groupEnd()},user:function(){var e,t;return console.group("Applying User Page settings..."),GM_getValue("mp_gift_default")&&null!=(t=document.querySelector("#bonusgift"))&&(e=t.getAttribute("max"),t.value=e,console.log("[M+] Set the default gift amount to "+e)),console.groupEnd()},vault:function(e){var t,o,n,r,i;return console.group("Applying Vault ("+e+") settings..."),i=document.querySelector("#mainBody"),GM_getValue("mp_simple_vault")&&(t=i.querySelector("form"),o=i.querySelector("table:last-of-type"),i.innerHTML="",null!=t?(n=t.cloneNode(!0),i.appendChild(n),n.classList.add("mp_vaultClone")):i.innerHTML="<h1>Come back tomorrow!</h1>",null!=o?(r=o.cloneNode(!0),i.appendChild(r),r.classList.add("mp_vaultClone")):i.style.paddingBottom="25px",console.log("[M+] Simplified the vault page!")),console.groupEnd()}};var MP_SETTINGS;MP_SETTINGS={global:{pageTitle:"Global",alerts:{id:"mp_alerts",type:"checkbox",desc:"Enable the MAM+ Alert panel for update information, etc."},hideBanner:{id:"mp_hide_banner",type:"checkbox",desc:"Remove the header image. (<em>Not recommended if the below is enabled</em>)"},hideHome:{id:"mp_hide_home",type:"checkbox",desc:"Remove the home button. (<em>Not recommended if the above is enabled</em>)"},hideBrowse:{id:"mp_hide_browse",type:"checkbox",desc:"Remove the Browse button, because Browse &amp; Search are the same"},vaultLink:{id:"mp_vault_link",type:"checkbox",desc:"Make the Vault link bypass the Vault Info page"},shortInfo:{id:"mp_short_info",type:"checkbox",desc:"Shorten the Vault link text"}},browse:{pageTitle:"Browse &amp; Search",hideSnatched:{id:"mp_hide_snatched",type:"checkbox",desc:"Enable the Hide Snatched button"}},torrent:{pageTitle:"Torrent Page",grBtn:{id:"mp_gr_btns",type:"checkbox",desc:"Enable the MAM-to-Goodreads buttons"},moveBookmark:{id:"mp_move_bookmark",type:"checkbox",desc:"Replace the bookmark icon with a new graphic"},placeholderCovers:{id:"mp_placeholder_covers",type:"checkbox",desc:"Display a placeholder cover for torrents with no picture"},simpleDownload:{id:"mp_simple_download",type:"dropdown",tag:"Simple DL Button",options:{false:"Disabled",tor:"Torrent Only",zip:"Zip Only"},desc:"Option to show only one download link. (<em>Also makes the button more visible</em>)"}},shoutbox:{pageTitle:"Shoutbox",blockUsers:{id:"mp_block_users",type:"textbox",tag:"Block Users",desc:"Hides messages from the listed users in the shoutbox",placeholder:"ex. 1234, 108303, 10000"},priorityUsers:{id:"mp_priority_users",type:"textbox",tag:"Emphasize Users",desc:"Emphasizes messages from the listed users in the shoutbox",placeholder:"ex. 6, 25420, 77618"},priorityStyle:{id:"mp_priority_style",type:"textbox",tag:"Emphasis Style",desc:"Change the color/opacity of the highlighting rule for emphasized users' posts.<br>(<em>This is formatted as R,G,B,Opacity. RGB are 0-255 and Opacity is 0-1</em>)",placeholder:"default: 125, 125, 125, 0.3"}},vault:{pageTitle:"Mil. Vault",simpleVault:{id:"mp_simple_vault",type:"checkbox",desc:"Simplify the Vault pages. (<em>This removes everything except the donate button &amp; list of recent donations</em>)"}},user:{pageTitle:"User Pages",giftDefault:{id:"mp_gift_default",type:"checkbox",desc:"Select the largest possible gift amount by default"}},other:{pageTitle:"Other",debug:{id:"mp_debug",type:"checkbox",desc:"Error log (<em>Click this checkbox to enable verbose logging to the console</em>)"}}};var MP_STYLE;MP_STYLE={setStyle:function(){var e;return e=document.querySelector('head link[href*="ICGstation"]').getAttribute("href"),e.indexOf("dark")>0&&(this.theme="dark",this.btnBorder="1px solid #bbaa77",this.btnColor="#aaa",this.phColor="#8d5d5d"),GM_addStyle(".mp_notification{\n    position: fixed;\n    padding: 20px 40px;\n    width: 100%;\n    bottom:0;\n    left:0;\n    background: #333;\n    color: #bbb;\n    box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);\n    z-index: 99998;\n}\n.mp_notification span{\n    position: absolute;\n    padding: 5px 10px;\n    display: inline-block;\n    top: -10px;\n    right: 90px;\n    background: #333;\n    color: red;\n    box-shadow: 0 0 4px 0 rgba(0,0,0,0.3);\n    border-radius: 50px;\n    cursor: pointer;\n    z-index: 99999;\n}\n.mp_hide_banner #header{\n    visibility: hidden;\n    height: 10px;\n}\n.mp_hide_home #menu .homeLink{\n    display: none;\n}\n.mp_hide_browse #menu .mmTorrents li:first-of-type{\n    display: none;\n}\n.mp_setTag{\n    display: inline-block;\n    min-width:120px;\n}\n.mp_textInput,\n.mp_dropInput{\n    padding: 5px;\n    margin-right: 5px;\n    margin-top: 5px;\n}\n.mp_textInput ~ .mp_textInput{\n    margin-top: 0;\n}\n.mp_textInput::placeholder{\n    color: "+this.phColor+";\n}\n#mp_submit{\n    border: "+this.btnBorder+";\ncolor: "+this.btnColor+";\nbackground-image: "+this.btnBack+";\n    box-sizing: border-box;\n    padding: 0 8px;\n    display: inline-block;\n    height: 25px;\n    line-height: 25px;\n    cursor: pointer;\n}\n#mp_submit ~ .mp_savestate{\n    font-weight: bold;\n    color: green;\n    padding: 0 20px;\n    cursor: default;\n}\na.mp_button_clone{\n    border: "+this.btnBorder+";\ncolor: "+this.btnColor+";\nbackground-image: "+this.btnBack+';\n    box-sizing: border-box;\n    padding: 0 4px;\n}\n#mp_bookmark{\n    display: inline-block;\n    position: relative;\n    top: 3px;\n    padding-left: 20px;\n}\n.mp_cover{\n    display: inline-block;\n    width: 130px;\n    height: 200px;\n    line-height: 200px;\n    background: #333;\n    color: #777;\n    text-align: center;\n}\n.mp_vaultClone{\n    margin-top: 20px;\n}\n.mp_vaultClone input,.mp_vaultClone select{\n    font-size: 1.5em;\n    display: inline-block;\n    margin-right: 10px;\n}\n.mp_vaultClone br{\n    display: none;\n}\na[class^="mp_mark_"]{\n    position:relative;\n    top:4px;\n    left:5px;\n}\n.mp_formButton{\n    display:inline;\n    border-color: '+this.btnColor+';\n}\na[id^="torBookmark"].mp_mark_dark{\n    background:url(//cdn.myanonamouse.net/imagebucket/108303_mark_white.gif) no-repeat;\n    \n}\na[id^="torBookmark"].mp_mark_light{\n    background:url(//cdn.myanonamouse.net/imagebucket/108303_mark_black.gif) no-repeat;\n}\na[id^="torDeBookmark"].mp_mark_dark{\n    background:url(//cdn.myanonamouse.net/imagebucket/108303/mark_white_del.gif) no-repeat;\n    \n}\na[id^="torDeBookmark"].mp_mark_light{\n    background:url(//cdn.myanonamouse.net/imagebucket/108303/mark_black_del.gif) no-repeat;\n}'),this.theme}};var MP;MP={VERSION:GM_info.script.version,PREV_VER:GM_getValue("mp_version"),TIMESTAMP:"Nov 17th",UPDATE_LIST:["Fixed an issue where the Simple DL Button wasn't 100% clickable"],BUG_LIST:[],errorLog:[],pagePath:window.location.pathname,run:function(){return console.group("Welcome to MAM+ v"+this.VERSION+"!"),document.cookie="mp_enabled=1;domain=myanonamouse.net;path=/",MP_STYLE.setStyle(),console.log("Theme is "+MP_STYLE.theme),MP_CHECK.version(),MP_CHECK.page(this.pagePath),console.groupEnd()},triggerNote:function(e){var t,o,n;if(!0===MP_DEBUG&&(console.group("MP.triggerNote()"),console.log("Note type is "+e)),t=function(e,t){var n,r,i;if(!0===MP_DEBUG&&console.log("buildMsg("+t+")"),e.length>0&&""!==e[0]){for(o+="<h4>"+t+":</h4><ul>",r=0,i=e.length;r<i;r++)n=e[r],o+="<li>"+n+"</li>";o+="</ul>"}},n=function(e){var t,o,n;!0===MP_DEBUG&&console.log("showPanel()"),document.body.innerHTML+="<div class='mp_notification'>"+e+"<span>X</span></div>",n=document.querySelector(".mp_notification"),t=n.querySelector("span");try{return t.addEventListener("click",function(){return n.remove()},!1)}catch(e){return o=e,!0===MP_DEBUG&&console.warn(o),!1}},o="","update"===e?(!0===MP_DEBUG&&console.log("update confirmed"),o+="<strong>MAM+ has been updated!</strong> You are now using v"+MP.VERSION+", published on "+MP.TIMESTAMP+". Discuss it on <a href='forums.php?action=viewtopic&topicid=41863'>the forums</a>.<hr>",t(MP.UPDATE_LIST,"Changes"),t(MP.BUG_LIST,"New Bugs")):"firstRun"===e&&(!0===MP_DEBUG&&console.log("firstRun confirmed"),o+='<h4>Welcome to MAM+!</h4>Please head over to your <a href="/preferences/index.php">preferences</a> to enable the MAM+ settings.<br>Any bug reports, feature requests, etc. can be made on <a href="/forums.php?action=viewtopic&topicid=41863">the forums</a> or <a href="/sendmessage.php?receiver=108303">through private message</a>.'),n(o),!0===MP_DEBUG)return console.groupEnd()},insertSettings:function(){var e,t,o,n,r,i,s,l,a,c;!0===MP_DEBUG&&console.group("MP.insertSettings()"),e=function(e){var t;return t='<tbody><tr><td class="row1" colspan="2">Here you can enable &amp; disable any feature from the <a href="/forums.php?action=viewtopic&topicid=41863&page=p376355#376355">MAM+ userscript</a>! However, these settings are <strong>NOT</strong> stored on MAM; they are stored within the Tampermonkey/Greasemonkey extension in your browser, and must be customized on each of your browsers/devices separately.</td></tr>',Object.keys(e).forEach(function(o){return t+="<tr><td class='row2'>"+e[o].pageTitle+"</td><td class='row1'>",Object.keys(e[o]).forEach(function(n){var r,i;if(i=e[o][n],r={checkbox:function(){return t+="<input type='checkbox' id='"+i.id+"' value='true'>"+i.desc+"<br>"},textbox:function(){return t+="<span class='mp_setTag'>"+i.tag+":</span> <input type='text' id='"+i.id+"' placeholder='"+i.placeholder+"' class='mp_textInput' size='25'>"+i.desc+"<br>"},dropdown:function(){var e,o,n;t+="<span class='mp_setTag'>"+i.tag+":</span> <select id='"+i.id+"' class='mp_dropInput'>",o=i.options;for(e in o)n=o[e],t+="<option value='"+e+"'>"+n+"</option>";return t+="</select>"+i.desc+"<br>"}},r[i.type])return r[i.type]()}),t+="</td></tr>"}),t+='<tr><td class="row1" colspan="2"><div id="mp_submit">Save M+ Settings</div><span class="mp_savestate" style="opacity:0">Saved!</span></td></tr></tbody>'},o=function(e){if(!0===MP_DEBUG&&console.group("getSettings()"),Object.keys(e).forEach(function(t){return Object.keys(e[t]).forEach(function(o){var n,r,i;if(null!==(i=e[t][o])&&"object"==typeof i&&(r=document.getElementById(i.id),n={checkbox:function(){return r.setAttribute("checked","checked")},textbox:function(){return r.value=GM_getValue(i.id+"_val")},dropdown:function(){return r.value=GM_getValue(""+i.id)}},n[i.type]&&GM_getValue(i.id)))return n[i.type]()})}),!0===MP_DEBUG)return console.endGroup},r=function(e){if(!0===MP_DEBUG&&console.group("setSettings()"),Object.keys(e).forEach(function(t){return Object.keys(e[t]).forEach(function(o){var n,r,i;if(null!==(i=e[t][o])&&"object"==typeof i&&(r=document.getElementById(i.id),n={checkbox:function(){if(r.checked)return GM_setValue(i.id,!0)},textbox:function(){var e;if(""!==(e=r.value))return GM_setValue(i.id,!0),GM_setValue(i.id+"_val",e)},dropdown:function(){return GM_setValue(i.id,r.value)}},n[i.type]))return n[i.type]()})}),!0===MP_DEBUG)return console.endGroup},n=function(e){var t,o,n;console.group("saveSettings()"),n=document.querySelector(".mp_savestate"),n.style.opacity="0",window.clearTimeout(e),console.log("Saving...");for(o in GM_listValues())"mp_version"!==GM_listValues()[o]&&GM_setValue(GM_listValues()[o],!1);console.log("Known settings:",GM_listValues()),r(MP_SETTINGS),console.log("Saved!"),n.style.opacity="1";try{e=window.setTimeout(function(){return n.style.opacity="0"},2345)}catch(e){t=e,!0===MP_DEBUG&&console.warn(t)}return console.endGroup},i=document.querySelector("#mainBody > table"),l=document.createElement("h1"),s=document.createElement("table"),MP_HELPERS.insertAfter(l,i),MP_HELPERS.insertAfter(s,l),MP_HELPERS.setAttr(s,{class:"coltable",cellspacing:"1",style:"width:100%;min-width:100%;max-width:100%;"}),l.innerHTML="MAM+ Settings",s.innerHTML=e(MP_SETTINGS),o(MP_SETTINGS),a="",c=document.querySelector("#mp_submit");try{c.addEventListener("click",function(){return n(a)},!1)}catch(e){t=e,!0===MP_DEBUG&&console.warn(t)}return!0===MP_DEBUG&&console.groupEnd(),console.log("[M+] Added the MAM+ Settings table!")},processResults:function(){var e,t,o;if(!0===MP_DEBUG&&console.log("processResults()"),o=!0,t=function(e,t){var n,r,i,s;console.log("toggling snatched"),s=document.querySelectorAll('#searchResults tr[id^="tdr"] td div[class^="browse"]'),!0===t&&MP_HELPERS.reportCount("Hiding",s.length,"snatched torrent"),!1===t&&MP_HELPERS.reportCount("Showing",s.length,"snatched torrent"),n=[];for(i in s)r=s[i].parentElement.parentElement,!0===t?(o=!1,r.style.display="none",e.innerHTML="Show Snatched"):(o=!0,r.removeAttribute("style"),e.innerHTML="Hide Snatched"),!0===MP_DEBUG?n.push(console.log(r)):n.push(void 0);return n},e=function(){var e,n,r;console.log("creating toggle"),e=document.querySelector("#resetNewIcon"),r=document.createElement("h1"),e.parentElement.insertBefore(r,e),MP_HELPERS.setAttr(r,{id:"mp_snatchedToggle",class:"torFormButton",role:"button"}),r.innerHTML="Hide Snatched";try{return r.addEventListener("click",function(){return t(r,o)},!1)}catch(e){if(n=e,!0===MP_DEBUG)return console.warn(n)}},GM_getValue("mp_hide_snatched"))return e()},addGoodreadsBtns:function(e,t,o){var n,r,i,s,l,a,c,u,d,p,m,g,h,_,f,b,M,y,P,E;if(s=null,M=null,r=null,d=[],P=document.querySelector("#download").parentNode,p=document.querySelector("#cat").textContent,y=function(e){var t,o,n;for(e=MP_HELPERS.strToArr(e),n=["",0],o=n[0],t=n[1];t<e.length;)e[t].length<2&&e[t+1].length<2?o+=e[t]:o+=e[t]+" ",t++;return o.trim()},m=function(e,t){var o;return!0===MP_DEBUG&&console.log("checkDashes("+e+", "+t+", "+e.indexOf(" - ")+")"),-1!==e.indexOf(" - ")?(!0===MP_DEBUG&&console.log("> Book title contains a dash"),o=e.split(" - "),o[0]===t?(!0===MP_DEBUG&&console.log("> String before dash is author; using string behind dash"),o[1]):o[0]):e},a=function(e,t){if(!0===MP_DEBUG&&console.log("buildURL("+e+", "+t+")"),"book"===e&&(e="title"),~["title","author","series","on"].indexOf(e))return"series"===e&&(e="on",t+=", #"),"https://www.goodreads.com/search?q="+encodeURIComponent(t).replace("'","&apos;")+"&search_type=books&search%5Bfield%5D="+e},f=function(e,t){return"<a class='mp_button_clone' href='"+t+"' target='_blank'>"+e+"</a> "},b=function(e,t,o){var r,i,s;if(s="",r="","book"===e)r="Title",s=MP_HELPERS.trimStr(MP_HELPERS.bracketRemover(t),50),s=m(s,n);else if("author"===e){for(r="Author",i=0;i<t.length&&i<3;)s+=t[i].textContent+" ",i++;s=y(s)}else"series"===e&&(r="Series",s=MP_HELPERS.redoSpaces(t.textContent));return o=a(e,s),d.splice(0,0,f(r,o)),console.log("> "+e+": "+s+" ("+o+")"),s},0===p.indexOf("Ebooks")||0===p.indexOf("Audiobooks")){for(u=P.parentNode.insertRow(P.rowIndex),E=u.insertCell(0),g=u.insertCell(1),E.innerHTML="Search Goodreads",null!=o&&b("series",o,M),0!==e.length&&(n=b("author",e,r)),null!=t&&(i=b("book",t,s)),null!=i&&null!=n&&(l=a("on",i+" "+n),d.splice(0,0,f("Title + Author",l))),h=0,_=d.length;h<_;h++)c=d[h],g.innerHTML+=c;return E.setAttribute("class","rowhead"),g.setAttribute("class","row1"),console.log("[M+] Added Goodreads buttons!")}return console.log("[M+] Category does not require Goodreads button")},moveBookmark:function(e,t){if(0!==t&&!isNaN(t))return document.querySelector('#mainBody > a[id*="Bookmark"]').setAttribute("class","mp_mark_"+MP_STYLE.theme)},fakeCover:function(e,t){if("missing"===t)return e.innerHTML+='<div class="mp_cover">(no image)</div>',console.log("[M+] Added empty cover!")},simpleDownload:function(e){var t;return"tor"===e?(t=document.querySelector("#dlNormal").href,e="Torrent"):"zip"===e&&(t=document.querySelector("#dlZip").href,e="ZIP"),document.querySelector("#download").innerHTML="<h1><a class='torFormButton mp_formButton' href='"+t+"'>"+e+"</a></h1>",console.log("[M+] Simplified the download link!")},fileList:function(){},initShoutbox:function(){var e,t,o,n,r,i,s;return console.group("Initializing shoutbox..."),s=document.querySelector("#sbf"),r=function(e,t){var o,n,r,i,s;if(!0===MP_DEBUG&&console.log("Running... getShoutParams( "+e+", "+t+" )"),o=[],GM_getValue(e))for(s=GM_getValue(e+"_val").split(","),n=0,r=s.length;n<r;n++)i=s[n],"num"===t?isNaN(Number(i))||o.push(Number(i)):"str"===t&&o.push(i);return o=null!=o[0]&&o,!0===MP_DEBUG&&console.log("Result >",o),o},t=function(e,t){var o;if(!0===MP_DEBUG&&console.log("Running... changeMsg( "+e.id+", "+t+" )"),o={hide:function(){return e.style.filter="blur(3px)",e.style.opacity="0.3"},show:function(){return e.style.filter="blur(0)",e.style.opacity="0.5"},emph:function(){return MP_DEBUG&&console.log(GM_getValue("mp_priority_style_val")),GM_getValue("mp_priority_style_val")?e.style.background="rgba("+GM_getValue("mp_priority_style_val")+")":e.style.background="rgba(125,125,125,0.3)"},alert:function(){return e.style.color="red"}},o[t])return o[t]()},n=function(e,o,n){var r,i,s,l,a;if(!1!==o)for(i=0,s=o.length;i<s;i++)if(l=o[i],a=e.querySelector("a:nth-of-type(2)").href.split("/"),Number(a[a.length-1])===l)if("ignore"===n){t(e,"hide");try{e.addEventListener("mouseenter",function(e){return t(e.target,"show")}),e.addEventListener("mouseleave",function(e){return t(e.target,"hide")})}catch(e){if(r=e,!0!==MP_DEBUG)return;console.warn(r)}}else"priority"===n&&t(e,"emph")},o=function(e,o){var n,r,i,s;if(!1!==o){for(n="",s=e.textContent.split(")"),MP_HELPERS.arrToStr(s.splice(0,1)),s+="",i=0;i<o.length;)n+="\\b"+o[i]+"\\b",i+1!==o.length&&(n+="|"),i++;if(r=new RegExp(n,"i"),s.search(r)>0)return t(e,"alert")}},i=function(e,t){var r,i,s,l;for(l=document.querySelectorAll("#sbf div:not(.mp_processed)"),r=0,i=l.length;r<i;r++)s=l[r],s.classList.contains("mp_processed")||(s.classList.add("mp_processed"),n(s,e.ignore,"ignore"),n(s,e.priority,"priority"),o(s,e.keywords));if(t)return t()},(GM_getValue("mp_block_users")||GM_getValue("mp_priority_users")||GM_getValue("mp_shout_keywords"))&&(!0===MP_DEBUG&&console.log("Shoutbox settings exist"),s&&(!0===MP_DEBUG&&console.log("Page has shoutbox"),e=new Object,e.ignore=r("mp_block_users","num"),e.priority=r("mp_priority_users","num"),e.keywords=r("mp_shout_keywords","str"),MP_HELPERS.pageLoad(function(){return i(e,function(){return window.setInterval(function(){return i(e,!1)},500)})},2340))),console.groupEnd}},MP.run()}catch(e){MP_DEBUG&&console.warn(e)}