"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MRepeat = void 0;

var _nodomEsmMin = require("../../dist/nodom.esm.min.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MRepeat =
/*#__PURE__*/
function (_Module) {
  _inherits(MRepeat, _Module);

  function MRepeat() {
    _classCallCheck(this, MRepeat);

    return _possibleConstructorReturn(this, _getPrototypeOf(MRepeat).apply(this, arguments));
  }

  _createClass(MRepeat, [{
    key: "template",
    value: function template() {
      return "\n        <div class=\"view\">\n            <button e-click='pop'>pop</button>\n            <button e-click='push'>push</button>\n            <button e-click='addFood'>addFood</button>\n            <button e-click='desc'>\u4EF7\u683C\u964D\u5E8F</button>\n            <button e-click='clear'>\u6E05\u7A7A</button>\n            \n            <div class=\"tip\">\u57FA\u672C\u4F7F\u7528</div>\n            <div class=\"code\">\n                \u83DC\u5355\uFF1A\n                <for cond={{foods}} $index='idx'>\n                    <span>\u83DC\u540D\uFF1A{{name}}\uFF0C\u4EF7\u683C\uFF1A{{price}}</span>\n                </for>\n            </div>\n            <!--<div class=tip>\u7D22\u5F15\u53F7\u7684\u4F7F\u7528\uFF08\u7F16\u53F7\u4ECE0\u5F00\u59CB\uFF09</div> \n            <p> \u5982\u679C\u4F7F\u7528\u7D22\u5F15\u53F7\uFF0C\u9700\u8981\u5728\u5E26\u6709repeat\u7684\u6307\u4EE4\u4E2D\u914D\u7F6E$index\u5C5E\u6027\uFF0C\u8BE5\u5C5E\u6027\u6307\u5B9A\u7D22\u5F15\u540D\u3002</p>\n            <div class=code>\n                \u83DC\u5355\uFF1A\n                <for cond={{foods}} $index='idx'>\n                    \u7F16\u53F7\uFF1A{{idx}}\uFF0C\u83DC\u540D\uFF1A{{name}}\uFF0C\u4EF7\u683C\uFF1A{{price}}\n                </for>\n            </div>\n            \n            <div class=tip>\u81EA\u5B9A\u4E49\u8FC7\u6EE4\u6570\u7EC4</div>\n            <div class=\"code\">\n                \u83DC\u5355\uFF1A\n                <for cond={{getOdd(foods)}}>\n                    \u83DC\u540D\uFF1A{{name}}\uFF0C\u4EF7\u683C\uFF1A{{price}}\n                </for>\n            </div>-->\n            <div class=tip>repeat \u5D4C\u5957</div>\n            <div class=code>\n                \u83DC\u5355\uFF1A\n                <div x-repeat={{foods1}} $index='idx'>\n                    \u7F16\u53F7\uFF1A{{idx+1}}\uFF0C\u83DC\u540D\uFF1A{{name}}\uFF0C\u4EF7\u683C\uFF1A{{price}}\n                    <p>\u914D\u6599\u5217\u8868\uFF1A</p>\n                    <ol>\n                        <li x-repeat={{rows}}>\u98DF\u6750\uFF1A{{title}}\uFF0C\u91CD\u91CF\uFF1A{{weight}}</li>\n                    </ol>\n                    \n                </div>\n            </div>\n\n            <style>\n                .red{\n                    color:red;\n                }\n                .blue{\n                    color:blue;\n                }\n            </style>\n        </div>\n        ";
    }
  }, {
    key: "data",
    value: function data() {
      return {
        show: 0,
        date1: new Date().getTime(),
        discount: {
          data: 0.9
        },
        xxx: true,
        foods: [{
          name: '夫妻肺片',
          price: 25
        }, {
          name: '京酱肉丝',
          price: 22
        }, {
          name: '糖醋里脊',
          price: 20
        }, {
          name: '红烧茄子',
          price: 12
        }, {
          name: '口水鸡',
          price: 18
        }, {
          name: '水煮肉片',
          price: 24
        }],
        foods1: [{
          name: '夫妻肺片',
          price: 25,
          rows: [{
            title: '芹菜',
            weight: 100
          }, {
            title: '猪头肉',
            weight: 200
          }]
        }, {
          name: '京酱肉丝',
          price: 22,
          rows: [{
            title: '瘦肉',
            weight: 100
          }, {
            title: '葱',
            weight: 200
          }]
        }, {
          name: '糖醋里脊',
          price: 20,
          rows: [{
            title: '排骨',
            weight: 200
          }]
        }]
      };
    }
  }, {
    key: "top",
    value: function top(arr) {
      var a = [];

      for (var i = 0; i < 3; i++) {
        a.push(arr[i]);
      }

      return a;
    }
  }, {
    key: "getOdd",
    value: function getOdd(arr) {
      var a1 = [];

      for (var i = 0; i < arr.length; i++) {
        if (i % 2) {
          a1.push(arr[i]);
        }
      }

      return a1;
    }
  }, {
    key: "sort1",
    value: function sort1(arr) {
      return arr.sort(function (a, b) {
        return a.price > b.price;
      });
    }
  }, {
    key: "desc",
    value: function desc(model) {
      model.foods.sort(function (a, b) {
        if (a.price > b.price) return -1;
        return 1;
      });
    }
  }, {
    key: "pop",
    value: function pop(model) {
      model.foods.pop();
    }
  }, {
    key: "push",
    value: function push(model) {
      model.foods.push({
        name: 'push菜单',
        price: 50
      });
    }
  }, {
    key: "addFood",
    value: function addFood(model) {
      model.foods.splice(2, 0, {
        name: '新增1',
        price: 20
      }, {
        name: '新增2',
        price: 30
      });
    }
  }, {
    key: "clear",
    value: function clear(model) {
      delete model.foods; //清空后再push,pop会报错

      model.foods = [];
      console.log(model);
    }
  }, {
    key: "genCls",
    value: function genCls(index) {
      console.log(index);
      return index % 2 ? 'red' : 'blue';
    }
  }]);

  return MRepeat;
}(_nodomEsmMin.Module);

exports.MRepeat = MRepeat;