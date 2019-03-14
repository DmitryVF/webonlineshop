/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "71940e5db9a742b4ef29"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/bin/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(1)(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = "<search-bar></search-bar>\n<main-nav></main-nav>\n\n<!-- Banner -->\n\n<div class=\"banner\">\n    <div class=\"banner_background\" style=\"background-image:url(images/banner_background.jpg)\"></div>\n    <div class=\"container fill_height\">\n        <div class=\"row fill_height\">\n            <div class=\"banner_product_image\"><img class=\"img-fluid\" src=\"images/ecommerce-1992281_640.png\" alt=\"\"></div>\n            <div class=\"col-lg-5 offset-lg-4 fill_height\">\n                <div class=\"banner_content\">\n                    <h1 class=\"banner_text\">chose your best </h1>\n                    <!-- <div class=\"banner_price\"><span>$530</span>$460</div> -->\n                    <div class=\"banner_product_name\">Explore our catalog</div>\n                    <div class=\"button banner_button\"><a href=\"#/category/Books\">Shop Now</a></div>\n                </div>\n            </div>\n            \n        </div>\n    </div>\n</div>\n\n        <best-sellers></best-sellers>    \n        <slider></slider>\n        <recently-viewed></recently-viewed>\n        <footer-block></footer-block>\n      <!-- </div> -->\n  <!-- </div> -->\n \n \n\n"

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {//require('angular');
var carousel  = __webpack_require__(4);
var controllers = __webpack_require__(5);
var directives = __webpack_require__(6);
var services = __webpack_require__(21);
var _ = __webpack_require__(23);
__webpack_require__(24);
__webpack_require__(26);


angular.module('mean.users', ['ng', "angular-jwt", "ngCookies"]);

//includes auth front lib and mean.users angular app:
var req = __webpack_require__(28);
    req.keys().map(req);
    req = __webpack_require__(30);
    req.keys().map(req);
    req = __webpack_require__(32);
    req.keys().map(req);

     
// var auth_app = require('./auth-app'); 
if (process.env.NODE_ENV != 'production') {
  //added for webpack watch changes in html
  __webpack_require__(34);
}

var components = angular.module('mean-retail.components', ['ng', 'angularCSS']);

_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});


_.each(directives, function(directive, name) {
  components.directive(name, directive);
});


_.each(services, function(factory, name) {
  components.factory(name, factory);
});

/*this creates services using the .factory() function.
here we register service (it can be any function) and then
we can use it in any controller after typing dependency on this
service in controller definition
(all controllers live in injector object (like in wagner) 
and if they dependent on some service it must be written 
as a parametr in controller function definition)
*/

var app = angular.module('mean-retail', ['mean-retail.components', 
  'mean.users', 
  //'ngRoute', 
  'ngAnimate', 'ngSanitize','ui.bootstrap', 
  'ui.router',
  'ngMaterial', 'ngAria', 'angular-carousel', 'angularCSS']);

app.config(function($stateProvider) {


  $stateProvider.state({
    name: 'home',
    url: '',
    // template: '<checkout></checkout>'
    template: __webpack_require__(0)
  });

  $stateProvider.state({
    name: 'home1',
    url: '/',
    template: __webpack_require__(0),
    controller: 'RedirectController'
  });

  $stateProvider.state({
    name: 'home2',
    url: '/_=_',
    template: __webpack_require__(0),
    controller: 'RedirectController'
  });

  $stateProvider.state({
    name: 'blog_single',
    url: '/blog_single',
    template: __webpack_require__(35),
    controller: 'BlogSingleController'
  });

  $stateProvider.state({
    name: 'about',
    url: '/about',
    template: __webpack_require__(36),
    controller: 'AboutController'
  });

  $stateProvider.state({
    name: 'checkout',
    url: '/checkout',
    template: '<checkout></checkout>'
  });

  $stateProvider.state({
    name: 'likes',
    url: '/likes', 
    template: '<likes></likes>'
  });

  $stateProvider.state({
    name: 'category',
    url: '/category/:category',
    template: __webpack_require__(37)
  });
 
  $stateProvider.state({
    name: 'product',
    url: '/product/:id', 
    template: __webpack_require__(38)
  });

    $stateProvider.state({
      name: 'login',
      url: '/login',
      stateparams:{ LoginTemplateUrl :'templates/users/index.html',
      card:"Log in"},
      template: '<login-modal></login-modal>'
    });
  // if (process.env.NODE_ENV != 'production') {
  //   $stateProvider.state({
  //     name: 'login',
  //     url: '/login',
  //     stateparams:{ LoginTemplateUrl :'templates/users/index.html',
  //     card:"Log in"},
  //     template: '<login-modal></login-modal>'
  //   });
  // }  
  // else{
  //   $stateProvider.state({
  //     name: 'login',
  //     url: '/login',
  //     stateparams:{ LoginTemplateUrl :'templates/users/hello.html',
  //     card:"Log in"},
  //     template: '<login-modal></login-modal>'
  //   });
  // };

  $stateProvider.state({
    name: 'signin',
    url: '/signin',
    stateparams:{ LoginTemplateUrl :'templates/users/login.html',
                  card:"Sign in"},
    template: '<login-modal></login-modal>',
  });
  $stateProvider.state({
    name: 'register',
    url: '/register',
    stateparams:{ LoginTemplateUrl :'templates/users/register.html',
                  card:"Register"},
    template: '<login-modal></login-modal>'
  });
  $stateProvider.state({
    name: 'forgot-password',
    url: '/forgot',
    stateparams:{ LoginTemplateUrl :'templates/users/forgot-password.html',
                  card:"Forgot Password"},
    template: '<login-modal></login-modal>'
  });
  $stateProvider.state({
    name: 'reset',
    url: '/reset/:tokenId',
    stateparams:{ LoginTemplateUrl :'templates/users/reset-password.html',
                  card:"Reset password"},
    template: '<login-modal></login-modal>'
  });
  
}); 
 
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Angular Carousel - Mobile friendly touch carousel for AngularJS
 * @version v1.0.2 - 2017-08-03
 * @link http://revolunet.github.com/angular-carousel
 * @author Julien Bouquillon <julien@revolunet.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
/*global angular */

/*
Angular touch carousel with CSS GPU accel and slide buffering
http://github.com/revolunet/angular-carousel

*/

angular.module('angular-carousel', [
    'ngTouch',
    'angular-carousel.shifty'
]);

angular.module('angular-carousel')

.directive('rnCarouselAutoSlide', ['$interval', function($interval) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
        var stopAutoPlay = function() {
            if (scope.autoSlider) {
                $interval.cancel(scope.autoSlider);
                scope.autoSlider = null;
            }
        };
        var restartTimer = function() {
            scope.autoSlide();
        };

        scope.$watch('carouselIndex', restartTimer);

        if (attrs.hasOwnProperty('rnCarouselPauseOnHover') && attrs.rnCarouselPauseOnHover !== 'false'){
            element.on('mouseenter', stopAutoPlay);
            element.on('mouseleave', restartTimer);
        }

        scope.$on('$destroy', function(){
            stopAutoPlay();
            element.off('mouseenter', stopAutoPlay);
            element.off('mouseleave', restartTimer);
        });
    }
  };
}]);

angular.module('angular-carousel')

.directive('rnCarouselIndicators', ['$parse', function($parse) {
  return {
    restrict: 'A',
    scope: {
      slides: '=',
      index: '=rnCarouselIndex'
    },
    templateUrl: 'carousel-indicators.html',
    link: function(scope, iElement, iAttributes) {
      var indexModel = $parse(iAttributes.rnCarouselIndex);
      scope.goToSlide = function(index) {
        indexModel.assign(scope.$parent.$parent, index);
      };
    }
  };
}]);

angular.module('angular-carousel').run(['$templateCache', function($templateCache) {
  $templateCache.put('carousel-indicators.html',
      '<div class="rn-carousel-indicator">\n' +
        '<span ng-repeat="slide in slides" ng-class="{active: $index==index}" ng-click="goToSlide($index)">●</span>' +
      '</div>'
  );
}]);

(function() {
    "use strict";

    angular.module('angular-carousel')

    .service('DeviceCapabilities', function() {

        // TODO: merge in a single function

        // detect supported CSS property
        function detectTransformProperty() {
            var transformProperty = 'transform',
                safariPropertyHack = 'webkitTransform';
            if (typeof document.body.style[transformProperty] !== 'undefined') {

                ['webkit', 'moz', 'o', 'ms'].every(function (prefix) {
                    var e = '-' + prefix + '-transform';
                    if (typeof document.body.style[e] !== 'undefined') {
                        transformProperty = e;
                        return false;
                    }
                    return true;
                });
            } else if (typeof document.body.style[safariPropertyHack] !== 'undefined') {
                transformProperty = '-webkit-transform';
            } else {
                transformProperty = undefined;
            }
            return transformProperty;
        }

        //Detect support of translate3d
        function detect3dSupport() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform': '-webkit-transform',
                    'msTransform': '-ms-transform',
                    'transform': 'transform'
                };
            // Add it to the body to get the computed style
            document.body.insertBefore(el, null);
            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        }

        return {
            has3d: detect3dSupport(),
            transformProperty: detectTransformProperty()
        };

    })

    .service('computeCarouselSlideStyle', ["DeviceCapabilities", function(DeviceCapabilities) {
        // compute transition transform properties for a given slide and global offset
        return function(slideIndex, offset, transitionType) {
            var style = {
                    display: 'inline-block'
                },
                opacity,
                absoluteLeft = (slideIndex * 100) + offset,
                slideTransformValue = DeviceCapabilities.has3d ? 'translate3d(' + absoluteLeft + '%, 0, 0)' : 'translate3d(' + absoluteLeft + '%, 0)',
                distance = ((100 - Math.abs(absoluteLeft)) / 100);

            if (!DeviceCapabilities.transformProperty) {
                // fallback to default slide if transformProperty is not available
                style['margin-left'] = absoluteLeft + '%';
            } else {
                if (transitionType == 'fadeAndSlide') {
                    style[DeviceCapabilities.transformProperty] = slideTransformValue;
                    opacity = 0;
                    if (Math.abs(absoluteLeft) < 100) {
                        opacity = 0.3 + distance * 0.7;
                    }
                    style.opacity = opacity;
                } else if (transitionType == 'hexagon') {
                    var transformFrom = 100,
                        degrees = 0,
                        maxDegrees = 60 * (distance - 1);

                    transformFrom = offset < (slideIndex * -100) ? 100 : 0;
                    degrees = offset < (slideIndex * -100) ? maxDegrees : -maxDegrees;
                    style[DeviceCapabilities.transformProperty] = slideTransformValue + ' ' + 'rotateY(' + degrees + 'deg)';
                    style[DeviceCapabilities.transformProperty + '-origin'] = transformFrom + '% 50%';
                } else if (transitionType == 'zoom') {
                    style[DeviceCapabilities.transformProperty] = slideTransformValue;
                    var scale = 1;
                    if (Math.abs(absoluteLeft) < 100) {
                        scale = 1 + ((1 - distance) * 2);
                    }
                    style[DeviceCapabilities.transformProperty] += ' scale(' + scale + ')';
                    style[DeviceCapabilities.transformProperty + '-origin'] = '50% 50%';
                    opacity = 0;
                    if (Math.abs(absoluteLeft) < 100) {
                        opacity = 0.3 + distance * 0.7;
                    }
                    style.opacity = opacity;
                } else {
                    style[DeviceCapabilities.transformProperty] = slideTransformValue;
                }
            }
            return style;
        };
    }])

    .service('createStyleString', function() {
        return function(object) {
            var styles = [];
            angular.forEach(object, function(value, key) {
                styles.push(key + ':' + value);
            });
            return styles.join(';');
        };
    })

    .directive('rnCarousel', ['$swipe', '$window', '$document', '$parse', '$compile', '$timeout', '$interval', 'computeCarouselSlideStyle', 'createStyleString', 'Tweenable',
        function($swipe, $window, $document, $parse, $compile, $timeout, $interval, computeCarouselSlideStyle, createStyleString, Tweenable) {
            // internal ids to allow multiple instances
            var carouselId = 0,
                // in absolute pixels, at which distance the slide stick to the edge on release
                rubberTreshold = 3;

            var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;

            function getItemIndex(collection, target, defaultIndex) {
                var result = defaultIndex;
                collection.every(function(item, index) {
                    if (angular.equals(item, target)) {
                        result = index;
                        return false;
                    }
                    return true;
                });
                return result;
            }

            return {
                restrict: 'A',
                scope: true,
                compile: function(tElement, tAttributes) {
                    // use the compile phase to customize the DOM
                    var firstChild = tElement[0].querySelector('li'),
                        firstChildAttributes = (firstChild) ? firstChild.attributes : [],
                        isRepeatBased = false,
                        isBuffered = false,
                        repeatItem,
                        repeatCollection;

                    // try to find an ngRepeat expression
                    // at this point, the attributes are not yet normalized so we need to try various syntax
                    ['ng-repeat', 'data-ng-repeat', 'ng:repeat', 'x-ng-repeat'].every(function(attr) {
                        var repeatAttribute = firstChildAttributes[attr];
                        if (angular.isDefined(repeatAttribute)) {
                            // ngRepeat regexp extracted from angular 1.2.7 src
                            var exprMatch = repeatAttribute.value.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),
                                trackProperty = exprMatch[3];

                            repeatItem = exprMatch[1];
                            repeatCollection = exprMatch[2];

                            if (repeatItem) {
                                if (angular.isDefined(tAttributes['rnCarouselBuffered'])) {
                                    // update the current ngRepeat expression and add a slice operator if buffered
                                    isBuffered = true;
                                    repeatAttribute.value = repeatItem + ' in ' + repeatCollection + '|carouselSlice:carouselBufferIndex:carouselBufferSize';
                                    if (trackProperty) {
                                        repeatAttribute.value += ' track by ' + trackProperty;
                                    }
                                }
                                isRepeatBased = true;
                                return false;
                            }
                        }
                        return true;
                    });

                    return function(scope, iElement, iAttributes, containerCtrl) {

                        carouselId++;

                        var defaultOptions = {
                            transitionType: iAttributes.rnCarouselTransition || 'slide',
                            transitionEasing: iAttributes.rnCarouselEasing || 'easeTo',
                            transitionDuration: parseInt(iAttributes.rnCarouselDuration, 10) || 300,
                            isSequential: true,
                            autoSlideDuration: 3,
                            bufferSize: 5,
                            /* in container % how much we need to drag to trigger the slide change */
                            moveTreshold: 0.1,
                            defaultIndex: 0
                        };

                        // TODO
                        var options = angular.extend({}, defaultOptions);

                        var pressed,
                            startX,
                            isIndexBound = false,
                            offset = 0,
                            destination,
                            swipeMoved = false,
                            //animOnIndexChange = true,
                            currentSlides = [],
                            elWidth = null,
                            elX = null,
                            animateTransitions = true,
                            intialState = true,
                            animating = false,
                            mouseUpBound = false,
                            locked = false;

                        //rn-swipe-disabled =true will only disable swipe events
                        if(iAttributes.rnSwipeDisabled !== "true") {
                            $swipe.bind(iElement, {
                                start: swipeStart,
                                move: swipeMove,
                                end: swipeEnd,
                                cancel: function(event) {
                                    swipeEnd({}, event);
                                }
                            });
                        }

                        function getSlidesDOM() {
                            var nodes = iElement[0].childNodes;
                            var slides = [];
                            for(var i=0; i<nodes.length ;i++){
                                if(nodes[i].tagName === "LI"){
                                    slides.push(nodes[i]);
                                }
                            }
                            return slides;
                        }

                        function documentMouseUpEvent(event) {
                            // in case we click outside the carousel, trigger a fake swipeEnd
                            swipeMoved = true;
                            swipeEnd({
                                x: event.clientX,
                                y: event.clientY
                            }, event);
                        }

                        function updateSlidesPosition(offset) {
                            // manually apply transformation to carousel childrens
                            // todo : optim : apply only to visible items
                            var x = scope.carouselBufferIndex * 100 + offset;
                            angular.forEach(getSlidesDOM(), function(child, index) {
                                child.style.cssText = createStyleString(computeCarouselSlideStyle(index, x, options.transitionType));
                            });
                        }

                        scope.nextSlide = function(slideOptions) {
                            var index = scope.carouselIndex + 1;
                            if (index > currentSlides.length - 1) {
                                index = 0;
                            }
                            if (!locked) {
                                goToSlide(index, slideOptions);
                            }
                        };

                        scope.prevSlide = function(slideOptions) {
                            var index = scope.carouselIndex - 1;
                            if (index < 0) {
                                index = currentSlides.length - 1;
                            }
                            goToSlide(index, slideOptions);
                        };

                        function goToSlide(index, slideOptions) {
                            //console.log('goToSlide', arguments);
                            // move a to the given slide index
                            if (index === undefined) {
                                index = scope.carouselIndex;
                            }

                            slideOptions = slideOptions || {};
                            if (slideOptions.animate === false || options.transitionType === 'none') {
                                locked = false;
                                offset = index * -100;
                                scope.carouselIndex = index;
                                updateBufferIndex();
                                return;
                            }

                            locked = true;
                            var tweenable = new Tweenable();
                            tweenable.tween({
                                from: {
                                    'x': offset
                                },
                                to: {
                                    'x': index * -100
                                },
                                duration: options.transitionDuration,
                                easing: options.transitionEasing,
                                step: function(state) {
                                    if (isFinite(state.x)) {
                                      updateSlidesPosition(state.x);
                                    }
                                },
                                finish: function() {
                                    scope.$apply(function() {
                                        scope.carouselIndex = index;
                                        offset = index * -100;
                                        updateBufferIndex();
                                        $timeout(function () {
                                          locked = false;
                                        }, 0, false);
                                    });
                                }
                            });
                        }

                        function getContainerWidth() {
                            var rect = iElement[0].getBoundingClientRect();
                            return rect.width ? rect.width : rect.right - rect.left;
                        }

                        function updateContainerWidth() {
                            elWidth = getContainerWidth();
                        }

                        function bindMouseUpEvent() {
                            if (!mouseUpBound) {
                              mouseUpBound = true;
                              $document.bind('mouseup', documentMouseUpEvent);
                            }
                        }

                        function unbindMouseUpEvent() {
                            if (mouseUpBound) {
                              mouseUpBound = false;
                              $document.unbind('mouseup', documentMouseUpEvent);
                            }
                        }

                        function swipeStart(coords, event) {
                            // console.log('swipeStart', coords, event);
                            if (locked || currentSlides.length <= 1) {
                                return;
                            }
                            updateContainerWidth();
                            elX = iElement[0].querySelector('li').getBoundingClientRect().left;
                            pressed = true;
                            startX = coords.x;
                            return false;
                        }

                        function swipeMove(coords, event) {
                            //console.log('swipeMove', coords, event);
                            var x, delta;
                            bindMouseUpEvent();
                            if (pressed) {
                                x = coords.x;
                                delta = startX - x;
                                if (delta > 2 || delta < -2) {
                                    swipeMoved = true;
                                    var moveOffset = offset + (-delta * 100 / elWidth);
                                    updateSlidesPosition(moveOffset);
                                }
                            }
                            return false;
                        }

                        var init = true;
                        scope.carouselIndex = 0;

                        if (!isRepeatBased) {
                            // fake array when no ng-repeat
                            currentSlides = [];
                            angular.forEach(getSlidesDOM(), function(node, index) {
                                currentSlides.push({id: index});
                            });
                            if (iAttributes.rnCarouselHtmlSlides) {
                                var updateParentSlides = function(value) {
                                    slidesModel.assign(scope.$parent, value);
                                };
                                var slidesModel = $parse(iAttributes.rnCarouselHtmlSlides);
                                if (angular.isFunction(slidesModel.assign)) {
                                    /* check if this property is assignable then watch it */
                                    scope.$watch('htmlSlides', function(newValue) {
                                        updateParentSlides(newValue);
                                    });
                                    scope.$parent.$watch(slidesModel, function(newValue, oldValue) {
                                        if (newValue !== undefined && newValue !== null) {
                                            newValue = 0;
                                            updateParentIndex(newValue);
                                        }
                                    });
                                }
                                scope.htmlSlides = currentSlides;
                            }
                        }

                        if (iAttributes.rnCarouselControls!==undefined) {
                            // dont use a directive for this
                            var canloop = ((isRepeatBased ? scope.$eval(repeatCollection.replace('::', '')).length : currentSlides.length) > 1) ? angular.isDefined(tAttributes['rnCarouselControlsAllowLoop']) : false;
                            var nextSlideIndexCompareValue = isRepeatBased ? '(' + repeatCollection.replace('::', '') + ').length - 1' : currentSlides.length - 1;
                            var tpl = '<div class="rn-carousel-controls">\n' +
                                '  <span class="rn-carousel-control rn-carousel-control-prev" ng-click="prevSlide()" ng-if="carouselIndex > 0 || ' + canloop + '"></span>\n' +
                                '  <span class="rn-carousel-control rn-carousel-control-next" ng-click="nextSlide()" ng-if="carouselIndex < ' + nextSlideIndexCompareValue + ' || ' + canloop + '"></span>\n' +
                                '</div>';
                            iElement.parent().append($compile(angular.element(tpl))(scope));
                        }

                        if (iAttributes.rnCarouselAutoSlide!==undefined) {
                            var duration = parseInt(iAttributes.rnCarouselAutoSlide, 10) || options.autoSlideDuration;
                            scope.autoSlide = function() {
                                if (scope.autoSlider) {
                                    $interval.cancel(scope.autoSlider);
                                    scope.autoSlider = null;
                                }
                                scope.autoSlider = $interval(function() {
                                    if (!locked && !pressed) {
                                        scope.nextSlide();
                                    }
                                }, duration * 1000);
                            };
                        }

                        if (iAttributes.rnCarouselDefaultIndex) {
                            var defaultIndexModel = $parse(iAttributes.rnCarouselDefaultIndex);
                            options.defaultIndex = defaultIndexModel(scope.$parent) || 0;
                        }

                        if (iAttributes.rnCarouselIndex) {
                            var updateParentIndex = function(value) {
                                indexModel.assign(scope.$parent, value);
                            };
                            var indexModel = $parse(iAttributes.rnCarouselIndex);
                            if (angular.isFunction(indexModel.assign)) {
                                /* check if this property is assignable then watch it */
                                scope.$watch('carouselIndex', function(newValue) {
                                    updateParentIndex(newValue);
                                });
                                scope.$parent.$watch(indexModel, function(newValue, oldValue) {

                                    if (newValue !== undefined && newValue !== null) {
                                        if (currentSlides && currentSlides.length > 0 && newValue >= currentSlides.length) {
                                            newValue = currentSlides.length - 1;
                                            updateParentIndex(newValue);
                                        } else if (currentSlides && newValue < 0) {
                                            newValue = 0;
                                            updateParentIndex(newValue);
                                        }
                                        if (!locked) {
                                            goToSlide(newValue, {
                                                animate: !init
                                            });
                                        }
                                        init = false;
                                    }
                                });
                                isIndexBound = true;

                                if (options.defaultIndex) {
                                    goToSlide(options.defaultIndex, {
                                        animate: !init
                                    });
                                }
                            } else if (!isNaN(iAttributes.rnCarouselIndex)) {
                                /* if user just set an initial number, set it */
                                goToSlide(parseInt(iAttributes.rnCarouselIndex, 10), {
                                    animate: false
                                });
                            }
                        } else {
                            goToSlide(options.defaultIndex, {
                                animate: !init
                            });
                            init = false;
                        }

                        if (iAttributes.rnCarouselLocked) {
                            scope.$watch(iAttributes.rnCarouselLocked, function(newValue, oldValue) {
                                // only bind swipe when it's not switched off
                                if(newValue === true) {
                                    locked = true;
                                } else {
                                    locked = false;
                                }
                            });
                        }

                        if (isRepeatBased) {
                            // use rn-carousel-deep-watch to fight the Angular $watchCollection weakness : https://github.com/angular/angular.js/issues/2621
                            // optional because it have some performance impacts (deep watch)
                            var deepWatch = (iAttributes.rnCarouselDeepWatch!==undefined);

                            scope[deepWatch?'$watch':'$watchCollection'](repeatCollection, function(newValue, oldValue) {
                                //console.log('repeatCollection', currentSlides);
                                currentSlides = newValue;
                                // if deepWatch ON ,manually compare objects to guess the new position
                                if (!angular.isArray(currentSlides)) {
                                  throw Error('the slides collection must be an Array');
                                }
                                if (deepWatch && angular.isArray(newValue)) {
                                    var activeElement = oldValue[scope.carouselIndex];
                                    var newIndex = getItemIndex(newValue, activeElement, scope.carouselIndex);
                                    goToSlide(newIndex, {animate: false});
                                } else {
                                    goToSlide(scope.carouselIndex, {animate: false});
                                }
                            }, true);
                        }

                        function swipeEnd(coords, event, forceAnimation) {
                            //  console.log('swipeEnd', 'scope.carouselIndex', scope.carouselIndex);
                            // Prevent clicks on buttons inside slider to trigger "swipeEnd" event on touchend/mouseup
                            // console.log(iAttributes.rnCarouselOnInfiniteScroll);
                            if (event && !swipeMoved) {
                                return;
                            }
                            unbindMouseUpEvent();
                            pressed = false;
                            swipeMoved = false;
                            destination = startX - coords.x;
                            if (destination===0) {
                                return;
                            }
                            if (locked) {
                                return;
                            }
                            offset += (-destination * 100 / elWidth);
                            if (options.isSequential) {
                                var minMove = options.moveTreshold * elWidth,
                                    absMove = -destination,
                                    slidesMove = -Math[absMove >= 0 ? 'ceil' : 'floor'](absMove / elWidth),
                                    shouldMove = Math.abs(absMove) > minMove;

                                if (currentSlides && (slidesMove + scope.carouselIndex) >= currentSlides.length) {
                                    slidesMove = currentSlides.length - 1 - scope.carouselIndex;
                                }
                                if ((slidesMove + scope.carouselIndex) < 0) {
                                    slidesMove = -scope.carouselIndex;
                                }
                                var moveOffset = shouldMove ? slidesMove : 0;

                                destination = (scope.carouselIndex + moveOffset);

                                goToSlide(destination);
                                if(iAttributes.rnCarouselOnInfiniteScrollRight!==undefined && slidesMove === 0 && scope.carouselIndex !== 0) {
                                    $parse(iAttributes.rnCarouselOnInfiniteScrollRight)(scope)
                                    goToSlide(0);
                                }
                                if(iAttributes.rnCarouselOnInfiniteScrollLeft!==undefined && slidesMove === 0 && scope.carouselIndex === 0 && moveOffset === 0) {
                                    $parse(iAttributes.rnCarouselOnInfiniteScrollLeft)(scope)
                                    goToSlide(currentSlides.length);
                                }

                            } else {
                                scope.$apply(function() {
                                    scope.carouselIndex = parseInt(-offset / 100, 10);
                                    updateBufferIndex();
                                });

                            }

                        }

                        scope.$on('$destroy', function() {
                            unbindMouseUpEvent();
                        });

                        scope.carouselBufferIndex = 0;
                        scope.carouselBufferSize = options.bufferSize;

                        function updateBufferIndex() {
                            // update and cap te buffer index
                            var bufferIndex = 0;
                            var bufferEdgeSize = (scope.carouselBufferSize - 1) / 2;
                            if (isBuffered) {
                                if (scope.carouselIndex <= bufferEdgeSize) {
                                    // first buffer part
                                    bufferIndex = 0;
                                } else if (currentSlides && currentSlides.length < scope.carouselBufferSize) {
                                    // smaller than buffer
                                    bufferIndex = 0;
                                } else if (currentSlides && scope.carouselIndex > currentSlides.length - scope.carouselBufferSize) {
                                    // last buffer part
                                    bufferIndex = currentSlides.length - scope.carouselBufferSize;
                                } else {
                                    // compute buffer start
                                    bufferIndex = scope.carouselIndex - bufferEdgeSize;
                                }

                                scope.carouselBufferIndex = bufferIndex;
                                $timeout(function() {
                                    updateSlidesPosition(offset);
                                }, 0, false);
                            } else {
                                $timeout(function() {
                                    updateSlidesPosition(offset);
                                }, 0, false);
                            }
                        }

                        function onOrientationChange() {
                            updateContainerWidth();
                            goToSlide();
                        }

                        // handle orientation change
                        var winEl = angular.element($window);
                        winEl.bind('orientationchange', onOrientationChange);
                        winEl.bind('resize', onOrientationChange);

                        scope.$on('$destroy', function() {
                            unbindMouseUpEvent();
                            winEl.unbind('orientationchange', onOrientationChange);
                            winEl.unbind('resize', onOrientationChange);
                        });
                    };
                }
            };
        }
    ]);
})();



angular.module('angular-carousel.shifty', [])

.factory('Tweenable', function() {

    /*! shifty - v1.3.4 - 2014-10-29 - http://jeremyckahn.github.io/shifty */
  ;(function (root) {

  /*!
   * Shifty Core
   * By Jeremy Kahn - jeremyckahn@gmail.com
   */

  var Tweenable = (function () {

    'use strict';

    // Aliases that get defined later in this function
    var formula;

    // CONSTANTS
    var DEFAULT_SCHEDULE_FUNCTION;
    var DEFAULT_EASING = 'linear';
    var DEFAULT_DURATION = 500;
    var UPDATE_TIME = 1000 / 60;

    var _now = Date.now
         ? Date.now
         : function () {return +new Date();};

    var now = typeof SHIFTY_DEBUG_NOW !== 'undefined' ? SHIFTY_DEBUG_NOW : _now;

    if (typeof window !== 'undefined') {
      // requestAnimationFrame() shim by Paul Irish (modified for Shifty)
      // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
      DEFAULT_SCHEDULE_FUNCTION = window.requestAnimationFrame
         || window.webkitRequestAnimationFrame
         || window.oRequestAnimationFrame
         || window.msRequestAnimationFrame
         || (window.mozCancelRequestAnimationFrame
         && window.mozRequestAnimationFrame)
         || setTimeout;
    } else {
      DEFAULT_SCHEDULE_FUNCTION = setTimeout;
    }

    function noop () {
      // NOOP!
    }

    /*!
     * Handy shortcut for doing a for-in loop. This is not a "normal" each
     * function, it is optimized for Shifty.  The iterator function only receives
     * the property name, not the value.
     * @param {Object} obj
     * @param {Function(string)} fn
     */
    function each (obj, fn) {
      var key;
      for (key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          fn(key);
        }
      }
    }

    /*!
     * Perform a shallow copy of Object properties.
     * @param {Object} targetObject The object to copy into
     * @param {Object} srcObject The object to copy from
     * @return {Object} A reference to the augmented `targetObj` Object
     */
    function shallowCopy (targetObj, srcObj) {
      each(srcObj, function (prop) {
        targetObj[prop] = srcObj[prop];
      });

      return targetObj;
    }

    /*!
     * Copies each property from src onto target, but only if the property to
     * copy to target is undefined.
     * @param {Object} target Missing properties in this Object are filled in
     * @param {Object} src
     */
    function defaults (target, src) {
      each(src, function (prop) {
        if (typeof target[prop] === 'undefined') {
          target[prop] = src[prop];
        }
      });
    }

    /*!
     * Calculates the interpolated tween values of an Object for a given
     * timestamp.
     * @param {Number} forPosition The position to compute the state for.
     * @param {Object} currentState Current state properties.
     * @param {Object} originalState: The original state properties the Object is
     * tweening from.
     * @param {Object} targetState: The destination state properties the Object
     * is tweening to.
     * @param {number} duration: The length of the tween in milliseconds.
     * @param {number} timestamp: The UNIX epoch time at which the tween began.
     * @param {Object} easing: This Object's keys must correspond to the keys in
     * targetState.
     */
    function tweenProps (forPosition, currentState, originalState, targetState,
      duration, timestamp, easing) {
      var normalizedPosition = (forPosition - timestamp) / duration;

      var prop;
      for (prop in currentState) {
        if (currentState.hasOwnProperty(prop)) {
          currentState[prop] = tweenProp(originalState[prop],
            targetState[prop], formula[easing[prop]], normalizedPosition);
        }
      }

      return currentState;
    }

    /*!
     * Tweens a single property.
     * @param {number} start The value that the tween started from.
     * @param {number} end The value that the tween should end at.
     * @param {Function} easingFunc The easing curve to apply to the tween.
     * @param {number} position The normalized position (between 0.0 and 1.0) to
     * calculate the midpoint of 'start' and 'end' against.
     * @return {number} The tweened value.
     */
    function tweenProp (start, end, easingFunc, position) {
      return start + (end - start) * easingFunc(position);
    }

    /*!
     * Applies a filter to Tweenable instance.
     * @param {Tweenable} tweenable The `Tweenable` instance to call the filter
     * upon.
     * @param {String} filterName The name of the filter to apply.
     */
    function applyFilter (tweenable, filterName) {
      var filters = Tweenable.prototype.filter;
      var args = tweenable._filterArgs;

      each(filters, function (name) {
        if (typeof filters[name][filterName] !== 'undefined') {
          filters[name][filterName].apply(tweenable, args);
        }
      });
    }

    var timeoutHandler_endTime;
    var timeoutHandler_currentTime;
    var timeoutHandler_isEnded;
    var timeoutHandler_offset;
    /*!
     * Handles the update logic for one step of a tween.
     * @param {Tweenable} tweenable
     * @param {number} timestamp
     * @param {number} duration
     * @param {Object} currentState
     * @param {Object} originalState
     * @param {Object} targetState
     * @param {Object} easing
     * @param {Function(Object, *, number)} step
     * @param {Function(Function,number)}} schedule
     */
    function timeoutHandler (tweenable, timestamp, duration, currentState,
      originalState, targetState, easing, step, schedule) {
      timeoutHandler_endTime = timestamp + duration;
      timeoutHandler_currentTime = Math.min(now(), timeoutHandler_endTime);
      timeoutHandler_isEnded =
        timeoutHandler_currentTime >= timeoutHandler_endTime;

      timeoutHandler_offset = duration - (
          timeoutHandler_endTime - timeoutHandler_currentTime);

      if (tweenable.isPlaying() && !timeoutHandler_isEnded) {
        tweenable._scheduleId = schedule(tweenable._timeoutHandler, UPDATE_TIME);

        applyFilter(tweenable, 'beforeTween');
        tweenProps(timeoutHandler_currentTime, currentState, originalState,
          targetState, duration, timestamp, easing);
        applyFilter(tweenable, 'afterTween');

        step(currentState, tweenable._attachment, timeoutHandler_offset);
      } else if (timeoutHandler_isEnded) {
        step(targetState, tweenable._attachment, timeoutHandler_offset);
        tweenable.stop(true);
      }
    }


    /*!
     * Creates a usable easing Object from either a string or another easing
     * Object.  If `easing` is an Object, then this function clones it and fills
     * in the missing properties with "linear".
     * @param {Object} fromTweenParams
     * @param {Object|string} easing
     */
    function composeEasingObject (fromTweenParams, easing) {
      var composedEasing = {};

      if (typeof easing === 'string') {
        each(fromTweenParams, function (prop) {
          composedEasing[prop] = easing;
        });
      } else {
        each(fromTweenParams, function (prop) {
          if (!composedEasing[prop]) {
            composedEasing[prop] = easing[prop] || DEFAULT_EASING;
          }
        });
      }

      return composedEasing;
    }

    /**
     * Tweenable constructor.
     * @param {Object=} opt_initialState The values that the initial tween should start at if a "from" object is not provided to Tweenable#tween.
     * @param {Object=} opt_config See Tweenable.prototype.setConfig()
     * @constructor
     */
    function Tweenable (opt_initialState, opt_config) {
      this._currentState = opt_initialState || {};
      this._configured = false;
      this._scheduleFunction = DEFAULT_SCHEDULE_FUNCTION;

      // To prevent unnecessary calls to setConfig do not set default configuration here.
      // Only set default configuration immediately before tweening if none has been set.
      if (typeof opt_config !== 'undefined') {
        this.setConfig(opt_config);
      }
    }

    /**
     * Configure and start a tween.
     * @param {Object=} opt_config See Tweenable.prototype.setConfig()
     * @return {Tweenable}
     */
    Tweenable.prototype.tween = function (opt_config) {
      if (this._isTweening) {
        return this;
      }

      // Only set default config if no configuration has been set previously and none is provided now.
      if (opt_config !== undefined || !this._configured) {
        this.setConfig(opt_config);
      }

      this._timestamp = now();
      this._start(this.get(), this._attachment);
      return this.resume();
    };

    /**
     * Sets the tween configuration. `config` may have the following options:
     *
     * - __from__ (_Object=_): Starting position.  If omitted, the current state is used.
     * - __to__ (_Object=_): Ending position.
     * - __duration__ (_number=_): How many milliseconds to animate for.
     * - __start__ (_Function(Object)_): Function to execute when the tween begins.  Receives the state of the tween as the first parameter. Attachment is the second parameter.
     * - __step__ (_Function(Object, *, number)_): Function to execute on every tick.  Receives the state of the tween as the first parameter. Attachment is the second parameter, and the time elapsed since the start of the tween is the third parameter. This function is not called on the final step of the animation, but `finish` is.
     * - __finish__ (_Function(Object, *)_): Function to execute upon tween completion.  Receives the state of the tween as the first parameter. Attachment is the second parameter.
     * - __easing__ (_Object|string=_): Easing curve name(s) to use for the tween.
     * - __attachment__ (_Object|string|any=_): Value that is attached to this instance and passed on to the step/start/finish methods.
     * @param {Object} config
     * @return {Tweenable}
     */
    Tweenable.prototype.setConfig = function (config) {
      config = config || {};
      this._configured = true;

      // Attach something to this Tweenable instance (e.g.: a DOM element, an object, a string, etc.);
      this._attachment = config.attachment;

      // Init the internal state
      this._pausedAtTime = null;
      this._scheduleId = null;
      this._start = config.start || noop;
      this._step = config.step || noop;
      this._finish = config.finish || noop;
      this._duration = config.duration || DEFAULT_DURATION;
      this._currentState = config.from || this.get();
      this._originalState = this.get();
      this._targetState = config.to || this.get();

      // Aliases used below
      var currentState = this._currentState;
      var targetState = this._targetState;

      // Ensure that there is always something to tween to.
      defaults(targetState, currentState);

      this._easing = composeEasingObject(
        currentState, config.easing || DEFAULT_EASING);

      this._filterArgs =
        [currentState, this._originalState, targetState, this._easing];

      applyFilter(this, 'tweenCreated');
      return this;
    };

    /**
     * Gets the current state.
     * @return {Object}
     */
    Tweenable.prototype.get = function () {
      return shallowCopy({}, this._currentState);
    };

    /**
     * Sets the current state.
     * @param {Object} state
     */
    Tweenable.prototype.set = function (state) {
      this._currentState = state;
    };

    /**
     * Pauses a tween.  Paused tweens can be resumed from the point at which they were paused.  This is different than [`stop()`](#stop), as that method causes a tween to start over when it is resumed.
     * @return {Tweenable}
     */
    Tweenable.prototype.pause = function () {
      this._pausedAtTime = now();
      this._isPaused = true;
      return this;
    };

    /**
     * Resumes a paused tween.
     * @return {Tweenable}
     */
    Tweenable.prototype.resume = function () {
      if (this._isPaused) {
        this._timestamp += now() - this._pausedAtTime;
      }

      this._isPaused = false;
      this._isTweening = true;

      var self = this;
      this._timeoutHandler = function () {
        timeoutHandler(self, self._timestamp, self._duration, self._currentState,
          self._originalState, self._targetState, self._easing, self._step,
          self._scheduleFunction);
      };

      this._timeoutHandler();

      return this;
    };

    /**
     * Move the state of the animation to a specific point in the tween's timeline.
     * If the animation is not running, this will cause the `step` handlers to be
     * called.
     * @param {millisecond} millisecond The millisecond of the animation to seek to.
     * @return {Tweenable}
     */
    Tweenable.prototype.seek = function (millisecond) {
      this._timestamp = now() - millisecond;

      if (!this.isPlaying()) {
        this._isTweening = true;
        this._isPaused = false;

        // If the animation is not running, call timeoutHandler to make sure that
        // any step handlers are run.
        timeoutHandler(this, this._timestamp, this._duration, this._currentState,
          this._originalState, this._targetState, this._easing, this._step,
          this._scheduleFunction);

        this._timeoutHandler();
        this.pause();
      }

      return this;
    };

    /**
     * Stops and cancels a tween.
     * @param {boolean=} gotoEnd If false or omitted, the tween just stops at its current state, and the "finish" handler is not invoked.  If true, the tweened object's values are instantly set to the target values, and "finish" is invoked.
     * @return {Tweenable}
     */
    Tweenable.prototype.stop = function (gotoEnd) {
      this._isTweening = false;
      this._isPaused = false;
      this._timeoutHandler = noop;

      (root.cancelAnimationFrame            ||
        root.webkitCancelAnimationFrame     ||
        root.oCancelAnimationFrame          ||
        root.msCancelAnimationFrame         ||
        root.mozCancelRequestAnimationFrame ||
        root.clearTimeout)(this._scheduleId);

      if (gotoEnd) {
        shallowCopy(this._currentState, this._targetState);
        applyFilter(this, 'afterTweenEnd');
        this._finish.call(this, this._currentState, this._attachment);
      }

      return this;
    };

    /**
     * Returns whether or not a tween is running.
     * @return {boolean}
     */
    Tweenable.prototype.isPlaying = function () {
      return this._isTweening && !this._isPaused;
    };

    /**
     * Sets a custom schedule function.
     *
     * If a custom function is not set the default one is used [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame) if available, otherwise [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout)).
     *
     * @param {Function(Function,number)} scheduleFunction The function to be called to schedule the next frame to be rendered
     */
    Tweenable.prototype.setScheduleFunction = function (scheduleFunction) {
      this._scheduleFunction = scheduleFunction;
    };

    /**
     * `delete`s all "own" properties.  Call this when the `Tweenable` instance is no longer needed to free memory.
     */
    Tweenable.prototype.dispose = function () {
      var prop;
      for (prop in this) {
        if (this.hasOwnProperty(prop)) {
          delete this[prop];
        }
      }
    };

    /*!
     * Filters are used for transforming the properties of a tween at various
     * points in a Tweenable's life cycle.  See the README for more info on this.
     */
    Tweenable.prototype.filter = {};

    /*!
     * This object contains all of the tweens available to Shifty.  It is extendible - simply attach properties to the Tweenable.prototype.formula Object following the same format at linear.
     *
     * `pos` should be a normalized `number` (between 0 and 1).
     */
    Tweenable.prototype.formula = {
      linear: function (pos) {
        return pos;
      }
    };

    formula = Tweenable.prototype.formula;

    shallowCopy(Tweenable, {
      'now': now
      ,'each': each
      ,'tweenProps': tweenProps
      ,'tweenProp': tweenProp
      ,'applyFilter': applyFilter
      ,'shallowCopy': shallowCopy
      ,'defaults': defaults
      ,'composeEasingObject': composeEasingObject
    });

    root.Tweenable = Tweenable;
    return Tweenable;

  } ());

  /*!
   * All equations are adapted from Thomas Fuchs' [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js).
   *
   * Based on Easing Equations (c) 2003 [Robert Penner](http://www.robertpenner.com/), all rights reserved. This work is [subject to terms](http://www.robertpenner.com/easing_terms_of_use.html).
   */

  /*!
   *  TERMS OF USE - EASING EQUATIONS
   *  Open source under the BSD License.
   *  Easing Equations (c) 2003 Robert Penner, all rights reserved.
   */

  ;(function () {

    Tweenable.shallowCopy(Tweenable.prototype.formula, {
      easeInQuad: function (pos) {
        return Math.pow(pos, 2);
      },

      easeOutQuad: function (pos) {
        return -(Math.pow((pos - 1), 2) - 1);
      },

      easeInOutQuad: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,2);}
        return -0.5 * ((pos -= 2) * pos - 2);
      },

      easeInCubic: function (pos) {
        return Math.pow(pos, 3);
      },

      easeOutCubic: function (pos) {
        return (Math.pow((pos - 1), 3) + 1);
      },

      easeInOutCubic: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,3);}
        return 0.5 * (Math.pow((pos - 2),3) + 2);
      },

      easeInQuart: function (pos) {
        return Math.pow(pos, 4);
      },

      easeOutQuart: function (pos) {
        return -(Math.pow((pos - 1), 4) - 1);
      },

      easeInOutQuart: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
        return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
      },

      easeInQuint: function (pos) {
        return Math.pow(pos, 5);
      },

      easeOutQuint: function (pos) {
        return (Math.pow((pos - 1), 5) + 1);
      },

      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,5);}
        return 0.5 * (Math.pow((pos - 2),5) + 2);
      },

      easeInSine: function (pos) {
        return -Math.cos(pos * (Math.PI / 2)) + 1;
      },

      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },

      easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
      },

      easeInExpo: function (pos) {
        return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
      },

      easeOutExpo: function (pos) {
        return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
      },

      easeInOutExpo: function (pos) {
        if (pos === 0) {return 0;}
        if (pos === 1) {return 1;}
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(2,10 * (pos - 1));}
        return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
      },

      easeInCirc: function (pos) {
        return -(Math.sqrt(1 - (pos * pos)) - 1);
      },

      easeOutCirc: function (pos) {
        return Math.sqrt(1 - Math.pow((pos - 1), 2));
      },

      easeInOutCirc: function (pos) {
        if ((pos /= 0.5) < 1) {return -0.5 * (Math.sqrt(1 - pos * pos) - 1);}
        return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
      },

      easeOutBounce: function (pos) {
        if ((pos) < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
          return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
          return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
          return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
      },

      easeInBack: function (pos) {
        var s = 1.70158;
        return (pos) * pos * ((s + 1) * pos - s);
      },

      easeOutBack: function (pos) {
        var s = 1.70158;
        return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
      },

      easeInOutBack: function (pos) {
        var s = 1.70158;
        if ((pos /= 0.5) < 1) {return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));}
        return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
      },

      elastic: function (pos) {
        return -1 * Math.pow(4,-8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
      },

      swingFromTo: function (pos) {
        var s = 1.70158;
        return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
            0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
      },

      swingFrom: function (pos) {
        var s = 1.70158;
        return pos * pos * ((s + 1) * pos - s);
      },

      swingTo: function (pos) {
        var s = 1.70158;
        return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
      },

      bounce: function (pos) {
        if (pos < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
          return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
          return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
          return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
      },

      bouncePast: function (pos) {
        if (pos < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
          return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
          return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
          return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
      },

      easeFromTo: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
        return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
      },

      easeFrom: function (pos) {
        return Math.pow(pos,4);
      },

      easeTo: function (pos) {
        return Math.pow(pos,0.25);
      }
    });

  }());

  /*!
   * The Bezier magic in this file is adapted/copied almost wholesale from
   * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/cubic-bezier.js),
   * which was adapted from Apple code (which probably came from
   * [here](http://opensource.apple.com/source/WebCore/WebCore-955.66/platform/graphics/UnitBezier.h)).
   * Special thanks to Apple and Thomas Fuchs for much of this code.
   */

  /*!
   *  Copyright (c) 2006 Apple Computer, Inc. All rights reserved.
   *
   *  Redistribution and use in source and binary forms, with or without
   *  modification, are permitted provided that the following conditions are met:
   *
   *  1. Redistributions of source code must retain the above copyright notice,
   *  this list of conditions and the following disclaimer.
   *
   *  2. Redistributions in binary form must reproduce the above copyright notice,
   *  this list of conditions and the following disclaimer in the documentation
   *  and/or other materials provided with the distribution.
   *
   *  3. Neither the name of the copyright holder(s) nor the names of any
   *  contributors may be used to endorse or promote products derived from
   *  this software without specific prior written permission.
   *
   *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
   *  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
   *  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   *  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  ;(function () {
    // port of webkit cubic bezier handling by http://www.netzgesta.de/dev/
    function cubicBezierAtTime(t,p1x,p1y,p2x,p2y,duration) {
      var ax = 0,bx = 0,cx = 0,ay = 0,by = 0,cy = 0;
      function sampleCurveX(t) {return ((ax * t + bx) * t + cx) * t;}
      function sampleCurveY(t) {return ((ay * t + by) * t + cy) * t;}
      function sampleCurveDerivativeX(t) {return (3.0 * ax * t + 2.0 * bx) * t + cx;}
      function solveEpsilon(duration) {return 1.0 / (200.0 * duration);}
      function solve(x,epsilon) {return sampleCurveY(solveCurveX(x,epsilon));}
      function fabs(n) {if (n >= 0) {return n;}else {return 0 - n;}}
      function solveCurveX(x,epsilon) {
        var t0,t1,t2,x2,d2,i;
        for (t2 = x, i = 0; i < 8; i++) {x2 = sampleCurveX(t2) - x; if (fabs(x2) < epsilon) {return t2;} d2 = sampleCurveDerivativeX(t2); if (fabs(d2) < 1e-6) {break;} t2 = t2 - x2 / d2;}
        t0 = 0.0; t1 = 1.0; t2 = x; if (t2 < t0) {return t0;} if (t2 > t1) {return t1;}
        while (t0 < t1) {x2 = sampleCurveX(t2); if (fabs(x2 - x) < epsilon) {return t2;} if (x > x2) {t0 = t2;}else {t1 = t2;} t2 = (t1 - t0) * 0.5 + t0;}
        return t2; // Failure.
      }
      cx = 3.0 * p1x; bx = 3.0 * (p2x - p1x) - cx; ax = 1.0 - cx - bx; cy = 3.0 * p1y; by = 3.0 * (p2y - p1y) - cy; ay = 1.0 - cy - by;
      return solve(t, solveEpsilon(duration));
    }
    /*!
     *  getCubicBezierTransition(x1, y1, x2, y2) -> Function
     *
     *  Generates a transition easing function that is compatible
     *  with WebKit's CSS transitions `-webkit-transition-timing-function`
     *  CSS property.
     *
     *  The W3C has more information about
     *  <a href="http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag">
     *  CSS3 transition timing functions</a>.
     *
     *  @param {number} x1
     *  @param {number} y1
     *  @param {number} x2
     *  @param {number} y2
     *  @return {function}
     */
    function getCubicBezierTransition (x1, y1, x2, y2) {
      return function (pos) {
        return cubicBezierAtTime(pos,x1,y1,x2,y2,1);
      };
    }
    // End ported code

    /**
     * Creates a Bezier easing function and attaches it to `Tweenable.prototype.formula`.  This function gives you total control over the easing curve.  Matthew Lein's [Ceaser](http://matthewlein.com/ceaser/) is a useful tool for visualizing the curves you can make with this function.
     *
     * @param {string} name The name of the easing curve.  Overwrites the old easing function on Tweenable.prototype.formula if it exists.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @return {function} The easing function that was attached to Tweenable.prototype.formula.
     */
    Tweenable.setBezierFunction = function (name, x1, y1, x2, y2) {
      var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
      cubicBezierTransition.x1 = x1;
      cubicBezierTransition.y1 = y1;
      cubicBezierTransition.x2 = x2;
      cubicBezierTransition.y2 = y2;

      return Tweenable.prototype.formula[name] = cubicBezierTransition;
    };


    /**
     * `delete`s an easing function from `Tweenable.prototype.formula`.  Be careful with this method, as it `delete`s whatever easing formula matches `name` (which means you can delete default Shifty easing functions).
     *
     * @param {string} name The name of the easing function to delete.
     * @return {function}
     */
    Tweenable.unsetBezierFunction = function (name) {
      delete Tweenable.prototype.formula[name];
    };

  })();

  ;(function () {

    function getInterpolatedValues (
      from, current, targetState, position, easing) {
      return Tweenable.tweenProps(
        position, current, from, targetState, 1, 0, easing);
    }

    // Fake a Tweenable and patch some internals.  This approach allows us to
    // skip uneccessary processing and object recreation, cutting down on garbage
    // collection pauses.
    var mockTweenable = new Tweenable();
    mockTweenable._filterArgs = [];

    /**
     * Compute the midpoint of two Objects.  This method effectively calculates a specific frame of animation that [Tweenable#tween](shifty.core.js.html#tween) does many times over the course of a tween.
     *
     * Example:
     *
     *     var interpolatedValues = Tweenable.interpolate({
     *       width: '100px',
     *       opacity: 0,
     *       color: '#fff'
     *     }, {
     *       width: '200px',
     *       opacity: 1,
     *       color: '#000'
     *     }, 0.5);
     *
     *     console.log(interpolatedValues);
     *     // {opacity: 0.5, width: "150px", color: "rgb(127,127,127)"}
     *
     * @param {Object} from The starting values to tween from.
     * @param {Object} targetState The ending values to tween to.
     * @param {number} position The normalized position value (between 0.0 and 1.0) to interpolate the values between `from` and `to` for.  `from` represents 0 and `to` represents `1`.
     * @param {string|Object} easing The easing curve(s) to calculate the midpoint against.  You can reference any easing function attached to `Tweenable.prototype.formula`.  If omitted, this defaults to "linear".
     * @return {Object}
     */
    Tweenable.interpolate = function (from, targetState, position, easing) {
      var current = Tweenable.shallowCopy({}, from);
      var easingObject = Tweenable.composeEasingObject(
        from, easing || 'linear');

      mockTweenable.set({});

      // Alias and reuse the _filterArgs array instead of recreating it.
      var filterArgs = mockTweenable._filterArgs;
      filterArgs.length = 0;
      filterArgs[0] = current;
      filterArgs[1] = from;
      filterArgs[2] = targetState;
      filterArgs[3] = easingObject;

      // Any defined value transformation must be applied
      Tweenable.applyFilter(mockTweenable, 'tweenCreated');
      Tweenable.applyFilter(mockTweenable, 'beforeTween');

      var interpolatedValues = getInterpolatedValues(
        from, current, targetState, position, easingObject);

      // Transform values back into their original format
      Tweenable.applyFilter(mockTweenable, 'afterTween');

      return interpolatedValues;
    };

  }());

  /**
   * Adds string interpolation support to Shifty.
   *
   * The Token extension allows Shifty to tween numbers inside of strings.  Among
   * other things, this allows you to animate CSS properties.  For example, you
   * can do this:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(45px)'},
   *       to: { transform: 'translateX(90xp)'}
   *     });
   *
   * ` `
   * `translateX(45)` will be tweened to `translateX(90)`.  To demonstrate:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(45px)'},
   *       to: { transform: 'translateX(90px)'},
   *       step: function (state) {
   *         console.log(state.transform);
   *       }
   *     });
   *
   * ` `
   * The above snippet will log something like this in the console:
   *
   *     translateX(60.3px)
   *     ...
   *     translateX(76.05px)
   *     ...
   *     translateX(90px)
   *
   * ` `
   * Another use for this is animating colors:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { color: 'rgb(0,255,0)'},
   *       to: { color: 'rgb(255,0,255)'},
   *       step: function (state) {
   *         console.log(state.color);
   *       }
   *     });
   *
   * ` `
   * The above snippet will log something like this:
   *
   *     rgb(84,170,84)
   *     ...
   *     rgb(170,84,170)
   *     ...
   *     rgb(255,0,255)
   *
   * ` `
   * This extension also supports hexadecimal colors, in both long (`#ff00ff`)
   * and short (`#f0f`) forms.  Be aware that hexadecimal input values will be
   * converted into the equivalent RGB output values.  This is done to optimize
   * for performance.
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { color: '#0f0'},
   *       to: { color: '#f0f'},
   *       step: function (state) {
   *         console.log(state.color);
   *       }
   *     });
   *
   * ` `
   * This snippet will generate the same output as the one before it because
   * equivalent values were supplied (just in hexadecimal form rather than RGB):
   *
   *     rgb(84,170,84)
   *     ...
   *     rgb(170,84,170)
   *     ...
   *     rgb(255,0,255)
   *
   * ` `
   * ` `
   * ## Easing support
   *
   * Easing works somewhat differently in the Token extension.  This is because
   * some CSS properties have multiple values in them, and you might need to
   * tween each value along its own easing curve.  A basic example:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(0px) translateY(0px)'},
   *       to: { transform:   'translateX(100px) translateY(100px)'},
   *       easing: { transform: 'easeInQuad' },
   *       step: function (state) {
   *         console.log(state.transform);
   *       }
   *     });
   *
   * ` `
   * The above snippet create values like this:
   *
   *     translateX(11.560000000000002px) translateY(11.560000000000002px)
   *     ...
   *     translateX(46.24000000000001px) translateY(46.24000000000001px)
   *     ...
   *     translateX(100px) translateY(100px)
   *
   * ` `
   * In this case, the values for `translateX` and `translateY` are always the
   * same for each step of the tween, because they have the same start and end
   * points and both use the same easing curve.  We can also tween `translateX`
   * and `translateY` along independent curves:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(0px) translateY(0px)'},
   *       to: { transform:   'translateX(100px) translateY(100px)'},
   *       easing: { transform: 'easeInQuad bounce' },
   *       step: function (state) {
   *         console.log(state.transform);
   *       }
   *     });
   *
   * ` `
   * The above snippet create values like this:
   *
   *     translateX(10.89px) translateY(82.355625px)
   *     ...
   *     translateX(44.89000000000001px) translateY(86.73062500000002px)
   *     ...
   *     translateX(100px) translateY(100px)
   *
   * ` `
   * `translateX` and `translateY` are not in sync anymore, because `easeInQuad`
   * was specified for `translateX` and `bounce` for `translateY`.  Mixing and
   * matching easing curves can make for some interesting motion in your
   * animations.
   *
   * The order of the space-separated easing curves correspond the token values
   * they apply to.  If there are more token values than easing curves listed,
   * the last easing curve listed is used.
   */
  function token () {
    // Functionality for this extension runs implicitly if it is loaded.
  } /*!*/

  // token function is defined above only so that dox-foundation sees it as
  // documentation and renders it.  It is never used, and is optimized away at
  // build time.

  ;(function (Tweenable) {

    /*!
     * @typedef {{
     *   formatString: string
     *   chunkNames: Array.<string>
     * }}
     */
    var formatManifest;

    // CONSTANTS

    var R_NUMBER_COMPONENT = /(\d|\-|\.)/;
    var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
    var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
    var R_RGB = new RegExp(
      'rgb\\(' + R_UNFORMATTED_VALUES.source +
      (/,\s*/.source) + R_UNFORMATTED_VALUES.source +
      (/,\s*/.source) + R_UNFORMATTED_VALUES.source + '\\)', 'g');
    var R_RGB_PREFIX = /^.*\(/;
    var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
    var VALUE_PLACEHOLDER = 'VAL';

    // HELPERS

    var getFormatChunksFrom_accumulator = [];
    /*!
     * @param {Array.number} rawValues
     * @param {string} prefix
     *
     * @return {Array.<string>}
     */
    function getFormatChunksFrom (rawValues, prefix) {
      getFormatChunksFrom_accumulator.length = 0;

      var rawValuesLength = rawValues.length;
      var i;

      for (i = 0; i < rawValuesLength; i++) {
        getFormatChunksFrom_accumulator.push('_' + prefix + '_' + i);
      }

      return getFormatChunksFrom_accumulator;
    }

    /*!
     * @param {string} formattedString
     *
     * @return {string}
     */
    function getFormatStringFrom (formattedString) {
      var chunks = formattedString.match(R_FORMAT_CHUNKS);

      if (!chunks) {
        // chunks will be null if there were no tokens to parse in
        // formattedString (for example, if formattedString is '2').  Coerce
        // chunks to be useful here.
        chunks = ['', ''];

        // If there is only one chunk, assume that the string is a number
        // followed by a token...
        // NOTE: This may be an unwise assumption.
      } else if (chunks.length === 1 ||
          // ...or if the string starts with a number component (".", "-", or a
          // digit)...
          formattedString[0].match(R_NUMBER_COMPONENT)) {
        // ...prepend an empty string here to make sure that the formatted number
        // is properly replaced by VALUE_PLACEHOLDER
        chunks.unshift('');
      }

      return chunks.join(VALUE_PLACEHOLDER);
    }

    /*!
     * Convert all hex color values within a string to an rgb string.
     *
     * @param {Object} stateObject
     *
     * @return {Object} The modified obj
     */
    function sanitizeObjectForHexProps (stateObject) {
      Tweenable.each(stateObject, function (prop) {
        var currentProp = stateObject[prop];

        if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
          stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
        }
      });
    }

    /*!
     * @param {string} str
     *
     * @return {string}
     */
    function  sanitizeHexChunksToRGB (str) {
      return filterStringChunks(R_HEX, str, convertHexToRGB);
    }

    /*!
     * @param {string} hexString
     *
     * @return {string}
     */
    function convertHexToRGB (hexString) {
      var rgbArr = hexToRGBArray(hexString);
      return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
    }

    var hexToRGBArray_returnArray = [];
    /*!
     * Convert a hexadecimal string to an array with three items, one each for
     * the red, blue, and green decimal values.
     *
     * @param {string} hex A hexadecimal string.
     *
     * @returns {Array.<number>} The converted Array of RGB values if `hex` is a
     * valid string, or an Array of three 0's.
     */
    function hexToRGBArray (hex) {

      hex = hex.replace(/#/, '');

      // If the string is a shorthand three digit hex notation, normalize it to
      // the standard six digit notation
      if (hex.length === 3) {
        hex = hex.split('');
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      hexToRGBArray_returnArray[0] = hexToDec(hex.substr(0, 2));
      hexToRGBArray_returnArray[1] = hexToDec(hex.substr(2, 2));
      hexToRGBArray_returnArray[2] = hexToDec(hex.substr(4, 2));

      return hexToRGBArray_returnArray;
    }

    /*!
     * Convert a base-16 number to base-10.
     *
     * @param {Number|String} hex The value to convert
     *
     * @returns {Number} The base-10 equivalent of `hex`.
     */
    function hexToDec (hex) {
      return parseInt(hex, 16);
    }

    /*!
     * Runs a filter operation on all chunks of a string that match a RegExp
     *
     * @param {RegExp} pattern
     * @param {string} unfilteredString
     * @param {function(string)} filter
     *
     * @return {string}
     */
    function filterStringChunks (pattern, unfilteredString, filter) {
      var pattenMatches = unfilteredString.match(pattern);
      var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);

      if (pattenMatches) {
        var pattenMatchesLength = pattenMatches.length;
        var currentChunk;

        for (var i = 0; i < pattenMatchesLength; i++) {
          currentChunk = pattenMatches.shift();
          filteredString = filteredString.replace(
            VALUE_PLACEHOLDER, filter(currentChunk));
        }
      }

      return filteredString;
    }

    /*!
     * Check for floating point values within rgb strings and rounds them.
     *
     * @param {string} formattedString
     *
     * @return {string}
     */
    function sanitizeRGBChunks (formattedString) {
      return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
    }

    /*!
     * @param {string} rgbChunk
     *
     * @return {string}
     */
    function sanitizeRGBChunk (rgbChunk) {
      var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
      var numbersLength = numbers.length;
      var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];

      for (var i = 0; i < numbersLength; i++) {
        sanitizedString += parseInt(numbers[i], 10) + ',';
      }

      sanitizedString = sanitizedString.slice(0, -1) + ')';

      return sanitizedString;
    }

    /*!
     * @param {Object} stateObject
     *
     * @return {Object} An Object of formatManifests that correspond to
     * the string properties of stateObject
     */
    function getFormatManifests (stateObject) {
      var manifestAccumulator = {};

      Tweenable.each(stateObject, function (prop) {
        var currentProp = stateObject[prop];

        if (typeof currentProp === 'string') {
          var rawValues = getValuesFrom(currentProp);

          manifestAccumulator[prop] = {
            'formatString': getFormatStringFrom(currentProp)
            ,'chunkNames': getFormatChunksFrom(rawValues, prop)
          };
        }
      });

      return manifestAccumulator;
    }

    /*!
     * @param {Object} stateObject
     * @param {Object} formatManifests
     */
    function expandFormattedProperties (stateObject, formatManifests) {
      Tweenable.each(formatManifests, function (prop) {
        var currentProp = stateObject[prop];
        var rawValues = getValuesFrom(currentProp);
        var rawValuesLength = rawValues.length;

        for (var i = 0; i < rawValuesLength; i++) {
          stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
        }

        delete stateObject[prop];
      });
    }

    /*!
     * @param {Object} stateObject
     * @param {Object} formatManifests
     */
    function collapseFormattedProperties (stateObject, formatManifests) {
      Tweenable.each(formatManifests, function (prop) {
        var currentProp = stateObject[prop];
        var formatChunks = extractPropertyChunks(
          stateObject, formatManifests[prop].chunkNames);
        var valuesList = getValuesList(
          formatChunks, formatManifests[prop].chunkNames);
        currentProp = getFormattedValues(
          formatManifests[prop].formatString, valuesList);
        stateObject[prop] = sanitizeRGBChunks(currentProp);
      });
    }

    /*!
     * @param {Object} stateObject
     * @param {Array.<string>} chunkNames
     *
     * @return {Object} The extracted value chunks.
     */
    function extractPropertyChunks (stateObject, chunkNames) {
      var extractedValues = {};
      var currentChunkName, chunkNamesLength = chunkNames.length;

      for (var i = 0; i < chunkNamesLength; i++) {
        currentChunkName = chunkNames[i];
        extractedValues[currentChunkName] = stateObject[currentChunkName];
        delete stateObject[currentChunkName];
      }

      return extractedValues;
    }

    var getValuesList_accumulator = [];
    /*!
     * @param {Object} stateObject
     * @param {Array.<string>} chunkNames
     *
     * @return {Array.<number>}
     */
    function getValuesList (stateObject, chunkNames) {
      getValuesList_accumulator.length = 0;
      var chunkNamesLength = chunkNames.length;

      for (var i = 0; i < chunkNamesLength; i++) {
        getValuesList_accumulator.push(stateObject[chunkNames[i]]);
      }

      return getValuesList_accumulator;
    }

    /*!
     * @param {string} formatString
     * @param {Array.<number>} rawValues
     *
     * @return {string}
     */
    function getFormattedValues (formatString, rawValues) {
      var formattedValueString = formatString;
      var rawValuesLength = rawValues.length;

      for (var i = 0; i < rawValuesLength; i++) {
        formattedValueString = formattedValueString.replace(
          VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
      }

      return formattedValueString;
    }

    /*!
     * Note: It's the duty of the caller to convert the Array elements of the
     * return value into numbers.  This is a performance optimization.
     *
     * @param {string} formattedString
     *
     * @return {Array.<string>|null}
     */
    function getValuesFrom (formattedString) {
      return formattedString.match(R_UNFORMATTED_VALUES);
    }

    /*!
     * @param {Object} easingObject
     * @param {Object} tokenData
     */
    function expandEasingObject (easingObject, tokenData) {
      Tweenable.each(tokenData, function (prop) {
        var currentProp = tokenData[prop];
        var chunkNames = currentProp.chunkNames;
        var chunkLength = chunkNames.length;
        var easingChunks = easingObject[prop].split(' ');
        var lastEasingChunk = easingChunks[easingChunks.length - 1];

        for (var i = 0; i < chunkLength; i++) {
          easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk;
        }

        delete easingObject[prop];
      });
    }

    /*!
     * @param {Object} easingObject
     * @param {Object} tokenData
     */
    function collapseEasingObject (easingObject, tokenData) {
      Tweenable.each(tokenData, function (prop) {
        var currentProp = tokenData[prop];
        var chunkNames = currentProp.chunkNames;
        var chunkLength = chunkNames.length;
        var composedEasingString = '';

        for (var i = 0; i < chunkLength; i++) {
          composedEasingString += ' ' + easingObject[chunkNames[i]];
          delete easingObject[chunkNames[i]];
        }

        easingObject[prop] = composedEasingString.substr(1);
      });
    }

    Tweenable.prototype.filter.token = {
      'tweenCreated': function (currentState, fromState, toState, easingObject) {
        sanitizeObjectForHexProps(currentState);
        sanitizeObjectForHexProps(fromState);
        sanitizeObjectForHexProps(toState);
        this._tokenData = getFormatManifests(currentState);
      },

      'beforeTween': function (currentState, fromState, toState, easingObject) {
        expandEasingObject(easingObject, this._tokenData);
        expandFormattedProperties(currentState, this._tokenData);
        expandFormattedProperties(fromState, this._tokenData);
        expandFormattedProperties(toState, this._tokenData);
      },

      'afterTween': function (currentState, fromState, toState, easingObject) {
        collapseFormattedProperties(currentState, this._tokenData);
        collapseFormattedProperties(fromState, this._tokenData);
        collapseFormattedProperties(toState, this._tokenData);
        collapseEasingObject(easingObject, this._tokenData);
      }
    };

  } (Tweenable));

  }(window));

  return window.Tweenable;
});

(function() {
    "use strict";

    angular.module('angular-carousel')

    .filter('carouselSlice', function() {
        return function(collection, start, size) {
            if (angular.isArray(collection)) {
                return collection.slice(start, start + size);
            } else if (angular.isObject(collection)) {
                // dont try to slice collections :)
                return collection;
            }
        };
    });

})();


/***/ }),
/* 5 */
/***/ (function(module, exports) {

exports.AddToCartController = function($scope, $http, $user, $timeout) {
  $scope.addToCart = function(product, quant) {
    var quantity= quant? quant : 1;
    // console.log(quantity);
    var obj = { product: product._id, quantity: quantity,name:product.name, displayPrice: product.displayPrice, picture_url: product.pictures };
    $user.user.data.cart.push(obj);
 
    $http.
      put('/api/v1/me/cart', $user.user).
      success(function(data) {
        $user.loadUser();
        $scope.success = true;
  

        $timeout(function() {
          $scope.success = false;
        }, 5000);
      });
  };
};

exports.CategoryProductsController = function($scope, $stateParams, $http,$user, $grade, $css) {

  $css.bind(
    {href: '../stylesheets/shop_styles_custom.css'}
  , $scope);

  // Simply add stylesheet(s)
  $css.add('../stylesheets/shop_styles_custom.css');

  var encoded = encodeURIComponent($stateParams.category);

  $scope.price = undefined;

  /*This enables the user to toggle sorting by price.*/
  $scope.handlePriceClick = function() {
    if ($scope.price === undefined) {
      $scope.price = -1;
    } else {
      $scope.price = 0 - $scope.price;
    }
    $scope.load();
  };
  $http.
    get('/api/v1/category').
    success(function(data) {

      $scope.categories = data.categories;
      //console.log($scope.categories);
    });
  /*It queries the server for which products
    belong to the given category and then adds a special query
    parameter for sorting by price.*/
  $scope.load = function() {
    var queryParams = { price: $scope.price };
    $http.
      get('/api/v1/product/category/' + encoded, { params: queryParams }).
      success(function(data) {
        var prds = data.products.filter(function(prd){
        return (prd.category.ancestors[1] !="Laptops");
        });
        // if(encoded == "Laptops"){
        //   $scope.products = [];
        // }
        // else {$scope.products = data.products;};
        // $scope.products = data.products;

        // grade
         // generates grader obj for each array
        var grade = new $grade();
        grade.init(prds,$user);
        $scope.products= grade.GetProducts();
        $scope.toggle_like = function(prd){grade.toggle_like(prd)};
  
      });
  };
  // $scope.category = encoded;
  $scope.load();


  setTimeout(function() {
    $scope.$emit('CategoryProductsController');
  }, 0);
  /* this event gets triggered
on the next iteration of the event loop
after the template is done rendering.
So this means that your tests can
listen for this event to know when the template is done loading
and it's safe to run tests.*/
};

exports.BlogSingleController = function($scope, $css) {
  $css.bind([
    {href: '../stylesheets/blog_single_styles.css'},
    {href: '../stylesheets/blog_single_responsive.css'},
    {href: '../stylesheets/blog_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/blog_single_styles.css', 
    '../stylesheets/blog_single_responsive.css',
    '../stylesheets/blog_styles_custom.css']);
};
exports.AboutController = function($scope, $css) {
  $css.bind([
    {href: '../stylesheets/blog_single_styles.css'},
    {href: '../stylesheets/blog_single_responsive.css'},
    {href: '../stylesheets/blog_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/blog_single_styles.css', 
    '../stylesheets/blog_single_responsive.css',
    '../stylesheets/blog_styles_custom.css']);
}

exports.CategoryTreeController = function($scope, $stateParams, $http) {
  var encoded = encodeURIComponent($stateParams.category);
  $http.
    get('/api/v1/category/id/' + encoded).
    success(function(data) {
      $scope.category = data.category;
      $http.
        get('/api/v1/category/parent/' + encoded).
        success(function(data) {
          $scope.children = data.categories;
        });
    });

  setTimeout(function() {
    $scope.$emit('CategoryTreeController');
  }, 0);
};

exports.CheckoutController = function($scope, $user, $http, $state, $css) {

  $css.bind([
    {href: '../stylesheets/cart_styles.css'},
    {href: '../stylesheets/cart_responsive.css'},
    {href: '../stylesheets/shop_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/cart_styles.css', 
    '../stylesheets/cart_responsive.css',
    '../stylesheets/shop_styles_custom.css']);

  // For update cart
  $scope.user = $user;
  
  // console.log("$user = "+JSON.stringify($user));
  var updateCart = function() {
    console.log("updating..");
    $http.
      put('/api/v1/me/cart', $user.user).
      then(function(data) {
        $scope.user = data.data;
        // console.log("data = "+JSON.stringify(data));
        // $user.loadUser();
        // $scope.updated = true;
        console.log("updated");
        });
  };
  $scope.$on('user.loaded',function(event) {
    // $scope.user = $user;
    // console.log("$user = "+JSON.stringify($user));
    updateCart();


  });
  updateCart();
  $scope.updateCart = function(){
    updateCart();
    // $window.location.href = '/#/checkout';
    $state.reload();
  };

  //user.user.data.cart

  $scope.getProduct = function(produt_id){
    $http.
      get('/api/v1/product/id/' + produt_id).
      success(function(data) {
        $scope.product = data.product;
      });
    }    

  // For checkout
  Stripe.setPublishableKey('pk_test_4v5vlkU771njziWz6cceNLgC');
  $scope.stripeToken = {
    number: '4242424242424242',
    cvc: '123',
    exp_month: '12',
    exp_year: '2022'
  };

  $scope.checkout = function() {
    $scope.error = null;
    Stripe.card.createToken($scope.stripeToken, function(status, response) {
      if (status.error) {
        $scope.error = status.error;
        return;
      }
      $http.
        post('/api/v1/checkout2', { stripeToken: response.id }).
        success(function(data) {
          $scope.checkedOut = true;
          $user.user.data.cart = [];
          updateCart();
          $state.reload();
        });
    });
  };
}; 

exports.LikesController = function($scope, $user, $http, $state, $q, $grade, $css) {
  // For update cart
  // $scope.user = $user;
  $css.bind([
    {href: '../stylesheets/cart_styles.css'},
    {href: '../stylesheets/cart_responsive.css'},
    {href: '../stylesheets/liked_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/cart_styles.css', 
    '../stylesheets/cart_responsive.css',
    '../stylesheets/liked_styles_custom.css']);


  $user.loadUser();
  $scope.$on('user.loaded',function(event) {
    // console.log("user = "+ JSON.stringify($user.user.data.liked));

    var reqs =[], len = $user.user.data.liked.length;
    // console.log("likes len ="+ len);
  var likes = $user.user.data.liked;
        for (i in likes) {
            reqs.push(
              $http.get('/api/v1/product-to-list/id/' + likes[len-1-i].product)
            );
        };
        $scope.w = []; var prds = [];
        $q.all(reqs).then(function(values){
          for (i in values){
            prds.push(values[i].data.product);

            // console.log("w[i] = "+JSON.stringify(values[i].data));
          }
          var grade = new $grade();
        grade.init(prds,$user);
        $scope.w= grade.GetProducts();
        $scope.toggle_like = function(prd){grade.toggle_like(prd)};

          // console.log("w[] = "+JSON.stringify($scope.w));
        });

        
  });

  $scope.updateLikes = function(){
    $state.reload();
  };

  //user.user.data.cart


}; 

exports.NavBarController = function($scope, $user, $window, Global) {
  $scope.user = $user;
  Global.load();
  // if ($user.data.provider == "facebook"){
  //   $scope.picture_url = 'http://graph.facebook.com/' +
  //             profile.id.toString() + '/picture?type=large';
  // }
  // else $scope.picture_url = '';
  if($user.user){
    $scope.picture_url = $user.user.data;
    // $scope.picture_url2 = $scope.picture_url.profile;

  }

  $scope.$on('user.loaded',function(event) {

    $scope.user = $user;
    $scope.picture_url = $user.user.data;
  }); 

  $scope.signout = function(){
    $window.location.href = '/api/logout';
    //$location.path('/');
  }

  setTimeout(function() {
    $scope.$emit('NavBarController');
  }, 0);
};

exports.ProductDetailsController = function($scope, $stateParams, $http, $user, $grade, $css) {
  var encoded = encodeURIComponent($stateParams.id);

/*takes the product ID from the routeParams service $stateParams,
and makes an HTTP request for the product details.*/

  $css.bind([
    {href: '../stylesheets/product_styles.css'},
    {href: '../stylesheets/product_responsive.css'},
    {href: '../stylesheets/shop_styles_custom.css'}
  ], $scope);

  // Simply add stylesheet(s)
  $css.add(['../stylesheets/product_styles.css', 
    '../stylesheets/product_responsive.css',
    '../stylesheets/shop_styles_custom.css']);


  $http.
    get('/api/v1/product/id/' + encoded).
    success(function(data) {
      console.log("prd: "+ data.product.pictures);
      $scope.image_selected=data.product.pictures[0];
      var pics=new Array('','',''); var i;
      for ( i = 0; i <= 2; i++) {if(data.product.pictures[i]){ pics[i] = data.product.pictures[i]}}  
      // data.product.pictures = pics;
      
      var prod =  data.product; prod.pictures = pics;

      $scope.product = prod;
      $user.loadUser();

      var prds = []; prds.push(data.product);
      var grade = new $grade();
      grade.init(prds,$user);
      // $scope.products= grade.GetProducts();
      $scope.prd = grade.GetProducts()[0];

      $scope.toggle_like = function(prd){grade.toggle_like(prd)};

      $scope.stars = grade.GetStars();
      $scope.hover_stars = function(index,prd){grade.hover_stars(index,prd)};
      $scope.leave_stars = function(index,prd){grade.leave_stars(index,prd)};
      $scope.set_stars =   function(index,prd){grade.set_stars(index,prd)};



    });


  setTimeout(function() {
    $scope.$emit('ProductDetailsController');
  }, 0);
};

exports.SearchBarController = function($scope, $http, $rootScope, $location, $window, $user) {
  // this function should make an HTTP request to
  // `/api/v1/product/text/:searchText` and expose the response's
  // `products` property as `results` to the scope.
  $scope.searchText = ''; 
  $scope.hide_list = 'true';
  $scope.show_list = '';
  $scope.hide_results = function(){
    setTimeout(function(){
      $scope.hide_list = 'true'; 
      $scope.show_list = '';
      $scope.$apply();
    }, 1000);
  };

  $scope.show_results = function(){
     $scope.hide_list = '';
     $scope.show_list = 'true'; 
  }
  $scope.update = function() {
    // if($scope.searchText != ''){
      
      $http.
      get('/api/v1/product/text/' + $scope.searchText).
      success(function(data) {
      $scope.results = data.products;
    });
  // };

  }

  $http.
    get('/api/v1/category').
    success(function(data) {
      $scope.categories = data.categories;
      //console.log($scope.categories);
    });
  
  $scope.toggle_cat_list = '';
  $scope.toggle_cat = function(){
    if (!$scope.toggle_cat_list){
      $scope.toggle_cat_list = 'active';
    }
    else{
      $scope.toggle_cat_list = '';
    }
  }
  $scope.checked_cat='All Categories';
  $scope.check_cat = function(category){
    $scope.toggle_cat_list = '';
    $scope.checked_cat=category._id;
  }

  $scope.search = function(){
    
    if ($scope.checked_cat == 'All Categories'){
      $scope.checked_cat = 'Books'; //for demo purposes only
    }
    $location.path('/category/'+$scope.checked_cat);
  }

  $scope.liked_ct = 0;
  $scope.cart_ct = 0;
  if($user.userLoaded){
    $scope.liked_ct = $user.user.data.liked.length;
    $scope.cart_ct = $user.user.data.cart.length;
  };
  $scope.$on('user.loaded',function(event) {
    $scope.liked_ct = $user.user.data.liked.length;
    $scope.cart_ct = $user.user.data.cart.length;
  });

  $scope.$on('$grade.toggleLike',function(event) {
    $user.loadUser();
  });


  $scope.user = $user;

  setTimeout(function() { 
    $scope.$emit('SearchBarController');
  }, 0);  
}; 

exports.SliderController = function($scope, $http, $rootScope, $location, $window, $timeout) {
  
  $scope.slides2 = [{
    id: 1,
    label: 'slide #' + '1',
    img: 'https://www.apple.com/v/ipad/home/ak/images/overview/ipad_pro_hero__tazkzdo0z8iu_large.jpg' ,
    color: "#fc0003",
    odd: 1
  },
  {
    id: 2,
    label: 'slide #' + '2',
    img: 'https://www.apple.com/v/ipad/home/ak/images/overview/ipad_pro_hero__tazkzdo0z8iu_large.jpg' ,
    // img: 'https://www.apple.com/v/ipad-9.7/j/images/overview/designed_in_mind_large.jpg' ,
    color: "#fc0003",
    odd: 0
  }
  ];
  
  


  setTimeout(function() { 
    $scope.$emit('SliderController');
  }, 0);  
}; 

exports.bestSellersController = function($scope, $http, $rootScope, $location, $window, $timeout, $user, $grade) {
  $scope.index = 0;
  
  $scope.tabs = [
    { status:'active', name:'Top of the Week' },
    { status:'',       name:'Most Liked' },
    { status:'',       name:'Top Scored' }
    
  ];
  $scope.toggle_tab = function(index){
    $scope.index =  index;
    console.log($scope.index);
    for (i in $scope.tabs) {
      if(i == index){
        $scope.tabs[i].status = 'active';
      }
      else {
        $scope.tabs[i].status = '';  
      }
    }
  };



// ToDO : Get raitings from the base
  // get twelve products from the base 
  var queryParams = { price: 0 };
  $http.
      get('/api/v1/product/category/Fiction', { params: queryParams })
      .success(function(data) {
        // console.log("data = "+data.products);
        $scope.products = data.products.slice(0,36);

      })
      .then(function() {
  // ToDo make modifications of product schema to add discount e/t/c

        var top =$scope.products.slice(0,12); 
        var liked =$scope.products.slice(12,24); 
        var scored =$scope.products.slice(24,36);
        
  // generates grader obj for each array
        var tgrade = new $grade();
        tgrade.init(top,$user);
        
        var lgrade = new $grade();
        lgrade.init(liked,$user);

        var sgrade = new $grade();
        sgrade.init(scored,$user);

  //get user-modified prd array for displaying
  // composes objects of top rated, e.t.s divided in to pairs by 6
        $scope.top0= tgrade.GetProducts().slice(0,6);
        $scope.top1= tgrade.GetProducts().slice(6,12);
        $scope.liked0= lgrade.GetProducts().slice(0,6);
        $scope.liked1= lgrade.GetProducts().slice(6,12);
        $scope.scored0= sgrade.GetProducts().slice(0,6);
        $scope.scored1= sgrade.GetProducts().slice(6,12);

  // processing the rating clicks:
        $scope.toggle_like_t = function(prd){tgrade.toggle_like(prd)};
        $scope.toggle_like_l = function(prd){lgrade.toggle_like(prd)};
        $scope.toggle_like_s = function(prd){sgrade.toggle_like(prd)};  

  // processing the stars clicks:

  //gen stars arr and ng-repeat it in view
        $scope.stars = tgrade.GetStars();

  // user events processing:
        $scope.hover_stars_t = function(index,prd){tgrade.hover_stars(index,prd)};
        $scope.hover_stars_l = function(index,prd){lgrade.hover_stars(index,prd)};
        $scope.hover_stars_s = function(index,prd){sgrade.hover_stars(index,prd)};

        $scope.leave_stars_t = function(index,prd){tgrade.leave_stars(index,prd)};
        $scope.leave_stars_l = function(index,prd){lgrade.leave_stars(index,prd)};
        $scope.leave_stars_s = function(index,prd){sgrade.leave_stars(index,prd)};
        
        $scope.set_stars_t =  function(index,prd){tgrade.set_stars(index,prd)};
        $scope.set_stars_l =  function(index,prd){lgrade.set_stars(index,prd)};
        $scope.set_stars_s =  function(index,prd){sgrade.set_stars(index,prd)};
  });

  $scope.slides3 = [{
    id: 1,
    label: 'slide #' + '1',
    img: 'images/banner_2_product.png' ,
    color: "#fc0003",
    odd: 1
  },
  {
    id: 2,
    label: 'slide #' + '2',
    img: 'images/banner_2_product.png' ,
    color: "#fc0003",
    odd: 0
  }];
  $scope.slides31 = $scope.slides3 ;
  $scope.slides32 = $scope.slides3 ;  
  
  setTimeout(function() { 
    $scope.$emit('bestSellersController');
  }, 0);  
}; 
 
// recentlyViewedController
exports.recentlyViewedController = function($scope,$user, $q, $http, $timeout, $sce) {
  // $scope.prevSlide = function(){ return (rnCarousel.prevSlide())};
  // $scope.nextSlide = function(){ return (rnCarousel.nextSlide())};
  // $user.loadUser();
  $scope.v = [];
  
  var loadHistory = function(){
    
    if ($user.user){
      // DeBuG
      // $user.user.data.viewed = [];

      var len = $user.user.data.viewed.length;
      $scope.len = len;
      console.log("len = "+len);
      if(len){
        var reqs = [];
        var viewed = $user.user.data.viewed;
        for (i in viewed) {
            if(i==5){break;};
            reqs.push(
              $http.get('/api/v1/product-to-list/id/' + viewed[len-1-i].product)
            );
          // };
        };
        $scope.v = [];
        $q.all(reqs).then(function(values){
          for (i in values){
            $scope.v.push(values[i].data.product);
            // console.log(values[i].data.product);
          }
        });
      }    
      else{
        //if registered user didn't watch any prds, then:
        loadRecommended();
      };
    };
  };
  var loadRecommended = function(){
  //ToDo: insert recommended into the empty arr of prds
    $scope.v = [];
    var queryParams = { price: 0 };
    $http.
        get('/api/v1/product/category/Fiction', { params: queryParams })
        .success(function(data) {
          // console.log("data = "+data.products);
          $scope.v = data.products.slice(36,42);
          if($user.userLoaded){
            //if user was loaded during async loadRecommended routine then we must reload $scope.v with user history prds:
            if($user.user.data.viewed.length){
              loadHistory();
            };
          }
          console.log('loadRecommended completed')
        });
  };
  
  if($user.userLoaded){
    loadHistory();
    console.log('$user.userLoaded');
  }
  else{
    loadRecommended();
    console.log('loadRecommended');
  };

  $scope.$on('user.loaded',function(event) {
    // $timeout(function() {
      loadHistory();
    // }, 0);
    
    console.log('$on user.loaded');
  });

  $scope.user = $user;
    // angular.forEach($user.user.data.viewed,function(liked){
    //   if(liked.product == prd._id){
    //     if(liked.rate){prd.liked = 'fas'}; //for displaying
    //   };
    // });

  $scope.slides4 = [{
    id: 1,
    label: 'slide #' + '1',
    img: 'images/banner_2_product.png' ,
    color: "#fc0003",
    odd: 1
  },
  {
    id: 2,
    label: 'slide #' + '2',
    img: 'images/banner_2_product.png' ,
    color: "#fc0003",
    odd: 0
  }
  ];
};  
exports.footerBlockController = function($scope, $http) {
$http.
    get('/api/v1/category').
    success(function(data) {
      $scope.categories = data.categories;
      $scope.cats1 = data.categories.slice(0,6);
      $scope.cats2 = data.categories.slice(6,11);
      // console.log("$scope.categories = "+$scope.categories);
    });


};  

exports.MainNavController = function($scope, $http, $rootScope, $location, $window, $compile, $timeout) {
  
  $http.
    get('/api/v1/category').
    success(function(data) {
      $scope.categories = data.categories;
      angular.forEach(data.categories,function (category, key) {
        if(!category.parent){
          mountSubCats(category._id);
          
        }
      });  
    });
    //generates nested menu structure
    function mountSubCats(cat) {
      $http.
      get('/api/v1/category/parent/' + cat).
      success(function(data) {
        angular.forEach(data.categories,function (child, key) {
          //insert shevron for parent element
          if(key==0){
            console.log('key = '+key);
            angular.element(document.getElementById(cat)).parent().find("a")
            .after($compile('<div class= "inline"> <i class="fas fa-chevron-right"></i></div>')($scope));  
          }
          var html= '<li class="hassubs"><div><a class="inline" href="#/category/'+child._id+'">'+child._id+
          '</a></div><ul id="'+child._id+'"></ul></li>';        
          angular.element(document.getElementById(cat)).append($compile(html)($scope));
          $timeout(function() { $scope.$emit('CatMounted',child._id);}, 0); 
        });
      }); 
    }
    $scope.$on('CatMounted',function(event,cat) {
      mountSubCats(cat);
    });
    // https://odetocode.com/blogs/scott/archive/2014/05/07/using-compile-in-angular.aspx

  $scope.burger_toggle = function(id){
    console.log("burger_toggle");
    var menu = angular.element(document.getElementById(id));
    if(menu.hasClass("burger_menu_show")){
      menu.removeClass("burger_menu_show").addClass("burger_menu_hide");
    }
    else if(menu.hasClass("burger_menu_hide")){
      menu.removeClass("burger_menu_hide").addClass("burger_menu_show");
    }
    else{
      menu.addClass("burger_menu_show");
    };
  };

  setTimeout(function() { 
    $scope.$emit('MainNavController');
  }, 0);  
}; 

exports.LoginController = function($scope, $http, $uibModal, $log, $document, $location,$rootScope
// ) {
  ,$state) {
  // , LoginTemplateUrl) {
  var $ctrl = this;

// Attach Custom Data to State Objects 
$ctrl.LoginTemplateUrl = $state.current.stateparams.LoginTemplateUrl;
$ctrl.Card = $state.current.stateparams.card;

  $ctrl.items = 'item1';//['item1', 'item2', 'item3'];

  $ctrl.animationsEnabled = true;
 
  $ctrl.open = function (size, parentSelector) {
    $ctrl.opened = true;
    var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'LoginModal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        items: function () {
          return $ctrl.items;
        },
        LoginTemplateUrl:function () {
          return $ctrl.LoginTemplateUrl;
        },
        Card:function () {
          return $ctrl.Card;
        }
      }
    }); 
 
    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

    if(modalInstance.rendered){
    console.log('modal rendered');
    $scope.$emit('modal.rendered');
    }
  return modalInstance;
  };
}; 

exports.ModalInstanceCtrl = function ($uibModalInstance, items,Card,LoginTemplateUrl,$user, $scope, $rootScope, $location ) {
  $scope.user = $user;
  
  var $ctrl = this;
  $ctrl.modalinstancepresence = true;
  $ctrl.LoginTemplateUrl = LoginTemplateUrl;
  $ctrl.Card = Card;
  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
    $rootScope.loginmodalrendered = false;
     $location.path('');
    
  };

  $scope.$on('modalclosecmd', function(event, data) {
    event.stopPropagation();
    $uibModalInstance.dismiss('cancel');
    console.log('$uibModalInstance.dismiss');
  });

};
exports.RedirectController = function($scope, $window,$timeout ,$user) {
  $user.loadUser();
  $timeout(function() {
          $window.location.href = '/#'; 
        }, 0);
   
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports.addToCart = function() {
  return {
    controller: 'AddToCartController',
    // templateUrl: '/assessment/templates/add_to_cart.html'
    template: __webpack_require__(7)
  };
};  
 
exports.categoryProducts = function() { 
  return {
    controller: 'CategoryProductsController',
    // templateUrl: 'templates/category_products.html'
    template: __webpack_require__(8)
  } 
}; 

exports.categoryTree = function() {
  return {
    controller: 'CategoryTreeController',
    // templateUrl: 'templates/category_tree.html'
    template: __webpack_require__(9)
  }
};

exports.checkout = function() {
  return {
    controller: 'CheckoutController',
    // templateUrl: 'templates/checkout.html'
    template: __webpack_require__(10)
  };
};

exports.likes = function() {
  return {
    controller: 'LikesController',
    // templateUrl: 'templates/checkout.html'
    template: __webpack_require__(11)
  };
};

exports.navBar = function() {
  return {
    // transclude:true,
    restrict:'E',
    // require : '^searchBar',
    controller: 'NavBarController',
    // templateUrl: 'templates/nav_bar.html'
    template: __webpack_require__(12)
  };
}; 

exports.productDetails = function() {
  return {
    controller: 'ProductDetailsController',
    // templateUrl: 'templates/product_details.html'
    template: __webpack_require__(13)
  };
};

exports.searchBar = function() {
  return { 
    // transclude:true,
    restrict:'E', 
    // require : '^navBar',
    controller: 'SearchBarController',
    // templateUrl: '/templates/search_bar.html'
    template: __webpack_require__(14)
  };
};
 
exports.loginModal = function() {
  return {   
    restrict:'E',  
    // require : '^navBar',
    controller: 'LoginController',
    // templateUrl: '/templates/modal.html' 
     template: __webpack_require__(15)
  };
}; 


exports.mainNav = function() {
  return {   
    restrict:'E',  
    controller: 'MainNavController',
    // templateUrl: '/templates/modal.html' 
     template: __webpack_require__(16)
  };
}; 

exports.slider = function() {
  return {   
    restrict:'E',  
    controller: 'SliderController',
    // templateUrl: '/templates/modal.html' 
     template: __webpack_require__(17)
  };
}; 

exports.bestSellers = function() {
  return {   
    restrict:'E',  
    controller: 'bestSellersController',
    // templateUrl: '/templates/modal.html' 
     template: __webpack_require__(18)
  };
}; 

exports.recentlyViewed = function() {
  return {   
    restrict:'E',  
    controller: 'recentlyViewedController',
    // templateUrl: '/templates/modal.html' 
     template: __webpack_require__(19)
  };
}; 

exports.footerBlock = function() {
  return {   
    restrict:'E',  
    controller: 'footerBlockController',
     template: __webpack_require__(20)
  };
}; 

  

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<button ng-show=\"user.user\" ng-click=\"addToCart(product,quant);\" class=\"product_cart_button\">\n\t<span ng-show=\"!success\">\n    <i class=\"fa fa-cart-plus\"></i>\n    Add to Cart\n  </span>\n  <span ng-show=\"success\">\n    <i class=\"fa fa-check\"></i>\n    Added\n  </span>\n  <!-- Add to Cart -->\n\n</button>\n\n<button ng-show=\"!user.user\" class=\"product_cart_button\">\n  \n    <i class=\"fa fa-cart-plus\"></i>\n    <a style=\"color:white;\" href=\"#/login\">Add to Cart</a>\n  \n</button>\n\n\n\n<!-- \n<div class=\"cart-button\" ng-click=\"addToCart(product);\">\n  <div ng-show=\"!success\">\n    <i class=\"fa fa-cart-plus\"></i>\n    Add\n  </div>\n  <div ng-show=\"success\">\n    <i class=\"fa fa-check\"></i>\n    Added\n  </div>\n</div>\n -->"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "\n\n<div class=\"shop\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-lg-3\">\n\n        <!-- Shop Sidebar -->\n        <div class=\"shop_sidebar\">\n          <div class=\"sidebar_section\">\n            <div class=\"sidebar_title\">Categories</div>\n            <ul class=\"sidebar_categories\">\n              <li ng-repeat=\"category in categories\"><a href=\"#/category/{{category._id}}\">{{category._id}}</a></li>\n            </ul>\n          </div>\n        </div>\n\n      </div>\n\n      <div class=\"col-lg-9\">\n        \n        <!-- Product Panel -->\n              <div class=\"shop_bar clearfix\">\n              <div class=\"shop_product_count\">\n                <!-- <span>186</span>  -->\n              Products found:</div>\n              <div class=\"shop_sorting\" ng-click=\"handlePriceClick()\">\n                <ul>\n                  <li>\n                    <li class=\"shop_sorting_button\">Sort by Price\n                      <span ng-show=\"price === -1\">\n                         <i class=\"fa fa-chevron-up\"></i>\n                      </span>\n                      <!-- <span ng-show=\"price === 1 || price === undefined\"> -->\n                      <span ng-show=\"price === 1 \">\n                         <i class=\"fa fa-chevron-down\"></i>\n                      </span>\n                    </li>\n                      \n                    </ul>\n                  </li>\n                </ul>\n              </div>\n            </div>\n\n              <div class=\"container \">\n                <div class=\"row \">\n                  <div class=\"col-lg-3 col-md-3 col-sm-4 col-6\" ng-repeat=\"product in products\">\n\n                  <!-- Slider Item -->\n                  <div   class=\"featured_slider_item\" >\n                    <div class=\"border_active\"></div>\n                    <div class=\"product_item slick-active discount d-flex flex-column align-items-center justify-content-center text-center\">\n                      <div class=\"product_image d-flex flex-column align-items-center justify-content-center\">\n                        <a ng-href=\"#/product/{{product._id}}\"><img  ng-src=\"{{product.pictures[0]}}\"  /></div></a>\n                      <div class=\"product_content\">\n                        <div class=\"product_price discount\"><a ng-href=\"#/product/{{product._id}}\"> {{product.displayPrice}} </a><!-- <span>$300</span> --></div>\n                        <div class=\"product_name d-flex flex-column align-items-center justify-content-center\"><div><a ng-href=\"#/product/{{product._id}}\">{{product.name}}</a></div></div>\n                        <div class=\"product_extras\">\n                         \n                          <add-to-cart></add-to-cart>\n                        </div>\n                      </div>\n                      <div ng-click=\"toggle_like(product)\" class=\"product_fav active\"><i class=\"{{product.liked}} fa-heart\" ></i></div>\n                      <!-- <ul class=\"product_marks\">\n                        <li class=\"product_mark product_discount\">-25%</li>\n                        <li class=\"product_mark product_new\">new</li>\n                      </ul> -->\n                    </div>\n                  </div>\n                </div>\n                </div>\n\n          <!-- Shop Page Navigation -->\n\n          <div class=\"shop_page_nav d-flex flex-row\">\n            <div class=\"page_prev d-flex flex-column align-items-center justify-content-center\"><i class=\"fas fa-chevron-left\"></i></div>\n            <ul class=\"page_nav d-flex flex-row\">\n              <li><a >1</a></li>\n              <!-- <li><a href=\"#\">2</a></li>\n              <li><a href=\"#\">3</a></li> -->\n              <li><a >...</a></li>\n              <li><a >last</a></li>\n            </ul>\n            <div class=\"page_next d-flex flex-column align-items-center justify-content-center\"><i class=\"fas fa-chevron-right\"></i></div>\n          </div>\n\n        </div>\n\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<div class = \"container\">\n\n<div class=\"category-tree-wrapper\" ng-show=\"category\">\n  <div class=\"crumbs\">\n    <div class=\"crumb\" ng-repeat=\"ancestor in category.ancestors\">\n      <a ng-href=\"#/category/{{ancestor}}\">\n        {{ancestor}}\n      </a>\n      <div class=\"divider\" ng-hide=\"$last\">\n        /\n      </div>\n    </div>\n    <div class=\"child-categories\" ng-show=\"children && children.length\">\n      <div class=\"divider\">\n        /\n      </div>\n      <div  class=\"child-arrow\"\n            ng-init=\"display = false;\"\n            ng-click=\"display = !display;\">\n        <i class=\"fa fa-chevron-down\"></i>\n      </div>\n      <div class=\"child-select\" ng-show=\"display\">\n        <div ng-repeat=\"child in children\">\n          <a ng-href=\"#/category/{{child._id}}\">\n            {{child._id}}\n          </a>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n</div>\n"

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/cart_styles.css\"> -->\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/cart_responsive.css\"> -->\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/shop_styles_custom.css\"> -->\n<search-bar></search-bar>\n<main-nav></main-nav>\n\n\n<!-- Cart -->\n\n  <div class=\"cart_section\">\n    <div class=\"container\">\n      <div class=\"row\">\n        <div class=\"col-lg-10 offset-lg-1\">\n          <div class=\"cart_container\">\n            <div class=\"cart_title\">Shopping Cart</div>\n            <div ng-repeat=\"item in user.user.data.cart\" class=\"cart_items\">\n              <ul class=\"cart_list\">\n                <li  class=\"cart_item clearfix\">\n                  <div class=\"cart_item_image\"><img ng-src=\"{{item.product.pictures[0]}}\" alt=\"\"></div>\n                  <div class=\"cart_item_info d-flex flex-md-row flex-column justify-content-between\">\n                    <div class=\"cart_item_name cart_info_col\">\n                      <div class=\"cart_item_title\">Name</div>\n                      <div class=\"cart_item_text\"><a ng-href=\"#/product/{{item.product._id}}\">{{item.product.name}}</a></div>\n                    </div>\n                    \n                    <div class=\"cart_item_quantity cart_info_col\">\n                      <div class=\"cart_item_title\">Quantity</div>\n                      <div class=\"cart_item_text\">{{item.quantity}}</div>\n                    </div>\n                    <div class=\"cart_item_price cart_info_col\">\n                      <div class=\"cart_item_title\">Price</div>\n                      <div class=\"cart_item_text\">{{item.product.displayPrice}}</div>\n                    </div>\n                  </div>\n                  <div class=\"cart_item_total cart_info_col\">\n                      <div class=\"cart_item_title\">Total</div>\n                      <div class=\"cart_item_text\">{{item.product.totalPrice}}</div>\n                  </div>\n                </li>\n                \n              </ul>\n            </div>\n            \n            <!-- Order Total -->\n            <div class=\"order_total\">\n              <div class=\"order_total_content text-md-right\">\n                <div class=\"order_total_title\">Order Total:</div>\n                <div class=\"order_total_amount\">{{user.user.data.DisplayTotalCost}}</div>\n              </div>\n            </div>\n\n            <div class=\"cart_buttons\">\n              <button ng-click=\"updateCart()\" type=\"button\" class=\"button cart_button_clear\">Update Cart</button>\n              <button ng-click=\"checkout()\" type=\"button\" class=\"button cart_button_checkout\">Check Out</button>\n            </div>\n          </div>\n\n          <div class=\"checkout-wrapper\">\n            <!-- <div class=\"update-cart-button\" ng-click=\"updateCart()\">\n              Update Cart\n            </div> -->\n            <div class=\"checkout\">\n              <h1>\n                <i class=\"fa fa-credit-card\"></i>\n                Payment\n              </h1>\n              <div class=\"credit-card-input\">\n                Credit Card Number:\n                <input type=\"text\" ng-model=\"stripeToken.number\" />\n              </div>\n             <!--  <div class=\"checkout-button\" ng-click=\"checkout()\">\n                Check Out\n              </div> -->\n              <div class=\"checkout-error\" ng-show=\"error\">\n                {{error}}\n              </div>\n              <div class=\"checkout-success\" ng-show=\"checkedOut\">\n                Checked out successfully!\n              </div>\n            </div>\n          </div>\n\n        </div>\n      </div>\n    </div>\n  </div>\n\n\n\n<!-- \n  <div  ng-repeat=\"item in user.user.data.cart\"\n        class=\"checkout-product\">\n    <div class=\"image-left\">\n      <img ng-src=\"{{item.product.pictures[0]}}\">\n    </div>\n    <div class=\"product-details\">\n      <div class=\"name\">\n        {{item.product.name}}\n      </div>\n      <div class=\"price\">\n        {{item.product.displayPrice}}\n      </div>\n      <div class=\"quantity\">\n        Quantity:\n        <input type=\"number\" ng-model=\"item.quantity\" />\n      </div>\n    </div>\n    <div style=\"clear: both\"></div>\n  </div> -->\n\n\n  \n\n<!-- {{user.user.data.cart}} -->\n<recently-viewed></recently-viewed>\n<footer-block></footer-block>"

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/cart_styles.css\"> -->\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/cart_responsive.css\"> -->\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/liked_styles_custom.css\"> -->\n<search-bar></search-bar>\n<main-nav></main-nav>\n\n\n<!-- Cart -->\n\n  <div class=\"cart_section\">\n    <div class=\"container\">\n      <div class=\"row\">\n        <div class=\"col-lg-10 offset-lg-1\">\n          <div class=\"cart_container\">\n            <div class=\"cart_title\">Whishlist</div>\n            <div ng-repeat=\"item in w\" class=\"cart_items\">\n              <ul class=\"cart_list\">\n                <li  class=\"cart_item clearfix\">\n                  <!-- {{item}} -->\n                  <div class=\"cart_item_image\"><img ng-src=\"{{item.pictures[0]}}\" alt=\"\"></div>\n                  <div class=\"cart_item_info d-flex flex-md-row flex-column justify-content-between\">\n                    <div class=\"cart_item_name cart_info_col\">\n                      <div class=\"cart_item_title\">Name</div>\n                      <div class=\"cart_item_text\"><a ng-href=\"#/product/{{item._id}}\">{{item.name}}</a></div>\n                    </div>\n                    <div class=\"cart_item_quantity cart_info_col\">\n                      <div class=\"cart_item_title\"><div ng-click=\"toggle_like(item)\" class=\"product_fav active\"><i class=\"{{item.liked}} fa-heart\"  ></i></div></div>\n                      <div class=\"cart_item_text\">&nbsp;</div>\n\n                    </div>\n                    <div class=\"cart_item_price cart_info_col\">\n                      <div class=\"cart_item_title\">Price</div>\n                      <div class=\"cart_item_text\">{{item.displayPrice}}</div>\n                    </div>\n                  </div>\n                  <!-- <div class=\"cart_item_total cart_info_col\">\n                      <div class=\"cart_item_title\">Total</div>\n                      <div class=\"cart_item_text\">{{item.totalPrice}}</div>\n                  </div> -->\n                </li>\n                \n              </ul>\n            </div>\n            \n\n            <div class=\"cart_buttons\">\n              <button ng-click=\"updateLikes()\" type=\"button\" class=\"button cart_button_clear\">Update Likes</button>\n             <!--  <button ng-click=\"checkout()\" type=\"button\" class=\"button cart_button_checkout\">Check Out</button> -->\n            </div>\n          </div>\n\n          \n        </div>\n      </div>\n    </div>\n  </div>\n\n\n\n\n  \n\n<!-- {{user.user.data.cart}} -->\n<recently-viewed></recently-viewed>\n<footer-block></footer-block>"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "\n<header class=\"header\">\n<div class=\"top_bar\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col d-flex flex-row\">\n        <div class=\"top_bar_contact_item\"><div class=\"top_bar_icon\"><a href=\"#\"><img \n          /*style =\" margin-top:13px; width:30px\" */\n          src=\"images/card-full.svg\" alt=\"\"></a></div></div>\n        <div class=\"top_bar_content ml-auto\">\n          <div class=\"top_bar_menu\">\n            \n          </div>\n          <div class=\"top_bar_user\">\n            \n            <div class=\"user_icon\" ng-hide=\"user.user\"><img ng-hide=\"user.user\" src=\"images/user.svg\" alt=\"\"></div>\n            <div><a ng-show=\"user.user\">Signed in as {{user.user.name}}</a>\n                 <a ng-show=\"!user.user\" ng-href=\"#/register\">Register</a>\n            </div>\n            <div><a ng-show=\"!user.user\" ng-href=\"#/login\">Sign in</a></div>\n            <div class=\"user_icon\" ng-show=\"user.user\"><a ng-href=\"#/checkout\"><i class=\"fa fa-shopping-cart\"></i></a></div>\n            <div class=\"user_icon\" ng-show=\"user.user\"><img ng-show=\"user.user.profile.picture\" ng-src=\"{{user.user.profile.picture}}\"/></div>\n            <div ng-show=\"user.user\"> <a href=\"#\" ng-click=\"signout()\">Logout</a></div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\t\t\n</div>\n</header>\n"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<!-- Single Product -->\n\n<div class=\"single_product\">\n  <div class=\"container\">\n    <div class=\"row\">\n\n      <!-- Images -->\n      <div class=\"col-lg-2 order-lg-1 order-2\">\n        <ul class=\"image_list\" >\n          <li ng-click= \"image_selected =product.pictures[0]\"><img ng-src=\"{{product.pictures[0]}}\" alt=\"\"></li>\n          <li ng-click= \"image_selected =product.pictures[1]\"><img ng-src=\"{{product.pictures[1]}}\" alt=\"\"></li>\n          <li ng-click= \"image_selected =product.pictures[2]\"><img ng-src=\"{{product.pictures[2]}}\" alt=\"\"></li>\n        </ul>\n      </div>\n\n      <!-- Selected Image -->\n      <div class=\"col-lg-5 order-lg-2 order-1\">\n        <div class=\"image_selected\"><img  ng-src=\"{{image_selected}}\" alt=\"\"></div>\n      </div>\n\n      <!-- Description -->\n      <div class=\"col-lg-5 order-3\">\n        <div class=\"product_description\">\n          <div class=\"product_category\"><a ng-href=\"#/category/{{product.category.ancestors[0]}}\">{{product.category.ancestors[0]}}</a></div>\n          <div class=\"product_name\">{{product.name}}</div>\n\n          <div class=\"rating_r {{prd.userrating}} product_rating\">\n                                        <i class = \"starrating\" ng-repeat=\"star in stars\" \n                                        ng-Mouseleave = \"leave_stars(star,prd)\" ng-Mouseover=\"hover_stars(star,prd)\" ng-click=\"set_stars(star,prd)\"></i></div>\n          \n          <div class=\"order_info d-flex flex-row\">\n            <!-- <form action=\"#\"> -->\n            <div>\n              <div class=\"clearfix\" style=\"z-index: 1000;\">\n\n                <!-- Product Quantity -->\n                <div class=\"product_quantity clearfix\">\n                  <span>Quantity: </span>\n                  <input ng-disabled=\"true\" style = \"background: transparent;\" id=\"quantity_input\" type=\"text\" pattern=\"[1-9]*\" value={{quant}}>\n                  <div class=\"quantity_buttons\" ng-init = \"quant = 1\">\n                    <div id=\"quantity_inc_button\" ng-click = \"quant=quant+1;\" class=\"quantity_inc quantity_control\"><i class=\"fas fa-chevron-up\"></i></div>\n                    <div id=\"quantity_dec_button\" ng-click = \"quant= quant <= 1 ? 1 : quant=quant-1;\" class=\"quantity_dec quantity_control\"><i class=\"fas fa-chevron-down\"></i></div>\n                  </div>\n                </div>\n\n                \n\n              </div>\n              \n              <div class=\"product_price\">{{product.displayPrice}}</div>\n              <div class=\"button_container\">\n                <add-to-cart></add-to-cart>\n                <!-- <button type=\"button\" class=\"button cart_button\">Add to Cart</button> -->\n                <div ng-click=\"toggle_like(prd)\" class=\"product_fav active\"><i class=\"{{prd.liked}} fa-heart\"  ></i></div>\n                <!-- <div class=\"product_fav\"><i class=\"fas fa-heart\"></i></div> -->\n              </div>\n            </div>  \n            <!-- </form> -->\n          </div>\n        </div>\n      </div>\n\n    </div>\n  </div>\n</div>\n\n\n"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "\n\n<!-- Header Main -->\n\n<div class=\"header_main\">\n\t<div class=\"container\">\n\t\t<div class=\"row\">\n\n\t\t\t<!-- Logo -->\n\t\t\t<div class=\"col-lg-2 col-sm-3 col-3 order-1\">\n\t\t\t\t<div class=\"logo_container\">\n\t\t\t\t\t<div class=\"logo\"><a href=\"#\">WebOnline</a></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<!-- Search -->\n\t\t\t<div class=\"col-lg-6 col-12 order-lg-2 order-3 text-lg-left text-right\">\n\t\t\t\t\t<div class=\"header_search\">\n\t\t\t\t\t\t<div class=\"header_search_content\">\n\t\t\t\t\t\t\t<div class=\"header_search_form_container\">\n\t\t\t\t\t\t\t\t<form ng-submit=\"search()\" class=\"header_search_form clearfix\">\n\t\t\t\t\t\t\t\t    <input class = \"header_search_input\" ng-model=\"searchText\" ng-focus = 'show_results()' ng-blur=\"hide_results()\" ng-change=\"update()\" placeholder=\"Type: cooking book...\" >\n\t\t\t\t\t\t\t\t\t<div class=\"custom_dropdown\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"custom_dropdown_list\" >\n\t\t\t\t\t\t\t\t\t\t\t<span  role=\"\" class=\"custom_dropdown_placeholder clc\"> <a ng-click=\"toggle_cat()\" >{{checked_cat}}</a></span>\n\t\t\t\t\t\t\t\t\t\t\t<i class=\"fas fa-chevron-down\"></i>\n\t\t\t\t\t\t\t\t\t\t\t<ul class=\"custom_list clc\" ng-class=\"toggle_cat_list\" >\n\t\t\t\t\t\t\t\t\t\t\t\t<li ng-repeat=\"category in categories\"><a class=\"clc\" ng-click=\"check_cat(category)\" href=\"#\">{{category._id}}</a></li>\n\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<button type=\"submit\" class=\"header_search_button trans_300\" value=\"Submit\"><img src=\"images/search.png\" alt=\"\"></button>\n\t\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t\t  <div class=\"autocomplete-res \"  ng-show = \"show_list\" ng-hide = \"hide_list\">\n\t\t\t\t\t\t\t\t\t<div ng-repeat=\"result in results\">\n\t\t\t\t\t\t\t\t\t\t<a ng-href=\"#/product/{{result._id}}\">\n\t\t\t\t\t\t\t\t\t\t{{result.name}} \n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<a></a>\n\t\t\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t<!-- Wishlist -->\n\t\t\t<!-- Wishlist -->\n\t\t\t<div class=\"col-lg-4 col-9 order-lg-3 order-2 text-lg-left text-right\">\n\t\t\t\t\t<div class=\"wishlist_cart d-flex flex-row align-items-center justify-content-end\">\n\t\t\t\t\t\t<div class=\"wishlist d-flex flex-row align-items-center justify-content-end\">\n\t\t\t\t\t\t\t<div class=\"wishlist_icon\"><img src=\"images/heart.png\" alt=\"\"></div>\n\t\t\t\t\t\t\t<div class=\"wishlist_content\">\n\t\t\t\t\t\t\t\t<div ng-show=\"user.user\" class=\"wishlist_text\" >\n\t\t\t\t\t\t\t\t\t<a href=\"#/likes\">Wishlist</a>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div ng-show=\"!user.user\" uib-popover=\"Please login to view your wishlist\" popover-trigger=\"'mouseenter'\" class=\"wishlist_text\">\n\t\t\t\t\t\t\t\t\t<a href=\"#/login\">Wishlist</a></div>\n\t\t\t\t\t\t\t\t<div class=\"wishlist_count\">{{liked_ct}}</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\n\t\t\t\t\t\t<!-- Cart -->\n\t\t\t\t\t\t<div class=\"cart\">\n\t\t\t\t\t\t\t<div class=\"cart_container d-flex flex-row align-items-center justify-content-end\">\n\t\t\t\t\t\t\t\t<div class=\"cart_icon\">\n\t\t\t\t\t\t\t\t\t<img src=\"images/cart.png\" alt=\"\">\n\t\t\t\t\t\t\t\t\t<div class=\"cart_count\"><span>{{cart_ct}}</span></div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"cart_content\">\n\t\t\t\t\t\t\t\t\t<div ng-show=\"user.user\" class=\"cart_text\"><a href=\"#/checkout\">Cart</a></div>\n\t\t\t\t\t\t\t\t\t<div ng-show=\"!user.user\" uib-popover=\"Please login to view your cart\" popover-trigger=\"'mouseenter'\" class=\"cart_text\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"#/login\">Cart</a></div>\n\t\t\t\t\t\t\t\t\t<!-- <div class=\"cart_price\">$85</div> -->\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t\n\n"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "\r\n\r\n<!-- <link rel=\"stylesheet\" href=\"http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css\"> -->\r\n  \r\n  \r\n<div ng-controller=\"LoginController as $ctrl\" class=\"modal-demo\">\r\n    \r\n        <!-- <div class=\"modal-header\">\r\n            <h3 class=\"modal-title\" id=\"modal-title\">Login</h3>\r\n        </div> -->\r\n      \r\n<div class=\"modal  show\" tabindex=\"-1\" role=\"dialog\"  style=\"display: block; \">\r\n  <div class=\"modal-dialog\" role=\"document\" style=\"display: block; \">\r\n    <div class=\"modal-content\">\r\n      <div class=\"modal-header\">\r\n      <span class=\"span-modal-header\"> <h3 class=\"modal-title\" id=\"exampleModalLiveLabel\">{{$ctrl.Card}}</h3></span>\r\n      <span class=\"span-modal-cross\">  <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n      <span aria-hidden=\"true\"><a ng-href=\"/#/\">×</a></span>\r\n        </button> \r\n      </span>\r\n      </div> \r\n\r\n        <div class=\"modal-body id=\"modal-body\" >\r\n          <div class=\"modal-form\" ng-include src=\"$ctrl.LoginTemplateUrl\">\r\n          </div> \r\n        </div>\r\n        <!-- <div class=\"modal-footer\">\r\n            <button class=\"btn btn-primary\" type=\"button\" ng-click=\"$ctrl.ok()\">OK</button>\r\n            <button class=\"btn btn-warning \" type=\"button\" ng-click=\"$ctrl.cancel()\">Cancel</button>\r\n        </div> -->\r\n       </div>\r\n  </div>\r\n</div>  \r\n    \r\n</div>\r\n<div class=\"modal-backdrop show\" style=\"opacity: 0.5; \"></div>\r\n\r\n<script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.min.js\"></script>\r\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js\"></script>\r\n  <script src=\"http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-messages.min.js\"></script>\r\n    <!-- Angular Material Library -->\r\n <script src=\"http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js\"></script> \r\n"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "\n\t\t<!-- Main Navigation -->\n\n\t\t<nav class=\"main_nav\" >\n\t\t\t<div class=\"container\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t\n\t\t\t\t\t\t<div class=\"main_nav_content d-flex flex-row\">\n\n\t\t\t\t\t\t\t<!-- Categories Menu -->\n\n\t\t\t\t\t\t\t<div class=\"cat_menu_container\">\n\t\t\t\t\t\t\t\t<div class=\"cat_menu_title d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t<div class=\"cat_burger\"><span></span><span></span><span></span></div>\n\t\t\t\t\t\t\t\t\t<div class=\"cat_menu_text\">categories</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<ul class=\"cat_menu\" \t>\n\t\t\t\t\t\t\t\t\t<li class=\"hassubs\" ng-repeat=\"category in categories\" ng-if=\"!category.parent\" >\n\t\t\t\t\t\t\t\t\t\t<div><a class=\"inline\" ng-href=\"#/category/{{category._id}}\">{{category._id}}</a></div>\n\t\t\t\t\t\t\t\t\t\t<ul id=\"{{category._id}}\"></ul>\n\t\t\t\t\t\t\t\t\t\t<!-- <a ng-Mouseleave=\"remove_sub(category)\" ng-mouseover=\"insert_sub(category)\" id=\"{{category._id}}\" ng-href=\"#/category/{{category._id}}\">{{category._id}}<i class=\"fas fa-chevron-right\"></i></a> -->\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<!-- Main Nav Menu -->\n\n\t\t\t\t\t\t\t<div class=\"main_nav_menu ml-auto\">\n\t\t\t\t\t\t\t\t<ul class=\"standard_dropdown main_nav_dropdown\">\n\t\t\t\t\t\t\t\t\t<li><a href=\"#\">Home<i class=\"fas fa-chevron-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t<li class=\"hassubs\">\n\t\t\t\t\t\t\t\t\t\t<a href=\"#\">Pages<i class=\"fas fa-chevron-down\"></i></a>\n\t\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t\t<li><a href=\"#/category/Books\">Categories<i class=\"fas fa-chevron-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t\t<li><a href=\"#/blog_single\">Blog<i class=\"fas fa-chevron-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t\t<li><a href=\"#/likes\">My wishes<i class=\"fas fa-chevron-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t\t<li><a href=\"#/checkout\">Cart<i class=\"fas fa-chevron-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t\t<li><a href=\"#/about\">Contacts<i class=\"fas fa-chevron-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t<li><a href=\"#/blog_single\">Blog<i class=\"fas fa-chevron-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t<li><a href=\"#/about\">About<i class=\"fas fa-chevron-down\"></i></a></li>\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t<!-- Menu Trigger -->\n\n\t\t\t\t\t\t\t<div class=\"menu_trigger_container ml-auto\">\n\t\t\t\t\t\t\t\t<div class=\"menu_trigger d-flex flex-row align-items-center justify-content-end\">\n\t\t\t\t\t\t\t\t\t<div class=\"menu_burger\" ng-click=\"burger_toggle('menu_content')\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"menu_trigger_text\">menu</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"cat_burger menu_burger_inner\"><span></span><span></span><span></span></div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</nav>\n\t\t\n\t\t<!-- Menu -->\n\n\t\t<div class=\"page_menu\">\n\t\t\t<div class=\"container\">\n\t\t\t\t<div class=\"row\">\n\t\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\t<!-- style=\"height: auto;\" -->\n\t\t\t\t\t\t<div id =\"menu_content\" class=\"page_menu_content\" >\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<!-- <div class=\"page_menu_search\">\n\t\t\t\t\t\t\t\t<form action=\"#\">\n\t\t\t\t\t\t\t\t\t<input type=\"search\" required=\"required\" class=\"page_menu_search_input\" placeholder=\"Search for products...\">\n\t\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t</div> -->\n\t\t\t\t\t\t\t<ul class=\"page_menu_nav\">\n\t\t\t\t\t\t\t\t<li class=\"page_menu_item\">\n\t\t\t\t\t\t\t\t\t<a href=\"/\">Home<i ></i></a>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li class=\"page_menu_item has-children\">\n\t\t\t\t\t\t\t\t\t<a style=\"cursor: pointer; color: white;\" ng-click=\"burger_toggle('menu_selection')\">Pages<i class=\"fa fa-angle-down\"></i></a>\n\t\t\t\t\t\t\t\t\t<ul id=\"menu_selection\" class=\"page_menu_selection\">\n\t\t\t\t\t\t\t\t\t\t<li><a href=\"#/category/Books\">Categories<i class=\"fa fa-angle-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t<li><a href=\"#/blog_single\">Blog<i class=\"fa fa-angle-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<li ng-show=\"user.user\"><a href=\"#/likes\">My wishes<i class=\"fa fa-angle-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t<li ng-show=\"!user.user\"><a href=\"#/login\">My wishes<i class=\"fa fa-angle-down\"></i></a></li>\n\n\t\t\t\t\t\t\t\t\t\t<li ng-show=\"user.user\"><a href=\"#/checkout\">Cart<i class=\"fa fa-angle-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t<li ng-show=\"!user.user\"><a href=\"#/login\">Cart<i class=\"fa fa-angle-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<li><a href=\"#/about\">Contacts<i class=\"fa fa-angle-down\"></i></a></li>\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li class=\"page_menu_item\">\n\t\t\t\t\t\t\t\t\t\t<a href=\"#/blog_single\"      >Blog<i class=\"fa\"></i></a>\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t<li class=\"page_menu_item\">\n\t\t\t\t\t\t\t\t\t<a href=\"#/about\"      >About<i class=\"fa fa-angle-down\"></i></a>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<!-- <div class=\"menu_contact\">\n\t\t\t\t\t\t\t\t<div class=\"menu_contact_item\"><div class=\"menu_contact_icon\"><img src=\"images/phone_white.png\" alt=\"\"></div>+38 068 005 3570</div>\n\t\t\t\t\t\t\t\t<div class=\"menu_contact_item\"><div class=\"menu_contact_icon\"><img src=\"images/mail_white.png\" alt=\"\"></div><a href=\"mailto:fastsales@gmail.com\">fastsales@gmail.com</a></div>\n\t\t\t\t\t\t\t</div> -->\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t</header>\n\t\n\n\t\n"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<div class=\"banner_2\">\n\n    <div>\n        <div class=\"carousel-demo\" >\n            <ul style=\"display:block; width: 97vw; height:40vw; margin: 0 auto\"  rn-carousel rn-carousel-index=\"carouselIndex2\"  rn-carousel-pause-on-hover\n                rn-carousel-buffered class=\"carousel2\">\n                <li class=\"banner_2_item\" style=\"display:block; \" ng-repeat=\"slide in slides2 track by slide.id\" ng-class=\"'id-' + slide.id\">\n                    <div class=\"banner_2_item\">\n                        <div class=\"container \">\n                            <div class=\"row \">\n                                <div class=\"col-lg-4 col-md-6 \">\n                                    <div class=\"banner_2_content\">\n                                        <div class=\"banner_2_category\">Tablets</div>\n                                        <div class=\"banner_2_title\"><a href=\"#/product/5bf1c9c6d92b220e273bb64b\">iPad Pro</a></div>\n                                        <div class=\"banner_2_text\">Get an exciting experience reading your favourite books on the new device</div>\n                                        \n                                        <div class=\"button banner_2_button\">\n                                            <a href=\"#/blog_single\">Explore</a>\n                                        </div>\n                                    </div>\n\n                                </div>\n                                <div class=\"col-lg-8 col-md-6 \">\n                                    <div class=\"banner_2_image_container\">\n                                        <div class=\"banner_2_image img-fluid\">\n                                            <img ng-src=\"{{slide.img}}\" alt=\"\">\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n\n\n                    <!-- #{{ slide.id }} -->\n\n                </li>\n            </ul>\n            <div class=\"rn-carousel-indicator custom-indicator banner_2_dots\" >\n                <div ng-repeat=\"slide in slides2\" ng-class=\"{active: $index==$parent.carouselIndex2}\" ng-click=\"$parent.carouselIndex2 = $index\"\n                    class=\"owl-dot active\" style = \"border:none; outline: none;\">\n                    <span></span>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n"

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "\t<!-- Best Sellers -->\n\t\n\n\t<div class=\"best_sellers\">\n\n\n\t\t<div class=\"container\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col\">\n\t\t\t\t\t<div class=\"tabbed_container\">\n\t\t\t\t\t\t<div class=\"tabs clearfix tabs-right\">\n\t\t\t\t\t\t\t<div class=\"new_arrivals_title\">Hot Best Sellers</div>\n\t\t\t\t\t\t\t<ul class=\"clearfix\">\n\t\t\t\t\t\t\t\t<li ng-repeat=\"tab in tabs\" ng-click=\"toggle_tab($index)\" \n\t\t\t\t\t\t\t\t    ng-class=\"tab.status\">{{tab.name}}</li>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t<div class=\"tabs_line\"><span></span></div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class=\"bestsellers_panel panel\" ng-init=\"num = 0;\" ng-show=\"num == index\">\n\t\t\t\t\t\t\t <!-- Top of the week Slider -->\n\t\t\t\t\t\t\t<div class=\"carousel-demo\" >\n\t\t\t\t\t\t\t\t<ul style=\"display:block; height:30vw; \"  rn-carousel rn-carousel-index=\"carouselIndex3\"  rn-carousel-pause-on-hover\n\t\t\t\t\t\t\t\t\trn-carousel-buffered class=\"carousel2 bestsellers\">\n\t\t\t\t\t\t\t\t\t<li class=\"banner_2_item\" style=\"display:block; \" >\n\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_item\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"container \">\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"row \" >\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Best Sellers Item -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"prd in top0\" class=\" col-lg-4 col-md-6 col-sm-12\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item discount\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item_container d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_image\"><img ng-src=\"{{prd.pictures[0]}}\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_category\"><a ng-href=\"#/category/{{prd.category.ancestors[0]}}\">{{prd.category.ancestors[0]}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_name\"><a ng-href=\"#/product/{{prd._id}}\">{{prd.name}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"rating_r {{prd.userrating}} bestsellers_rating\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<i class = \"starrating\" ng-repeat=\"star in stars\" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tng-Mouseleave = \"leave_stars_t(star,prd)\" ng-Mouseover=\"hover_stars_t(star,prd)\" ng-click=\"set_stars_t(star,prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_price discount\">{{prd.displayPrice}}<span></span></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_fav active\"><i class=\"{{prd.liked}} fa-heart\"  ng-click=\"toggle_like_t(prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"bestsellers_marks\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- <li class=\"bestsellers_mark bestsellers_discount\">-25%</li> -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"bestsellers_mark bestsellers_new\">new</li>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n \t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<!-- #{{ slide.id }} -->\n\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t</li>\n\n\t\t\t\t\t\t\t\t\t<li class=\"banner_2_item\" style=\"display:block; \" >\n\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_item\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"container \">\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"row \" >\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Best Sellers Item -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"prd in top1\" class=\" col-lg-4 col-md-6 col-sm-12\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item discount\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item_container d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_image\"><img ng-src=\"{{prd.pictures[0]}}\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_category\"><a ng-href=\"#/category/{{prd.category.ancestors[0]}}\">{{prd.category.ancestors[0]}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_name\"><a ng-href=\"#/product/{{prd._id}}\">{{prd.name}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"rating_r {{prd.userrating}} bestsellers_rating\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<i class = \"starrating\" ng-repeat=\"star in stars\" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tng-Mouseleave = \"leave_stars_t(star,prd)\" ng-Mouseover=\"hover_stars_t(star,prd)\" ng-click=\"set_stars_t(star,prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_price discount\">{{prd.displayPrice}}<span></span></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_fav active\"><i class=\"{{prd.liked}} fa-heart\"  ng-click=\"toggle_like_t(prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"bestsellers_marks\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- <li class=\"bestsellers_mark bestsellers_discount\">-25%</li> -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"bestsellers_mark bestsellers_new\">new</li>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n \t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\t\t\t\t\t<!-- #{{ slide.id }} -->\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t<div class= 'container' ></div>\n\t\t\t\t\t\t\t\t<div class= 'row' >\n               \t\t\t\t\t\t <div class = 'col-xs-2 col-md-4'></div>\n                \t\t\t\t\t <div class = 'col-xs-4'>\n\t\t\t\t\t\t\t\t\t\t<div class=\"rn-carousel-indicator custom-indicator banner_2_dots\" \n\t\t\t\t\t\t\t\t\t\tstyle = \"position:relative; left:150px; bottom:-25px;\">\n\t\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"slide in slides3\" ng-class=\"{active: $index==$parent.carouselIndex3}\" ng-click=\"$parent.carouselIndex3 = $index\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"owl-dot active\" style = \"border:none; outline: none;\">\n\t\t\t\t\t\t\t\t\t\t\t\t<span></span>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<!-- <div class = 'col-sm-4'>....</div>\t -->\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t\n\n\t\t\t\t\t\t<div class=\"bestsellers_panel panel\" ng-init=\"num1 = 1;\" ng-show=\"num1 == index\">\n\n\t\t\t\t\t\t\t<!-- Most liked Slider -->\n\n\t\t\t\t\t\t\t<div class=\"carousel-demo\" >\n\t\t\t\t\t\t\t\t<ul style=\"display:block; height:30vw; \"  rn-carousel rn-carousel-index=\"carouselIndex31\" rn-carousel-pause-on-hover\n\t\t\t\t\t\t\t\t\trn-carousel-buffered class=\"carousel2 bestsellers\">\n\t\t\t\t\t\t\t\t\t<li class=\"banner_2_item\" style=\"display:block; \" >\n\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_item\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"container \">\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"row \" >\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Best Sellers Item -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"prd in liked0\" class=\" col-lg-4 col-md-6 col-sm-12\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item discount\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item_container d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_image\"><img ng-src=\"{{prd.pictures[0]}}\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_category\"><a ng-href=\"#/category/{{prd.category.ancestors[0]}}\">{{prd.category.ancestors[0]}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_name\"><a ng-href=\"#/product/{{prd._id}}\">{{prd.name}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"rating_r {{prd.userrating}} bestsellers_rating\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<i class = \"starrating\" ng-repeat=\"star in stars\" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tng-Mouseleave = \"leave_stars_l(star,prd)\" ng-Mouseover=\"hover_stars_l(star,prd)\" ng-click=\"set_stars_l(star,prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_price discount\">{{prd.displayPrice}}<span></span></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_fav active\"><i class=\"{{prd.liked}} fa-heart\"  ng-click=\"toggle_like_t(prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"bestsellers_marks\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- <li class=\"bestsellers_mark bestsellers_discount\">-25%</li> -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"bestsellers_mark bestsellers_new\">new</li>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n \t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<!-- #{{ slide.id }} -->\n\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t</li>\n\n\t\t\t\t\t\t\t\t\t<li class=\"banner_2_item\" style=\"display:block; \" >\n\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_item\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"container \">\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"row \" >\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Best Sellers Item -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"prd in liked1\" class=\" col-lg-4 col-md-6 col-sm-12\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item discount\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item_container d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_image\"><img ng-src=\"{{prd.pictures[0]}}\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_category\"><a ng-href=\"#/category/{{prd.category.ancestors[0]}}\">{{prd.category.ancestors[0]}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_name\"><a ng-href=\"#/product/{{prd._id}}\">{{prd.name}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"rating_r {{prd.userrating}} bestsellers_rating\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<i class = \"starrating\" ng-repeat=\"star in stars\" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tng-Mouseleave = \"leave_stars_l(star,prd)\" ng-Mouseover=\"hover_stars_l(star,prd)\" ng-click=\"set_stars_l(star,prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_price discount\">{{prd.displayPrice}}<span></span></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_fav active\"><i class=\"{{prd.liked}} fa-heart\"  ng-click=\"toggle_like_t(prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"bestsellers_marks\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- <li class=\"bestsellers_mark bestsellers_discount\">-25%</li> -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"bestsellers_mark bestsellers_new\">new</li>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n \t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\t\t\t\t\t<!-- #{{ slide.id }} -->\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t<div class= 'container' ></div>\n\t\t\t\t\t\t\t\t<div class= 'row' >\n               \t\t\t\t\t\t <div class = 'col-xs-2 col-md-4'></div>\n                \t\t\t\t\t <div class = 'col-xs-4'>\n\t\t\t\t\t\t\t\t\t\t<div class=\"rn-carousel-indicator custom-indicator banner_2_dots\" \n\t\t\t\t\t\t\t\t\t\tstyle = \"position:relative; left:150px; bottom:-25px;\">\n\t\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"slide in slides31\" ng-class=\"{active: $index==$parent.carouselIndex31}\" ng-click=\"$parent.carouselIndex31 = $index\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"owl-dot active\" style = \"border:none; outline: none;\">\n\t\t\t\t\t\t\t\t\t\t\t\t<span></span>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<!-- <div class = 'col-sm-4'>....</div>\t -->\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t<div class=\"bestsellers_panel panel\" ng-init=\"num2 = 2;\" ng-show=\"num2 == index\">\n\n\t\t\t\t\t\t\t<!-- Top scored -->\n\t\t\t\t\t\t\t<!-- Most liked Slider -->\n\n\t\t\t\t\t\t\t<div class=\"carousel-demo\" >\n\t\t\t\t\t\t\t\t<ul style=\"display:block; height:30vw; \"  rn-carousel rn-carousel-index=\"carouselIndex32\" rn-carousel-pause-on-hover\n\t\t\t\t\t\t\t\t\trn-carousel-buffered class=\"carousel2 bestsellers\">\n\t\t\t\t\t\t\t\t\t<li class=\"banner_2_item\" style=\"display:block; \" >\n\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_item\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"container \">\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"row \" >\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Best Sellers Item -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"prd in scored0\" class=\" col-lg-4 col-md-6 col-sm-12\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item discount\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item_container d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_image\"><img ng-src=\"{{prd.pictures[0]}}\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_category\"><a ng-href=\"#/category/{{prd.category.ancestors[0]}}\">{{prd.category.ancestors[0]}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_name\"><a ng-href=\"#/product/{{prd._id}}\">{{prd.name}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"rating_r {{prd.userrating}} bestsellers_rating\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<i class = \"starrating\" ng-repeat=\"star in stars\" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tng-Mouseleave = \"leave_stars_l(star,prd)\" ng-Mouseover=\"hover_stars_l(star,prd)\" ng-click=\"set_stars_l(star,prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_price discount\">{{prd.displayPrice}}<span></span></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_fav active\"><i class=\"{{prd.liked}} fa-heart\"  ng-click=\"toggle_like_t(prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"bestsellers_marks\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- <li class=\"bestsellers_mark bestsellers_discount\">-25%</li> -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"bestsellers_mark bestsellers_new\">new</li>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n \t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<!-- #{{ slide.id }} -->\n\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t</li>\n\n\t\t\t\t\t\t\t\t\t<li class=\"banner_2_item\" style=\"display:block; \" >\n\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_item\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"banner_2_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"container \">\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"row \" >\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- Best Sellers Item -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"prd in scored1\" class=\" col-lg-4 col-md-6 col-sm-12\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item discount\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_item_container d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_image\"><img ng-src=\"{{prd.pictures[0]}}\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_content\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_category\"><a ng-href=\"#/category/{{prd.category.ancestors[0]}}\">{{prd.category.ancestors[0]}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_name\"><a ng-href=\"#/product/{{prd._id}}\">{{prd.name}}</a></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"rating_r {{prd.userrating}} bestsellers_rating\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<i class = \"starrating\" ng-repeat=\"star in stars\" \n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tng-Mouseleave = \"leave_stars_l(star,prd)\" ng-Mouseover=\"hover_stars_l(star,prd)\" ng-click=\"set_stars_l(star,prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_price discount\">{{prd.displayPrice}}<span></span></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"bestsellers_fav active\"><i class=\"{{prd.liked}} fa-heart\"  ng-click=\"toggle_like_t(prd)\"></i></div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"bestsellers_marks\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<!-- <li class=\"bestsellers_mark bestsellers_discount\">-25%</li> -->\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li class=\"bestsellers_mark bestsellers_new\">new</li>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n \t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\t\n\t\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\t\t\t\t\t<!-- #{{ slide.id }} -->\n\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t<div class= 'container' ></div>\n\t\t\t\t\t\t\t\t<div class= 'row' >\n               \t\t\t\t\t\t <div class = 'col-xs-2 col-md-4'></div>\n                \t\t\t\t\t <div class = 'col-xs-4'>\n\t\t\t\t\t\t\t\t\t\t<div class=\"rn-carousel-indicator custom-indicator banner_2_dots\" \n\t\t\t\t\t\t\t\t\t\tstyle = \"position:relative; left:150px; bottom:-25px;\">\n\t\t\t\t\t\t\t\t\t\t\t<div ng-repeat=\"slide in slides32\" ng-class=\"{active: $index==$parent.carouselIndex32}\" ng-click=\"$parent.carouselIndex32 = $index\"\n\t\t\t\t\t\t\t\t\t\t\t\tclass=\"owl-dot active\" style = \"border:none; outline: none;\">\n\t\t\t\t\t\t\t\t\t\t\t\t<span></span>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<!-- <div class = 'col-sm-4'>....</div>\t -->\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>"

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "\n\n<div class=\"viewed\">\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col\">\n                <div class=\"viewed_title_container\">\n                        <!-- <div class=\"new_arrivals_title\">Hot Best Sellers</div> -->\n                    <div class=\"viewed_title \" ng-show=\"!user.user\" > <a  ng-href=\"#/login\" uib-popover=\"Please login to see your recently viewed products\" popover-trigger=\"'mouseenter'\" >Recently Viewed</a> <span> | </span>Recommended</div>\n                    <div class=\"viewed_title \" ng-show=\"user.user && !len\"> <a  ng-href=\"#/login\" uib-popover=\"You didn't see any products details yet\" popover-trigger=\"'mouseenter'\" >Recently Viewed</a> <span> | </span>Recommended</div>\n                    <div class=\"viewed_title \" ng-show=\"user.user && len\" > Recently Viewed</div>\n            \n                </div>\n\n                <div class=\"viewed_slider_container\">\n                    \n                    <!-- Recently Viewed Slider -->\n                  <div class=\"carousel-demo owl-carousel owl-theme viewed_slider\">\n                           \n\t\t\t\t\t<ul style=\"display:block; height:265px; \"  rn-carousel-locked rn-carousel  rn-carousel-auto-slide=\"10\" rn-carousel-index=\"carouselIndex4\"\n                                    rn-carousel-buffered rn-carousel-controls-allow-loop class=\"carousel1 \" >\n                        <li class=\"banner_2_item \" style=\"display:block; \" >     \n                            <div class=\"container \">\t\n                                <div class=\"row viewed_list\" >       \t\n                                    <!-- Recently Viewed Item --> \n                                    <div ng-repeat=\"prd in v track by $index\" class=\"owl-item col-lg-2 col-md-3 col-sm-4 col-6\">\n                                        <div class=\"viewed_item flex-column align-items-center justify-content-center text-center\">\n                                            <div class=\"bestsellers_image\"><img ng-src=\"{{prd.pictures[0]}}\" alt=\"\"></div>\n                                            <div class=\"viewed_content text-center\">\n                                                <div class=\"viewed_price\">{{prd.displayPrice}}</div>\n                                                <div class=\"viewed_name\"><a style= \"text-overflow: ellipsis;\" ng-href=\"#/product/{{prd._id}}\">{{prd.name}}</a></div>\n                                            </div>\n                                            <ul class=\"item_marks\">\n                                                <!-- <li class=\"item_mark item_discount\">-25%</li> -->\n                                                <li class=\"item_mark item_new\">new</li>\n                                            </ul>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                         </li>\n                         <li class=\"banner_2_item \" style=\"display:block; \" >     \n                            <div class=\"container \">\t\n                                <div class=\"row viewed_list\" >       \t\n                                    <!-- Recently Viewed Item --> \n                                    <div ng-repeat=\"prd in v track by $index\" class=\"owl-item col-lg-2 col-md-3 col-sm-4 col-6\">\n                                        <div class=\"viewed_item flex-column align-items-center justify-content-center text-center\">\n                                            <div class=\"bestsellers_image\"><img ng-src=\"{{prd.pictures[0]}}\" alt=\"\"></div>\n                                            <div class=\"viewed_content text-center\">\n                                                <div class=\"viewed_price\">{{prd.displayPrice}}</div>\n                                                <div class=\"viewed_name\"><a style= \"text-overflow: ellipsis;\" ng-href=\"#/product/{{prd._id}}\">{{prd.name}}</a></div>\n                                            </div>\n                                            <ul class=\"item_marks\">\n                                                <!-- <li class=\"item_mark item_discount\">-25%</li> -->\n                                                <li class=\"item_mark item_new\">new</li>\n                                            </ul>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                         </li>\n                    </ul>\n                    \n                   \n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<!-- </div> -->"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "    \n    <!-- Newsletter -->\n\n\t<div class=\"newsletter\">\n\n\t\t\t<div class=\"characteristics\">\n\t\t\t\t\t<div class=\"container\">\n\t\t\t\t\t\t<div class=\"row\">\n\t\t\t\n\t\t\t\t\t\t\t<!-- Char. Item -->\n\t\t\t\t\t\t\t<div class=\"col-lg-3 col-md-6 char_col\">\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"char_item d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t<div class=\"char_icon\"><img src=\"images/char_1.png\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t<div class=\"char_content\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"char_title\">Free Delivery</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"char_subtitle\">from $50</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\n\t\t\t\t\t\t\t<!-- Char. Item -->\n\t\t\t\t\t\t\t<div class=\"col-lg-3 col-md-6 char_col\">\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"char_item d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t<div class=\"char_icon\"><img src=\"images/char_2.png\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t<div class=\"char_content\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"char_title\">Free return</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"char_subtitle\">within 30 days</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\n\t\t\t\t\t\t\t<!-- Char. Item -->\n\t\t\t\t\t\t\t<div class=\"col-lg-3 col-md-6 char_col\">\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"char_item d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t<div class=\"char_icon\"><img src=\"images/char_3.png\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t<div class=\"char_content\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"char_title\">Online payments</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"char_subtitle\">using Stripe</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\n\t\t\t\t\t\t\t<!-- Char. Item -->\n\t\t\t\t\t\t\t<div class=\"col-lg-3 col-md-6 char_col\">\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t<div class=\"char_item d-flex flex-row align-items-center justify-content-start\">\n\t\t\t\t\t\t\t\t\t<div class=\"char_icon\"><img src=\"images/char_4.png\" alt=\"\"></div>\n\t\t\t\t\t\t\t\t\t<div class=\"char_content\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"char_title\">Best prices</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"char_subtitle\">from $10</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t</div>\t\n\t\n    <!-- Footer -->\n\n\t<footer class=\"footer\">\n\t\t<div class=\"container\">\n\t\t\t<div class=\"row\">\n\n\t\t\t\t<div class=\"col-lg-3 footer_col\">\n\t\t\t\t\t<div class=\"footer_column footer_contact\">\n\t\t\t\t\t\t<div class=\"logo_container\">\n\t\t\t\t\t\t\t<div class=\"logo\"><a href=\"#\">WebOnline</a></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"footer_title\">Got Question? View our github page</div>\n\t\t\t\t\t\t<div class=\"footer_phone\"><a href=\"http://github.com/DmitryVF\">DmitryVF</a></div>\n\t\t\t\t\t\t<div class=\"footer_contact_text\">\n\t\t\t\t\t\t\t<p>Making websites for your needs</p>\n\t\t\t\t\t\t\t<p></p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"footer_social\">\n\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t<li><a href=\"http://github.com/DmitryVF\"><i class=\"fab fa-github\"></i></a></li>\n\t\t\t\t\t\t\t\t<!-- <li><a href=\"#\"><i class=\"fab fa-twitter\"></i></a></li>\n\t\t\t\t\t\t\t\t<li><a href=\"#\"><i class=\"fab fa-youtube\"></i></a></li>\n\t\t\t\t\t\t\t\t<li><a href=\"#\"><i class=\"fab fa-google\"></i></a></li>\n\t\t\t\t\t\t\t\t<li><a href=\"#\"><i class=\"fab fa-vimeo-v\"></i></a></li> -->\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"col-lg-2 offset-lg-2\">\n\t\t\t\t\t<div class=\"footer_column\">\n\t\t\t\t\t\t<div class=\"footer_title\">Find it Fast</div>\n\t\t\t\t\t\t<ul class=\"footer_list\">\n                            <li ng-repeat=\"cat in cats1\">\n\t\t\t\t\t\t\t\t<a href=\"#/category/{{cat._id}}\">{{cat._id}}</a>\n                            </li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t<!-- <div class=\"footer_subtitle\">Gadgets</div> -->\n\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"col-lg-2\">\n\t\t\t\t\t<div class=\"footer_column\">\n\t\t\t\t\t\t<div class=\"footer_title\"> &nbsp</div>\n\t\t\t\t\t\t<ul class=\"footer_list\">\n                            <li ng-repeat=\"cat in cats2\">\n\t\t\t\t\t\t\t\t<a href=\"#/category/{{cat._id}}\">{{cat._id}}</a>\n                            </li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"col-lg-2\">\n\t\t\t\t\t<div class=\"footer_column\">\n\t\t\t\t\t\t<div class=\"footer_title\">Pages</div>\n\t\t\t\t\t\t<ul class=\"footer_list\">\n\t\t\t\t\t\t\t<li><a href=\"#\">Home</a></li>\n\t\t\t\t\t\t\t<li><a href=\"#/category/Books\">Categories</a></li>\n\t\t\t\t\t\t\t<li><a href=\"#/blog_single\">Blog</a></li>\n\t\t\t\t\t\t\t<li ng-show=\"user.user\"><a href=\"#/likes\">My wishes</a></li>\n\t\t\t\t\t\t\t<li ng-show=\"!user.user\" uib-popover=\"Please login to view your Wishes\" popover-trigger=\"'mouseenter'\">\n\t\t\t\t\t\t\t\t<a href=\"#/login\">My wishes</a>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li ng-show=\"user.user\"><a href=\"#/checkout\">Cart</a></li>\n\t\t\t\t\t\t\t<li ng-show=\"!user.user\" uib-popover=\"Please login to view your Cart\" popover-trigger=\"'mouseenter'\">\n\t\t\t\t\t\t\t\t<a href=\"#/login\">Cart</a>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t    <li><a href=\"#/about\">Contacts</a></li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t</div>\n\t\t</div>\n\t</footer>\n\n\t<!-- Copyright -->\n\n\t<div class=\"copyright\">\n\t\t<div class=\"container\">\n\t\t\t<div class=\"row\">\n\t\t\t\t<div class=\"col\">\n\t\t\t\t\t\n\t\t\t\t\t<div class=\"copyright_container d-flex flex-sm-row flex-column align-items-center justify-content-start\">\n\t\t\t\t\t\t<div class=\"copyright_content\"><!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->\n\t\t\t\t\t\t\tCopyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i class=\"fa fa-heart\" aria-hidden=\"true\"></i> by <a href=\"https://colorlib.com\" target=\"_blank\">Colorlib</a>\n\t\t\t\t\t\t\t<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<!-- <div class=\"logos ml-sm-auto\">\n\t\t\t\t\t\t\t<ul class=\"logos_list\">\n\t\t\t\t\t\t\t\t<li><a href=\"#\"><img src=\"images/logos_1.png\" alt=\"\"></a></li>\n\t\t\t\t\t\t\t\t<li><a href=\"#\"><img src=\"images/logos_2.png\" alt=\"\"></a></li>\n\t\t\t\t\t\t\t\t<li><a href=\"#\"><img src=\"images/logos_3.png\" alt=\"\"></a></li>\n\t\t\t\t\t\t\t\t<li><a href=\"#\"><img src=\"images/logos_4.png\" alt=\"\"></a></li>\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t</div> -->\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n<!-- </div> -->\n"

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var status = __webpack_require__(22);

exports.$user1 = function($http) {
  var s = {};
  s.loadUser = function() {
    $http.
      get('/api/v1/me').
      success(function(data) {
        s.user = data.user;
        $rootScope.$broadcast('user.loaded');
        // console.log("user.loaded");
      }).
      error(function(data, status) {
        if (status === status.UNAUTHORIZED) {
          s.user = null;
          $rootScope.$broadcast('user.loaded');
        }
      });
  };

  s.loadUser();/*this was done only for ability to call setInterval() */

  setInterval(s.loadUser, 60 * 60 * 1000);

  return s;
}; 
exports.$user = function($http,$rootScope) {
  // var s = {};
  function userClass(){
    this.user = null;
    this.userLoaded = null;
  };

  userClass.prototype.loadUser = function() {
      var self = this;
      $http.
        get('/api/v1/me').
        success(function(data) {
          self.user = data.user;
          $rootScope.$broadcast('user.loaded');
          self.userLoaded = true;
        }).
        error(function(data, status) {
          if (status === status.UNAUTHORIZED) {
            self.user = null;
            $rootScope.$broadcast('user.loaded');
            self.userLoaded = true;
          }
        });
  };
  
  var s = new userClass();
  s.loadUser();/*this was done only for ability to call setInterval() */

  setInterval(s.loadUser, 60 * 60 * 1000);

  return s;
}; 

//used in meanio-users in meanUser service
exports.$meanConfig = function() {
  var config = {};
  config.loginPage = '/login';

  return config;
}; 

//used in meanio-users in meanUser service
exports.Global = function($http) {
  var Global = {};
  Global.load = function() {
    $http.get('/api/v1/global').
        success(function(data) {
          Global.data = data;
          console.log("data = "+JSON.stringify(data));
          
        });
  };  
  Global.load();

  Global.authenticate = function() {
  };
return Global;

}; 

exports.$grade = function($http,$rootScope) {
  // class that includes common logic executed by clicking on "like" and "star-score" buttons
  function GradeClass(){
    this.products = [];
    this.$user = {};
    //gen stars arr and ng-repeat it in view
    this.stars_arr = [];
    for(i = 1; i < 6; i++){
      this.stars_arr.push(i);
    };
    this.updateRatings = function(prd,$user) {
    // this.updateRatings = function(prd,$user) {
      // for each prd checks likes data from $user and adds it to prd object for rendering
      prd.liked = 'far'; 
      if ($user.user){
        angular.forEach($user.user.data.liked,function(liked){
          if(liked.product == prd._id){
            if(liked.rate){prd.liked = 'fas'}; //for displaying
          };
        });
      };
      return prd;
    };
  
    this.updateStars = function(prd,$user){
      // for each prd from collection calc-s star raiting
          var sum = 0;
          var n = 0;
        angular.forEach(prd.raiting.score,function(scorei){
          sum += scorei.rate;
          n += 1;
        });
        
        prd.averStars = (n>0) ? Math.round(sum/n) : 0;
        prd.averrating = "rating_r_"+ prd.averStars; //buffered for displaying
        prd.userrating = "rating_r_"+ prd.averStars; //for displaying
        // console.log("sum =" +sum+"; n ="+n + " aver =" + sum/n + "round ="+prd.averStars+ "displ ="+prd.userrating);
      // adds raiting data to each prd from collection and returns it for rendering
      return prd;
    };
  }

  GradeClass.prototype.GetStars = function(){
    return this.stars_arr;
  }; 
  GradeClass.prototype.GetProducts = function(){
    return this.products;
  }; 
  GradeClass.prototype.init = function(products,$user) {
    this.$user = $user;
    this.products = products;
    var self = this;
    angular.forEach(products,function(prd,key){
      // calc-s raitings & adds it to prd obj-s for rendering
      self.products[key] = self.updateRatings(prd,self.$user);
      self.products[key] = self.updateStars(prd,self.$user);
    });
  }
  
  
  // processing the rating clicks:
  GradeClass.prototype.toggle_like = function(prd){
    //handle click on like 
    if (prd.liked == 'far'){
      prd.liked = 'fas'; //for view changing
      prd.likedscore = '1'; //for logging into the database
    }
    else{
      prd.liked = 'far';
      prd.likedscore = '0';
    };
    var self = this;
    // update products that must refresh the view
    angular.forEach(self.products,function(prdx,key){
      if(prdx._id == prd._id){self.products[key] = prd;};
    });

    // sinc with the server in back process...
    var queryParams = { type: 'liked', id:prd._id, rate:prd.likedscore};
    $http.
      get('/api/v1/product/grade', { params: queryParams })
      .success(function(data) {
        // emit an event to inform all vidgets to refresh their like's counters (if they have them)
        $rootScope.$broadcast("$grade.toggleLike");
      });
  };

   // processing the stars clicks:
  // user events processing:
  GradeClass.prototype.hover_stars = function(index,prd){
    prd.userrating = "rating_r_"+index;
  };

  GradeClass.prototype.leave_stars = function(index,prd){
    //  restore raiting using product array because it could be changed during hover (if user clicked)

    var self = this;
    console.log("self.products = "+self.products);
    angular.forEach(self.products,function(prdx,key){
          if(prdx._id == prd._id){
            prdx.userrating = prdx.averrating;
            prd.userrating = prdx.userrating;
          };
        });
  };

  GradeClass.prototype.set_stars = function(index,prd){
    // update products rate:
    var self = this;
    // sinc with the server in back process...
    var queryParams = { type: 'score', id:prd._id, rate:index};
    $http.
      get('/api/v1/product/grade', { params: queryParams })
      .success(function(product) {
        // update products that must refresh the view
        prd.userrating = self.updateStars(product,self.$user).userrating;
        angular.forEach(self.products,function(prdx,key){
          if(prdx._id == prd._id){
            self.products[key] = product;
          };
        });
    });
  
  };

  return GradeClass;
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.7.1
module.exports = {
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Requested Range not Satisfiable',
  417: 'Expectation Failed',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version not Supported',
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (true) {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25);
module.exports = 'angular-jwt';



/***/ }),
/* 25 */
/***/ (function(module, exports) {

(function() {


// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Modules
angular.module('angular-jwt',
    [
        'angular-jwt.options',
        'angular-jwt.interceptor',
        'angular-jwt.jwt',
        'angular-jwt.authManager'
    ]);

angular.module('angular-jwt.authManager', [])
  .provider('authManager', function () {

    this.$get = ["$rootScope", "$injector", "$location", "jwtHelper", "jwtInterceptor", "jwtOptions", function ($rootScope, $injector, $location, jwtHelper, jwtInterceptor, jwtOptions) {

      var config = jwtOptions.getConfig();

      function invokeToken(tokenGetter) {
        var token = null;
        if (Array.isArray(tokenGetter)) {
          token = $injector.invoke(tokenGetter, this, {options: null});
        } else {
          token = tokenGetter();
        }
        return token;
      }

      function invokeRedirector(redirector) {
        if (Array.isArray(redirector) || angular.isFunction(redirector)) {
          return $injector.invoke(redirector, config, {});
        } else {
          throw new Error('unauthenticatedRedirector must be a function');
        }
      }

      function isAuthenticated() {
        var token = invokeToken(config.tokenGetter);
        if (token) {
          return !jwtHelper.isTokenExpired(token);
        }
      }

      $rootScope.isAuthenticated = false;

      function authenticate() {
        $rootScope.isAuthenticated = true;
      }

      function unauthenticate() {
        $rootScope.isAuthenticated = false;
      }

      function validateToken() {
        var token = invokeToken(config.tokenGetter);
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            authenticate();
          } else {
            $rootScope.$broadcast('tokenHasExpired', token);
          }
        }
      }

      function checkAuthOnRefresh() {
        if ($injector.has('$transitions')) {
          var $transitions = $injector.get('$transitions');
          $transitions.onStart({}, validateToken);
        } else {
          $rootScope.$on('$locationChangeStart', validateToken);
        }
      }

      function redirectWhenUnauthenticated() {
        $rootScope.$on('unauthenticated', function () {
          invokeRedirector(config.unauthenticatedRedirector);
          unauthenticate();
        });
      }

      function verifyRoute(event, next) {
        if (!next) {
          return false;
        }

        var routeData = (next.$$route) ? next.$$route : next.data;

        if (routeData && routeData.requiresLogin === true && !isAuthenticated()) {
          event.preventDefault();
          invokeRedirector(config.unauthenticatedRedirector);
        }
      }

      function verifyState(transition) {
        var route = transition.to();
        var $state = transition.router.stateService;
          if (route && route.data && route.data.requiresLogin === true && !isAuthenticated()) {
            return $state.target(config.loginPath);
          }
      }

      if ($injector.has('$transitions')) {
        var $transitions = $injector.get('$transitions');
        $transitions.onStart({}, verifyState);
      } else {
        var eventName = ($injector.has('$state')) ? '$stateChangeStart' : '$routeChangeStart';
        $rootScope.$on(eventName, verifyRoute);
      }



      return {
        authenticate: authenticate,
        unauthenticate: unauthenticate,
        getToken: function(){ return invokeToken(config.tokenGetter); },
        redirect: function() { return invokeRedirector(config.unauthenticatedRedirector); },
        checkAuthOnRefresh: checkAuthOnRefresh,
        redirectWhenUnauthenticated: redirectWhenUnauthenticated,
        isAuthenticated: isAuthenticated
      }
    }]
  });

angular.module('angular-jwt.interceptor', [])
  .provider('jwtInterceptor', function() {

    this.urlParam;
    this.authHeader;
    this.authPrefix;
    this.whiteListedDomains;
    this.tokenGetter;

    var config = this;

    this.$get = ["$q", "$injector", "$rootScope", "urlUtils", "jwtOptions", function($q, $injector, $rootScope, urlUtils, jwtOptions) {

      var options = angular.extend({}, jwtOptions.getConfig(), config);

      function isSafe (url) {
        if (!urlUtils.isSameOrigin(url) && !options.whiteListedDomains.length) {
          throw new Error('As of v0.1.0, requests to domains other than the application\'s origin must be white listed. Use jwtOptionsProvider.config({ whiteListedDomains: [<domain>] }); to whitelist.')
        }
        var hostname = urlUtils.urlResolve(url).hostname.toLowerCase();
        for (var i = 0; i < options.whiteListedDomains.length; i++) {
          var domain = options.whiteListedDomains[i];
          if (domain instanceof RegExp) {
            if (hostname.match(domain)) {
              return true;
            }
          } else {
            if (hostname === domain.toLowerCase()) {
              return true;
            }
          }
        }

        if (urlUtils.isSameOrigin(url)) {
          return true;
        }

        return false;
      }

      return {
        request: function (request) {
          if (request.skipAuthorization || !isSafe(request.url)) {
            return request;
          }

          if (options.urlParam) {
            request.params = request.params || {};
            // Already has the token in the url itself
            if (request.params[options.urlParam]) {
              return request;
            }
          } else {
            request.headers = request.headers || {};
            // Already has an Authorization header
            if (request.headers[options.authHeader]) {
              return request;
            }
          }

          var tokenPromise = $q.when($injector.invoke(options.tokenGetter, this, {
            options: request
          }));

          return tokenPromise.then(function(token) {
            if (token) {
              if (options.urlParam) {
                request.params[options.urlParam] = token;
              } else {
                request.headers[options.authHeader] = options.authPrefix + token;
              }
            }
            return request;
          });
        },
        responseError: function (response) {
          // handle the case where the user is not authenticated
          if (response.status === 401) {
            $rootScope.$broadcast('unauthenticated', response);
          }
          return $q.reject(response);
        }
      };
    }]
  });

 angular.module('angular-jwt.jwt', [])
  .service('jwtHelper', ["$window", function($window) {

    this.urlBase64Decode = function(str) {
      var output = str.replace(/-/g, '+').replace(/_/g, '/');
      switch (output.length % 4) {
        case 0: { break; }
        case 2: { output += '=='; break; }
        case 3: { output += '='; break; }
        default: {
          throw 'Illegal base64url string!';
        }
      }
      return $window.decodeURIComponent(escape($window.atob(output))); //polyfill https://github.com/davidchambers/Base64.js
    };


    this.decodeToken = function(token) {
      var parts = token.split('.');

      if (parts.length !== 3) {
        throw new Error('JWT must have 3 parts');
      }

      var decoded = this.urlBase64Decode(parts[1]);
      if (!decoded) {
        throw new Error('Cannot decode the token');
      }

      return angular.fromJson(decoded);
    };

    this.getTokenExpirationDate = function(token) {
      var decoded = this.decodeToken(token);

      if(typeof decoded.exp === "undefined") {
        return null;
      }

      var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
      d.setUTCSeconds(decoded.exp);

      return d;
    };

    this.isTokenExpired = function(token, offsetSeconds) {
      var d = this.getTokenExpirationDate(token);
      offsetSeconds = offsetSeconds || 0;
      if (d === null) {
        return false;
      }

      // Token expired?
      return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    };
  }]);

angular.module('angular-jwt.options', [])
  .provider('jwtOptions', function() {
    var globalConfig = {};
    this.config = function(value) {
      globalConfig = value;
    };
    this.$get = function() {

      var options = {
        urlParam: null,
        authHeader: 'Authorization',
        authPrefix: 'Bearer ',
        whiteListedDomains: [],
        tokenGetter: function() {
          return null;
        },
        loginPath: '/',
        unauthenticatedRedirectPath: '/',
        unauthenticatedRedirector: ['$location', function($location) {
          $location.path(this.unauthenticatedRedirectPath);
        }]
      };

      function JwtOptions() {
        var config = this.config = angular.extend({}, options, globalConfig);
      }

      JwtOptions.prototype.getConfig = function() {
        return this.config;
      };

      return new JwtOptions();
    }
  });

 /**
  * The content from this file was directly lifted from Angular. It is
  * unfortunately not a public API, so the best we can do is copy it.
  *
  * Angular References:
  *   https://github.com/angular/angular.js/issues/3299
  *   https://github.com/angular/angular.js/blob/d077966ff1ac18262f4615ff1a533db24d4432a7/src/ng/urlUtils.js
  */

 angular.module('angular-jwt.interceptor')
  .service('urlUtils', function () {

    // NOTE:  The usage of window and document instead of $window and $document here is
    // deliberate.  This service depends on the specific behavior of anchor nodes created by the
    // browser (resolving and parsing URLs) that is unlikely to be provided by mock objects and
    // cause us to break tests.  In addition, when the browser resolves a URL for XHR, it
    // doesn't know about mocked locations and resolves URLs to the real document - which is
    // exactly the behavior needed here.  There is little value is mocking these out for this
    // service.
    var urlParsingNode = document.createElement("a");
    var originUrl = urlResolve(window.location.href);

    /**
     *
     * Implementation Notes for non-IE browsers
     * ----------------------------------------
     * Assigning a URL to the href property of an anchor DOM node, even one attached to the DOM,
     * results both in the normalizing and parsing of the URL.  Normalizing means that a relative
     * URL will be resolved into an absolute URL in the context of the application document.
     * Parsing means that the anchor node's host, hostname, protocol, port, pathname and related
     * properties are all populated to reflect the normalized URL.  This approach has wide
     * compatibility - Safari 1+, Mozilla 1+, Opera 7+,e etc.  See
     * http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *
     * Implementation Notes for IE
     * ---------------------------
     * IE <= 10 normalizes the URL when assigned to the anchor node similar to the other
     * browsers.  However, the parsed components will not be set if the URL assigned did not specify
     * them.  (e.g. if you assign a.href = "foo", then a.protocol, a.host, etc. will be empty.)  We
     * work around that by performing the parsing in a 2nd step by taking a previously normalized
     * URL (e.g. by assigning to a.href) and assigning it a.href again.  This correctly populates the
     * properties such as protocol, hostname, port, etc.
     *
     * References:
     *   http://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement
     *   http://www.aptana.com/reference/html/api/HTMLAnchorElement.html
     *   http://url.spec.whatwg.org/#urlutils
     *   https://github.com/angular/angular.js/pull/2902
     *   http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
     *
     * @kind function
     * @param {string} url The URL to be parsed.
     * @description Normalizes and parses a URL.
     * @returns {object} Returns the normalized URL as a dictionary.
     *
     *   | member name   | Description    |
     *   |---------------|----------------|
     *   | href          | A normalized version of the provided URL if it was not an absolute URL |
     *   | protocol      | The protocol including the trailing colon                              |
     *   | host          | The host and port (if the port is non-default) of the normalizedUrl    |
     *   | search        | The search params, minus the question mark                             |
     *   | hash          | The hash string, minus the hash symbol
     *   | hostname      | The hostname
     *   | port          | The port, without ":"
     *   | pathname      | The pathname, beginning with "/"
     *
     */
    function urlResolve(url) {
      var href = url;

      // Normalize before parse.  Refer Implementation Notes on why this is
      // done in two steps on IE.
      urlParsingNode.setAttribute("href", href);
      href = urlParsingNode.href;
      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/')
          ? urlParsingNode.pathname
          : '/' + urlParsingNode.pathname
      };
    }

    /**
     * Parse a request URL and determine whether this is a same-origin request as the application document.
     *
     * @param {string|object} requestUrl The url of the request as a string that will be resolved
     * or a parsed URL object.
     * @returns {boolean} Whether the request is for the same origin as the application document.
     */
    function urlIsSameOrigin(requestUrl) {
      var parsed = (angular.isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
      return (parsed.protocol === originUrl.protocol &&
              parsed.host === originUrl.host);
    }

    return {
      urlResolve: urlResolve,
      isSameOrigin: urlIsSameOrigin
    };

  });

}());

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(27);
module.exports = 'angularCSS';


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * AngularCSS - CSS on-demand for AngularJS
 * @version v1.0.8
 * @author Alex Castillo
 * @link http://castillo-io.github.io/angular-css
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */



(function (angular) {

  /**
   * AngularCSS Module
   * Contains: config, constant, provider and run
   **/
  var angularCSS = angular.module('angularCSS', []);

  // Old module name handler
  angular.module('door3.css', [])
    .run(function () {
      console.error('AngularCSS: The module name "door3.css" is now deprecated. Please use "angularCSS" instead.');
    });

  // Provider
  angularCSS.provider('$css', [function $cssProvider() {

    // Defaults - default options that can be overridden from application config
    var defaults = this.defaults = {
      element: 'link',
      rel: 'stylesheet',
      type: 'text/css',
      container: 'head',
      method: 'append',
      weight: 0
    };
    
    var DEBUG = false;

    // Turn off/on in order to see console logs during dev mode
    this.debugMode = function(mode) {
        if (angular.isDefined(mode))
            DEBUG = mode;
        return DEBUG;
    };

    this.$get = ['$rootScope','$injector','$q','$window','$timeout','$compile','$http','$filter','$log', '$interpolate',
                function $get($rootScope, $injector, $q, $window, $timeout, $compile, $http, $filter, $log, $interpolate) {

      var $css = {};

      var template = '<link ng-repeat="stylesheet in stylesheets | orderBy: \'weight\' track by $index " rel="{{ stylesheet.rel }}" type="{{ stylesheet.type }}" ng-href="{{ stylesheet.href }}" ng-attr-media="{{ stylesheet.media }}">';

      // Using correct interpolation symbols.
      template = template
        .replace(/{{/g, $interpolate.startSymbol())
        .replace(/}}/g, $interpolate.endSymbol());

      // Variables - default options that can be overridden from application config
      var mediaQuery = {}, mediaQueryListener = {}, mediaQueriesToIgnore = ['print'], options = angular.extend({}, defaults),
        container = angular.element(document.querySelector ? document.querySelector(options.container) : document.getElementsByTagName(options.container)[0]),
        dynamicPaths = [];

      // Parse all directives
      angular.forEach($directives, function (directive, key) {
        if (directive.hasOwnProperty('css')) {
          $directives[key] = parse(directive.css);
        }
      });

      /**
       * Listen for directive add event in order to add stylesheet(s)
       **/
      function $directiveAddEventListener(event, directive, scope) {
        // Binds directive's css
        if (scope && directive.hasOwnProperty('css')) {
          $css.bind(directive.css, scope);
        }
      }

      /**
       * Listen for route change event and add/remove stylesheet(s)
       **/
      function $routeEventListener(event, current, prev) {
        // Removes previously added css rules
        if (prev) {
          $css.remove($css.getFromRoute(prev).concat(dynamicPaths));
          // Reset dynamic paths array
          dynamicPaths.length = 0;
        }
        // Adds current css rules
        if (current) {
          $css.add($css.getFromRoute(current));
        }
      }

      /**
       * Listen for state change event and add/remove stylesheet(s)
       **/
      function $stateEventListener(event, current, params, prev) {
        // Removes previously added css rules
        if (prev) {
          $css.remove($css.getFromState(prev).concat(dynamicPaths));
          // Reset dynamic paths array
          dynamicPaths.length = 0;
        }
        // Adds current css rules
        if (current) {
          $css.add($css.getFromState(current));
        }
      }

      /**
       * Map breakpoitns defined in defaults to stylesheet media attribute
       **/
      function mapBreakpointToMedia(stylesheet) {
        if (angular.isDefined(options.breakpoints)) {
          if (stylesheet.breakpoint in options.breakpoints) {
            stylesheet.media = options.breakpoints[stylesheet.breakpoint];
          }
          delete stylesheet.breakpoints;
        }
      }

      /**
       * Parse: returns array with full all object based on defaults
       **/
      function parse(obj) {
        if (!obj) {
          return;
        }
        // Function syntax
        if (angular.isFunction(obj)) {
          obj = angular.copy($injector.invoke(obj));
        }
        // String syntax
        if (angular.isString(obj)) {
          obj = angular.extend({
            href: obj
          }, options);
        }
        // Array of strings syntax
        if (angular.isArray(obj) && angular.isString(obj[0])) {
          angular.forEach(obj, function (item) {
            obj = angular.extend({
              href: item
            }, options);
          });
        }
        // Object syntax
        if (angular.isObject(obj) && !angular.isArray(obj)) {
          obj = angular.extend({}, options, obj);
        }
        // Array of objects syntax
        if (angular.isArray(obj) && angular.isObject(obj[0])) {
          angular.forEach(obj, function (item) {
            obj = angular.extend(item, options);
          });
        }
        // Map breakpoint to media attribute
        mapBreakpointToMedia(obj);
        return obj;
      }

      // Add stylesheets to scope
      $rootScope.stylesheets = [];

      // Adds compiled link tags to container element
      container[options.method]($compile(template)($rootScope));

      // Directive event listener (emulated internally)
      $rootScope.$on('$directiveAdd', $directiveAddEventListener);

      // Routes event listener ($route required)
      $rootScope.$on('$routeChangeSuccess', $routeEventListener);

      // States event listener ($state required)
      $rootScope.$on('$stateChangeSuccess', $stateEventListener);

      /**
       * Bust Cache
       **/
      function bustCache(stylesheet) {
        if (!stylesheet) {
          if(DEBUG) $log.error('No stylesheets provided');
          return;
        }
        var queryString = '?cache=';
        // Append query string for bust cache only once
        if (stylesheet.href.indexOf(queryString) === -1) {
          stylesheet.href = stylesheet.href + (stylesheet.bustCache ? queryString + (new Date().getTime()) : '');
        }
      }

      /**
       * Filter By: returns an array of routes based on a property option
       **/
      function filterBy(array, prop) {
        if (!array || !prop) {
            if(DEBUG) $log.error('filterBy: missing array or property');
            return;
        }
        return $filter('filter')(array, function (item) {
          return item[prop];
        });
      }

      /**
       * Add Media Query
       **/
      function addViaMediaQuery(stylesheet) {
        if (!stylesheet) {
            if(DEBUG) $log.error('No stylesheet provided');
            return;
        }
        // Media query object
        mediaQuery[stylesheet.href] = $window.matchMedia(stylesheet.media);
        // Media Query Listener function
        mediaQueryListener[stylesheet.href] = function(mediaQuery) {
          // Trigger digest
          $timeout(function () {
            if (mediaQuery.matches) {
              // Add stylesheet
              $rootScope.stylesheets.push(stylesheet);
            } else {
              var index = $rootScope.stylesheets.indexOf($filter('filter')($rootScope.stylesheets, {
                href: stylesheet.href
              })[0]);
              // Remove stylesheet
              if (index !== -1) {
                $rootScope.stylesheets.splice(index, 1);
              }
            }
          });
        };
        // Listen for media query changes
        mediaQuery[stylesheet.href].addListener(mediaQueryListener[stylesheet.href]);
        // Invoke first media query check
        mediaQueryListener[stylesheet.href](mediaQuery[stylesheet.href]);
      }

      /**
       * Remove Media Query
       **/
      function removeViaMediaQuery(stylesheet) {
        if (!stylesheet) {
            if(DEBUG) $log.error('No stylesheet provided');
            return;
        }
        // Remove media query listener
        if ($rootScope && angular.isDefined(mediaQuery)
          && mediaQuery[stylesheet.href]
          && angular.isDefined(mediaQueryListener)) {
          mediaQuery[stylesheet.href].removeListener(mediaQueryListener[stylesheet.href]);
        }
      }

      /**
       * Is Media Query: checks for media settings, media queries to be ignore and match media support
       **/
      function isMediaQuery(stylesheet) {
        if (!stylesheet) {
            if(DEBUG) $log.error('No stylesheet provided');
            return;
        }
        return !!(
          // Check for media query setting
          stylesheet.media
          // Check for media queries to be ignored
          && (mediaQueriesToIgnore.indexOf(stylesheet.media) === -1)
          // Check for matchMedia support
          && $window.matchMedia
        );
      }

      /**
       * Get From Route: returns array of css objects from single route
       **/
      $css.getFromRoute = function (route) {
        if (!route) {
            if(DEBUG) $log.error('Get From Route: No route provided');
            return;
        }
        var css = null, result = [];
        if (route.$$route && route.$$route.css) {
          css = route.$$route.css;
        }
        else if (route.css) {
          css = route.css;
        }
        // Adds route css rules to array
        if (css) {
          if (angular.isArray(css)) {
            angular.forEach(css, function (cssItem) {
              if (angular.isFunction(cssItem)) {
                dynamicPaths.push(parse(cssItem));
              }
              result.push(parse(cssItem));
            });
          } else {
            if (angular.isFunction(css)) {
              dynamicPaths.push(parse(css));
            }
            result.push(parse(css));
          }
        }
        return result;
      };

      /**
       * Get From Routes: returns array of css objects from ng routes
       **/
      $css.getFromRoutes = function (routes) {
        if (!routes) {
            if(DEBUG) $log.error('Get From Routes: No routes provided');
            return;
        }
        var result = [];
        // Make array of all routes
        angular.forEach(routes, function (route) {
          var css = $css.getFromRoute(route);
          if (css.length) {
            result.push(css[0]);
          }
        });
        return result;
      };

      /**
       * Get From State: returns array of css objects from single state
       **/
      $css.getFromState = function (state) {
        if (!state) {
            if(DEBUG) $log.error('Get From State: No state provided');
            return;
        }
        var result = [];
        // State "views" notation
        if (angular.isDefined(state.views)) {
          angular.forEach(state.views, function (item) {
            if (item.css) {
              if (angular.isFunction(item.css)) {
                dynamicPaths.push(parse(item.css));
              }
              result.push(parse(item.css));
            }
          });
        }
        // State "children" notation
        if (angular.isDefined(state.children)) {
          angular.forEach(state.children, function (child) {
            if (child.css) {
              if (angular.isFunction(child.css)) {
                dynamicPaths.push(parse(child.css));
              }
              result.push(parse(child.css));
            }
            if (angular.isDefined(child.children)) {
              angular.forEach(child.children, function (childChild) {
                if (childChild.css) {
                  if (angular.isFunction(childChild.css)) {
                    dynamicPaths.push(parse(childChild.css));
                  }
                  result.push(parse(childChild.css));
                }
              });
            }
          });
        }
        // State default notation
        if (
            angular.isDefined(state.css) ||
            (angular.isDefined(state.data) && angular.isDefined(state.data.css))
        ) {
          var css = state.css || state.data.css;
          // For multiple stylesheets
          if (angular.isArray(css)) {
              angular.forEach(css, function (itemCss) {
                if (angular.isFunction(itemCss)) {
                  dynamicPaths.push(parse(itemCss));
                }
                result.push(parse(itemCss));
              });
            // For single stylesheets
          } else {
            if (angular.isFunction(css)) {
              dynamicPaths.push(parse(css));
            }
            result.push(parse(css));
          }
        }
        return result;
      };

      /**
       * Get From States: returns array of css objects from states
       **/
      $css.getFromStates = function (states) {
        if (!states) {
            if(DEBUG) $log.error('Get From States: No states provided');
            return;
        }
        var result = [];
        // Make array of all routes
        angular.forEach(states, function (state) {
          var css = $css.getFromState(state);
          if (angular.isArray(css)) {
            angular.forEach(css, function (cssItem) {
              result.push(cssItem);
            });
          } else {
            result.push(css);
          }
        });
        return result;
      };

      /**
       * Preload: preloads css via http request
       **/
      $css.preload = function (stylesheets, callback) {
        // If no stylesheets provided, then preload all
        if (!stylesheets) {
          stylesheets = [];
          // Add all stylesheets from custom directives to array
          if ($directives.length) {
            Array.prototype.push.apply(stylesheets, $directives);
          }
          // Add all stylesheets from ngRoute to array
          if ($injector.has('$route')) {
            Array.prototype.push.apply(stylesheets, $css.getFromRoutes($injector.get('$route').routes));
          }
          // Add all stylesheets from UI Router to array
          if ($injector.has('$state')) {
            Array.prototype.push.apply(stylesheets, $css.getFromStates($injector.get('$state').get()));
          }
          stylesheets = filterBy(stylesheets, 'preload');
        }
        if (!angular.isArray(stylesheets)) {
          stylesheets = [stylesheets];
        }
        var stylesheetLoadPromises = [];
        angular.forEach(stylesheets, function(stylesheet, key) {
          stylesheet = stylesheets[key] = parse(stylesheet);
          stylesheetLoadPromises.push(
            // Preload via ajax request
            $http.get(stylesheet.href).error(function (response) {
                if(DEBUG) $log.error('AngularCSS: Incorrect path for ' + stylesheet.href);
            })
          );
        });
        if (angular.isFunction(callback)) {
          $q.all(stylesheetLoadPromises).then(function () {
            callback(stylesheets);
          });
        }
      };

      /**
       * Bind: binds css in scope with own scope create/destroy events
       **/
       $css.bind = function (css, $scope) {
        if (!css || !$scope) {
            if(DEBUG) $log.error('No scope or stylesheets provided');
            return;
        }
        var result = [];
        // Adds route css rules to array
        if (angular.isArray(css)) {
          angular.forEach(css, function (cssItem) {
            result.push(parse(cssItem));
          });
        } else {
          result.push(parse(css));
        }
        $css.add(result);
        if(DEBUG) $log.debug('$css.bind(): Added', result);
        $scope.$on('$destroy', function () {
          $css.remove(result);
          if(DEBUG) $log.debug('$css.bind(): Removed', result);
        });
       };

      /**
       * Add: adds stylesheets to scope
       **/
      $css.add = function (stylesheets, callback) {
        if (!stylesheets) {
            if(DEBUG) $log.error('No stylesheets provided');
            return;
        }
        if (!angular.isArray(stylesheets)) {
          stylesheets = [stylesheets];
        }
        angular.forEach(stylesheets, function(stylesheet) {
          stylesheet = parse(stylesheet);
          // Avoid adding duplicate stylesheets
          if (stylesheet.href && !$filter('filter')($rootScope.stylesheets, { href: stylesheet.href }).length) {
            // Bust Cache feature
            bustCache(stylesheet);
            // Media Query add support check
            if (isMediaQuery(stylesheet)) {
              addViaMediaQuery(stylesheet);
            }
            else {
              $rootScope.stylesheets.push(stylesheet);
            }
            if(DEBUG) $log.debug('$css.add(): ' + stylesheet.href);
          }
        });
        // Broadcasts custom event for css add
        $rootScope.$broadcast('$cssAdd', stylesheets, $rootScope.stylesheets);
      };

      /**
       * Remove: removes stylesheets from scope
       **/
      $css.remove = function (stylesheets, callback) {
        if (!stylesheets) {
            if(DEBUG) $log.error('No stylesheets provided');
            return;
        }
        if (!angular.isArray(stylesheets)) {
          stylesheets = [stylesheets];
        }
        // Only proceed based on persist setting
        stylesheets = $filter('filter')(stylesheets, function (stylesheet) {
          return !stylesheet.persist;
        });
        angular.forEach(stylesheets, function(stylesheet) {
          stylesheet = parse(stylesheet);
          // Get index of current item to be removed based on href
          var index = $rootScope.stylesheets.indexOf($filter('filter')($rootScope.stylesheets, {
            href: stylesheet.href
          })[0]);
          // Remove stylesheet from scope (if found)
          if (index !== -1) {
            $rootScope.stylesheets.splice(index, 1);
          }
          // Remove stylesheet via media query
          removeViaMediaQuery(stylesheet);
          if(DEBUG) $log.debug('$css.remove(): ' + stylesheet.href);
        });
        // Broadcasts custom event for css remove
        $rootScope.$broadcast('$cssRemove', stylesheets, $rootScope.stylesheets);
      };

      /**
       * Remove All: removes all style tags from the DOM
       **/
      $css.removeAll = function () {
        // Remove all stylesheets from scope
        if ($rootScope && $rootScope.hasOwnProperty('stylesheets')) {
          $rootScope.stylesheets.length = 0;
        }
        if(DEBUG) $log.debug('all stylesheets removed');
      };

      // Preload all stylesheets
      $css.preload();

      return $css;

    }];

  }]);

  /**
   * Links filter - renders the stylesheets array in html format
   **/
  angularCSS.filter('$cssLinks', function () {
    return function (stylesheets) {
      if (!stylesheets || !angular.isArray(stylesheets)) {
        return stylesheets;
      }
      var result = '';
      angular.forEach(stylesheets, function (stylesheet) {
        result += '<link rel="' + stylesheet.rel + '" type="' + stylesheet.type + '" href="' + stylesheet.href + '"';
        result += (stylesheet.media ? ' media="' + stylesheet.media + '"' : '');
        result += '>\n\n';
      });
      return result;
    }
  });

  /**
   * Run - auto instantiate the $css provider by injecting it in the run phase of this module
   **/
  angularCSS.run(['$css', function ($css) { } ]);

  /**
   * AngularJS hack - This way we can get and decorate all custom directives
   * in order to broadcast a custom $directiveAdd event
   **/
  var $directives = [];
  var originalModule = angular.module;
  var arraySelect = function(array, action) {
    return array.reduce(
      function(previous, current) {
        previous.push(action(current));
        return previous;
      }, []);
    };
  var arrayExists = function(array, value) {
    return array.indexOf(value) > -1;
  };

  angular.module = function () {
    var module = originalModule.apply(this, arguments);
    var originalDirective = module.directive;
    module.directive = function(directiveName, directiveFactory) {
      var originalDirectiveFactory = angular.isFunction(directiveFactory) ?
      directiveFactory : directiveFactory[directiveFactory ? (directiveFactory.length - 1) : 0];
      try {
        var directive = angular.copy(originalDirectiveFactory)();
        directive.directiveName = directiveName;
        if (directive.hasOwnProperty('css') && !arrayExists(arraySelect($directives, function(x) {return x.ddo.directiveName}), directiveName)) {
          $directives.push({ ddo: directive, handled: false });
        }
      } catch (e) { }
      return originalDirective.apply(this, arguments);
    };
    var originalComponent = module.component;
    module.component = function (componentName, componentObject) {
      componentObject.directiveName = componentName;
      if (componentObject.hasOwnProperty('css') && !arrayExists(arraySelect($directives, function(x) {return x.ddo.directiveName}), componentName)) {
        $directives.push({ ddo: componentObject, handled: false });
      }
      return originalComponent.apply(this, arguments);
    };
    module.config(['$provide','$injector', function ($provide, $injector) {
      angular.forEach($directives, function ($dir) {
        if (!$dir.handled) {
          var $directive = $dir.ddo;
          var dirProvider = $directive.directiveName + 'Directive';
          if ($injector.has(dirProvider)) {
            $dir.handled = true;
            $provide.decorator(dirProvider, ['$delegate', '$rootScope', '$timeout', function ($delegate, $rootScope, $timeout) {
              var directive = $delegate[0];
              var compile = directive.compile;
              if (!directive.css) {
                directive.css = $directive.css;
              }
              directive.compile = function() {
                var link = compile ? compile.apply(this, arguments): false;
                return function(scope) {
                  var linkArgs = arguments;
                  $timeout(function () {
                    if (link) {
                      link.apply(this, linkArgs);
                    }
                  });
                  $rootScope.$broadcast('$directiveAdd', directive, scope);
                };
              };
              return $delegate;
            }]);
          }
        }
      });
    }]);
    return module;
  };
  /* End of hack */

})(angular);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./meanUser.js": 29
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 28;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('mean.users')
  .controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$state', 'Global',
    function($scope, $rootScope, $http, $state, Global) {
      // This object will contain list of available social buttons to authorize
      $scope.socialButtonsCounter = 0;
      $scope.global = Global;
      $scope.$state = $state;
      console.log('Global = '+JSON.stringify(Global));
      // setTimeout(function() {console.log('Global = '+JSON.stringify(Global));}, 1000); 
      $http.get('/api/get-config')
        .then(function(response) {
          var config = response.data;
          if(config.hasOwnProperty('local')) delete config.local; // Only non-local passport strategies
          $scope.socialButtons = config;
          $scope.socialButtonsCounter = Object.keys(config).length;
        });
    }
  ])
  .controller('LoginCtrl', ['$rootScope', 'MeanUser',
    function($rootScope, MeanUser) {
      var vm = this;

      // This object will be filled by the form
      vm.user = {};

      vm.input = {
        type: 'password',
        placeholder: 'Password',
        confirmPlaceholder: 'Repeat Password',
        iconClass: '',
        tooltipText: 'Show password'
      };

      vm.togglePasswordVisible = function() {
        vm.input.type = vm.input.type === 'text' ? 'password' : 'text';
        vm.input.placeholder = vm.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
        vm.input.iconClass = vm.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
        vm.input.tooltipText = vm.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
      };

      $rootScope.$on('loginfailed', function(){
        vm.loginError = MeanUser.loginError;
      });

      // Register the login() function
      vm.login = function() {
        MeanUser.login(this.user);
      };
    }
  ])
  .controller('RegisterCtrl', ['$rootScope', 'MeanUser',
    function($rootScope, MeanUser) {
      var vm = this;

      vm.user = {};

      vm.registerForm = MeanUser.registerForm = true;

      vm.input = {
        type: 'password',
        placeholder: 'Password',
        placeholderConfirmPass: 'Repeat Password',
        iconClassConfirmPass: '',
        tooltipText: 'Show password',
        tooltipTextConfirmPass: 'Show password'
      };

      vm.togglePasswordVisible = function() {
        vm.input.type = vm.input.type === 'text' ? 'password' : 'text';
        vm.input.placeholder = vm.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
        vm.input.iconClass = vm.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
        vm.input.tooltipText = vm.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
      };
      vm.togglePasswordConfirmVisible = function() {
        vm.input.type = vm.input.type === 'text' ? 'password' : 'text';
        vm.input.placeholderConfirmPass = vm.input.placeholderConfirmPass === 'Repeat Password' ? 'Visible Password' : 'Repeat Password';
        vm.input.iconClassConfirmPass = vm.input.iconClassConfirmPass === 'icon_hide_password' ? '' : 'icon_hide_password';
        vm.input.tooltipTextConfirmPass = vm.input.tooltipTextConfirmPass === 'Show password' ? 'Hide password' : 'Show password';
      };

      // Register the register() function
      vm.register = function() {
        MeanUser.register(this.user);
      };

      $rootScope.$on('registerfailed', function(){
        vm.registerError = MeanUser.registerError;
      });
    }
  ])
  .controller('ForgotPasswordCtrl', ['MeanUser', '$rootScope',
    function(MeanUser, $rootScope) {
      var vm = this;
      vm.user = {};
      vm.registerForm = MeanUser.registerForm = false;
      vm.forgotpassword = function() {
        MeanUser.forgotpassword(this.user);
      };
      $rootScope.$on('forgotmailsent', function(event, args){
        vm.response = args;
      });
    }
  ])
  .controller('ResetPasswordCtrl', ['MeanUser',
    function(MeanUser) {
      var vm = this;
      vm.user = {};
      vm.registerForm = MeanUser.registerForm = false;
      vm.resetpassword = function() {
        MeanUser.resetpassword(this.user);
      };
    }
  ]);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./auth.js": 31
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 30;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//Setting up route
angular.module('mean.users').config(['$httpProvider', 'jwtInterceptorProvider',
  function($httpProvider, jwtInterceptorProvider) {    
        
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  }
]);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./meanUser.js": 33
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 32;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('mean.users').factory('MeanUser', [ '$rootScope', '$http', '$location', '$stateParams',
  '$cookies', '$q', '$timeout', '$meanConfig', 'Global',
  function($rootScope, $http, $location, $stateParams, $cookies, $q, $timeout, $meanConfig, Global) {

    var self;

    function escape(html) {
      return String(html)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function b64_to_utf8( str ) {
      return decodeURIComponent(escape(window.atob( str )));
    }

    /*function url_base64_decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
      case 0:
      break;
      case 2:
      output += '==';
      break;
      case 3:
      output += '=';
      break;
      default:
      throw 'Illegal base64url string!';
      }
      return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
    }*/

    function MeanUserKlass(){
      this.name = 'users';
      this.user = {};
      this.acl = {};
      this.registerForm = false;
      this.loggedin = false;
      this.isAdmin = false;
      this.loginError = 0;
      this.usernameError = null;
      this.registerError = null;
      this.resetpassworderror = null;
      this.validationError = null;
      self = this;
      $http.get('/api/users/me').then(function(response) {
        if(!response.data && $cookies.get('token') && $cookies.get('redirect')) {
          self.onIdentity.bind(self)({
            token: $cookies.get('token'),
            redirect: $cookies.get('redirect').replace(/^"|"$/g, '')
          });
          $cookies.remove('token');
          $cookies.remove('redirect');
        } else {
          self.onIdentity.bind(self)(response.data);
        }
      });
    }

    MeanUserKlass.prototype.onIdentity = function(response) {
      if (!response) return;

      // Workaround for Angular 1.6.x
      if (response.data)
        response = response.data;

      var encodedUser, user, destination;
      if (angular.isDefined(response.token)) {
        localStorage.setItem('JWT', response.token);
        encodedUser = decodeURI(b64_to_utf8(response.token.split('.')[1]));
        user = JSON.parse(encodedUser);
      }
      destination = angular.isDefined(response.redirect) ? response.redirect : destination;
      this.user = user || response;
      this.loggedin = true;
      this.loginError = 0;
      this.registerError = 0;
      this.isAdmin = this.user.roles.indexOf('admin') > -1;
      var userObj = this.user;
      var self = this;
      // Add circles info to user
      $http.get('/api/circles/mine').then(function(response) {
        self.acl = response.data;
        if (destination) {
          $location.path(destination);
        }
        $rootScope.$emit('loggedin', userObj);
        Global.authenticate(userObj);
      });
    };

    MeanUserKlass.prototype.onIdFail = function (response) {

      // Workaround for Angular 1.6.x
      if (response.data)
        response = response.data;

      $location.path(response.redirect);
      this.loginError = 'Authentication failed.';
      this.registerError = response;
      this.validationError = response.msg;
      this.resetpassworderror = response.msg;
      $rootScope.$emit('loginfailed');
      $rootScope.$emit('registerfailed');
    };

    var MeanUser = new MeanUserKlass();

    MeanUserKlass.prototype.login = function (user) {
      // this is an ugly hack due to mean-admin needs
      var destination = $location.path().indexOf('/login') === -1 ? $location.absUrl() : false;
      $http.post('/api/login', {
          email: user.email,
          password: user.password,
          redirect: destination
        })
        .then(this.onIdentity.bind(this))
        .catch(this.onIdFail.bind(this));
    };

    MeanUserKlass.prototype.register = function(user) {
      $http.post('/api/register', {
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
        username: user.username,
        name: user.name
      })
        .then(this.onIdentity.bind(this))
        .catch(this.onIdFail.bind(this));
    };

    MeanUserKlass.prototype.resetpassword = function(user) {
        $http.post('/api/reset/' + $stateParams.tokenId, {
          password: user.password,
          confirmPassword: user.confirmPassword
        })
        .then(this.onIdentity.bind(this))
        .catch(this.onIdFail.bind(this));
      };

    MeanUserKlass.prototype.forgotpassword = function(user) {
        $http.post('/api/forgot-password', {
          text: user.email
        })
          .then(function(response) {
            $rootScope.$emit('forgotmailsent', response.data);
          })
          .catch(this.onIdFail.bind(this));
      };

    MeanUserKlass.prototype.logout = function(){
      this.user = {};
      this.loggedin = false;
      this.isAdmin = false;

      $http.get('/api/logout').then(function(response) {
        localStorage.removeItem('JWT');
        $rootScope.$emit('logout');
        Global.authenticate();
      });
    };

    MeanUserKlass.prototype.checkLoggedin = function() {
     var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').then(function(response) {
        var user = response.data;
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $cookies.put('redirect', $location.path());
          $timeout(deferred.reject);
          $location.url($meanConfig.loginPage);
        }
      });

      return deferred.promise;
    };

    MeanUserKlass.prototype.checkLoggedOut = function() {
       // Check if the user is not connected
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').then(function(response) {
        var user = response.data;
        // Authenticated
        if (user !== '0') {
          $timeout(deferred.reject);
          $location.url('/');
        }
        // Not Authenticated
        else $timeout(deferred.resolve);
      });

      return deferred.promise;
    };

    MeanUserKlass.prototype.checkAdmin = function() {
     var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').then(function(response) {
        var user = response.data;
        // Authenticated
        if (user !== '0' && user.roles.indexOf('admin') !== -1) $timeout(deferred.resolve);

        // Not Authenticated or not Admin
        else {
          $timeout(deferred.reject);
          $location.url('/');
        }
      });

      return deferred.promise;
    };

    return MeanUser;
  }
]);


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "<form name=\"signUpForm\" ng-controller=\"RegisterCtrl as reg\" ng-submit=\"reg.register()\" class=\"login-box\">\r\n  <md-card-title>\r\n    <md-card-title-text>\r\n      <!-- <span class=\"md-headline\">Join</span> -->\r\n      <div ng-repeat=\"error in reg.registerError track by $index\">\r\n        <p class=\"alert alert-danger animated fadeIn\">{{error.msg}}</p>\r\n      </div>\r\n    </md-card-title-text>\r\n  </md-card-title>\r\n  <md-card-content> \r\n    <md-input-container class=\"md-block\">\r\n      <label>Full Name</label>\r\n      <input type=\"text\" ng-model=\"reg.user.name\">\r\n    </md-input-container>\r\n    <md-input-container class=\"md-block\">\r\n      <label>Email Address</label>\r\n      <input type=\"email\" ng-model=\"reg.user.email\">\r\n    </md-input-container>\r\n    <md-input-container class=\"md-block\">\r\n      <label>Username</label>\r\n      <input type=\"text\" ng-model=\"reg.user.username\">\r\n    </md-input-container>\r\n    <md-input-container class=\"md-block\">\r\n      <label>Password</label>\r\n      <input type=\"password\" ng-model=\"reg.user.password\">\r\n    </md-input-container>\r\n    <md-input-container class=\"md-block\">\r\n      <label>Confirm Password</label>\r\n      <input type=\"password\" ng-model=\"reg.user.confirmPassword\">\r\n    </md-input-container>\r\n  </md-card-content>\r\n  <md-button ui-sref=\"forgot-password\">Forgot Password</md-button>\r\n    <md-button ui-sref=\"signin\">Sign in</md-button>\r\n  <md-card-actions layout=\"row\" layout-align=\"end center\">\r\n    <!-- <md-button ui-sref=\"auth.login\">Login</md-button> -->\r\n    <!-- <span flex></span> -->\r\n\r\n    <md-button class=\"md-primary\" type=\"submit\">Join</md-button>\r\n  </md-card-actions>\r\n\r\n</form>\r\n"

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/blog_single_styles.css\"> -->\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/blog_single_responsive.css\"> -->\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/blog_styles_custom.css\"> -->\n\n<search-bar></search-bar>\n<main-nav></main-nav>\n\n\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/shop_responsive.css\"> -->\n\n<!-- Home -->\n<div class=\"home \" >\n<!-- <div class=\"home \" style=\"overflow: hidden; top:-37px;\">     -->\n    <div class=\"home_background parallax-window\" data-parallax=\"scroll\" style=\" background-image:url(images/Ipadpro_blog.jpg);\"></div>\n    <div class=\"home_overlay\"></div>\n    <div class=\"home_content d-flex flex-column align-items-center justify-content-center\">\n        <h2 class=\"home_title\">{{category._id}}</h2>\n    </div>\n</div>\n\n\n    <!-- Single Blog Post -->\n\n    <div class=\"single_post\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col-lg-8 offset-lg-2\">\n                    <div class=\"single_post_title\">Apple iPad Pro 12.9 (2018, LTE, 256 GB) </div>\n                    <div class=\"single_post_title\"> Tablet Review </div> <div>by Daniel Schmidt (translated by Alex Alderson) - www.notebookcheck.net</div>\n\n                    <div class=\"single_post_text\">\n                        <p>The first-generation iPad Pro 12.9 was already a comparatively slim device. However, Apple has somehow managed to shave another millimetre off and has made the new iPad Pro 12.9 only 5.9 mm thick. Our test device measures 5.95 mm thick, but the 0.5 mm difference is marginal. It is worth noting that the device will not lay flat though as its rear-facing camera housing protrudes by 2.45 mm from the case like a little volcano. The third-generation iPad Pro 12.9 also has strikingly more rounded and smaller bezels than its predecessors, the result of which means that it is more compact too.\n\n</p>\n\n                        <div class=\"single_post_quote text-center\">\n                            <!-- <div class=\"quote_image\"><img src=\"images/quote.png\" alt=\"\"></div> -->\n                            <div class=\"quote_text\">Strong and expensive. The release of the third generation of Apple’s huge tablet has coincided with a complete redesign that shares more design cues with the new iPhone XS series than classic iPhones. Apple has equipped its most-expensive tablet with its most-powerful ARM SoC, Face ID, high volume storage options, support for a new Apple Pencil and much more, including a massive mark-up in price.</div>\n                            <div class=\"quote_name\">www.notebookcheck.net</div>\n                        </div>\n\n                        <p>In our opinion, the new iPad Pro 12.9 looks like a huge iPhone 5S or SE with a higher screen-to-body ratio. The recycled aluminium unibody not only looks great but also feels premium in the hand. We generally have no complaints about the craftsmanship of our test device either. The gaps between materials are consistently even and precise while the hardware buttons feel well made and sit firmly within the frame. The nano-SIM slot is made of the same aluminium as the frame too.\n\nApplying firm pressure to the display makes the LCD distort slightly though, and the case is generally not as stiff as we would have liked. We can easily make the device creak by trying to twist it with our hands, which is not what we would have expected from such an expensive tablet.\n\nMoreover, the iPad Pro 12.9 has no IP certification against dust and water, which is a shame as all new iPhones are at least IP67-resistant against dust and water. Apple currently sells the device in either silver or space grey. </p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- Blog Posts -->\n\n    <div class=\"blog\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col\">\n                    <div class=\"blog_posts d-flex flex-row align-items-start justify-content-between\">\n\n                        <!-- Blog post -->\n                        <div class=\"blog_post\">\n                            <div class=\"blog_image\" style=\"background-image:url(images/blog_4.jpg)\"></div>\n                            <div class=\"blog_text\">AirPods will forever change the way you use headphones</div>\n                            <div class=\"blog_button\"><a href=\"#/blog_single\">Stay in touch to see the latest reviews</a></div>\n                        </div>\n\n                        <!-- Blog post -->\n                        <div class=\"blog_post\">\n                            <div class=\"blog_image\" style=\"background-image:url(images/blog_5.jpg)\"></div>\n                            <div class=\"blog_text\">A desktop experience that draws you in and keeps you there</div>\n                            <div class=\"blog_button\"><a href=\"#/blog_single\">Stay in touch to see the latest reviews</a></div>\n                        </div>\n\n                        <!-- Blog post -->\n                        <div class=\"blog_post\">\n                            <div class=\"blog_image\" style=\"background-image:url(images/blog_6.jpg)\"></div>\n                            <div class=\"blog_text\">The ultimate home entertainment center starts with PlayStation </div>\n                            <div class=\"blog_button\"><a href=\"#/blog_single\">Stay in touch to see the latest reviews</a></div>\n                        </div>\n\n                    </div>\n                </div>  \n            </div>\n        </div>\n    </div>\n\n\n<footer-block></footer-block>\n"

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/blog_single_styles.css\"> -->\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/blog_single_responsive.css\"> -->\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/blog_styles_custom.css\"> -->\n\n<!-- <search-bar></search-bar> -->\n<!-- <main-nav></main-nav> -->\n\n\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/shop_responsive.css\"> -->\n\n<!-- Home -->\n<div class=\"home \" >\n<!-- <div class=\"home \" style=\"overflow: hidden; top:-37px;\">     -->\n    <div class=\"home_background parallax-window\" data-parallax=\"scroll\" style=\" background-image:url(images/about-code.jpg);\"></div>\n    <div class=\"home_overlay\"></div>\n    <div class=\"home_content d-flex flex-column align-items-center justify-content-center\">\n        <h2 class=\"home_title\">{{category._id}}</h2>\n    </div>\n</div>\n\n\n    <!-- Single Blog Post -->\n\n    <div class=\"single_post\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col-lg-8 offset-lg-2\">\n                    <div class=\"single_post_title\">About this project</div>\n                    <div class=\"single_post_title\">  </div> <div>Created by Dmitry Filimonoff</div>\n\n                    <div class=\"single_post_text\">\n                        <p>This resource was created for demonstration purposes only.\n                            This website is built using MEAN stack. CSS style theme is based on a free Bootstrap template. jQuery is completely removed from the basic template and rewritten to be compatible with Angular framework. Some vidgets are based on the third-party libraries including Angular-UI-Bootstrap.\n                            All data is stored in MongoDB. Backend part of the project is running on Nodejs. Communication between backend and frontend is performed with Expressjs framework.\n                            Facebook and local login strategies are available.  Password change procedure is implemented using Email request. Other social login strategies are possible. \n                            Stripe online payment and currency online exchange services are integrated via external APIs.\n\n</p>\n\n                        <div class=\"single_post_quote text-center\">\n                            Please view source project on my  <a href=\"http://github.com/DmitryVF\">github page </a> to get more information and realisation details. \n                            <!-- <div class=\"quote_image\"><img src=\"images/quote.png\" alt=\"\"></div> -->\n                            <div class=\"quote_text\">\n                                \n                            </div>\n                            <div class=\"quote_name\"></div>\n                        </div>\n\n                        <p> </p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n   \n\n\n<!-- <footer-block></footer-block> -->\n\n <!-- Newsletter -->\n\n    <div class=\"newsletter\">\n\n            <div class=\"characteristics\">\n                    <div class=\"container\">\n                        <div class=\"row\">\n            \n                           \n                        </div>\n                    </div>\n                </div>\n    </div>  \n    \n    <!-- Footer -->\n\n    <footer class=\"footer\">\n        <div class=\"container\">\n            <div class=\"row\">\n\n                <div class=\"col-lg-3 footer_col\">\n                    <div class=\"footer_column footer_contact\">\n                        <div class=\"logo_container\">\n                            <div class=\"logo\"><a href=\"#\">WebOnline</a></div>\n                        </div>\n                        <div class=\"footer_title\">Got Question? View our github page</div>\n                        <div class=\"footer_phone\"><a href=\"http://github.com/DmitryVF\">DmitryVF</a></div>\n                        <div class=\"footer_contact_text\">\n                            <p>Making websites for your needs</p>\n                            <p></p>\n                        </div>\n                        <div class=\"footer_social\">\n                            <ul>\n                                <li><a href=\"http://github.com/DmitryVF\"><i class=\"fab fa-github\"></i></a></li>\n                                <!-- <li><a href=\"#\"><i class=\"fab fa-twitter\"></i></a></li>\n                                <li><a href=\"#\"><i class=\"fab fa-youtube\"></i></a></li>\n                                <li><a href=\"#\"><i class=\"fab fa-google\"></i></a></li>\n                                <li><a href=\"#\"><i class=\"fab fa-vimeo-v\"></i></a></li> -->\n                            </ul>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"col-lg-2 offset-lg-2\">\n                    <div class=\"footer_column\">\n                        <div class=\"footer_title\"></div>\n                        \n                        <!-- <div class=\"footer_subtitle\">Gadgets</div> -->\n                        \n                    </div>\n                </div>\n\n                <div class=\"col-lg-2\">\n                    <div class=\"footer_column\">\n                        <div class=\"footer_title\"> &nbsp</div>\n                        <ul class=\"footer_list\">\n                            <li ng-repeat=\"cat in cats2\">\n                                <a href=\"#/category/{{cat._id}}\">{{cat._id}}</a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n\n                <div class=\"col-lg-2\">\n                    <div class=\"footer_column\">\n                        <div class=\"footer_title\">Pages</div>\n                        <ul class=\"footer_list\">\n                            <li><a href=\"#\">Home</a></li>\n                            <li><a href=\"#/category/Books\">Categories</a></li>\n                            <li><a href=\"#/blog_single\">Blog</a></li>\n                            <li ng-show=\"user.user\"><a href=\"#/likes\">My wishes</a></li>\n                            <li ng-show=\"!user.user\" uib-popover=\"Please login to view your Wishes\" popover-trigger=\"'mouseenter'\">\n                                <a href=\"#/login\">My wishes</a>\n                            </li>\n                            <li ng-show=\"user.user\"><a href=\"#/checkout\">Cart</a></li>\n                            <li ng-show=\"!user.user\" uib-popover=\"Please login to view your Cart\" popover-trigger=\"'mouseenter'\">\n                                <a href=\"#/login\">Cart</a>\n                            </li>\n                            <li><a href=\"#/about\">Contacts</a></li>\n                        </ul>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n    </footer>\n\n    <!-- Copyright -->\n\n    <div class=\"copyright\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col\">\n                    \n                    <div class=\"copyright_container d-flex flex-sm-row flex-column align-items-center justify-content-start\">\n                        <div class=\"copyright_content\"><!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->\n                            Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i class=\"fa fa-heart\" aria-hidden=\"true\"></i> by <a href=\"https://colorlib.com\" target=\"_blank\">Colorlib</a>\n                            <!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->\n                            </div>\n                        <div class=\"logos ml-sm-auto\">\n                            <!-- <ul class=\"logos_list\">\n                                <li><a href=\"#\"><img src=\"images/logos_1.png\" alt=\"\"></a></li>\n                                <li><a href=\"#\"><img src=\"images/logos_2.png\" alt=\"\"></a></li>\n                                <li><a href=\"#\"><img src=\"images/logos_3.png\" alt=\"\"></a></li>\n                                <li><a href=\"#\"><img src=\"images/logos_4.png\" alt=\"\"></a></li>\n                            </ul> -->\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n<!-- </div> -->\n"

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "<link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/shop_styles_custom.css\">\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/shop_styles.css\"> -->\n<search-bar></search-bar>\n<main-nav></main-nav>\n\n\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/shop_responsive.css\"> -->\n\n<!-- Home -->\n<div class=\"home \" >\n<!-- <div class=\"home \" style=\"overflow: hidden; top:-37px;\">     -->\n    <div class=\"home_background parallax-window\" data-parallax=\"scroll\" style=\" background-image:url(images/shop_background.jpg);\"></div>\n    <div class=\"home_overlay\"></div>\n    <div class=\"home_content d-flex flex-column align-items-center justify-content-center\">\n        <h2 class=\"home_title\">{{category._id}}</h2>\n    </div>\n</div>\n\n\n<category-tree></category-tree>\n<category-products></category-products>\n<footer-block></footer-block>\n"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/product_styles.css\"> -->\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/product_responsive.css\"> -->\n\n<!-- <link rel=\"stylesheet\" type=\"text/css\" href=\"stylesheets/shop_styles_custom.css\"> -->\n<search-bar></search-bar>\n<main-nav></main-nav>\n\n\n\n\n<!-- <category-tree></category-tree> -->\n<product-details></product-details>\n<recently-viewed></recently-viewed>\n<footer-block></footer-block>\n"

/***/ })
/******/ ]);