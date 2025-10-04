import { app as l } from "../../../scripts/app.js";
import { ComponentWidgetImpl as r, addWidget as u } from "../../../scripts/domWidget.js";
import { defineComponent as d, ref as f, createElementBlock as p, openBlock as a, createElementVNode as s, createCommentVNode as _, toDisplayString as c, unref as i } from "vue";
import { useI18n as g } from "vue-i18n";
const v = { class: "example-component" }, x = {
  key: 0,
  class: "counter"
}, C = /* @__PURE__ */ d({
  __name: "ExampleComponent",
  props: {
    widget: {}
  },
  setup(o) {
    const { t } = g(), e = f(0);
    function n() {
      e.value++, console.log("Button clicked:", e.value), o.widget && (o.widget.value = { clicks: e.value });
    }
    return (m, E) => (a(), p("div", v, [
      s("h3", null, c(i(t)("example.title")), 1),
      s("p", null, c(i(t)("example.description")), 1),
      s("button", { onClick: n }, c(i(t)("example.button")), 1),
      e.value > 0 ? (a(), p("div", x, " Clicked " + c(e.value) + " times ", 1)) : _("", !0)
    ]));
  }
}), k = (o, t) => {
  const e = o.__vccOpts || o;
  for (const [n, m] of t)
    e[n] = m;
  return e;
}, y = /* @__PURE__ */ k(C, [["__scopeId", "data-v-00501ba1"]]), w = l;
w.registerExtension({
  name: "comfyui-swissarmyknife.vue-components",
  async setup() {
    console.log("Vue components for ComfyUI Swiss Army Knife loaded");
  },
  getCustomWidgets(o) {
    return {
      EXAMPLE_WIDGET(t) {
        const e = {
          name: "example_widget",
          type: "example-widget"
        }, n = new r({
          node: t,
          name: e.name,
          component: y,
          inputSpec: e,
          options: {}
        });
        return u(t, n), { widget: n };
      }
    };
  },
  nodeCreated(o) {
  }
});
export {
  w as comfyApp
};
