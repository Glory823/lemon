! function(r, e) { var t, i = r.document,
        o = i.documentElement,
        n = i.querySelector('meta[name="viewport"]'),
        a = i.querySelector('meta[name="flexible"]'),
        l = 0,
        s = 0,
        d = e.flexible || (e.flexible = {}); if (a) { var m = a.getAttribute("content"); if (m) { var p = m.match(/initial\-dpr=([\d\.]+)/),
                c = m.match(/maximum\-dpr=([\d\.]+)/);
            p && (l = parseFloat(p[1]), s = parseFloat((1 / l).toFixed(2))), c && (l = parseFloat(c[1]), s = parseFloat((1 / l).toFixed(2))) } } if (!l && !s) { r.navigator.appVersion.match(/android/gi), r.navigator.appVersion.match(/iphone/gi); var f = r.devicePixelRatio;
        l = 3 <= f && (!l || 3 <= l) ? 3 : 2 <= f && (!l || 2 <= l) ? 2 : 1, console.log(l), s = 1 / l } if (o.setAttribute("data-dpr", l), (n = i.createElement("meta")).setAttribute("name", "viewport"), n.setAttribute("content", "width=device-width, initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), o.firstElementChild) o.firstElementChild.appendChild(n);
    else { var u = i.createElement("div");
        u.appendChild(n), i.write(u.innerHTML) }

    function h() { var e = o.getBoundingClientRect().width;
        540 < e / l && (e = 540 * l); var t = e / 10;
        console.log(t), o.style.fontSize = t + "px", d.rem = r.rem = t; var i = parseFloat(o.style.fontSize),
            n = parseFloat(window.getComputedStyle(o).getPropertyValue("font-size"));
        console.log("flexible.refreshRem: fontSize && finalFontSize => ", i, n), i !== n && (o.style.fontSize = i * (i / n) + "px", console.log("flexible.refreshRem.fixed: fontSize  => ", o.style.fontSize)) }
    r.addEventListener("resize", function() { clearTimeout(t), t = setTimeout(h, 300) }, !1), r.addEventListener("pageshow", function(e) { e.persisted && (clearTimeout(t), t = setTimeout(h, 300)) }, !1), "complete" === i.readyState ? i.body.style.fontSize = 12 * l + "px" : i.addEventListener("DOMContentLoaded", function(e) { i.body.style.fontSize = 12 * l + "px" }, !1), h(), d.dpr = r.dpr = l, d.refreshRem = h, d.rem2px = function(e) { var t = parseFloat(e) * this.rem; return "string" == typeof e && e.match(/rem$/) && (t += "px"), t }, d.px2rem = function(e) { var t = parseFloat(e) / this.rem; return "string" == typeof e && e.match(/px$/) && (t += "rem"), t } }(window, window.lib || (window.lib = {}));