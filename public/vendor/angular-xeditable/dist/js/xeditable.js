angular.module("xeditable", []).value("editableOptions", {
    theme: "default",
    buttons: "right",
    blurElem: "cancel",
    blurForm: "ignore",
    activate: "focus"
}), angular.module("xeditable").directive("editableBsdate", ["editableDirectiveFactory", function (e) {
    return e({directiveName: "editableBsdate", inputTpl: '<input type="text">'})
}]), angular.module("xeditable").directive("editableBstime", ["editableDirectiveFactory", function (e) {
    return e({
        directiveName: "editableBstime", inputTpl: "<timepicker></timepicker>", render: function () {
            this.parent.render.call(this);
            var e = angular.element('<div class="well well-small" style="display:inline-block;"></div>');
            e.attr("ng-model", this.inputEl.attr("ng-model")), this.inputEl.removeAttr("ng-model"), this.attrs.eNgChange && (e.attr("ng-change", this.inputEl.attr("ng-change")), this.inputEl.removeAttr("ng-change")), this.inputEl.wrap(e)
        }
    })
}]), angular.module("xeditable").directive("editableCheckbox", ["editableDirectiveFactory", function (e) {
    return e({
        directiveName: "editableCheckbox", inputTpl: '<input type="checkbox">', render: function () {
            this.parent.render.call(this), this.attrs.eTitle && (this.inputEl.wrap("<label></label>"), this.inputEl.after(angular.element("<span></span>").text(this.attrs.eTitle)))
        }, autosubmit: function () {
            var e = this;
            e.inputEl.bind("change", function () {
                setTimeout(function () {
                    e.scope.$apply(function () {
                        e.scope.$form.$submit()
                    })
                }, 500)
            })
        }
    })
}]), angular.module("xeditable").directive("editableChecklist", ["editableDirectiveFactory", "editableNgOptionsParser", function (e, t) {
    return e({
        directiveName: "editableChecklist", inputTpl: "<span></span>", useCopy: !0, render: function () {
            this.parent.render.call(this);
            var e = t(this.attrs.eNgOptions), n = '<label ng-repeat="' + e.ngRepeat + '"><input type="checkbox" checklist-model="$parent.$data" checklist-value="' + e.locals.valueFn + '"><span ng-bind="' + e.locals.displayFn + '"></span></label>';
            this.inputEl.removeAttr("ng-model"), this.inputEl.removeAttr("ng-options"), this.inputEl.html(n)
        }
    })
}]), function () {
    var e = "text|email|tel|number|url|search|color|date|datetime|time|month|week".split("|");
    angular.forEach(e, function (e) {
        var t = "editable" + e.charAt(0).toUpperCase() + e.slice(1);
        angular.module("xeditable").directive(t, ["editableDirectiveFactory", function (n) {
            return n({directiveName: t, inputTpl: '<input type="' + e + '">'})
        }])
    }), angular.module("xeditable").directive("editableRange", ["editableDirectiveFactory", function (e) {
        return e({
            directiveName: "editableRange",
            inputTpl: '<input type="range" id="range" name="range">',
            render: function () {
                this.parent.render.call(this), this.inputEl.after("<output>{{$data}}</output>")
            }
        })
    }])
}(), angular.module("xeditable").directive("editableRadiolist", ["editableDirectiveFactory", "editableNgOptionsParser", function (e, t) {
    return e({
        directiveName: "editableRadiolist", inputTpl: "<span></span>", render: function () {
            this.parent.render.call(this);
            var e = t(this.attrs.eNgOptions), n = '<label ng-repeat="' + e.ngRepeat + '"><input type="radio" ng-model="$parent.$data" value="{{' + e.locals.valueFn + '}}"><span ng-bind="' + e.locals.displayFn + '"></span></label>';
            this.inputEl.removeAttr("ng-model"), this.inputEl.removeAttr("ng-options"), this.inputEl.html(n)
        }, autosubmit: function () {
            var e = this;
            e.inputEl.bind("change", function () {
                setTimeout(function () {
                    e.scope.$apply(function () {
                        e.scope.$form.$submit()
                    })
                }, 500)
            })
        }
    })
}]), angular.module("xeditable").directive("editableSelect", ["editableDirectiveFactory", function (e) {
    return e({
        directiveName: "editableSelect", inputTpl: "<select></select>", autosubmit: function () {
            var e = this;
            e.inputEl.bind("change", function () {
                e.scope.$apply(function () {
                    e.scope.$form.$submit()
                })
            })
        }
    })
}]), angular.module("xeditable").directive("editableTextarea", ["editableDirectiveFactory", function (e) {
    return e({
        directiveName: "editableTextarea", inputTpl: "<textarea></textarea>", addListeners: function () {
            var e = this;
            e.parent.addListeners.call(e), e.single && "no" !== e.buttons && e.autosubmit()
        }, autosubmit: function () {
            var e = this;
            e.inputEl.bind("keydown", function (t) {
                (t.ctrlKey || t.metaKey) && 13 === t.keyCode && e.scope.$apply(function () {
                    e.scope.$form.$submit()
                })
            })
        }
    })
}]), angular.module("xeditable").factory("editableController", ["$q", "editableUtils", function (e, t) {
    function n(e, n, a, i, r, l, o, s, u) {
        var c, d, b = this;
        b.scope = e, b.elem = a, b.attrs = n, b.inputEl = null, b.editorEl = null, b.single = !0, b.error = "", b.theme = r[l.theme] || r["default"], b.parent = {}, b.inputTpl = "", b.directiveName = "", b.useCopy = !1, b.single = null, b.buttons = "right", b.init = function (t) {
            if (b.single = t, b.name = n.eName || n[b.directiveName], !n[b.directiveName])throw"You should provide value for `" + b.directiveName + "` in editable element!";
            c = i(n[b.directiveName]), b.buttons = b.single ? b.attrs.buttons || l.buttons : "no", n.eName && b.scope.$watch("$data", function (e) {
                b.scope.$form.$data[n.eName] = e
            }), n.onshow && (b.onshow = function () {
                return b.catchError(i(n.onshow)(e))
            }), n.onhide && (b.onhide = function () {
                return i(n.onhide)(e)
            }), n.oncancel && (b.oncancel = function () {
                return i(n.oncancel)(e)
            }), n.onbeforesave && (b.onbeforesave = function () {
                return b.catchError(i(n.onbeforesave)(e))
            }), n.onaftersave && (b.onaftersave = function () {
                return b.catchError(i(n.onaftersave)(e))
            }), e.$parent.$watch(n[b.directiveName], function () {
                b.handleEmpty()
            })
        }, b.render = function () {
            var e = b.theme;
            b.inputEl = angular.element(b.inputTpl), b.controlsEl = angular.element(e.controlsTpl), b.controlsEl.append(b.inputEl), "no" !== b.buttons && (b.buttonsEl = angular.element(e.buttonsTpl), b.submitEl = angular.element(e.submitTpl), b.cancelEl = angular.element(e.cancelTpl), b.buttonsEl.append(b.submitEl).append(b.cancelEl), b.controlsEl.append(b.buttonsEl), b.inputEl.addClass("editable-has-buttons")), b.errorEl = angular.element(e.errorTpl), b.controlsEl.append(b.errorEl), b.editorEl = angular.element(b.single ? e.formTpl : e.noformTpl), b.editorEl.append(b.controlsEl);
            for (var a in n.$attr)if (!(a.length <= 1)) {
                var i = !1, r = a.substring(1, 2);
                if ("e" === a.substring(0, 1) && r === r.toUpperCase() && (i = a.substring(1), "Form" !== i && "NgSubmit" !== i)) {
                    i = i.substring(0, 1).toLowerCase() + t.camelToDash(i.substring(1));
                    var o = "" === n[a] ? i : n[a];
                    b.inputEl.attr(i, o)
                }
            }
            b.inputEl.addClass("editable-input"), b.inputEl.attr("ng-model", "$data"), b.editorEl.addClass(t.camelToDash(b.directiveName)), b.single && (b.editorEl.attr("editable-form", "$form"), b.editorEl.attr("blur", b.attrs.blur || ("no" === b.buttons ? "cancel" : l.blurElem))), angular.isFunction(e.postrender) && e.postrender.call(b)
        }, b.setLocalValue = function () {
            b.scope.$data = b.useCopy ? angular.copy(c(e.$parent)) : c(e.$parent)
        }, b.show = function () {
            return b.setLocalValue(), b.render(), a.after(b.editorEl), s(b.editorEl)(e), b.addListeners(), a.addClass("editable-hide"), b.onshow()
        }, b.hide = function () {
            return b.editorEl.remove(), a.removeClass("editable-hide"), b.onhide()
        }, b.cancel = function () {
            b.oncancel()
        }, b.addListeners = function () {
            b.inputEl.bind("keyup", function (e) {
                if (b.single)switch (e.keyCode) {
                    case 27:
                        b.scope.$apply(function () {
                            b.scope.$form.$cancel()
                        })
                }
            }), b.single && "no" === b.buttons && b.autosubmit(), b.editorEl.bind("click", function (e) {
                1 === e.which && b.scope.$form.$visible && (b.scope.$form._clicked = !0)
            })
        }, b.setWaiting = function (e) {
            e ? (d = !b.inputEl.attr("disabled") && !b.inputEl.attr("ng-disabled") && !b.inputEl.attr("ng-enabled"), d && (b.inputEl.attr("disabled", "disabled"), b.buttonsEl && b.buttonsEl.find("button").attr("disabled", "disabled"))) : d && (b.inputEl.removeAttr("disabled"), b.buttonsEl && b.buttonsEl.find("button").removeAttr("disabled"))
        }, b.activate = function () {
            setTimeout(function () {
                var e = b.inputEl[0];
                "focus" === l.activate && e.focus && e.focus(), "select" === l.activate && e.select && e.select()
            }, 0)
        }, b.setError = function (t) {
            angular.isObject(t) || (e.$error = t, b.error = t)
        }, b.catchError = function (e, t) {
            return angular.isObject(e) && t !== !0 ? u.when(e).then(angular.bind(this, function (e) {
                this.catchError(e, !0)
            }), angular.bind(this, function (e) {
                this.catchError(e, !0)
            })) : t && angular.isObject(e) && e.status && 200 !== e.status && e.data && angular.isString(e.data) ? (this.setError(e.data), e = e.data) : angular.isString(e) && this.setError(e), e
        }, b.save = function () {
            c.assign(e.$parent, angular.copy(b.scope.$data))
        }, b.handleEmpty = function () {
            var t = c(e.$parent), n = null === t || void 0 === t || "" === t || angular.isArray(t) && 0 === t.length;
            a.toggleClass("editable-empty", n)
        }, b.autosubmit = angular.noop, b.onshow = angular.noop, b.onhide = angular.noop, b.oncancel = angular.noop, b.onbeforesave = angular.noop, b.onaftersave = angular.noop
    }

    return n.$inject = ["$scope", "$attrs", "$element", "$parse", "editableThemes", "editableOptions", "$rootScope", "$compile", "$q"], n
}]), angular.module("xeditable").factory("editableDirectiveFactory", ["$parse", "$compile", "editableThemes", "$rootScope", "$document", "editableController", "editableFormController", function (e, t, n, a, i, r, l) {
    return function (t) {
        return {
            restrict: "A",
            scope: !0,
            require: [t.directiveName, "?^form"],
            controller: r,
            link: function (n, r, o, s) {
                var u, c = s[0], d = !1;
                if (s[1])u = s[1], d = !0; else if (o.eForm) {
                    var b = e(o.eForm)(n);
                    if (b)u = b, d = !0; else for (var p = 0; p < i[0].forms.length; p++)if (i[0].forms[p].name === o.eForm) {
                        u = null, d = !0;
                        break
                    }
                }
                if (angular.forEach(t, function (e, t) {
                        void 0 !== c[t] && (c.parent[t] = c[t])
                    }), angular.extend(c, t), c.init(!d), n.$editable = c, r.addClass("editable"), d)if (u) {
                    if (n.$form = u, !n.$form.$addEditable)throw"Form with editable elements should have `editable-form` attribute.";
                    n.$form.$addEditable(c)
                } else a.$$editableBuffer = a.$$editableBuffer || {}, a.$$editableBuffer[o.eForm] = a.$$editableBuffer[o.eForm] || [], a.$$editableBuffer[o.eForm].push(c), n.$form = null; else n.$form = l(), n.$form.$addEditable(c), o.eForm && (n.$parent[o.eForm] = n.$form), o.eForm || (r.addClass("editable-click"), r.bind("click", function (e) {
                    e.preventDefault(), e.editable = c, n.$apply(function () {
                        n.$form.$show()
                    })
                }))
            }
        }
    }
}]), angular.module("xeditable").factory("editableFormController", ["$parse", "$document", "$rootScope", "editablePromiseCollection", "editableUtils", function (e, t, n, a, i) {
    var r = [];
    t.bind("click", function (e) {
        if (1 === e.which) {
            for (var t = [], a = [], i = 0; i < r.length; i++)r[i]._clicked ? r[i]._clicked = !1 : r[i].$waiting || ("cancel" === r[i]._blur && t.push(r[i]), "submit" === r[i]._blur && a.push(r[i]));
            (t.length || a.length) && n.$apply(function () {
                angular.forEach(t, function (e) {
                    e.$cancel()
                }), angular.forEach(a, function (e) {
                    e.$submit()
                })
            })
        }
    });
    var l = {
        $addEditable: function (e) {
            this.$editables.push(e), e.elem.bind("$destroy", angular.bind(this, this.$removeEditable, e)), e.scope.$form || (e.scope.$form = this), this.$visible && e.catchError(e.show())
        },
        $removeEditable: function (e) {
            for (var t = 0; t < this.$editables.length; t++)if (this.$editables[t] === e)return void this.$editables.splice(t, 1)
        },
        $show: function () {
            if (!this.$visible) {
                this.$visible = !0;
                var e = a();
                e.when(this.$onshow()), this.$setError(null, ""), angular.forEach(this.$editables, function (t) {
                    e.when(t.show())
                }), e.then({
                    onWait: angular.bind(this, this.$setWaiting),
                    onTrue: angular.bind(this, this.$activate),
                    onFalse: angular.bind(this, this.$activate),
                    onString: angular.bind(this, this.$activate)
                }), setTimeout(angular.bind(this, function () {
                    this._clicked = !1, -1 === i.indexOf(r, this) && r.push(this)
                }), 0)
            }
        },
        $activate: function (e) {
            var t;
            if (this.$editables.length) {
                if (angular.isString(e))for (t = 0; t < this.$editables.length; t++)if (this.$editables[t].name === e)return void this.$editables[t].activate();
                for (t = 0; t < this.$editables.length; t++)if (this.$editables[t].error)return void this.$editables[t].activate();
                this.$editables[0].activate()
            }
        },
        $hide: function () {
            this.$visible && (this.$visible = !1, this.$onhide(), angular.forEach(this.$editables, function (e) {
                e.hide()
            }), i.arrayRemove(r, this))
        },
        $cancel: function () {
            this.$visible && (this.$oncancel(), angular.forEach(this.$editables, function (e) {
                e.cancel()
            }), this.$hide())
        },
        $setWaiting: function (e) {
            this.$waiting = !!e, angular.forEach(this.$editables, function (t) {
                t.setWaiting(!!e)
            })
        },
        $setError: function (e, t) {
            angular.forEach(this.$editables, function (n) {
                e && n.name !== e || n.setError(t)
            })
        },
        $submit: function () {
            function e(e) {
                var t = a();
                t.when(this.$onbeforesave()), t.then({
                    onWait: angular.bind(this, this.$setWaiting),
                    onTrue: e ? angular.bind(this, this.$save) : angular.bind(this, this.$hide),
                    onFalse: angular.bind(this, this.$hide),
                    onString: angular.bind(this, this.$activate)
                })
            }

            if (!this.$waiting) {
                this.$setError(null, "");
                var t = a();
                angular.forEach(this.$editables, function (e) {
                    t.when(e.onbeforesave())
                }), t.then({
                    onWait: angular.bind(this, this.$setWaiting),
                    onTrue: angular.bind(this, e, !0),
                    onFalse: angular.bind(this, e, !1),
                    onString: angular.bind(this, this.$activate)
                })
            }
        },
        $save: function () {
            angular.forEach(this.$editables, function (e) {
                e.save()
            });
            var e = a();
            e.when(this.$onaftersave()), angular.forEach(this.$editables, function (t) {
                e.when(t.onaftersave())
            }), e.then({
                onWait: angular.bind(this, this.$setWaiting),
                onTrue: angular.bind(this, this.$hide),
                onFalse: angular.bind(this, this.$hide),
                onString: angular.bind(this, this.$activate)
            })
        },
        $onshow: angular.noop,
        $oncancel: angular.noop,
        $onhide: angular.noop,
        $onbeforesave: angular.noop,
        $onaftersave: angular.noop
    };
    return function () {
        return angular.extend({$editables: [], $visible: !1, $waiting: !1, $data: {}, _clicked: !1, _blur: null}, l)
    }
}]), angular.module("xeditable").directive("editableForm", ["$rootScope", "$parse", "editableFormController", "editableOptions", function (e, t, n, a) {
    return {
        restrict: "A", require: ["form"], compile: function () {
            return {
                pre: function (t, a, i, r) {
                    var l, o = r[0];
                    i.editableForm ? t[i.editableForm] && t[i.editableForm].$show ? (l = t[i.editableForm], angular.extend(o, l)) : (l = n(), t[i.editableForm] = l, angular.extend(l, o)) : (l = n(), angular.extend(o, l));
                    var s = e.$$editableBuffer, u = o.$name;
                    u && s && s[u] && (angular.forEach(s[u], function (e) {
                        l.$addEditable(e)
                    }), delete s[u])
                }, post: function (e, n, i, r) {
                    var l;
                    l = i.editableForm && e[i.editableForm] && e[i.editableForm].$show ? e[i.editableForm] : r[0], i.onshow && (l.$onshow = angular.bind(l, t(i.onshow), e)), i.onhide && (l.$onhide = angular.bind(l, t(i.onhide), e)), i.oncancel && (l.$oncancel = angular.bind(l, t(i.oncancel), e)), i.shown && t(i.shown)(e) && l.$show(), l._blur = i.blur || a.blurForm, i.ngSubmit || i.submit || (i.onbeforesave && (l.$onbeforesave = function () {
                        return t(i.onbeforesave)(e, {$data: l.$data})
                    }), i.onaftersave && (l.$onaftersave = function () {
                        return t(i.onaftersave)(e, {$data: l.$data})
                    }), n.bind("submit", function (t) {
                        t.preventDefault(), e.$apply(function () {
                            l.$submit()
                        })
                    })), n.bind("click", function (e) {
                        1 === e.which && l.$visible && (l._clicked = !0)
                    })
                }
            }
        }
    }
}]), angular.module("xeditable").factory("editablePromiseCollection", ["$q", function (e) {
    function t() {
        return {
            promises: [], hasFalse: !1, hasString: !1, when: function (t, n) {
                if (t === !1)this.hasFalse = !0; else if (!n && angular.isObject(t))this.promises.push(e.when(t)); else {
                    if (!angular.isString(t))return;
                    this.hasString = !0
                }
            }, then: function (t) {
                function n() {
                    o.hasString || o.hasFalse ? !o.hasString && o.hasFalse ? i() : r() : a()
                }

                t = t || {};
                var a = t.onTrue || angular.noop, i = t.onFalse || angular.noop, r = t.onString || angular.noop, l = t.onWait || angular.noop, o = this;
                this.promises.length ? (l(!0), e.all(this.promises).then(function (e) {
                    l(!1), angular.forEach(e, function (e) {
                        o.when(e, !0)
                    }), n()
                }, function () {
                    l(!1), r()
                })) : n()
            }
        }
    }

    return t
}]), angular.module("xeditable").factory("editableUtils", [function () {
    return {
        indexOf: function (e, t) {
            if (e.indexOf)return e.indexOf(t);
            for (var n = 0; n < e.length; n++)if (t === e[n])return n;
            return -1
        }, arrayRemove: function (e, t) {
            var n = this.indexOf(e, t);
            return n >= 0 && e.splice(n, 1), t
        }, camelToDash: function (e) {
            var t = /[A-Z]/g;
            return e.replace(t, function (e, t) {
                return (t ? "-" : "") + e.toLowerCase()
            })
        }, dashToCamel: function (e) {
            var t = /([\:\-\_]+(.))/g, n = /^moz([A-Z])/;
            return e.replace(t, function (e, t, n, a) {
                return a ? n.toUpperCase() : n
            }).replace(n, "Moz$1")
        }
    }
}]), angular.module("xeditable").factory("editableNgOptionsParser", [function () {
    function e(e) {
        var n;
        if (!(n = e.match(t)))throw"ng-options parse error";
        var a, i = n[2] || n[1], r = n[4] || n[6], l = n[5], o = (n[3] || "", n[2] ? n[1] : r), s = n[7], u = n[8], c = u ? n[8] : null;
        return void 0 === l ? (a = r + " in " + s, void 0 !== u && (a += " track by " + c)) : a = "(" + l + ", " + r + ") in " + s, {
            ngRepeat: a,
            locals: {valueName: r, keyName: l, valueFn: o, displayFn: i}
        }
    }

    var t = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
    return e
}]), angular.module("xeditable").factory("editableThemes", function () {
    var e = {
        "default": {
            formTpl: '<form class="editable-wrap"></form>',
            noformTpl: '<span class="editable-wrap"></span>',
            controlsTpl: '<span class="editable-controls"></span>',
            inputTpl: "",
            errorTpl: '<div class="editable-error" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl: '<span class="editable-buttons"></span>',
            submitTpl: '<button type="submit">save</button>',
            cancelTpl: '<button type="button" ng-click="$form.$cancel()">cancel</button>'
        },
        bs2: {
            formTpl: '<form class="form-inline editable-wrap" role="form"></form>',
            noformTpl: '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls controls control-group" ng-class="{\'error\': $error}"></div>',
            inputTpl: "",
            errorTpl: '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl: '<span class="editable-buttons"></span>',
            submitTpl: '<button type="submit" class="btn btn-primary"><span class="icon-ok icon-white"></span></button>',
            cancelTpl: '<button type="button" class="btn" ng-click="$form.$cancel()"><span class="icon-remove"></span></button>'
        },
        bs3: {
            formTpl: '<form class="form-inline editable-wrap" role="form"></form>',
            noformTpl: '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls form-group" ng-class="{\'has-error\': $error}"></div>',
            inputTpl: "",
            errorTpl: '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl: '<span class="editable-buttons"></span>',
            submitTpl: '<button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-ok"></span></button>',
            cancelTpl: '<button type="button" class="btn btn-default" ng-click="$form.$cancel()"><span class="glyphicon glyphicon-remove"></span></button>',
            buttonsClass: "",
            inputClass: "",
            postrender: function () {
                switch (this.directiveName) {
                    case"editableText":
                    case"editableSelect":
                    case"editableTextarea":
                    case"editableEmail":
                    case"editableTel":
                    case"editableNumber":
                    case"editableUrl":
                    case"editableSearch":
                    case"editableDate":
                    case"editableDatetime":
                    case"editableTime":
                    case"editableMonth":
                    case"editableWeek":
                        if (this.inputEl.addClass("form-control"), this.theme.inputClass) {
                            if (this.inputEl.attr("multiple") && ("input-sm" === this.theme.inputClass || "input-lg" === this.theme.inputClass))break;
                            this.inputEl.addClass(this.theme.inputClass)
                        }
                }
                this.buttonsEl && this.theme.buttonsClass && this.buttonsEl.find("button").addClass(this.theme.buttonsClass)
            }
        }
    };
    return e
});