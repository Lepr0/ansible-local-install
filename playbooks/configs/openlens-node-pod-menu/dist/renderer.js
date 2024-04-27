/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 553:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const extensions_1 = __webpack_require__(931);
const node_menu_1 = __webpack_require__(117);
const attach_menu_1 = __webpack_require__(76);
const shell_menu_1 = __webpack_require__(509);
const logs_menu_1 = __webpack_require__(639);
const react_1 = __importDefault(__webpack_require__(104));
class PodMenuRendererExtension extends extensions_1.Renderer.LensExtension {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "kubeObjectMenuItems", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                {
                    kind: "Node",
                    apiVersions: ["v1"],
                    components: {
                        MenuItem: (props) => react_1.default.createElement(node_menu_1.NodeMenu, Object.assign({}, props)),
                    },
                },
                {
                    kind: "Pod",
                    apiVersions: ["v1"],
                    components: {
                        MenuItem: (props) => react_1.default.createElement(attach_menu_1.PodAttachMenu, Object.assign({}, props)),
                    },
                },
                {
                    kind: "Pod",
                    apiVersions: ["v1"],
                    components: {
                        MenuItem: (props) => react_1.default.createElement(shell_menu_1.PodShellMenu, Object.assign({}, props)),
                    },
                },
                {
                    kind: "Pod",
                    apiVersions: ["v1"],
                    components: {
                        MenuItem: (props) => react_1.default.createElement(logs_menu_1.PodLogsMenu, Object.assign({}, props)),
                    },
                },
            ]
        });
    }
}
exports["default"] = PodMenuRendererExtension;


/***/ }),

/***/ 76:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PodAttachMenu = void 0;
const react_1 = __importDefault(__webpack_require__(104));
const extensions_1 = __webpack_require__(931);
const { Component: { createTerminalTab, terminalStore, MenuItem, Icon, SubMenu, StatusBrick, }, Navigation, } = extensions_1.Renderer;
const { Util, App, } = extensions_1.Common;
class PodAttachMenu extends react_1.default.Component {
    async attachToPod(container) {
        const { object: pod } = this.props;
        const kubectlPath = App.Preferences.getKubectlPath() || "kubectl";
        const commandParts = [
            kubectlPath,
            "attach",
            "-i",
            "-t",
            "-n", pod.getNs(),
            pod.getName(),
        ];
        if (window.navigator.platform !== "Win32") {
            commandParts.unshift("exec");
        }
        if (container) {
            commandParts.push("-c", container);
        }
        const shell = createTerminalTab({
            title: `Pod: ${pod.getName()} (namespace: ${pod.getNs()}) [Attached]`,
        });
        terminalStore.sendCommand(commandParts.join(" "), {
            enter: true,
            tabId: shell.id,
        });
        Navigation.hideDetails();
    }
    render() {
        const { object, toolbar } = this.props;
        const containers = object.getRunningContainers();
        if (!containers.length)
            return null;
        return (react_1.default.createElement(MenuItem, { onClick: Util.prevDefault(() => this.attachToPod(containers[0].name)) },
            react_1.default.createElement(Icon, { material: "pageview", interactive: toolbar, tooltip: toolbar && "Attach to Pod" }),
            react_1.default.createElement("span", { className: "title" }, "Attach Pod"),
            containers.length > 1 && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(Icon, { className: "arrow", material: "keyboard_arrow_right" }),
                react_1.default.createElement(SubMenu, null, containers.map(container => {
                    const { name } = container;
                    return (react_1.default.createElement(MenuItem, { key: name, onClick: Util.prevDefault(() => this.attachToPod(name)), className: "flex align-center" },
                        react_1.default.createElement(StatusBrick, null),
                        react_1.default.createElement("span", null, name)));
                }))))));
    }
}
exports.PodAttachMenu = PodAttachMenu;


/***/ }),

/***/ 639:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PodLogsMenu = void 0;
const react_1 = __importDefault(__webpack_require__(104));
const extensions_1 = __webpack_require__(931);
const { Component: { logTabStore, MenuItem, Icon, SubMenu, StatusBrick, }, Navigation, } = extensions_1.Renderer;
const { Util, } = extensions_1.Common;
class PodLogsMenu extends react_1.default.Component {
    showLogs(container) {
        Navigation.hideDetails();
        const pod = this.props.object;
        logTabStore.createPodTab({
            selectedPod: pod,
            selectedContainer: container,
        });
    }
    render() {
        const { object: pod, toolbar } = this.props;
        const containers = pod.getAllContainers();
        const statuses = pod.getContainerStatuses();
        if (!containers.length)
            return null;
        return (react_1.default.createElement(MenuItem, { onClick: Util.prevDefault(() => this.showLogs(containers[0])) },
            react_1.default.createElement(Icon, { material: "subject", interactive: toolbar, tooltip: toolbar && "Pod Logs" }),
            react_1.default.createElement("span", { className: "title" }, "Logs"),
            containers.length > 1 && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(Icon, { className: "arrow", material: "keyboard_arrow_right" }),
                react_1.default.createElement(SubMenu, null, containers.map(container => {
                    const { name } = container;
                    const status = statuses.find(status => status.name === name);
                    const brick = status ? (react_1.default.createElement(StatusBrick, { className: Util.cssNames(Object.keys(status.state)[0], { ready: status.ready }) })) : null;
                    return (react_1.default.createElement(MenuItem, { key: name, onClick: Util.prevDefault(() => this.showLogs(container)), className: "flex align-center" },
                        brick,
                        react_1.default.createElement("span", null, name)));
                }))))));
    }
}
exports.PodLogsMenu = PodLogsMenu;


/***/ }),

/***/ 117:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeMenu = void 0;
const react_1 = __importDefault(__webpack_require__(104));
const extensions_1 = __webpack_require__(931);
const { Component: { terminalStore, createTerminalTab, ConfirmDialog, MenuItem, Icon, }, Navigation, } = extensions_1.Renderer;
const { App, } = extensions_1.Common;
function NodeMenu(props) {
    const { object: node, toolbar } = props;
    if (!node) {
        return null;
    }
    const nodeName = node.getName();
    const kubectlPath = App.Preferences.getKubectlPath() || "kubectl";
    const sendToTerminal = (command) => {
        terminalStore.sendCommand(command, {
            enter: true,
            newTab: true,
        });
        Navigation.hideDetails();
    };
    const shell = () => {
        createTerminalTab({
            title: `Node: ${nodeName}`,
            node: nodeName,
        });
        Navigation.hideDetails();
    };
    const cordon = () => {
        sendToTerminal(`${kubectlPath} cordon ${nodeName}`);
    };
    const unCordon = () => {
        sendToTerminal(`${kubectlPath} uncordon ${nodeName}`);
    };
    const drain = () => {
        const command = `${kubectlPath} drain ${nodeName} --delete-local-data --ignore-daemonsets --force`;
        ConfirmDialog.open({
            ok: () => sendToTerminal(command),
            labelOk: `Drain Node`,
            message: (react_1.default.createElement("p", null,
                "Are you sure you want to drain ",
                react_1.default.createElement("b", null, nodeName),
                "?")),
        });
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(MenuItem, { onClick: shell },
            react_1.default.createElement(Icon, { svg: "ssh", interactive: toolbar, tooltip: toolbar && "Node shell" }),
            react_1.default.createElement("span", { className: "title" }, "Shell")),
        node.isUnschedulable()
            ? (react_1.default.createElement(MenuItem, { onClick: unCordon },
                react_1.default.createElement(Icon, { material: "play_circle_filled", tooltip: toolbar && "Uncordon", interactive: toolbar }),
                react_1.default.createElement("span", { className: "title" }, "Uncordon")))
            : (react_1.default.createElement(MenuItem, { onClick: cordon },
                react_1.default.createElement(Icon, { material: "pause_circle_filled", tooltip: toolbar && "Cordon", interactive: toolbar }),
                react_1.default.createElement("span", { className: "title" }, "Cordon"))),
        react_1.default.createElement(MenuItem, { onClick: drain },
            react_1.default.createElement(Icon, { material: "delete_sweep", tooltip: toolbar && "Drain", interactive: toolbar }),
            react_1.default.createElement("span", { className: "title" }, "Drain"))));
}
exports.NodeMenu = NodeMenu;


/***/ }),

/***/ 509:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PodShellMenu = void 0;
const react_1 = __importDefault(__webpack_require__(104));
const extensions_1 = __webpack_require__(931);
const { Component: { createTerminalTab, terminalStore, MenuItem, Icon, SubMenu, StatusBrick, }, Navigation, } = extensions_1.Renderer;
const { Util, App, } = extensions_1.Common;
class PodShellMenu extends react_1.default.Component {
    async execShell(container) {
        const { object: pod } = this.props;
        const kubectlPath = App.Preferences.getKubectlPath() || "kubectl";
        const commandParts = [
            kubectlPath,
            "exec",
            "-i",
            "-t",
            "-n", pod.getNs(),
            pod.getName(),
        ];
        if (window.navigator.platform !== "Win32") {
            commandParts.unshift("exec");
        }
        if (container) {
            commandParts.push("-c", container);
        }
        commandParts.push("--");
        if (pod.getSelectedNodeOs() === "windows") {
            commandParts.push("powershell");
        }
        else {
            commandParts.push('sh -c "clear; (bash || ash || sh)"');
        }
        const shell = createTerminalTab({
            title: `Pod: ${pod.getName()} (namespace: ${pod.getNs()})`,
        });
        terminalStore.sendCommand(commandParts.join(" "), {
            enter: true,
            tabId: shell.id,
        });
        Navigation.hideDetails();
    }
    render() {
        const { object, toolbar } = this.props;
        const containers = object.getRunningContainers();
        if (!containers.length)
            return null;
        return (react_1.default.createElement(MenuItem, { onClick: Util.prevDefault(() => this.execShell(containers[0].name)) },
            react_1.default.createElement(Icon, { svg: "ssh", interactive: toolbar, tooltip: toolbar && "Pod Shell" }),
            react_1.default.createElement("span", { className: "title" }, "Shell"),
            containers.length > 1 && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(Icon, { className: "arrow", material: "keyboard_arrow_right" }),
                react_1.default.createElement(SubMenu, null, containers.map(container => {
                    const { name } = container;
                    return (react_1.default.createElement(MenuItem, { key: name, onClick: Util.prevDefault(() => this.execShell(name)), className: "flex align-center" },
                        react_1.default.createElement(StatusBrick, null),
                        react_1.default.createElement("span", null, name)));
                }))))));
    }
}
exports.PodShellMenu = PodShellMenu;


/***/ }),

/***/ 931:
/***/ ((module) => {

module.exports = global.LensExtensions;

/***/ }),

/***/ 104:
/***/ ((module) => {

module.exports = global.React;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(553);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;