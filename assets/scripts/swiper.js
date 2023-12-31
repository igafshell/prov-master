!(function (global, factory) {
	"object" == typeof exports && "undefined" != typeof module
		? (module.exports = factory())
		: "function" == typeof define && define.amd
		? define(factory)
		: ((global =
				"undefined" != typeof globalThis ? globalThis : global || self).Swiper =
				factory());
})(this, function () {
	"use strict";
	function isObject$1(obj) {
		return (
			null !== obj &&
			"object" == typeof obj &&
			"constructor" in obj &&
			obj.constructor === Object
		);
	}
	function extend$1(target, src) {
		void 0 === target && (target = {}),
			void 0 === src && (src = {}),
			Object.keys(src).forEach((key) => {
				void 0 === target[key]
					? (target[key] = src[key])
					: isObject$1(src[key]) &&
					  isObject$1(target[key]) &&
					  Object.keys(src[key]).length > 0 &&
					  extend$1(target[key], src[key]);
			});
	}
	const ssrDocument = {
		body: {},
		addEventListener() {},
		removeEventListener() {},
		activeElement: { blur() {}, nodeName: "" },
		querySelector: () => null,
		querySelectorAll: () => [],
		getElementById: () => null,
		createEvent: () => ({ initEvent() {} }),
		createElement: () => ({
			children: [],
			childNodes: [],
			style: {},
			setAttribute() {},
			getElementsByTagName: () => [],
		}),
		createElementNS: () => ({}),
		importNode: () => null,
		location: {
			hash: "",
			host: "",
			hostname: "",
			href: "",
			origin: "",
			pathname: "",
			protocol: "",
			search: "",
		},
	};
	function getDocument() {
		const doc = "undefined" != typeof document ? document : {};
		return extend$1(doc, ssrDocument), doc;
	}
	const ssrWindow = {
		document: ssrDocument,
		navigator: { userAgent: "" },
		location: {
			hash: "",
			host: "",
			hostname: "",
			href: "",
			origin: "",
			pathname: "",
			protocol: "",
			search: "",
		},
		history: { replaceState() {}, pushState() {}, go() {}, back() {} },
		CustomEvent: function CustomEvent() {
			return this;
		},
		addEventListener() {},
		removeEventListener() {},
		getComputedStyle: () => ({ getPropertyValue: () => "" }),
		Image() {},
		Date() {},
		screen: {},
		setTimeout() {},
		clearTimeout() {},
		matchMedia: () => ({}),
		requestAnimationFrame: (callback) =>
			"undefined" == typeof setTimeout
				? (callback(), null)
				: setTimeout(callback, 0),
		cancelAnimationFrame(id) {
			"undefined" != typeof setTimeout && clearTimeout(id);
		},
	};
	function getWindow() {
		const win = "undefined" != typeof window ? window : {};
		return extend$1(win, ssrWindow), win;
	}
	function deleteProps(obj) {
		const object = obj;
		Object.keys(object).forEach((key) => {
			try {
				object[key] = null;
			} catch (e) {}
			try {
				delete object[key];
			} catch (e) {}
		});
	}
	function nextTick(callback, delay) {
		return void 0 === delay && (delay = 0), setTimeout(callback, delay);
	}
	function now() {
		return Date.now();
	}
	function getComputedStyle$1(el) {
		const window = getWindow();
		let style;
		return (
			window.getComputedStyle && (style = window.getComputedStyle(el, null)),
			!style && el.currentStyle && (style = el.currentStyle),
			style || (style = el.style),
			style
		);
	}
	function getTranslate(el, axis) {
		void 0 === axis && (axis = "x");
		const window = getWindow();
		let matrix, curTransform, transformMatrix;
		const curStyle = getComputedStyle$1(el);
		return (
			window.WebKitCSSMatrix
				? ((curTransform = curStyle.transform || curStyle.webkitTransform),
				  curTransform.split(",").length > 6 &&
						(curTransform = curTransform
							.split(", ")
							.map((a) => a.replace(",", "."))
							.join(", ")),
				  (transformMatrix = new window.WebKitCSSMatrix(
						"none" === curTransform ? "" : curTransform
				  )))
				: ((transformMatrix =
						curStyle.MozTransform ||
						curStyle.OTransform ||
						curStyle.MsTransform ||
						curStyle.msTransform ||
						curStyle.transform ||
						curStyle
							.getPropertyValue("transform")
							.replace("translate(", "matrix(1, 0, 0, 1,")),
				  (matrix = transformMatrix.toString().split(","))),
			"x" === axis &&
				(curTransform = window.WebKitCSSMatrix
					? transformMatrix.m41
					: 16 === matrix.length
					? parseFloat(matrix[12])
					: parseFloat(matrix[4])),
			"y" === axis &&
				(curTransform = window.WebKitCSSMatrix
					? transformMatrix.m42
					: 16 === matrix.length
					? parseFloat(matrix[13])
					: parseFloat(matrix[5])),
			curTransform || 0
		);
	}
	function isObject(o) {
		return (
			"object" == typeof o &&
			null !== o &&
			o.constructor &&
			"Object" === Object.prototype.toString.call(o).slice(8, -1)
		);
	}
	function isNode(node) {
		return "undefined" != typeof window && void 0 !== window.HTMLElement
			? node instanceof HTMLElement
			: node && (1 === node.nodeType || 11 === node.nodeType);
	}
	function extend() {
		const to = Object(arguments.length <= 0 ? void 0 : arguments[0]),
			noExtend = ["__proto__", "constructor", "prototype"];
		for (let i = 1; i < arguments.length; i += 1) {
			const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
			if (null != nextSource && !isNode(nextSource)) {
				const keysArray = Object.keys(Object(nextSource)).filter(
					(key) => noExtend.indexOf(key) < 0
				);
				for (
					let nextIndex = 0, len = keysArray.length;
					nextIndex < len;
					nextIndex += 1
				) {
					const nextKey = keysArray[nextIndex],
						desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					void 0 !== desc &&
						desc.enumerable &&
						(isObject(to[nextKey]) && isObject(nextSource[nextKey])
							? nextSource[nextKey].__swiper__
								? (to[nextKey] = nextSource[nextKey])
								: extend(to[nextKey], nextSource[nextKey])
							: !isObject(to[nextKey]) && isObject(nextSource[nextKey])
							? ((to[nextKey] = {}),
							  nextSource[nextKey].__swiper__
									? (to[nextKey] = nextSource[nextKey])
									: extend(to[nextKey], nextSource[nextKey]))
							: (to[nextKey] = nextSource[nextKey]));
				}
			}
		}
		return to;
	}
	function setCSSProperty(el, varName, varValue) {
		el.style.setProperty(varName, varValue);
	}
	function animateCSSModeScroll(_ref) {
		let { swiper: swiper, targetPosition: targetPosition, side: side } = _ref;
		const window = getWindow(),
			startPosition = -swiper.translate;
		let startTime = null,
			time;
		const duration = swiper.params.speed;
		(swiper.wrapperEl.style.scrollSnapType = "none"),
			window.cancelAnimationFrame(swiper.cssModeFrameID);
		const dir = targetPosition > startPosition ? "next" : "prev",
			isOutOfBound = (current, target) =>
				("next" === dir && current >= target) ||
				("prev" === dir && current <= target),
			animate = () => {
				(time = new Date().getTime()), null === startTime && (startTime = time);
				const progress = Math.max(
						Math.min((time - startTime) / duration, 1),
						0
					),
					easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
				let currentPosition =
					startPosition + easeProgress * (targetPosition - startPosition);
				if (
					(isOutOfBound(currentPosition, targetPosition) &&
						(currentPosition = targetPosition),
					swiper.wrapperEl.scrollTo({ [side]: currentPosition }),
					isOutOfBound(currentPosition, targetPosition))
				)
					return (
						(swiper.wrapperEl.style.overflow = "hidden"),
						(swiper.wrapperEl.style.scrollSnapType = ""),
						setTimeout(() => {
							(swiper.wrapperEl.style.overflow = ""),
								swiper.wrapperEl.scrollTo({ [side]: currentPosition });
						}),
						void window.cancelAnimationFrame(swiper.cssModeFrameID)
					);
				swiper.cssModeFrameID = window.requestAnimationFrame(animate);
			};
		animate();
	}
	function getSlideTransformEl(slideEl) {
		return (
			slideEl.querySelector(".swiper-slide-transform") ||
			(slideEl.shadowEl &&
				slideEl.shadowEl.querySelector(".swiper-slide-transform")) ||
			slideEl
		);
	}
	function elementChildren(element, selector) {
		return (
			void 0 === selector && (selector = ""),
			[...element.children].filter((el) => el.matches(selector))
		);
	}
	function createElement(tag, classes) {
		void 0 === classes && (classes = []);
		const el = document.createElement(tag);
		return (
			el.classList.add(...(Array.isArray(classes) ? classes : [classes])), el
		);
	}
	function elementOffset(el) {
		const window = getWindow(),
			document = getDocument(),
			box = el.getBoundingClientRect(),
			body = document.body,
			clientTop = el.clientTop || body.clientTop || 0,
			clientLeft = el.clientLeft || body.clientLeft || 0,
			scrollTop = el === window ? window.scrollY : el.scrollTop,
			scrollLeft = el === window ? window.scrollX : el.scrollLeft;
		return {
			top: box.top + scrollTop - clientTop,
			left: box.left + scrollLeft - clientLeft,
		};
	}
	function elementPrevAll(el, selector) {
		const prevEls = [];
		for (; el.previousElementSibling; ) {
			const prev = el.previousElementSibling;
			selector
				? prev.matches(selector) && prevEls.push(prev)
				: prevEls.push(prev),
				(el = prev);
		}
		return prevEls;
	}
	function elementNextAll(el, selector) {
		const nextEls = [];
		for (; el.nextElementSibling; ) {
			const next = el.nextElementSibling;
			selector
				? next.matches(selector) && nextEls.push(next)
				: nextEls.push(next),
				(el = next);
		}
		return nextEls;
	}
	function elementStyle(el, prop) {
		const window = getWindow();
		return window.getComputedStyle(el, null).getPropertyValue(prop);
	}
	function elementIndex(el) {
		let child = el,
			i;
		if (child) {
			for (i = 0; null !== (child = child.previousSibling); )
				1 === child.nodeType && (i += 1);
			return i;
		}
	}
	function elementParents(el, selector) {
		const parents = [];
		let parent = el.parentElement;
		for (; parent; )
			selector
				? parent.matches(selector) && parents.push(parent)
				: parents.push(parent),
				(parent = parent.parentElement);
		return parents;
	}
	function elementTransitionEnd(el, callback) {
		function fireCallBack(e) {
			e.target === el &&
				(callback.call(el, e),
				el.removeEventListener("transitionend", fireCallBack));
		}
		callback && el.addEventListener("transitionend", fireCallBack);
	}
	function elementOuterSize(el, size, includeMargins) {
		const window = getWindow();
		return includeMargins
			? el["width" === size ? "offsetWidth" : "offsetHeight"] +
					parseFloat(
						window
							.getComputedStyle(el, null)
							.getPropertyValue(
								"width" === size ? "margin-right" : "margin-top"
							)
					) +
					parseFloat(
						window
							.getComputedStyle(el, null)
							.getPropertyValue(
								"width" === size ? "margin-left" : "margin-bottom"
							)
					)
			: el.offsetWidth;
	}
	let support, deviceCached, browser;
	function calcSupport() {
		const window = getWindow(),
			document = getDocument();
		return {
			smoothScroll:
				document.documentElement &&
				document.documentElement.style &&
				"scrollBehavior" in document.documentElement.style,
			touch: !!(
				"ontouchstart" in window ||
				(window.DocumentTouch && document instanceof window.DocumentTouch)
			),
		};
	}
	function getSupport() {
		return support || (support = calcSupport()), support;
	}
	function calcDevice(_temp) {
		let { userAgent: userAgent } = void 0 === _temp ? {} : _temp;
		const support = getSupport(),
			window = getWindow(),
			platform = window.navigator.platform,
			ua = userAgent || window.navigator.userAgent,
			device = { ios: !1, android: !1 },
			screenWidth = window.screen.width,
			screenHeight = window.screen.height,
			android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
		let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
		const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
			iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
			windows = "Win32" === platform;
		let macos = "MacIntel" === platform;
		const iPadScreens = [
			"1024x1366",
			"1366x1024",
			"834x1194",
			"1194x834",
			"834x1112",
			"1112x834",
			"768x1024",
			"1024x768",
			"820x1180",
			"1180x820",
			"810x1080",
			"1080x810",
		];
		return (
			!ipad &&
				macos &&
				support.touch &&
				iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0 &&
				((ipad = ua.match(/(Version)\/([\d.]+)/)),
				ipad || (ipad = [0, 1, "13_0_0"]),
				(macos = !1)),
			android && !windows && ((device.os = "android"), (device.android = !0)),
			(ipad || iphone || ipod) && ((device.os = "ios"), (device.ios = !0)),
			device
		);
	}
	function getDevice(overrides) {
		return (
			void 0 === overrides && (overrides = {}),
			deviceCached || (deviceCached = calcDevice(overrides)),
			deviceCached
		);
	}
	function calcBrowser() {
		const window = getWindow();
		let needPerspectiveFix = !1;
		function isSafari() {
			const ua = window.navigator.userAgent.toLowerCase();
			return (
				ua.indexOf("safari") >= 0 &&
				ua.indexOf("chrome") < 0 &&
				ua.indexOf("android") < 0
			);
		}
		if (isSafari()) {
			const ua = String(window.navigator.userAgent);
			if (ua.includes("Version/")) {
				const [major, minor] = ua
					.split("Version/")[1]
					.split(" ")[0]
					.split(".")
					.map((num) => Number(num));
				needPerspectiveFix = major < 16 || (16 === major && minor < 2);
			}
		}
		return {
			isSafari: needPerspectiveFix || isSafari(),
			needPerspectiveFix: needPerspectiveFix,
			isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
				window.navigator.userAgent
			),
		};
	}
	function getBrowser() {
		return browser || (browser = calcBrowser()), browser;
	}
	function Resize(_ref) {
		let { swiper: swiper, on: on, emit: emit } = _ref;
		const window = getWindow();
		let observer = null,
			animationFrame = null;
		const resizeHandler = () => {
				swiper &&
					!swiper.destroyed &&
					swiper.initialized &&
					(emit("beforeResize"), emit("resize"));
			},
			createObserver = () => {
				swiper &&
					!swiper.destroyed &&
					swiper.initialized &&
					((observer = new ResizeObserver((entries) => {
						animationFrame = window.requestAnimationFrame(() => {
							const { width: width, height: height } = swiper;
							let newWidth = width,
								newHeight = height;
							entries.forEach((_ref2) => {
								let {
									contentBoxSize: contentBoxSize,
									contentRect: contentRect,
									target: target,
								} = _ref2;
								(target && target !== swiper.el) ||
									((newWidth = contentRect
										? contentRect.width
										: (contentBoxSize[0] || contentBoxSize).inlineSize),
									(newHeight = contentRect
										? contentRect.height
										: (contentBoxSize[0] || contentBoxSize).blockSize));
							}),
								(newWidth === width && newHeight === height) || resizeHandler();
						});
					})),
					observer.observe(swiper.el));
			},
			removeObserver = () => {
				animationFrame && window.cancelAnimationFrame(animationFrame),
					observer &&
						observer.unobserve &&
						swiper.el &&
						(observer.unobserve(swiper.el), (observer = null));
			},
			orientationChangeHandler = () => {
				swiper &&
					!swiper.destroyed &&
					swiper.initialized &&
					emit("orientationchange");
			};
		on("init", () => {
			swiper.params.resizeObserver && void 0 !== window.ResizeObserver
				? createObserver()
				: (window.addEventListener("resize", resizeHandler),
				  window.addEventListener(
						"orientationchange",
						orientationChangeHandler
				  ));
		}),
			on("destroy", () => {
				removeObserver(),
					window.removeEventListener("resize", resizeHandler),
					window.removeEventListener(
						"orientationchange",
						orientationChangeHandler
					);
			});
	}
	function Observer(_ref) {
		let {
			swiper: swiper,
			extendParams: extendParams,
			on: on,
			emit: emit,
		} = _ref;
		const observers = [],
			window = getWindow(),
			attach = function (target, options) {
				void 0 === options && (options = {});
				const ObserverFunc =
						window.MutationObserver || window.WebkitMutationObserver,
					observer = new ObserverFunc((mutations) => {
						if (swiper.__preventObserver__) return;
						if (1 === mutations.length)
							return void emit("observerUpdate", mutations[0]);
						const observerUpdate = function observerUpdate() {
							emit("observerUpdate", mutations[0]);
						};
						window.requestAnimationFrame
							? window.requestAnimationFrame(observerUpdate)
							: window.setTimeout(observerUpdate, 0);
					});
				observer.observe(target, {
					attributes: void 0 === options.attributes || options.attributes,
					childList: void 0 === options.childList || options.childList,
					characterData:
						void 0 === options.characterData || options.characterData,
				}),
					observers.push(observer);
			},
			init = () => {
				if (swiper.params.observer) {
					if (swiper.params.observeParents) {
						const containerParents = elementParents(swiper.el);
						for (let i = 0; i < containerParents.length; i += 1)
							attach(containerParents[i]);
					}
					attach(swiper.el, { childList: swiper.params.observeSlideChildren }),
						attach(swiper.wrapperEl, { attributes: !1 });
				}
			},
			destroy = () => {
				observers.forEach((observer) => {
					observer.disconnect();
				}),
					observers.splice(0, observers.length);
			};
		extendParams({
			observer: !1,
			observeParents: !1,
			observeSlideChildren: !1,
		}),
			on("init", init),
			on("destroy", destroy);
	}
	var eventsEmitter = {
		on(events, handler, priority) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if ("function" != typeof handler) return self;
			const method = priority ? "unshift" : "push";
			return (
				events.split(" ").forEach((event) => {
					self.eventsListeners[event] || (self.eventsListeners[event] = []),
						self.eventsListeners[event][method](handler);
				}),
				self
			);
		},
		once(events, handler, priority) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if ("function" != typeof handler) return self;
			function onceHandler() {
				self.off(events, onceHandler),
					onceHandler.__emitterProxy && delete onceHandler.__emitterProxy;
				for (
					var _len = arguments.length, args = new Array(_len), _key = 0;
					_key < _len;
					_key++
				)
					args[_key] = arguments[_key];
				handler.apply(self, args);
			}
			return (
				(onceHandler.__emitterProxy = handler),
				self.on(events, onceHandler, priority)
			);
		},
		onAny(handler, priority) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if ("function" != typeof handler) return self;
			const method = priority ? "unshift" : "push";
			return (
				self.eventsAnyListeners.indexOf(handler) < 0 &&
					self.eventsAnyListeners[method](handler),
				self
			);
		},
		offAny(handler) {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (!self.eventsAnyListeners) return self;
			const index = self.eventsAnyListeners.indexOf(handler);
			return index >= 0 && self.eventsAnyListeners.splice(index, 1), self;
		},
		off(events, handler) {
			const self = this;
			return !self.eventsListeners || self.destroyed
				? self
				: self.eventsListeners
				? (events.split(" ").forEach((event) => {
						void 0 === handler
							? (self.eventsListeners[event] = [])
							: self.eventsListeners[event] &&
							  self.eventsListeners[event].forEach((eventHandler, index) => {
									(eventHandler === handler ||
										(eventHandler.__emitterProxy &&
											eventHandler.__emitterProxy === handler)) &&
										self.eventsListeners[event].splice(index, 1);
							  });
				  }),
				  self)
				: self;
		},
		emit() {
			const self = this;
			if (!self.eventsListeners || self.destroyed) return self;
			if (!self.eventsListeners) return self;
			let events, data, context;
			for (
				var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
				_key2 < _len2;
				_key2++
			)
				args[_key2] = arguments[_key2];
			"string" == typeof args[0] || Array.isArray(args[0])
				? ((events = args[0]),
				  (data = args.slice(1, args.length)),
				  (context = self))
				: ((events = args[0].events),
				  (data = args[0].data),
				  (context = args[0].context || self)),
				data.unshift(context);
			const eventsArray = Array.isArray(events) ? events : events.split(" ");
			return (
				eventsArray.forEach((event) => {
					self.eventsAnyListeners &&
						self.eventsAnyListeners.length &&
						self.eventsAnyListeners.forEach((eventHandler) => {
							eventHandler.apply(context, [event, ...data]);
						}),
						self.eventsListeners &&
							self.eventsListeners[event] &&
							self.eventsListeners[event].forEach((eventHandler) => {
								eventHandler.apply(context, data);
							});
				}),
				self
			);
		},
	};
	function updateSize() {
		const swiper = this;
		let width, height;
		const el = swiper.el;
		(width =
			void 0 !== swiper.params.width && null !== swiper.params.width
				? swiper.params.width
				: el.clientWidth),
			(height =
				void 0 !== swiper.params.height && null !== swiper.params.height
					? swiper.params.height
					: el.clientHeight),
			(0 === width && swiper.isHorizontal()) ||
				(0 === height && swiper.isVertical()) ||
				((width =
					width -
					parseInt(elementStyle(el, "padding-left") || 0, 10) -
					parseInt(elementStyle(el, "padding-right") || 0, 10)),
				(height =
					height -
					parseInt(elementStyle(el, "padding-top") || 0, 10) -
					parseInt(elementStyle(el, "padding-bottom") || 0, 10)),
				Number.isNaN(width) && (width = 0),
				Number.isNaN(height) && (height = 0),
				Object.assign(swiper, {
					width: width,
					height: height,
					size: swiper.isHorizontal() ? width : height,
				}));
	}
	function updateSlides() {
		const swiper = this;
		function getDirectionLabel(property) {
			return swiper.isHorizontal()
				? property
				: {
						width: "height",
						"margin-top": "margin-left",
						"margin-bottom ": "margin-right",
						"margin-left": "margin-top",
						"margin-right": "margin-bottom",
						"padding-left": "padding-top",
						"padding-right": "padding-bottom",
						marginRight: "marginBottom",
				  }[property];
		}
		function getDirectionPropertyValue(node, label) {
			return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
		}
		const params = swiper.params,
			{
				wrapperEl: wrapperEl,
				slidesEl: slidesEl,
				size: swiperSize,
				rtlTranslate: rtl,
				wrongRTL: wrongRTL,
			} = swiper,
			isVirtual = swiper.virtual && params.virtual.enabled,
			previousSlidesLength = isVirtual
				? swiper.virtual.slides.length
				: swiper.slides.length,
			slides = elementChildren(
				slidesEl,
				`.${swiper.params.slideClass}, swiper-slide`
			),
			slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
		let snapGrid = [];
		const slidesGrid = [],
			slidesSizesGrid = [];
		let offsetBefore = params.slidesOffsetBefore;
		"function" == typeof offsetBefore &&
			(offsetBefore = params.slidesOffsetBefore.call(swiper));
		let offsetAfter = params.slidesOffsetAfter;
		"function" == typeof offsetAfter &&
			(offsetAfter = params.slidesOffsetAfter.call(swiper));
		const previousSnapGridLength = swiper.snapGrid.length,
			previousSlidesGridLength = swiper.slidesGrid.length;
		let spaceBetween = params.spaceBetween,
			slidePosition = -offsetBefore,
			prevSlideSize = 0,
			index = 0;
		if (void 0 === swiperSize) return;
		"string" == typeof spaceBetween && spaceBetween.indexOf("%") >= 0
			? (spaceBetween =
					(parseFloat(spaceBetween.replace("%", "")) / 100) * swiperSize)
			: "string" == typeof spaceBetween &&
			  (spaceBetween = parseFloat(spaceBetween)),
			(swiper.virtualSize = -spaceBetween),
			slides.forEach((slideEl) => {
				rtl
					? (slideEl.style.marginLeft = "")
					: (slideEl.style.marginRight = ""),
					(slideEl.style.marginBottom = ""),
					(slideEl.style.marginTop = "");
			}),
			params.centeredSlides &&
				params.cssMode &&
				(setCSSProperty(wrapperEl, "--swiper-centered-offset-before", ""),
				setCSSProperty(wrapperEl, "--swiper-centered-offset-after", ""));
		const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
		let slideSize;
		gridEnabled && swiper.grid.initSlides(slidesLength);
		const shouldResetSlideSize =
			"auto" === params.slidesPerView &&
			params.breakpoints &&
			Object.keys(params.breakpoints).filter(
				(key) => void 0 !== params.breakpoints[key].slidesPerView
			).length > 0;
		for (let i = 0; i < slidesLength; i += 1) {
			let slide;
			if (
				((slideSize = 0),
				slides[i] && (slide = slides[i]),
				gridEnabled &&
					swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel),
				!slides[i] || "none" !== elementStyle(slide, "display"))
			) {
				if ("auto" === params.slidesPerView) {
					shouldResetSlideSize &&
						(slides[i].style[getDirectionLabel("width")] = "");
					const slideStyles = getComputedStyle(slide),
						currentTransform = slide.style.transform,
						currentWebKitTransform = slide.style.webkitTransform;
					if (
						(currentTransform && (slide.style.transform = "none"),
						currentWebKitTransform && (slide.style.webkitTransform = "none"),
						params.roundLengths)
					)
						slideSize = swiper.isHorizontal()
							? elementOuterSize(slide, "width", !0)
							: elementOuterSize(slide, "height", !0);
					else {
						const width = getDirectionPropertyValue(slideStyles, "width"),
							paddingLeft = getDirectionPropertyValue(
								slideStyles,
								"padding-left"
							),
							paddingRight = getDirectionPropertyValue(
								slideStyles,
								"padding-right"
							),
							marginLeft = getDirectionPropertyValue(
								slideStyles,
								"margin-left"
							),
							marginRight = getDirectionPropertyValue(
								slideStyles,
								"margin-right"
							),
							boxSizing = slideStyles.getPropertyValue("box-sizing");
						if (boxSizing && "border-box" === boxSizing)
							slideSize = width + marginLeft + marginRight;
						else {
							const { clientWidth: clientWidth, offsetWidth: offsetWidth } =
								slide;
							slideSize =
								width +
								paddingLeft +
								paddingRight +
								marginLeft +
								marginRight +
								(offsetWidth - clientWidth);
						}
					}
					currentTransform && (slide.style.transform = currentTransform),
						currentWebKitTransform &&
							(slide.style.webkitTransform = currentWebKitTransform),
						params.roundLengths && (slideSize = Math.floor(slideSize));
				} else
					(slideSize =
						(swiperSize - (params.slidesPerView - 1) * spaceBetween) /
						params.slidesPerView),
						params.roundLengths && (slideSize = Math.floor(slideSize)),
						slides[i] &&
							(slides[i].style[getDirectionLabel("width")] = `${slideSize}px`);
				slides[i] && (slides[i].swiperSlideSize = slideSize),
					slidesSizesGrid.push(slideSize),
					params.centeredSlides
						? ((slidePosition =
								slidePosition +
								slideSize / 2 +
								prevSlideSize / 2 +
								spaceBetween),
						  0 === prevSlideSize &&
								0 !== i &&
								(slidePosition = slidePosition - swiperSize / 2 - spaceBetween),
						  0 === i &&
								(slidePosition = slidePosition - swiperSize / 2 - spaceBetween),
						  Math.abs(slidePosition) < 0.001 && (slidePosition = 0),
						  params.roundLengths &&
								(slidePosition = Math.floor(slidePosition)),
						  index % params.slidesPerGroup == 0 &&
								snapGrid.push(slidePosition),
						  slidesGrid.push(slidePosition))
						: (params.roundLengths &&
								(slidePosition = Math.floor(slidePosition)),
						  (index - Math.min(swiper.params.slidesPerGroupSkip, index)) %
								swiper.params.slidesPerGroup ==
								0 && snapGrid.push(slidePosition),
						  slidesGrid.push(slidePosition),
						  (slidePosition = slidePosition + slideSize + spaceBetween)),
					(swiper.virtualSize += slideSize + spaceBetween),
					(prevSlideSize = slideSize),
					(index += 1);
			}
		}
		if (
			((swiper.virtualSize =
				Math.max(swiper.virtualSize, swiperSize) + offsetAfter),
			rtl &&
				wrongRTL &&
				("slide" === params.effect || "coverflow" === params.effect) &&
				(wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`),
			params.setWrapperSize &&
				(wrapperEl.style[getDirectionLabel("width")] = `${
					swiper.virtualSize + spaceBetween
				}px`),
			gridEnabled &&
				swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel),
			!params.centeredSlides)
		) {
			const newSlidesGrid = [];
			for (let i = 0; i < snapGrid.length; i += 1) {
				let slidesGridItem = snapGrid[i];
				params.roundLengths && (slidesGridItem = Math.floor(slidesGridItem)),
					snapGrid[i] <= swiper.virtualSize - swiperSize &&
						newSlidesGrid.push(slidesGridItem);
			}
			(snapGrid = newSlidesGrid),
				Math.floor(swiper.virtualSize - swiperSize) -
					Math.floor(snapGrid[snapGrid.length - 1]) >
					1 && snapGrid.push(swiper.virtualSize - swiperSize);
		}
		if (isVirtual && params.loop) {
			const size = slidesSizesGrid[0] + spaceBetween;
			if (params.slidesPerGroup > 1) {
				const groups = Math.ceil(
						(swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) /
							params.slidesPerGroup
					),
					groupSize = size * params.slidesPerGroup;
				for (let i = 0; i < groups; i += 1)
					snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
			}
			for (
				let i = 0;
				i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter;
				i += 1
			)
				1 === params.slidesPerGroup &&
					snapGrid.push(snapGrid[snapGrid.length - 1] + size),
					slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size),
					(swiper.virtualSize += size);
		}
		if ((0 === snapGrid.length && (snapGrid = [0]), 0 !== spaceBetween)) {
			const key =
				swiper.isHorizontal() && rtl
					? "marginLeft"
					: getDirectionLabel("marginRight");
			slides
				.filter(
					(_, slideIndex) =>
						!(params.cssMode && !params.loop) ||
						slideIndex !== slides.length - 1
				)
				.forEach((slideEl) => {
					slideEl.style[key] = `${spaceBetween}px`;
				});
		}
		if (params.centeredSlides && params.centeredSlidesBounds) {
			let allSlidesSize = 0;
			slidesSizesGrid.forEach((slideSizeValue) => {
				allSlidesSize += slideSizeValue + (spaceBetween || 0);
			}),
				(allSlidesSize -= spaceBetween);
			const maxSnap = allSlidesSize - swiperSize;
			snapGrid = snapGrid.map((snap) =>
				snap <= 0
					? -offsetBefore
					: snap > maxSnap
					? maxSnap + offsetAfter
					: snap
			);
		}
		if (params.centerInsufficientSlides) {
			let allSlidesSize = 0;
			if (
				(slidesSizesGrid.forEach((slideSizeValue) => {
					allSlidesSize += slideSizeValue + (spaceBetween || 0);
				}),
				(allSlidesSize -= spaceBetween),
				allSlidesSize < swiperSize)
			) {
				const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
				snapGrid.forEach((snap, snapIndex) => {
					snapGrid[snapIndex] = snap - allSlidesOffset;
				}),
					slidesGrid.forEach((snap, snapIndex) => {
						slidesGrid[snapIndex] = snap + allSlidesOffset;
					});
			}
		}
		if (
			(Object.assign(swiper, {
				slides: slides,
				snapGrid: snapGrid,
				slidesGrid: slidesGrid,
				slidesSizesGrid: slidesSizesGrid,
			}),
			params.centeredSlides && params.cssMode && !params.centeredSlidesBounds)
		) {
			setCSSProperty(
				wrapperEl,
				"--swiper-centered-offset-before",
				`${-snapGrid[0]}px`
			),
				setCSSProperty(
					wrapperEl,
					"--swiper-centered-offset-after",
					`${
						swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2
					}px`
				);
			const addToSnapGrid = -swiper.snapGrid[0],
				addToSlidesGrid = -swiper.slidesGrid[0];
			(swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid)),
				(swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid));
		}
		if (
			(slidesLength !== previousSlidesLength &&
				swiper.emit("slidesLengthChange"),
			snapGrid.length !== previousSnapGridLength &&
				(swiper.params.watchOverflow && swiper.checkOverflow(),
				swiper.emit("snapGridLengthChange")),
			slidesGrid.length !== previousSlidesGridLength &&
				swiper.emit("slidesGridLengthChange"),
			params.watchSlidesProgress && swiper.updateSlidesOffset(),
			!(
				isVirtual ||
				params.cssMode ||
				("slide" !== params.effect && "fade" !== params.effect)
			))
		) {
			const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`,
				hasClassBackfaceClassAdded =
					swiper.el.classList.contains(backFaceHiddenClass);
			slidesLength <= params.maxBackfaceHiddenSlides
				? hasClassBackfaceClassAdded ||
				  swiper.el.classList.add(backFaceHiddenClass)
				: hasClassBackfaceClassAdded &&
				  swiper.el.classList.remove(backFaceHiddenClass);
		}
	}
	function updateAutoHeight(speed) {
		const swiper = this,
			activeSlides = [],
			isVirtual = swiper.virtual && swiper.params.virtual.enabled;
		let newHeight = 0,
			i;
		"number" == typeof speed
			? swiper.setTransition(speed)
			: !0 === speed && swiper.setTransition(swiper.params.speed);
		const getSlideByIndex = (index) =>
			isVirtual
				? swiper.slides[swiper.getSlideIndexByData(index)]
				: swiper.slides[index];
		if (
			"auto" !== swiper.params.slidesPerView &&
			swiper.params.slidesPerView > 1
		)
			if (swiper.params.centeredSlides)
				(swiper.visibleSlides || []).forEach((slide) => {
					activeSlides.push(slide);
				});
			else
				for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
					const index = swiper.activeIndex + i;
					if (index > swiper.slides.length && !isVirtual) break;
					activeSlides.push(getSlideByIndex(index));
				}
		else activeSlides.push(getSlideByIndex(swiper.activeIndex));
		for (i = 0; i < activeSlides.length; i += 1)
			if (void 0 !== activeSlides[i]) {
				const height = activeSlides[i].offsetHeight;
				newHeight = height > newHeight ? height : newHeight;
			}
		(newHeight || 0 === newHeight) &&
			(swiper.wrapperEl.style.height = `${newHeight}px`);
	}
	function updateSlidesOffset() {
		const swiper = this,
			slides = swiper.slides,
			minusOffset = swiper.isElement
				? swiper.isHorizontal()
					? swiper.wrapperEl.offsetLeft
					: swiper.wrapperEl.offsetTop
				: 0;
		for (let i = 0; i < slides.length; i += 1)
			slides[i].swiperSlideOffset =
				(swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) -
				minusOffset -
				swiper.cssOverflowAdjustment();
	}
	function updateSlidesProgress(translate) {
		void 0 === translate && (translate = (this && this.translate) || 0);
		const swiper = this,
			params = swiper.params,
			{ slides: slides, rtlTranslate: rtl, snapGrid: snapGrid } = swiper;
		if (0 === slides.length) return;
		void 0 === slides[0].swiperSlideOffset && swiper.updateSlidesOffset();
		let offsetCenter = -translate;
		rtl && (offsetCenter = translate),
			slides.forEach((slideEl) => {
				slideEl.classList.remove(params.slideVisibleClass);
			}),
			(swiper.visibleSlidesIndexes = []),
			(swiper.visibleSlides = []);
		let spaceBetween = params.spaceBetween;
		"string" == typeof spaceBetween && spaceBetween.indexOf("%") >= 0
			? (spaceBetween =
					(parseFloat(spaceBetween.replace("%", "")) / 100) * swiper.size)
			: "string" == typeof spaceBetween &&
			  (spaceBetween = parseFloat(spaceBetween));
		for (let i = 0; i < slides.length; i += 1) {
			const slide = slides[i];
			let slideOffset = slide.swiperSlideOffset;
			params.cssMode &&
				params.centeredSlides &&
				(slideOffset -= slides[0].swiperSlideOffset);
			const slideProgress =
					(offsetCenter +
						(params.centeredSlides ? swiper.minTranslate() : 0) -
						slideOffset) /
					(slide.swiperSlideSize + spaceBetween),
				originalSlideProgress =
					(offsetCenter -
						snapGrid[0] +
						(params.centeredSlides ? swiper.minTranslate() : 0) -
						slideOffset) /
					(slide.swiperSlideSize + spaceBetween),
				slideBefore = -(offsetCenter - slideOffset),
				slideAfter = slideBefore + swiper.slidesSizesGrid[i],
				isVisible =
					(slideBefore >= 0 && slideBefore < swiper.size - 1) ||
					(slideAfter > 1 && slideAfter <= swiper.size) ||
					(slideBefore <= 0 && slideAfter >= swiper.size);
			isVisible &&
				(swiper.visibleSlides.push(slide),
				swiper.visibleSlidesIndexes.push(i),
				slides[i].classList.add(params.slideVisibleClass)),
				(slide.progress = rtl ? -slideProgress : slideProgress),
				(slide.originalProgress = rtl
					? -originalSlideProgress
					: originalSlideProgress);
		}
	}
	function updateProgress(translate) {
		const swiper = this;
		if (void 0 === translate) {
			const multiplier = swiper.rtlTranslate ? -1 : 1;
			translate =
				(swiper && swiper.translate && swiper.translate * multiplier) || 0;
		}
		const params = swiper.params,
			translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
		let {
			progress: progress,
			isBeginning: isBeginning,
			isEnd: isEnd,
			progressLoop: progressLoop,
		} = swiper;
		const wasBeginning = isBeginning,
			wasEnd = isEnd;
		if (0 === translatesDiff) (progress = 0), (isBeginning = !0), (isEnd = !0);
		else {
			progress = (translate - swiper.minTranslate()) / translatesDiff;
			const isBeginningRounded =
					Math.abs(translate - swiper.minTranslate()) < 1,
				isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
			(isBeginning = isBeginningRounded || progress <= 0),
				(isEnd = isEndRounded || progress >= 1),
				isBeginningRounded && (progress = 0),
				isEndRounded && (progress = 1);
		}
		if (params.loop) {
			const firstSlideIndex = swiper.getSlideIndexByData(0),
				lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1),
				firstSlideTranslate = swiper.slidesGrid[firstSlideIndex],
				lastSlideTranslate = swiper.slidesGrid[lastSlideIndex],
				translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1],
				translateAbs = Math.abs(translate);
			(progressLoop =
				translateAbs >= firstSlideTranslate
					? (translateAbs - firstSlideTranslate) / translateMax
					: (translateAbs + translateMax - lastSlideTranslate) / translateMax),
				progressLoop > 1 && (progressLoop -= 1);
		}
		Object.assign(swiper, {
			progress: progress,
			progressLoop: progressLoop,
			isBeginning: isBeginning,
			isEnd: isEnd,
		}),
			(params.watchSlidesProgress ||
				(params.centeredSlides && params.autoHeight)) &&
				swiper.updateSlidesProgress(translate),
			isBeginning && !wasBeginning && swiper.emit("reachBeginning toEdge"),
			isEnd && !wasEnd && swiper.emit("reachEnd toEdge"),
			((wasBeginning && !isBeginning) || (wasEnd && !isEnd)) &&
				swiper.emit("fromEdge"),
			swiper.emit("progress", progress);
	}
	function updateSlidesClasses() {
		const swiper = this,
			{
				slides: slides,
				params: params,
				slidesEl: slidesEl,
				activeIndex: activeIndex,
			} = swiper,
			isVirtual = swiper.virtual && params.virtual.enabled,
			getFilteredSlide = (selector) =>
				elementChildren(
					slidesEl,
					`.${params.slideClass}${selector}, swiper-slide${selector}`
				)[0];
		let activeSlide;
		if (
			(slides.forEach((slideEl) => {
				slideEl.classList.remove(
					params.slideActiveClass,
					params.slideNextClass,
					params.slidePrevClass
				);
			}),
			isVirtual)
		)
			if (params.loop) {
				let slideIndex = activeIndex - swiper.virtual.slidesBefore;
				slideIndex < 0 &&
					(slideIndex = swiper.virtual.slides.length + slideIndex),
					slideIndex >= swiper.virtual.slides.length &&
						(slideIndex -= swiper.virtual.slides.length),
					(activeSlide = getFilteredSlide(
						`[data-swiper-slide-index="${slideIndex}"]`
					));
			} else
				activeSlide = getFilteredSlide(
					`[data-swiper-slide-index="${activeIndex}"]`
				);
		else activeSlide = slides[activeIndex];
		if (activeSlide) {
			activeSlide.classList.add(params.slideActiveClass);
			let nextSlide = elementNextAll(
				activeSlide,
				`.${params.slideClass}, swiper-slide`
			)[0];
			params.loop && !nextSlide && (nextSlide = slides[0]),
				nextSlide && nextSlide.classList.add(params.slideNextClass);
			let prevSlide = elementPrevAll(
				activeSlide,
				`.${params.slideClass}, swiper-slide`
			)[0];
			params.loop &&
				0 === !prevSlide &&
				(prevSlide = slides[slides.length - 1]),
				prevSlide && prevSlide.classList.add(params.slidePrevClass);
		}
		swiper.emitSlidesClasses();
	}
	const processLazyPreloader = (swiper, imageEl) => {
			if (!swiper || swiper.destroyed || !swiper.params) return;
			const slideSelector = () =>
					swiper.isElement ? "swiper-slide" : `.${swiper.params.slideClass}`,
				slideEl = imageEl.closest(slideSelector());
			if (slideEl) {
				const lazyEl = slideEl.querySelector(
					`.${swiper.params.lazyPreloaderClass}`
				);
				lazyEl && lazyEl.remove();
			}
		},
		unlazy = (swiper, index) => {
			if (!swiper.slides[index]) return;
			const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
			imageEl && imageEl.removeAttribute("loading");
		},
		preload = (swiper) => {
			if (!swiper || swiper.destroyed || !swiper.params) return;
			let amount = swiper.params.lazyPreloadPrevNext;
			const len = swiper.slides.length;
			if (!len || !amount || amount < 0) return;
			amount = Math.min(amount, len);
			const slidesPerView =
					"auto" === swiper.params.slidesPerView
						? swiper.slidesPerViewDynamic()
						: Math.ceil(swiper.params.slidesPerView),
				activeIndex = swiper.activeIndex;
			if (swiper.params.grid && swiper.params.grid.rows > 1) {
				const activeColumn = activeIndex,
					preloadColumns = [activeColumn - amount];
				return (
					preloadColumns.push(
						...Array.from({ length: amount }).map(
							(_, i) => activeColumn + slidesPerView + i
						)
					),
					void swiper.slides.forEach((slideEl, i) => {
						preloadColumns.includes(slideEl.column) && unlazy(swiper, i);
					})
				);
			}
			const slideIndexLastInView = activeIndex + slidesPerView - 1;
			if (swiper.params.rewind || swiper.params.loop)
				for (
					let i = activeIndex - amount;
					i <= slideIndexLastInView + amount;
					i += 1
				) {
					const realIndex = ((i % len) + len) % len;
					(realIndex < activeIndex || realIndex > slideIndexLastInView) &&
						unlazy(swiper, realIndex);
				}
			else
				for (
					let i = Math.max(activeIndex - amount, 0);
					i <= Math.min(slideIndexLastInView + amount, len - 1);
					i += 1
				)
					i !== activeIndex &&
						(i > slideIndexLastInView || i < activeIndex) &&
						unlazy(swiper, i);
		};
	function getActiveIndexByTranslate(swiper) {
		const { slidesGrid: slidesGrid, params: params } = swiper,
			translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
		let activeIndex;
		for (let i = 0; i < slidesGrid.length; i += 1)
			void 0 !== slidesGrid[i + 1]
				? translate >= slidesGrid[i] &&
				  translate <
						slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2
					? (activeIndex = i)
					: translate >= slidesGrid[i] &&
					  translate < slidesGrid[i + 1] &&
					  (activeIndex = i + 1)
				: translate >= slidesGrid[i] && (activeIndex = i);
		return (
			params.normalizeSlideIndex &&
				(activeIndex < 0 || void 0 === activeIndex) &&
				(activeIndex = 0),
			activeIndex
		);
	}
	function updateActiveIndex(newActiveIndex) {
		const swiper = this,
			translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate,
			{
				snapGrid: snapGrid,
				params: params,
				activeIndex: previousIndex,
				realIndex: previousRealIndex,
				snapIndex: previousSnapIndex,
			} = swiper;
		let activeIndex = newActiveIndex,
			snapIndex;
		const getVirtualRealIndex = (aIndex) => {
			let realIndex = aIndex - swiper.virtual.slidesBefore;
			return (
				realIndex < 0 && (realIndex = swiper.virtual.slides.length + realIndex),
				realIndex >= swiper.virtual.slides.length &&
					(realIndex -= swiper.virtual.slides.length),
				realIndex
			);
		};
		if (
			(void 0 === activeIndex &&
				(activeIndex = getActiveIndexByTranslate(swiper)),
			snapGrid.indexOf(translate) >= 0)
		)
			snapIndex = snapGrid.indexOf(translate);
		else {
			const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
			snapIndex =
				skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
		}
		if (
			(snapIndex >= snapGrid.length && (snapIndex = snapGrid.length - 1),
			activeIndex === previousIndex)
		)
			return (
				snapIndex !== previousSnapIndex &&
					((swiper.snapIndex = snapIndex), swiper.emit("snapIndexChange")),
				void (
					swiper.params.loop &&
					swiper.virtual &&
					swiper.params.virtual.enabled &&
					(swiper.realIndex = getVirtualRealIndex(activeIndex))
				)
			);
		let realIndex;
		(realIndex =
			swiper.virtual && params.virtual.enabled && params.loop
				? getVirtualRealIndex(activeIndex)
				: swiper.slides[activeIndex]
				? parseInt(
						swiper.slides[activeIndex].getAttribute(
							"data-swiper-slide-index"
						) || activeIndex,
						10
				  )
				: activeIndex),
			Object.assign(swiper, {
				previousSnapIndex: previousSnapIndex,
				snapIndex: snapIndex,
				previousRealIndex: previousRealIndex,
				realIndex: realIndex,
				previousIndex: previousIndex,
				activeIndex: activeIndex,
			}),
			swiper.initialized && preload(swiper),
			swiper.emit("activeIndexChange"),
			swiper.emit("snapIndexChange"),
			previousRealIndex !== realIndex && swiper.emit("realIndexChange"),
			(swiper.initialized || swiper.params.runCallbacksOnInit) &&
				swiper.emit("slideChange");
	}
	function updateClickedSlide(e) {
		const swiper = this,
			params = swiper.params,
			slide = e.closest(`.${params.slideClass}, swiper-slide`);
		let slideFound = !1,
			slideIndex;
		if (slide)
			for (let i = 0; i < swiper.slides.length; i += 1)
				if (swiper.slides[i] === slide) {
					(slideFound = !0), (slideIndex = i);
					break;
				}
		if (!slide || !slideFound)
			return (
				(swiper.clickedSlide = void 0), void (swiper.clickedIndex = void 0)
			);
		(swiper.clickedSlide = slide),
			swiper.virtual && swiper.params.virtual.enabled
				? (swiper.clickedIndex = parseInt(
						slide.getAttribute("data-swiper-slide-index"),
						10
				  ))
				: (swiper.clickedIndex = slideIndex),
			params.slideToClickedSlide &&
				void 0 !== swiper.clickedIndex &&
				swiper.clickedIndex !== swiper.activeIndex &&
				swiper.slideToClickedSlide();
	}
	var update, translate, transition, slide, loop, grabCursor;
	function getSwiperTranslate(axis) {
		void 0 === axis && (axis = this.isHorizontal() ? "x" : "y");
		const swiper = this,
			{
				params: params,
				rtlTranslate: rtl,
				translate: translate,
				wrapperEl: wrapperEl,
			} = this;
		if (params.virtualTranslate) return rtl ? -translate : translate;
		if (params.cssMode) return translate;
		let currentTranslate = getTranslate(wrapperEl, axis);
		return (
			(currentTranslate += this.cssOverflowAdjustment()),
			rtl && (currentTranslate = -currentTranslate),
			currentTranslate || 0
		);
	}
	function setTranslate(translate, byController) {
		const swiper = this,
			{
				rtlTranslate: rtl,
				params: params,
				wrapperEl: wrapperEl,
				progress: progress,
			} = swiper;
		let x = 0,
			y = 0;
		const z = 0;
		let newProgress;
		swiper.isHorizontal()
			? (x = rtl ? -translate : translate)
			: (y = translate),
			params.roundLengths && ((x = Math.floor(x)), (y = Math.floor(y))),
			(swiper.previousTranslate = swiper.translate),
			(swiper.translate = swiper.isHorizontal() ? x : y),
			params.cssMode
				? (wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] =
						swiper.isHorizontal() ? -x : -y)
				: params.virtualTranslate ||
				  (swiper.isHorizontal()
						? (x -= swiper.cssOverflowAdjustment())
						: (y -= swiper.cssOverflowAdjustment()),
				  (wrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0px)`));
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
		(newProgress =
			0 === translatesDiff
				? 0
				: (translate - swiper.minTranslate()) / translatesDiff),
			newProgress !== progress && swiper.updateProgress(translate),
			swiper.emit("setTranslate", swiper.translate, byController);
	}
	function minTranslate() {
		return -this.snapGrid[0];
	}
	function maxTranslate() {
		return -this.snapGrid[this.snapGrid.length - 1];
	}
	function translateTo(
		translate,
		speed,
		runCallbacks,
		translateBounds,
		internal
	) {
		void 0 === translate && (translate = 0),
			void 0 === speed && (speed = this.params.speed),
			void 0 === runCallbacks && (runCallbacks = !0),
			void 0 === translateBounds && (translateBounds = !0);
		const swiper = this,
			{ params: params, wrapperEl: wrapperEl } = swiper;
		if (swiper.animating && params.preventInteractionOnTransition) return !1;
		const minTranslate = swiper.minTranslate(),
			maxTranslate = swiper.maxTranslate();
		let newTranslate;
		if (
			((newTranslate =
				translateBounds && translate > minTranslate
					? minTranslate
					: translateBounds && translate < maxTranslate
					? maxTranslate
					: translate),
			swiper.updateProgress(newTranslate),
			params.cssMode)
		) {
			const isH = swiper.isHorizontal();
			if (0 === speed)
				wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
			else {
				if (!swiper.support.smoothScroll)
					return (
						animateCSSModeScroll({
							swiper: swiper,
							targetPosition: -newTranslate,
							side: isH ? "left" : "top",
						}),
						!0
					);
				wrapperEl.scrollTo({
					[isH ? "left" : "top"]: -newTranslate,
					behavior: "smooth",
				});
			}
			return !0;
		}
		return (
			0 === speed
				? (swiper.setTransition(0),
				  swiper.setTranslate(newTranslate),
				  runCallbacks &&
						(swiper.emit("beforeTransitionStart", speed, internal),
						swiper.emit("transitionEnd")))
				: (swiper.setTransition(speed),
				  swiper.setTranslate(newTranslate),
				  runCallbacks &&
						(swiper.emit("beforeTransitionStart", speed, internal),
						swiper.emit("transitionStart")),
				  swiper.animating ||
						((swiper.animating = !0),
						swiper.onTranslateToWrapperTransitionEnd ||
							(swiper.onTranslateToWrapperTransitionEnd =
								function transitionEnd(e) {
									swiper &&
										!swiper.destroyed &&
										e.target === this &&
										(swiper.wrapperEl.removeEventListener(
											"transitionend",
											swiper.onTranslateToWrapperTransitionEnd
										),
										(swiper.onTranslateToWrapperTransitionEnd = null),
										delete swiper.onTranslateToWrapperTransitionEnd,
										runCallbacks && swiper.emit("transitionEnd"));
								}),
						swiper.wrapperEl.addEventListener(
							"transitionend",
							swiper.onTranslateToWrapperTransitionEnd
						))),
			!0
		);
	}
	function setTransition(duration, byController) {
		const swiper = this;
		swiper.params.cssMode ||
			(swiper.wrapperEl.style.transitionDuration = `${duration}ms`),
			swiper.emit("setTransition", duration, byController);
	}
	function transitionEmit(_ref) {
		let {
			swiper: swiper,
			runCallbacks: runCallbacks,
			direction: direction,
			step: step,
		} = _ref;
		const { activeIndex: activeIndex, previousIndex: previousIndex } = swiper;
		let dir = direction;
		if (
			(dir ||
				(dir =
					activeIndex > previousIndex
						? "next"
						: activeIndex < previousIndex
						? "prev"
						: "reset"),
			swiper.emit(`transition${step}`),
			runCallbacks && activeIndex !== previousIndex)
		) {
			if ("reset" === dir)
				return void swiper.emit(`slideResetTransition${step}`);
			swiper.emit(`slideChangeTransition${step}`),
				"next" === dir
					? swiper.emit(`slideNextTransition${step}`)
					: swiper.emit(`slidePrevTransition${step}`);
		}
	}
	function transitionStart(runCallbacks, direction) {
		void 0 === runCallbacks && (runCallbacks = !0);
		const swiper = this,
			{ params: params } = swiper;
		params.cssMode ||
			(params.autoHeight && swiper.updateAutoHeight(),
			transitionEmit({
				swiper: swiper,
				runCallbacks: runCallbacks,
				direction: direction,
				step: "Start",
			}));
	}
	function transitionEnd(runCallbacks, direction) {
		void 0 === runCallbacks && (runCallbacks = !0);
		const swiper = this,
			{ params: params } = this;
		(this.animating = !1),
			params.cssMode ||
				(this.setTransition(0),
				transitionEmit({
					swiper: this,
					runCallbacks: runCallbacks,
					direction: direction,
					step: "End",
				}));
	}
	function slideTo(index, speed, runCallbacks, internal, initial) {
		void 0 === index && (index = 0),
			void 0 === speed && (speed = this.params.speed),
			void 0 === runCallbacks && (runCallbacks = !0),
			"string" == typeof index && (index = parseInt(index, 10));
		const swiper = this;
		let slideIndex = index;
		slideIndex < 0 && (slideIndex = 0);
		const {
			params: params,
			snapGrid: snapGrid,
			slidesGrid: slidesGrid,
			previousIndex: previousIndex,
			activeIndex: activeIndex,
			rtlTranslate: rtl,
			wrapperEl: wrapperEl,
			enabled: enabled,
		} = swiper;
		if (
			(swiper.animating && params.preventInteractionOnTransition) ||
			(!enabled && !internal && !initial)
		)
			return !1;
		const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
		let snapIndex =
			skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
		snapIndex >= snapGrid.length && (snapIndex = snapGrid.length - 1);
		const translate = -snapGrid[snapIndex];
		if (params.normalizeSlideIndex)
			for (let i = 0; i < slidesGrid.length; i += 1) {
				const normalizedTranslate = -Math.floor(100 * translate),
					normalizedGrid = Math.floor(100 * slidesGrid[i]),
					normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
				void 0 !== slidesGrid[i + 1]
					? normalizedTranslate >= normalizedGrid &&
					  normalizedTranslate <
							normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2
						? (slideIndex = i)
						: normalizedTranslate >= normalizedGrid &&
						  normalizedTranslate < normalizedGridNext &&
						  (slideIndex = i + 1)
					: normalizedTranslate >= normalizedGrid && (slideIndex = i);
			}
		if (swiper.initialized && slideIndex !== activeIndex) {
			if (
				!swiper.allowSlideNext &&
				(rtl
					? translate > swiper.translate && translate > swiper.minTranslate()
					: translate < swiper.translate && translate < swiper.minTranslate())
			)
				return !1;
			if (
				!swiper.allowSlidePrev &&
				translate > swiper.translate &&
				translate > swiper.maxTranslate() &&
				(activeIndex || 0) !== slideIndex
			)
				return !1;
		}
		let direction;
		if (
			(slideIndex !== (previousIndex || 0) &&
				runCallbacks &&
				swiper.emit("beforeSlideChangeStart"),
			swiper.updateProgress(translate),
			(direction =
				slideIndex > activeIndex
					? "next"
					: slideIndex < activeIndex
					? "prev"
					: "reset"),
			(rtl && -translate === swiper.translate) ||
				(!rtl && translate === swiper.translate))
		)
			return (
				swiper.updateActiveIndex(slideIndex),
				params.autoHeight && swiper.updateAutoHeight(),
				swiper.updateSlidesClasses(),
				"slide" !== params.effect && swiper.setTranslate(translate),
				"reset" !== direction &&
					(swiper.transitionStart(runCallbacks, direction),
					swiper.transitionEnd(runCallbacks, direction)),
				!1
			);
		if (params.cssMode) {
			const isH = swiper.isHorizontal(),
				t = rtl ? translate : -translate;
			if (0 === speed) {
				const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
				isVirtual &&
					((swiper.wrapperEl.style.scrollSnapType = "none"),
					(swiper._immediateVirtual = !0)),
					isVirtual &&
					!swiper._cssModeVirtualInitialSet &&
					swiper.params.initialSlide > 0
						? ((swiper._cssModeVirtualInitialSet = !0),
						  requestAnimationFrame(() => {
								wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
						  }))
						: (wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t),
					isVirtual &&
						requestAnimationFrame(() => {
							(swiper.wrapperEl.style.scrollSnapType = ""),
								(swiper._immediateVirtual = !1);
						});
			} else {
				if (!swiper.support.smoothScroll)
					return (
						animateCSSModeScroll({
							swiper: swiper,
							targetPosition: t,
							side: isH ? "left" : "top",
						}),
						!0
					);
				wrapperEl.scrollTo({ [isH ? "left" : "top"]: t, behavior: "smooth" });
			}
			return !0;
		}
		return (
			swiper.setTransition(speed),
			swiper.setTranslate(translate),
			swiper.updateActiveIndex(slideIndex),
			swiper.updateSlidesClasses(),
			swiper.emit("beforeTransitionStart", speed, internal),
			swiper.transitionStart(runCallbacks, direction),
			0 === speed
				? swiper.transitionEnd(runCallbacks, direction)
				: swiper.animating ||
				  ((swiper.animating = !0),
				  swiper.onSlideToWrapperTransitionEnd ||
						(swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
							swiper &&
								!swiper.destroyed &&
								e.target === this &&
								(swiper.wrapperEl.removeEventListener(
									"transitionend",
									swiper.onSlideToWrapperTransitionEnd
								),
								(swiper.onSlideToWrapperTransitionEnd = null),
								delete swiper.onSlideToWrapperTransitionEnd,
								swiper.transitionEnd(runCallbacks, direction));
						}),
				  swiper.wrapperEl.addEventListener(
						"transitionend",
						swiper.onSlideToWrapperTransitionEnd
				  )),
			!0
		);
	}
	function slideToLoop(index, speed, runCallbacks, internal) {
		if (
			(void 0 === index && (index = 0),
			void 0 === speed && (speed = this.params.speed),
			void 0 === runCallbacks && (runCallbacks = !0),
			"string" == typeof index)
		) {
			const indexAsNumber = parseInt(index, 10);
			index = indexAsNumber;
		}
		const swiper = this;
		let newIndex = index;
		return (
			swiper.params.loop &&
				(swiper.virtual && swiper.params.virtual.enabled
					? (newIndex += swiper.virtual.slidesBefore)
					: (newIndex = swiper.getSlideIndexByData(newIndex))),
			swiper.slideTo(newIndex, speed, runCallbacks, internal)
		);
	}
	function slideNext(speed, runCallbacks, internal) {
		void 0 === speed && (speed = this.params.speed),
			void 0 === runCallbacks && (runCallbacks = !0);
		const swiper = this,
			{ enabled: enabled, params: params, animating: animating } = swiper;
		if (!enabled) return swiper;
		let perGroup = params.slidesPerGroup;
		"auto" === params.slidesPerView &&
			1 === params.slidesPerGroup &&
			params.slidesPerGroupAuto &&
			(perGroup = Math.max(swiper.slidesPerViewDynamic("current", !0), 1));
		const increment =
				swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup,
			isVirtual = swiper.virtual && params.virtual.enabled;
		if (params.loop) {
			if (animating && !isVirtual && params.loopPreventsSliding) return !1;
			swiper.loopFix({ direction: "next" }),
				(swiper._clientLeft = swiper.wrapperEl.clientLeft);
		}
		return params.rewind && swiper.isEnd
			? swiper.slideTo(0, speed, runCallbacks, internal)
			: swiper.slideTo(
					swiper.activeIndex + increment,
					speed,
					runCallbacks,
					internal
			  );
	}
	function slidePrev(speed, runCallbacks, internal) {
		void 0 === speed && (speed = this.params.speed),
			void 0 === runCallbacks && (runCallbacks = !0);
		const swiper = this,
			{
				params: params,
				snapGrid: snapGrid,
				slidesGrid: slidesGrid,
				rtlTranslate: rtlTranslate,
				enabled: enabled,
				animating: animating,
			} = swiper;
		if (!enabled) return swiper;
		const isVirtual = swiper.virtual && params.virtual.enabled;
		if (params.loop) {
			if (animating && !isVirtual && params.loopPreventsSliding) return !1;
			swiper.loopFix({ direction: "prev" }),
				(swiper._clientLeft = swiper.wrapperEl.clientLeft);
		}
		const translate = rtlTranslate ? swiper.translate : -swiper.translate;
		function normalize(val) {
			return val < 0 ? -Math.floor(Math.abs(val)) : Math.floor(val);
		}
		const normalizedTranslate = normalize(translate),
			normalizedSnapGrid = snapGrid.map((val) => normalize(val));
		let prevSnap =
			snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
		if (void 0 === prevSnap && params.cssMode) {
			let prevSnapIndex;
			snapGrid.forEach((snap, snapIndex) => {
				normalizedTranslate >= snap && (prevSnapIndex = snapIndex);
			}),
				void 0 !== prevSnapIndex &&
					(prevSnap =
						snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex]);
		}
		let prevIndex = 0;
		if (
			(void 0 !== prevSnap &&
				((prevIndex = slidesGrid.indexOf(prevSnap)),
				prevIndex < 0 && (prevIndex = swiper.activeIndex - 1),
				"auto" === params.slidesPerView &&
					1 === params.slidesPerGroup &&
					params.slidesPerGroupAuto &&
					((prevIndex =
						prevIndex - swiper.slidesPerViewDynamic("previous", !0) + 1),
					(prevIndex = Math.max(prevIndex, 0)))),
			params.rewind && swiper.isBeginning)
		) {
			const lastIndex =
				swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual
					? swiper.virtual.slides.length - 1
					: swiper.slides.length - 1;
			return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
		}
		return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
	}
	function slideReset(speed, runCallbacks, internal) {
		void 0 === speed && (speed = this.params.speed),
			void 0 === runCallbacks && (runCallbacks = !0);
		const swiper = this;
		return this.slideTo(this.activeIndex, speed, runCallbacks, internal);
	}
	function slideToClosest(speed, runCallbacks, internal, threshold) {
		void 0 === speed && (speed = this.params.speed),
			void 0 === runCallbacks && (runCallbacks = !0),
			void 0 === threshold && (threshold = 0.5);
		const swiper = this;
		let index = swiper.activeIndex;
		const skip = Math.min(swiper.params.slidesPerGroupSkip, index),
			snapIndex =
				skip + Math.floor((index - skip) / swiper.params.slidesPerGroup),
			translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
		if (translate >= swiper.snapGrid[snapIndex]) {
			const currentSnap = swiper.snapGrid[snapIndex],
				nextSnap = swiper.snapGrid[snapIndex + 1];
			translate - currentSnap > (nextSnap - currentSnap) * threshold &&
				(index += swiper.params.slidesPerGroup);
		} else {
			const prevSnap = swiper.snapGrid[snapIndex - 1],
				currentSnap = swiper.snapGrid[snapIndex];
			translate - prevSnap <= (currentSnap - prevSnap) * threshold &&
				(index -= swiper.params.slidesPerGroup);
		}
		return (
			(index = Math.max(index, 0)),
			(index = Math.min(index, swiper.slidesGrid.length - 1)),
			swiper.slideTo(index, speed, runCallbacks, internal)
		);
	}
	function slideToClickedSlide() {
		const swiper = this,
			{ params: params, slidesEl: slidesEl } = swiper,
			slidesPerView =
				"auto" === params.slidesPerView
					? swiper.slidesPerViewDynamic()
					: params.slidesPerView;
		let slideToIndex = swiper.clickedIndex,
			realIndex;
		const slideSelector = swiper.isElement
			? "swiper-slide"
			: `.${params.slideClass}`;
		if (params.loop) {
			if (swiper.animating) return;
			(realIndex = parseInt(
				swiper.clickedSlide.getAttribute("data-swiper-slide-index"),
				10
			)),
				params.centeredSlides
					? slideToIndex < swiper.loopedSlides - slidesPerView / 2 ||
					  slideToIndex >
							swiper.slides.length - swiper.loopedSlides + slidesPerView / 2
						? (swiper.loopFix(),
						  (slideToIndex = swiper.getSlideIndex(
								elementChildren(
									slidesEl,
									`${slideSelector}[data-swiper-slide-index="${realIndex}"]`
								)[0]
						  )),
						  nextTick(() => {
								swiper.slideTo(slideToIndex);
						  }))
						: swiper.slideTo(slideToIndex)
					: slideToIndex > swiper.slides.length - slidesPerView
					? (swiper.loopFix(),
					  (slideToIndex = swiper.getSlideIndex(
							elementChildren(
								slidesEl,
								`${slideSelector}[data-swiper-slide-index="${realIndex}"]`
							)[0]
					  )),
					  nextTick(() => {
							swiper.slideTo(slideToIndex);
					  }))
					: swiper.slideTo(slideToIndex);
		} else swiper.slideTo(slideToIndex);
	}
	function loopCreate(slideRealIndex) {
		const swiper = this,
			{ params: params, slidesEl: slidesEl } = this;
		if (!params.loop || (this.virtual && this.params.virtual.enabled)) return;
		const slides = elementChildren(
			slidesEl,
			`.${params.slideClass}, swiper-slide`
		);
		slides.forEach((el, index) => {
			el.setAttribute("data-swiper-slide-index", index);
		}),
			this.loopFix({
				slideRealIndex: slideRealIndex,
				direction: params.centeredSlides ? void 0 : "next",
			});
	}
	function loopFix(_temp) {
		let {
			slideRealIndex: slideRealIndex,
			slideTo: slideTo = !0,
			direction: direction,
			setTranslate: setTranslate,
			activeSlideIndex: activeSlideIndex,
			byController: byController,
			byMousewheel: byMousewheel,
		} = void 0 === _temp ? {} : _temp;
		const swiper = this;
		if (!swiper.params.loop) return;
		swiper.emit("beforeLoopFix");
		const {
			slides: slides,
			allowSlidePrev: allowSlidePrev,
			allowSlideNext: allowSlideNext,
			slidesEl: slidesEl,
			params: params,
		} = swiper;
		if (
			((swiper.allowSlidePrev = !0),
			(swiper.allowSlideNext = !0),
			swiper.virtual && params.virtual.enabled)
		)
			return (
				slideTo &&
					(params.centeredSlides || 0 !== swiper.snapIndex
						? params.centeredSlides && swiper.snapIndex < params.slidesPerView
							? swiper.slideTo(
									swiper.virtual.slides.length + swiper.snapIndex,
									0,
									!1,
									!0
							  )
							: swiper.snapIndex === swiper.snapGrid.length - 1 &&
							  swiper.slideTo(swiper.virtual.slidesBefore, 0, !1, !0)
						: swiper.slideTo(swiper.virtual.slides.length, 0, !1, !0)),
				(swiper.allowSlidePrev = allowSlidePrev),
				(swiper.allowSlideNext = allowSlideNext),
				void swiper.emit("loopFix")
			);
		const slidesPerView =
			"auto" === params.slidesPerView
				? swiper.slidesPerViewDynamic()
				: Math.ceil(parseFloat(params.slidesPerView, 10));
		let loopedSlides = params.loopedSlides || slidesPerView;
		loopedSlides % params.slidesPerGroup != 0 &&
			(loopedSlides +=
				params.slidesPerGroup - (loopedSlides % params.slidesPerGroup)),
			(swiper.loopedSlides = loopedSlides);
		const prependSlidesIndexes = [],
			appendSlidesIndexes = [];
		let activeIndex = swiper.activeIndex;
		void 0 === activeSlideIndex
			? (activeSlideIndex = swiper.getSlideIndex(
					swiper.slides.filter((el) =>
						el.classList.contains(params.slideActiveClass)
					)[0]
			  ))
			: (activeIndex = activeSlideIndex);
		const isNext = "next" === direction || !direction,
			isPrev = "prev" === direction || !direction;
		let slidesPrepended = 0,
			slidesAppended = 0;
		if (activeSlideIndex < loopedSlides) {
			slidesPrepended = Math.max(
				loopedSlides - activeSlideIndex,
				params.slidesPerGroup
			);
			for (let i = 0; i < loopedSlides - activeSlideIndex; i += 1) {
				const index = i - Math.floor(i / slides.length) * slides.length;
				prependSlidesIndexes.push(slides.length - index - 1);
			}
		} else if (activeSlideIndex > swiper.slides.length - 2 * loopedSlides) {
			slidesAppended = Math.max(
				activeSlideIndex - (swiper.slides.length - 2 * loopedSlides),
				params.slidesPerGroup
			);
			for (let i = 0; i < slidesAppended; i += 1) {
				const index = i - Math.floor(i / slides.length) * slides.length;
				appendSlidesIndexes.push(index);
			}
		}
		if (
			(isPrev &&
				prependSlidesIndexes.forEach((index) => {
					(swiper.slides[index].swiperLoopMoveDOM = !0),
						slidesEl.prepend(swiper.slides[index]),
						(swiper.slides[index].swiperLoopMoveDOM = !1);
				}),
			isNext &&
				appendSlidesIndexes.forEach((index) => {
					(swiper.slides[index].swiperLoopMoveDOM = !0),
						slidesEl.append(swiper.slides[index]),
						(swiper.slides[index].swiperLoopMoveDOM = !1);
				}),
			swiper.recalcSlides(),
			"auto" === params.slidesPerView && swiper.updateSlides(),
			params.watchSlidesProgress && swiper.updateSlidesOffset(),
			slideTo)
		)
			if (prependSlidesIndexes.length > 0 && isPrev)
				if (void 0 === slideRealIndex) {
					const currentSlideTranslate = swiper.slidesGrid[activeIndex],
						newSlideTranslate =
							swiper.slidesGrid[activeIndex + slidesPrepended],
						diff = newSlideTranslate - currentSlideTranslate;
					byMousewheel
						? swiper.setTranslate(swiper.translate - diff)
						: (swiper.slideTo(activeIndex + slidesPrepended, 0, !1, !0),
						  setTranslate &&
								(swiper.touches[swiper.isHorizontal() ? "startX" : "startY"] +=
									diff));
				} else setTranslate && swiper.slideToLoop(slideRealIndex, 0, !1, !0);
			else if (appendSlidesIndexes.length > 0 && isNext)
				if (void 0 === slideRealIndex) {
					const currentSlideTranslate = swiper.slidesGrid[activeIndex],
						newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended],
						diff = newSlideTranslate - currentSlideTranslate;
					byMousewheel
						? swiper.setTranslate(swiper.translate - diff)
						: (swiper.slideTo(activeIndex - slidesAppended, 0, !1, !0),
						  setTranslate &&
								(swiper.touches[swiper.isHorizontal() ? "startX" : "startY"] +=
									diff));
				} else swiper.slideToLoop(slideRealIndex, 0, !1, !0);
		if (
			((swiper.allowSlidePrev = allowSlidePrev),
			(swiper.allowSlideNext = allowSlideNext),
			swiper.controller && swiper.controller.control && !byController)
		) {
			const loopParams = {
				slideRealIndex: slideRealIndex,
				slideTo: !1,
				direction: direction,
				setTranslate: setTranslate,
				activeSlideIndex: activeSlideIndex,
				byController: !0,
			};
			Array.isArray(swiper.controller.control)
				? swiper.controller.control.forEach((c) => {
						!c.destroyed && c.params.loop && c.loopFix(loopParams);
				  })
				: swiper.controller.control instanceof swiper.constructor &&
				  swiper.controller.control.params.loop &&
				  swiper.controller.control.loopFix(loopParams);
		}
		swiper.emit("loopFix");
	}
	function loopDestroy() {
		const swiper = this,
			{ params: params, slidesEl: slidesEl } = this;
		if (!params.loop || (this.virtual && this.params.virtual.enabled)) return;
		this.recalcSlides();
		const newSlidesOrder = [];
		this.slides.forEach((slideEl) => {
			const index =
				void 0 === slideEl.swiperSlideIndex
					? 1 * slideEl.getAttribute("data-swiper-slide-index")
					: slideEl.swiperSlideIndex;
			newSlidesOrder[index] = slideEl;
		}),
			this.slides.forEach((slideEl) => {
				slideEl.removeAttribute("data-swiper-slide-index");
			}),
			newSlidesOrder.forEach((slideEl) => {
				slidesEl.append(slideEl);
			}),
			this.recalcSlides(),
			this.slideTo(this.realIndex, 0);
	}
	function setGrabCursor(moving) {
		const swiper = this;
		if (
			!swiper.params.simulateTouch ||
			(swiper.params.watchOverflow && swiper.isLocked) ||
			swiper.params.cssMode
		)
			return;
		const el =
			"container" === swiper.params.touchEventsTarget
				? swiper.el
				: swiper.wrapperEl;
		swiper.isElement && (swiper.__preventObserver__ = !0),
			(el.style.cursor = "move"),
			(el.style.cursor = moving ? "grabbing" : "grab"),
			swiper.isElement &&
				requestAnimationFrame(() => {
					swiper.__preventObserver__ = !1;
				});
	}
	function unsetGrabCursor() {
		const swiper = this;
		(swiper.params.watchOverflow && swiper.isLocked) ||
			swiper.params.cssMode ||
			(swiper.isElement && (swiper.__preventObserver__ = !0),
			(swiper[
				"container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"
			].style.cursor = ""),
			swiper.isElement &&
				requestAnimationFrame(() => {
					swiper.__preventObserver__ = !1;
				}));
	}
	function closestElement(selector, base) {
		function __closestFrom(el) {
			if (!el || el === getDocument() || el === getWindow()) return null;
			el.assignedSlot && (el = el.assignedSlot);
			const found = el.closest(selector);
			return found || el.getRootNode
				? found || __closestFrom(el.getRootNode().host)
				: null;
		}
		return void 0 === base && (base = this), __closestFrom(base);
	}
	function onTouchStart(event) {
		const swiper = this,
			document = getDocument(),
			window = getWindow(),
			data = swiper.touchEventsData;
		data.evCache.push(event);
		const { params: params, touches: touches, enabled: enabled } = swiper;
		if (!enabled) return;
		if (!params.simulateTouch && "mouse" === event.pointerType) return;
		if (swiper.animating && params.preventInteractionOnTransition) return;
		!swiper.animating && params.cssMode && params.loop && swiper.loopFix();
		let e = event;
		e.originalEvent && (e = e.originalEvent);
		let targetEl = e.target;
		if (
			"wrapper" === params.touchEventsTarget &&
			!swiper.wrapperEl.contains(targetEl)
		)
			return;
		if ("which" in e && 3 === e.which) return;
		if ("button" in e && e.button > 0) return;
		if (data.isTouched && data.isMoved) return;
		const swipingClassHasValue =
				!!params.noSwipingClass && "" !== params.noSwipingClass,
			eventPath = event.composedPath ? event.composedPath() : event.path;
		swipingClassHasValue &&
			e.target &&
			e.target.shadowRoot &&
			eventPath &&
			(targetEl = eventPath[0]);
		const noSwipingSelector = params.noSwipingSelector
				? params.noSwipingSelector
				: `.${params.noSwipingClass}`,
			isTargetShadow = !(!e.target || !e.target.shadowRoot);
		if (
			params.noSwiping &&
			(isTargetShadow
				? closestElement(noSwipingSelector, targetEl)
				: targetEl.closest(noSwipingSelector))
		)
			return void (swiper.allowClick = !0);
		if (params.swipeHandler && !targetEl.closest(params.swipeHandler)) return;
		(touches.currentX = e.pageX), (touches.currentY = e.pageY);
		const startX = touches.currentX,
			startY = touches.currentY,
			edgeSwipeDetection =
				params.edgeSwipeDetection || params.iOSEdgeSwipeDetection,
			edgeSwipeThreshold =
				params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
		if (
			edgeSwipeDetection &&
			(startX <= edgeSwipeThreshold ||
				startX >= window.innerWidth - edgeSwipeThreshold)
		) {
			if ("prevent" !== edgeSwipeDetection) return;
			event.preventDefault();
		}
		Object.assign(data, {
			isTouched: !0,
			isMoved: !1,
			allowTouchCallbacks: !0,
			isScrolling: void 0,
			startMoving: void 0,
		}),
			(touches.startX = startX),
			(touches.startY = startY),
			(data.touchStartTime = now()),
			(swiper.allowClick = !0),
			swiper.updateSize(),
			(swiper.swipeDirection = void 0),
			params.threshold > 0 && (data.allowThresholdMove = !1);
		let preventDefault = !0;
		targetEl.matches(data.focusableElements) &&
			((preventDefault = !1),
			"SELECT" === targetEl.nodeName && (data.isTouched = !1)),
			document.activeElement &&
				document.activeElement.matches(data.focusableElements) &&
				document.activeElement !== targetEl &&
				document.activeElement.blur();
		const shouldPreventDefault =
			preventDefault &&
			swiper.allowTouchMove &&
			params.touchStartPreventDefault;
		(!params.touchStartForcePreventDefault && !shouldPreventDefault) ||
			targetEl.isContentEditable ||
			e.preventDefault(),
			params.freeMode &&
				params.freeMode.enabled &&
				swiper.freeMode &&
				swiper.animating &&
				!params.cssMode &&
				swiper.freeMode.onTouchStart(),
			swiper.emit("touchStart", e);
	}
	function onTouchMove(event) {
		const document = getDocument(),
			swiper = this,
			data = swiper.touchEventsData,
			{
				params: params,
				touches: touches,
				rtlTranslate: rtl,
				enabled: enabled,
			} = swiper;
		if (!enabled) return;
		if (!params.simulateTouch && "mouse" === event.pointerType) return;
		let e = event;
		if ((e.originalEvent && (e = e.originalEvent), !data.isTouched))
			return void (
				data.startMoving &&
				data.isScrolling &&
				swiper.emit("touchMoveOpposite", e)
			);
		const pointerIndex = data.evCache.findIndex(
			(cachedEv) => cachedEv.pointerId === e.pointerId
		);
		pointerIndex >= 0 && (data.evCache[pointerIndex] = e);
		const targetTouch = data.evCache.length > 1 ? data.evCache[0] : e,
			pageX = targetTouch.pageX,
			pageY = targetTouch.pageY;
		if (e.preventedByNestedSwiper)
			return (touches.startX = pageX), void (touches.startY = pageY);
		if (!swiper.allowTouchMove)
			return (
				e.target.matches(data.focusableElements) || (swiper.allowClick = !1),
				void (
					data.isTouched &&
					(Object.assign(touches, {
						startX: pageX,
						startY: pageY,
						prevX: swiper.touches.currentX,
						prevY: swiper.touches.currentY,
						currentX: pageX,
						currentY: pageY,
					}),
					(data.touchStartTime = now()))
				)
			);
		if (params.touchReleaseOnEdges && !params.loop)
			if (swiper.isVertical()) {
				if (
					(pageY < touches.startY &&
						swiper.translate <= swiper.maxTranslate()) ||
					(pageY > touches.startY && swiper.translate >= swiper.minTranslate())
				)
					return (data.isTouched = !1), void (data.isMoved = !1);
			} else if (
				(pageX < touches.startX && swiper.translate <= swiper.maxTranslate()) ||
				(pageX > touches.startX && swiper.translate >= swiper.minTranslate())
			)
				return;
		if (
			document.activeElement &&
			e.target === document.activeElement &&
			e.target.matches(data.focusableElements)
		)
			return (data.isMoved = !0), void (swiper.allowClick = !1);
		if (
			(data.allowTouchCallbacks && swiper.emit("touchMove", e),
			e.targetTouches && e.targetTouches.length > 1)
		)
			return;
		(touches.currentX = pageX), (touches.currentY = pageY);
		const diffX = touches.currentX - touches.startX,
			diffY = touches.currentY - touches.startY;
		if (
			swiper.params.threshold &&
			Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold
		)
			return;
		if (void 0 === data.isScrolling) {
			let touchAngle;
			(swiper.isHorizontal() && touches.currentY === touches.startY) ||
			(swiper.isVertical() && touches.currentX === touches.startX)
				? (data.isScrolling = !1)
				: diffX * diffX + diffY * diffY >= 25 &&
				  ((touchAngle =
						(180 * Math.atan2(Math.abs(diffY), Math.abs(diffX))) / Math.PI),
				  (data.isScrolling = swiper.isHorizontal()
						? touchAngle > params.touchAngle
						: 90 - touchAngle > params.touchAngle));
		}
		if (
			(data.isScrolling && swiper.emit("touchMoveOpposite", e),
			void 0 === data.startMoving &&
				((touches.currentX === touches.startX &&
					touches.currentY === touches.startY) ||
					(data.startMoving = !0)),
			data.isScrolling ||
				(swiper.zoom &&
					swiper.params.zoom &&
					swiper.params.zoom.enabled &&
					data.evCache.length > 1))
		)
			return void (data.isTouched = !1);
		if (!data.startMoving) return;
		(swiper.allowClick = !1),
			!params.cssMode && e.cancelable && e.preventDefault(),
			params.touchMoveStopPropagation && !params.nested && e.stopPropagation();
		let diff = swiper.isHorizontal() ? diffX : diffY,
			touchesDiff = swiper.isHorizontal()
				? touches.currentX - touches.previousX
				: touches.currentY - touches.previousY;
		params.oneWayMovement &&
			((diff = Math.abs(diff) * (rtl ? 1 : -1)),
			(touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1))),
			(touches.diff = diff),
			(diff *= params.touchRatio),
			rtl && ((diff = -diff), (touchesDiff = -touchesDiff));
		const prevTouchesDirection = swiper.touchesDirection;
		(swiper.swipeDirection = diff > 0 ? "prev" : "next"),
			(swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next");
		const isLoop = swiper.params.loop && !params.cssMode;
		if (!data.isMoved) {
			if (
				(isLoop && swiper.loopFix({ direction: swiper.swipeDirection }),
				(data.startTranslate = swiper.getTranslate()),
				swiper.setTransition(0),
				swiper.animating)
			) {
				const evt = new window.CustomEvent("transitionend", {
					bubbles: !0,
					cancelable: !0,
				});
				swiper.wrapperEl.dispatchEvent(evt);
			}
			(data.allowMomentumBounce = !1),
				!params.grabCursor ||
					(!0 !== swiper.allowSlideNext && !0 !== swiper.allowSlidePrev) ||
					swiper.setGrabCursor(!0),
				swiper.emit("sliderFirstMove", e);
		}
		let loopFixed;
		data.isMoved &&
			prevTouchesDirection !== swiper.touchesDirection &&
			isLoop &&
			Math.abs(diff) >= 1 &&
			(swiper.loopFix({ direction: swiper.swipeDirection, setTranslate: !0 }),
			(loopFixed = !0)),
			swiper.emit("sliderMove", e),
			(data.isMoved = !0),
			(data.currentTranslate = diff + data.startTranslate);
		let disableParentSwiper = !0,
			resistanceRatio = params.resistanceRatio;
		if (
			(params.touchReleaseOnEdges && (resistanceRatio = 0),
			diff > 0
				? (isLoop &&
						!loopFixed &&
						data.currentTranslate >
							(params.centeredSlides
								? swiper.minTranslate() - swiper.size / 2
								: swiper.minTranslate()) &&
						swiper.loopFix({
							direction: "prev",
							setTranslate: !0,
							activeSlideIndex: 0,
						}),
				  data.currentTranslate > swiper.minTranslate() &&
						((disableParentSwiper = !1),
						params.resistance &&
							(data.currentTranslate =
								swiper.minTranslate() -
								1 +
								(-swiper.minTranslate() + data.startTranslate + diff) **
									resistanceRatio)))
				: diff < 0 &&
				  (isLoop &&
						!loopFixed &&
						data.currentTranslate <
							(params.centeredSlides
								? swiper.maxTranslate() + swiper.size / 2
								: swiper.maxTranslate()) &&
						swiper.loopFix({
							direction: "next",
							setTranslate: !0,
							activeSlideIndex:
								swiper.slides.length -
								("auto" === params.slidesPerView
									? swiper.slidesPerViewDynamic()
									: Math.ceil(parseFloat(params.slidesPerView, 10))),
						}),
				  data.currentTranslate < swiper.maxTranslate() &&
						((disableParentSwiper = !1),
						params.resistance &&
							(data.currentTranslate =
								swiper.maxTranslate() +
								1 -
								(swiper.maxTranslate() - data.startTranslate - diff) **
									resistanceRatio))),
			disableParentSwiper && (e.preventedByNestedSwiper = !0),
			!swiper.allowSlideNext &&
				"next" === swiper.swipeDirection &&
				data.currentTranslate < data.startTranslate &&
				(data.currentTranslate = data.startTranslate),
			!swiper.allowSlidePrev &&
				"prev" === swiper.swipeDirection &&
				data.currentTranslate > data.startTranslate &&
				(data.currentTranslate = data.startTranslate),
			swiper.allowSlidePrev ||
				swiper.allowSlideNext ||
				(data.currentTranslate = data.startTranslate),
			params.threshold > 0)
		) {
			if (!(Math.abs(diff) > params.threshold || data.allowThresholdMove))
				return void (data.currentTranslate = data.startTranslate);
			if (!data.allowThresholdMove)
				return (
					(data.allowThresholdMove = !0),
					(touches.startX = touches.currentX),
					(touches.startY = touches.currentY),
					(data.currentTranslate = data.startTranslate),
					void (touches.diff = swiper.isHorizontal()
						? touches.currentX - touches.startX
						: touches.currentY - touches.startY)
				);
		}
		params.followFinger &&
			!params.cssMode &&
			(((params.freeMode && params.freeMode.enabled && swiper.freeMode) ||
				params.watchSlidesProgress) &&
				(swiper.updateActiveIndex(), swiper.updateSlidesClasses()),
			params.freeMode &&
				params.freeMode.enabled &&
				swiper.freeMode &&
				swiper.freeMode.onTouchMove(),
			swiper.updateProgress(data.currentTranslate),
			swiper.setTranslate(data.currentTranslate));
	}
	function onTouchEnd(event) {
		const swiper = this,
			data = swiper.touchEventsData,
			pointerIndex = data.evCache.findIndex(
				(cachedEv) => cachedEv.pointerId === event.pointerId
			);
		if (
			(pointerIndex >= 0 && data.evCache.splice(pointerIndex, 1),
			["pointercancel", "pointerout", "pointerleave"].includes(event.type))
		) {
			const proceed =
				"pointercancel" === event.type &&
				(swiper.browser.isSafari || swiper.browser.isWebView);
			if (!proceed) return;
		}
		const {
			params: params,
			touches: touches,
			rtlTranslate: rtl,
			slidesGrid: slidesGrid,
			enabled: enabled,
		} = swiper;
		if (!enabled) return;
		if (!params.simulateTouch && "mouse" === event.pointerType) return;
		let e = event;
		if (
			(e.originalEvent && (e = e.originalEvent),
			data.allowTouchCallbacks && swiper.emit("touchEnd", e),
			(data.allowTouchCallbacks = !1),
			!data.isTouched)
		)
			return (
				data.isMoved && params.grabCursor && swiper.setGrabCursor(!1),
				(data.isMoved = !1),
				void (data.startMoving = !1)
			);
		params.grabCursor &&
			data.isMoved &&
			data.isTouched &&
			(!0 === swiper.allowSlideNext || !0 === swiper.allowSlidePrev) &&
			swiper.setGrabCursor(!1);
		const touchEndTime = now(),
			timeDiff = touchEndTime - data.touchStartTime;
		if (swiper.allowClick) {
			const pathTree = e.path || (e.composedPath && e.composedPath());
			swiper.updateClickedSlide((pathTree && pathTree[0]) || e.target),
				swiper.emit("tap click", e),
				timeDiff < 300 &&
					touchEndTime - data.lastClickTime < 300 &&
					swiper.emit("doubleTap doubleClick", e);
		}
		if (
			((data.lastClickTime = now()),
			nextTick(() => {
				swiper.destroyed || (swiper.allowClick = !0);
			}),
			!data.isTouched ||
				!data.isMoved ||
				!swiper.swipeDirection ||
				0 === touches.diff ||
				data.currentTranslate === data.startTranslate)
		)
			return (
				(data.isTouched = !1), (data.isMoved = !1), void (data.startMoving = !1)
			);
		let currentPos;
		if (
			((data.isTouched = !1),
			(data.isMoved = !1),
			(data.startMoving = !1),
			(currentPos = params.followFinger
				? rtl
					? swiper.translate
					: -swiper.translate
				: -data.currentTranslate),
			params.cssMode)
		)
			return;
		if (params.freeMode && params.freeMode.enabled)
			return void swiper.freeMode.onTouchEnd({ currentPos: currentPos });
		let stopIndex = 0,
			groupSize = swiper.slidesSizesGrid[0];
		for (
			let i = 0;
			i < slidesGrid.length;
			i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup
		) {
			const increment =
				i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
			void 0 !== slidesGrid[i + increment]
				? currentPos >= slidesGrid[i] &&
				  currentPos < slidesGrid[i + increment] &&
				  ((stopIndex = i),
				  (groupSize = slidesGrid[i + increment] - slidesGrid[i]))
				: currentPos >= slidesGrid[i] &&
				  ((stopIndex = i),
				  (groupSize =
						slidesGrid[slidesGrid.length - 1] -
						slidesGrid[slidesGrid.length - 2]));
		}
		let rewindFirstIndex = null,
			rewindLastIndex = null;
		params.rewind &&
			(swiper.isBeginning
				? (rewindLastIndex =
						params.virtual && params.virtual.enabled && swiper.virtual
							? swiper.virtual.slides.length - 1
							: swiper.slides.length - 1)
				: swiper.isEnd && (rewindFirstIndex = 0));
		const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize,
			increment =
				stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
		if (timeDiff > params.longSwipesMs) {
			if (!params.longSwipes) return void swiper.slideTo(swiper.activeIndex);
			"next" === swiper.swipeDirection &&
				(ratio >= params.longSwipesRatio
					? swiper.slideTo(
							params.rewind && swiper.isEnd
								? rewindFirstIndex
								: stopIndex + increment
					  )
					: swiper.slideTo(stopIndex)),
				"prev" === swiper.swipeDirection &&
					(ratio > 1 - params.longSwipesRatio
						? swiper.slideTo(stopIndex + increment)
						: null !== rewindLastIndex &&
						  ratio < 0 &&
						  Math.abs(ratio) > params.longSwipesRatio
						? swiper.slideTo(rewindLastIndex)
						: swiper.slideTo(stopIndex));
		} else {
			if (!params.shortSwipes) return void swiper.slideTo(swiper.activeIndex);
			const isNavButtonTarget =
				swiper.navigation &&
				(e.target === swiper.navigation.nextEl ||
					e.target === swiper.navigation.prevEl);
			isNavButtonTarget
				? e.target === swiper.navigation.nextEl
					? swiper.slideTo(stopIndex + increment)
					: swiper.slideTo(stopIndex)
				: ("next" === swiper.swipeDirection &&
						swiper.slideTo(
							null !== rewindFirstIndex
								? rewindFirstIndex
								: stopIndex + increment
						),
				  "prev" === swiper.swipeDirection &&
						swiper.slideTo(
							null !== rewindLastIndex ? rewindLastIndex : stopIndex
						));
		}
	}
	function onResize() {
		const swiper = this,
			{ params: params, el: el } = swiper;
		if (el && 0 === el.offsetWidth) return;
		params.breakpoints && swiper.setBreakpoint();
		const {
				allowSlideNext: allowSlideNext,
				allowSlidePrev: allowSlidePrev,
				snapGrid: snapGrid,
			} = swiper,
			isVirtual = swiper.virtual && swiper.params.virtual.enabled;
		(swiper.allowSlideNext = !0),
			(swiper.allowSlidePrev = !0),
			swiper.updateSize(),
			swiper.updateSlides(),
			swiper.updateSlidesClasses();
		const isVirtualLoop = isVirtual && params.loop;
		!("auto" === params.slidesPerView || params.slidesPerView > 1) ||
		!swiper.isEnd ||
		swiper.isBeginning ||
		swiper.params.centeredSlides ||
		isVirtualLoop
			? swiper.params.loop && !isVirtual
				? swiper.slideToLoop(swiper.realIndex, 0, !1, !0)
				: swiper.slideTo(swiper.activeIndex, 0, !1, !0)
			: swiper.slideTo(swiper.slides.length - 1, 0, !1, !0),
			swiper.autoplay &&
				swiper.autoplay.running &&
				swiper.autoplay.paused &&
				(clearTimeout(swiper.autoplay.resizeTimeout),
				(swiper.autoplay.resizeTimeout = setTimeout(() => {
					swiper.autoplay &&
						swiper.autoplay.running &&
						swiper.autoplay.paused &&
						swiper.autoplay.resume();
				}, 500))),
			(swiper.allowSlidePrev = allowSlidePrev),
			(swiper.allowSlideNext = allowSlideNext),
			swiper.params.watchOverflow &&
				snapGrid !== swiper.snapGrid &&
				swiper.checkOverflow();
	}
	function onClick(e) {
		const swiper = this;
		swiper.enabled &&
			(swiper.allowClick ||
				(swiper.params.preventClicks && e.preventDefault(),
				swiper.params.preventClicksPropagation &&
					swiper.animating &&
					(e.stopPropagation(), e.stopImmediatePropagation())));
	}
	function onScroll() {
		const swiper = this,
			{
				wrapperEl: wrapperEl,
				rtlTranslate: rtlTranslate,
				enabled: enabled,
			} = swiper;
		if (!enabled) return;
		let newProgress;
		(swiper.previousTranslate = swiper.translate),
			swiper.isHorizontal()
				? (swiper.translate = -wrapperEl.scrollLeft)
				: (swiper.translate = -wrapperEl.scrollTop),
			0 === swiper.translate && (swiper.translate = 0),
			swiper.updateActiveIndex(),
			swiper.updateSlidesClasses();
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
		(newProgress =
			0 === translatesDiff
				? 0
				: (swiper.translate - swiper.minTranslate()) / translatesDiff),
			newProgress !== swiper.progress &&
				swiper.updateProgress(
					rtlTranslate ? -swiper.translate : swiper.translate
				),
			swiper.emit("setTranslate", swiper.translate, !1);
	}
	function onLoad(e) {
		const swiper = this;
		processLazyPreloader(this, e.target),
			this.params.cssMode ||
				("auto" !== this.params.slidesPerView && !this.params.autoHeight) ||
				this.update();
	}
	let dummyEventAttached = !1;
	function dummyEventListener() {}
	const events = (swiper, method) => {
		const document = getDocument(),
			{ params: params, el: el, wrapperEl: wrapperEl, device: device } = swiper,
			capture = !!params.nested,
			domMethod = "on" === method ? "addEventListener" : "removeEventListener",
			swiperMethod = method;
		el[domMethod]("pointerdown", swiper.onTouchStart, { passive: !1 }),
			document[domMethod]("pointermove", swiper.onTouchMove, {
				passive: !1,
				capture: capture,
			}),
			document[domMethod]("pointerup", swiper.onTouchEnd, { passive: !0 }),
			document[domMethod]("pointercancel", swiper.onTouchEnd, { passive: !0 }),
			document[domMethod]("pointerout", swiper.onTouchEnd, { passive: !0 }),
			document[domMethod]("pointerleave", swiper.onTouchEnd, { passive: !0 }),
			(params.preventClicks || params.preventClicksPropagation) &&
				el[domMethod]("click", swiper.onClick, !0),
			params.cssMode && wrapperEl[domMethod]("scroll", swiper.onScroll),
			params.updateOnWindowResize
				? swiper[swiperMethod](
						device.ios || device.android
							? "resize orientationchange observerUpdate"
							: "resize observerUpdate",
						onResize,
						!0
				  )
				: swiper[swiperMethod]("observerUpdate", onResize, !0),
			el[domMethod]("load", swiper.onLoad, { capture: !0 });
	};
	function attachEvents() {
		const swiper = this,
			document = getDocument(),
			{ params: params } = swiper;
		(swiper.onTouchStart = onTouchStart.bind(swiper)),
			(swiper.onTouchMove = onTouchMove.bind(swiper)),
			(swiper.onTouchEnd = onTouchEnd.bind(swiper)),
			params.cssMode && (swiper.onScroll = onScroll.bind(swiper)),
			(swiper.onClick = onClick.bind(swiper)),
			(swiper.onLoad = onLoad.bind(swiper)),
			dummyEventAttached ||
				(document.addEventListener("touchstart", dummyEventListener),
				(dummyEventAttached = !0)),
			events(swiper, "on");
	}
	function detachEvents() {
		const swiper = this;
		events(this, "off");
	}
	var events$1;
	const isGridEnabled = (swiper, params) =>
		swiper.grid && params.grid && params.grid.rows > 1;
	function setBreakpoint() {
		const swiper = this,
			{
				realIndex: realIndex,
				initialized: initialized,
				params: params,
				el: el,
			} = swiper,
			breakpoints = params.breakpoints;
		if (!breakpoints || (breakpoints && 0 === Object.keys(breakpoints).length))
			return;
		const breakpoint = swiper.getBreakpoint(
			breakpoints,
			swiper.params.breakpointsBase,
			swiper.el
		);
		if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
		const breakpointOnlyParams =
				breakpoint in breakpoints ? breakpoints[breakpoint] : void 0,
			breakpointParams = breakpointOnlyParams || swiper.originalParams,
			wasMultiRow = isGridEnabled(swiper, params),
			isMultiRow = isGridEnabled(swiper, breakpointParams),
			wasEnabled = params.enabled;
		wasMultiRow && !isMultiRow
			? (el.classList.remove(
					`${params.containerModifierClass}grid`,
					`${params.containerModifierClass}grid-column`
			  ),
			  swiper.emitContainerClasses())
			: !wasMultiRow &&
			  isMultiRow &&
			  (el.classList.add(`${params.containerModifierClass}grid`),
			  ((breakpointParams.grid.fill &&
					"column" === breakpointParams.grid.fill) ||
					(!breakpointParams.grid.fill && "column" === params.grid.fill)) &&
					el.classList.add(`${params.containerModifierClass}grid-column`),
			  swiper.emitContainerClasses()),
			["navigation", "pagination", "scrollbar"].forEach((prop) => {
				if (void 0 === breakpointParams[prop]) return;
				const wasModuleEnabled = params[prop] && params[prop].enabled,
					isModuleEnabled =
						breakpointParams[prop] && breakpointParams[prop].enabled;
				wasModuleEnabled && !isModuleEnabled && swiper[prop].disable(),
					!wasModuleEnabled && isModuleEnabled && swiper[prop].enable();
			});
		const directionChanged =
				breakpointParams.direction &&
				breakpointParams.direction !== params.direction,
			needsReLoop =
				params.loop &&
				(breakpointParams.slidesPerView !== params.slidesPerView ||
					directionChanged);
		directionChanged && initialized && swiper.changeDirection(),
			extend(swiper.params, breakpointParams);
		const isEnabled = swiper.params.enabled;
		Object.assign(swiper, {
			allowTouchMove: swiper.params.allowTouchMove,
			allowSlideNext: swiper.params.allowSlideNext,
			allowSlidePrev: swiper.params.allowSlidePrev,
		}),
			wasEnabled && !isEnabled
				? swiper.disable()
				: !wasEnabled && isEnabled && swiper.enable(),
			(swiper.currentBreakpoint = breakpoint),
			swiper.emit("_beforeBreakpoint", breakpointParams),
			needsReLoop &&
				initialized &&
				(swiper.loopDestroy(),
				swiper.loopCreate(realIndex),
				swiper.updateSlides()),
			swiper.emit("breakpoint", breakpointParams);
	}
	function getBreakpoint(breakpoints, base, containerEl) {
		if (
			(void 0 === base && (base = "window"),
			!breakpoints || ("container" === base && !containerEl))
		)
			return;
		let breakpoint = !1;
		const window = getWindow(),
			currentHeight =
				"window" === base ? window.innerHeight : containerEl.clientHeight,
			points = Object.keys(breakpoints).map((point) => {
				if ("string" == typeof point && 0 === point.indexOf("@")) {
					const minRatio = parseFloat(point.substr(1)),
						value = currentHeight * minRatio;
					return { value: value, point: point };
				}
				return { value: point, point: point };
			});
		points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
		for (let i = 0; i < points.length; i += 1) {
			const { point: point, value: value } = points[i];
			"window" === base
				? window.matchMedia(`(min-width: ${value}px)`).matches &&
				  (breakpoint = point)
				: value <= containerEl.clientWidth && (breakpoint = point);
		}
		return breakpoint || "max";
	}
	var breakpoints, classes;
	function prepareClasses(entries, prefix) {
		const resultClasses = [];
		return (
			entries.forEach((item) => {
				"object" == typeof item
					? Object.keys(item).forEach((classNames) => {
							item[classNames] && resultClasses.push(prefix + classNames);
					  })
					: "string" == typeof item && resultClasses.push(prefix + item);
			}),
			resultClasses
		);
	}
	function addClasses() {
		const swiper = this,
			{
				classNames: classNames,
				params: params,
				rtl: rtl,
				el: el,
				device: device,
			} = this,
			suffixes = prepareClasses(
				[
					"initialized",
					params.direction,
					{ "free-mode": this.params.freeMode && params.freeMode.enabled },
					{ autoheight: params.autoHeight },
					{ rtl: rtl },
					{ grid: params.grid && params.grid.rows > 1 },
					{
						"grid-column":
							params.grid &&
							params.grid.rows > 1 &&
							"column" === params.grid.fill,
					},
					{ android: device.android },
					{ ios: device.ios },
					{ "css-mode": params.cssMode },
					{ centered: params.cssMode && params.centeredSlides },
					{ "watch-progress": params.watchSlidesProgress },
				],
				params.containerModifierClass
			);
		classNames.push(...suffixes),
			el.classList.add(...classNames),
			this.emitContainerClasses();
	}
	function removeClasses() {
		const swiper = this,
			{ el: el, classNames: classNames } = this;
		el.classList.remove(...classNames), this.emitContainerClasses();
	}
	function checkOverflow() {
		const swiper = this,
			{ isLocked: wasLocked, params: params } = swiper,
			{ slidesOffsetBefore: slidesOffsetBefore } = params;
		if (slidesOffsetBefore) {
			const lastSlideIndex = swiper.slides.length - 1,
				lastSlideRightEdge =
					swiper.slidesGrid[lastSlideIndex] +
					swiper.slidesSizesGrid[lastSlideIndex] +
					2 * slidesOffsetBefore;
			swiper.isLocked = swiper.size > lastSlideRightEdge;
		} else swiper.isLocked = 1 === swiper.snapGrid.length;
		!0 === params.allowSlideNext && (swiper.allowSlideNext = !swiper.isLocked),
			!0 === params.allowSlidePrev &&
				(swiper.allowSlidePrev = !swiper.isLocked),
			wasLocked && wasLocked !== swiper.isLocked && (swiper.isEnd = !1),
			wasLocked !== swiper.isLocked &&
				swiper.emit(swiper.isLocked ? "lock" : "unlock");
	}
	var checkOverflow$1,
		defaults = {
			init: !0,
			direction: "horizontal",
			oneWayMovement: !1,
			touchEventsTarget: "wrapper",
			initialSlide: 0,
			speed: 300,
			cssMode: !1,
			updateOnWindowResize: !0,
			resizeObserver: !0,
			nested: !1,
			createElements: !1,
			enabled: !0,
			focusableElements:
				"input, select, option, textarea, button, video, label",
			width: null,
			height: null,
			preventInteractionOnTransition: !1,
			userAgent: null,
			url: null,
			edgeSwipeDetection: !1,
			edgeSwipeThreshold: 20,
			autoHeight: !1,
			setWrapperSize: !1,
			virtualTranslate: !1,
			effect: "slide",
			breakpoints: void 0,
			breakpointsBase: "window",
			spaceBetween: 0,
			slidesPerView: 1,
			slidesPerGroup: 1,
			slidesPerGroupSkip: 0,
			slidesPerGroupAuto: !1,
			centeredSlides: !1,
			centeredSlidesBounds: !1,
			slidesOffsetBefore: 0,
			slidesOffsetAfter: 0,
			normalizeSlideIndex: !0,
			centerInsufficientSlides: !1,
			watchOverflow: !0,
			roundLengths: !1,
			touchRatio: 1,
			touchAngle: 45,
			simulateTouch: !0,
			shortSwipes: !0,
			longSwipes: !0,
			longSwipesRatio: 0.5,
			longSwipesMs: 300,
			followFinger: !0,
			allowTouchMove: !0,
			threshold: 5,
			touchMoveStopPropagation: !1,
			touchStartPreventDefault: !0,
			touchStartForcePreventDefault: !1,
			touchReleaseOnEdges: !1,
			uniqueNavElements: !0,
			resistance: !0,
			resistanceRatio: 0.85,
			watchSlidesProgress: !1,
			grabCursor: !1,
			preventClicks: !0,
			preventClicksPropagation: !0,
			slideToClickedSlide: !1,
			loop: !1,
			loopedSlides: null,
			loopPreventsSliding: !0,
			rewind: !1,
			allowSlidePrev: !0,
			allowSlideNext: !0,
			swipeHandler: null,
			noSwiping: !0,
			noSwipingClass: "swiper-no-swiping",
			noSwipingSelector: null,
			passiveListeners: !0,
			maxBackfaceHiddenSlides: 10,
			containerModifierClass: "swiper-",
			slideClass: "swiper-slide",
			slideActiveClass: "swiper-slide-active",
			slideVisibleClass: "swiper-slide-visible",
			slideNextClass: "swiper-slide-next",
			slidePrevClass: "swiper-slide-prev",
			wrapperClass: "swiper-wrapper",
			lazyPreloaderClass: "swiper-lazy-preloader",
			lazyPreloadPrevNext: 0,
			runCallbacksOnInit: !0,
			_emitClasses: !1,
		};
	function moduleExtendParams(params, allModulesParams) {
		return function extendParams(obj) {
			void 0 === obj && (obj = {});
			const moduleParamName = Object.keys(obj)[0],
				moduleParams = obj[moduleParamName];
			"object" == typeof moduleParams && null !== moduleParams
				? (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >=
						0 &&
						!0 === params[moduleParamName] &&
						(params[moduleParamName] = { auto: !0 }),
				  moduleParamName in params && "enabled" in moduleParams
						? (!0 === params[moduleParamName] &&
								(params[moduleParamName] = { enabled: !0 }),
						  "object" != typeof params[moduleParamName] ||
								"enabled" in params[moduleParamName] ||
								(params[moduleParamName].enabled = !0),
						  params[moduleParamName] ||
								(params[moduleParamName] = { enabled: !1 }),
						  extend(allModulesParams, obj))
						: extend(allModulesParams, obj))
				: extend(allModulesParams, obj);
		};
	}
	const prototypes = {
			eventsEmitter: eventsEmitter,
			update: {
				updateSize: updateSize,
				updateSlides: updateSlides,
				updateAutoHeight: updateAutoHeight,
				updateSlidesOffset: updateSlidesOffset,
				updateSlidesProgress: updateSlidesProgress,
				updateProgress: updateProgress,
				updateSlidesClasses: updateSlidesClasses,
				updateActiveIndex: updateActiveIndex,
				updateClickedSlide: updateClickedSlide,
			},
			translate: {
				getTranslate: getSwiperTranslate,
				setTranslate: setTranslate,
				minTranslate: minTranslate,
				maxTranslate: maxTranslate,
				translateTo: translateTo,
			},
			transition: {
				setTransition: setTransition,
				transitionStart: transitionStart,
				transitionEnd: transitionEnd,
			},
			slide: {
				slideTo: slideTo,
				slideToLoop: slideToLoop,
				slideNext: slideNext,
				slidePrev: slidePrev,
				slideReset: slideReset,
				slideToClosest: slideToClosest,
				slideToClickedSlide: slideToClickedSlide,
			},
			loop: {
				loopCreate: loopCreate,
				loopFix: loopFix,
				loopDestroy: loopDestroy,
			},
			grabCursor: {
				setGrabCursor: setGrabCursor,
				unsetGrabCursor: unsetGrabCursor,
			},
			events: { attachEvents: attachEvents, detachEvents: detachEvents },
			breakpoints: {
				setBreakpoint: setBreakpoint,
				getBreakpoint: getBreakpoint,
			},
			checkOverflow: { checkOverflow: checkOverflow },
			classes: { addClasses: addClasses, removeClasses: removeClasses },
		},
		extendedDefaults = {};
	class Swiper {
		constructor() {
			let el, params;
			for (
				var _len = arguments.length, args = new Array(_len), _key = 0;
				_key < _len;
				_key++
			)
				args[_key] = arguments[_key];
			1 === args.length &&
			args[0].constructor &&
			"Object" === Object.prototype.toString.call(args[0]).slice(8, -1)
				? (params = args[0])
				: ([el, params] = args),
				params || (params = {}),
				(params = extend({}, params)),
				el && !params.el && (params.el = el);
			const document = getDocument();
			if (
				params.el &&
				"string" == typeof params.el &&
				document.querySelectorAll(params.el).length > 1
			) {
				const swipers = [];
				return (
					document.querySelectorAll(params.el).forEach((containerEl) => {
						const newParams = extend({}, params, { el: containerEl });
						swipers.push(new Swiper(newParams));
					}),
					swipers
				);
			}
			const swiper = this;
			(swiper.__swiper__ = !0),
				(swiper.support = getSupport()),
				(swiper.device = getDevice({ userAgent: params.userAgent })),
				(swiper.browser = getBrowser()),
				(swiper.eventsListeners = {}),
				(swiper.eventsAnyListeners = []),
				(swiper.modules = [...swiper.__modules__]),
				params.modules &&
					Array.isArray(params.modules) &&
					swiper.modules.push(...params.modules);
			const allModulesParams = {};
			swiper.modules.forEach((mod) => {
				mod({
					params: params,
					swiper: swiper,
					extendParams: moduleExtendParams(params, allModulesParams),
					on: swiper.on.bind(swiper),
					once: swiper.once.bind(swiper),
					off: swiper.off.bind(swiper),
					emit: swiper.emit.bind(swiper),
				});
			});
			const swiperParams = extend({}, defaults, allModulesParams);
			return (
				(swiper.params = extend({}, swiperParams, extendedDefaults, params)),
				(swiper.originalParams = extend({}, swiper.params)),
				(swiper.passedParams = extend({}, params)),
				swiper.params &&
					swiper.params.on &&
					Object.keys(swiper.params.on).forEach((eventName) => {
						swiper.on(eventName, swiper.params.on[eventName]);
					}),
				swiper.params &&
					swiper.params.onAny &&
					swiper.onAny(swiper.params.onAny),
				Object.assign(swiper, {
					enabled: swiper.params.enabled,
					el: el,
					classNames: [],
					slides: [],
					slidesGrid: [],
					snapGrid: [],
					slidesSizesGrid: [],
					isHorizontal: () => "horizontal" === swiper.params.direction,
					isVertical: () => "vertical" === swiper.params.direction,
					activeIndex: 0,
					realIndex: 0,
					isBeginning: !0,
					isEnd: !1,
					translate: 0,
					previousTranslate: 0,
					progress: 0,
					velocity: 0,
					animating: !1,
					cssOverflowAdjustment() {
						return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
					},
					allowSlideNext: swiper.params.allowSlideNext,
					allowSlidePrev: swiper.params.allowSlidePrev,
					touchEventsData: {
						isTouched: void 0,
						isMoved: void 0,
						allowTouchCallbacks: void 0,
						touchStartTime: void 0,
						isScrolling: void 0,
						currentTranslate: void 0,
						startTranslate: void 0,
						allowThresholdMove: void 0,
						focusableElements: swiper.params.focusableElements,
						lastClickTime: 0,
						clickTimeout: void 0,
						velocities: [],
						allowMomentumBounce: void 0,
						startMoving: void 0,
						evCache: [],
					},
					allowClick: !0,
					allowTouchMove: swiper.params.allowTouchMove,
					touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
					imagesToLoad: [],
					imagesLoaded: 0,
				}),
				swiper.emit("_swiper"),
				swiper.params.init && swiper.init(),
				swiper
			);
		}
		getSlideIndex(slideEl) {
			const { slidesEl: slidesEl, params: params } = this,
				slides = elementChildren(
					slidesEl,
					`.${params.slideClass}, swiper-slide`
				),
				firstSlideIndex = elementIndex(slides[0]);
			return elementIndex(slideEl) - firstSlideIndex;
		}
		getSlideIndexByData(index) {
			return this.getSlideIndex(
				this.slides.filter(
					(slideEl) =>
						1 * slideEl.getAttribute("data-swiper-slide-index") === index
				)[0]
			);
		}
		recalcSlides() {
			const swiper = this,
				{ slidesEl: slidesEl, params: params } = this;
			this.slides = elementChildren(
				slidesEl,
				`.${params.slideClass}, swiper-slide`
			);
		}
		enable() {
			const swiper = this;
			swiper.enabled ||
				((swiper.enabled = !0),
				swiper.params.grabCursor && swiper.setGrabCursor(),
				swiper.emit("enable"));
		}
		disable() {
			const swiper = this;
			swiper.enabled &&
				((swiper.enabled = !1),
				swiper.params.grabCursor && swiper.unsetGrabCursor(),
				swiper.emit("disable"));
		}
		setProgress(progress, speed) {
			const swiper = this;
			progress = Math.min(Math.max(progress, 0), 1);
			const min = this.minTranslate(),
				max = this.maxTranslate(),
				current = (max - min) * progress + min;
			this.translateTo(current, void 0 === speed ? 0 : speed),
				this.updateActiveIndex(),
				this.updateSlidesClasses();
		}
		emitContainerClasses() {
			const swiper = this;
			if (!swiper.params._emitClasses || !swiper.el) return;
			const cls = swiper.el.className
				.split(" ")
				.filter(
					(className) =>
						0 === className.indexOf("swiper") ||
						0 === className.indexOf(swiper.params.containerModifierClass)
				);
			swiper.emit("_containerClasses", cls.join(" "));
		}
		getSlideClasses(slideEl) {
			const swiper = this;
			return swiper.destroyed
				? ""
				: slideEl.className
						.split(" ")
						.filter(
							(className) =>
								0 === className.indexOf("swiper-slide") ||
								0 === className.indexOf(swiper.params.slideClass)
						)
						.join(" ");
		}
		emitSlidesClasses() {
			const swiper = this;
			if (!swiper.params._emitClasses || !swiper.el) return;
			const updates = [];
			swiper.slides.forEach((slideEl) => {
				const classNames = swiper.getSlideClasses(slideEl);
				updates.push({ slideEl: slideEl, classNames: classNames }),
					swiper.emit("_slideClass", slideEl, classNames);
			}),
				swiper.emit("_slideClasses", updates);
		}
		slidesPerViewDynamic(view, exact) {
			void 0 === view && (view = "current"), void 0 === exact && (exact = !1);
			const swiper = this,
				{
					params: params,
					slides: slides,
					slidesGrid: slidesGrid,
					slidesSizesGrid: slidesSizesGrid,
					size: swiperSize,
					activeIndex: activeIndex,
				} = this;
			let spv = 1;
			if (params.centeredSlides) {
				let slideSize = slides[activeIndex]
						? slides[activeIndex].swiperSlideSize
						: 0,
					breakLoop;
				for (let i = activeIndex + 1; i < slides.length; i += 1)
					slides[i] &&
						!breakLoop &&
						((slideSize += slides[i].swiperSlideSize),
						(spv += 1),
						slideSize > swiperSize && (breakLoop = !0));
				for (let i = activeIndex - 1; i >= 0; i -= 1)
					slides[i] &&
						!breakLoop &&
						((slideSize += slides[i].swiperSlideSize),
						(spv += 1),
						slideSize > swiperSize && (breakLoop = !0));
			} else if ("current" === view)
				for (let i = activeIndex + 1; i < slides.length; i += 1) {
					const slideInView = exact
						? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] <
						  swiperSize
						: slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
					slideInView && (spv += 1);
				}
			else
				for (let i = activeIndex - 1; i >= 0; i -= 1) {
					const slideInView =
						slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
					slideInView && (spv += 1);
				}
			return spv;
		}
		update() {
			const swiper = this;
			if (!swiper || swiper.destroyed) return;
			const { snapGrid: snapGrid, params: params } = swiper;
			function setTranslate() {
				const translateValue = swiper.rtlTranslate
						? -1 * swiper.translate
						: swiper.translate,
					newTranslate = Math.min(
						Math.max(translateValue, swiper.maxTranslate()),
						swiper.minTranslate()
					);
				swiper.setTranslate(newTranslate),
					swiper.updateActiveIndex(),
					swiper.updateSlidesClasses();
			}
			let translated;
			if (
				(params.breakpoints && swiper.setBreakpoint(),
				[...swiper.el.querySelectorAll('[loading="lazy"]')].forEach(
					(imageEl) => {
						imageEl.complete && processLazyPreloader(swiper, imageEl);
					}
				),
				swiper.updateSize(),
				swiper.updateSlides(),
				swiper.updateProgress(),
				swiper.updateSlidesClasses(),
				params.freeMode && params.freeMode.enabled && !params.cssMode)
			)
				setTranslate(), params.autoHeight && swiper.updateAutoHeight();
			else {
				if (
					("auto" === params.slidesPerView || params.slidesPerView > 1) &&
					swiper.isEnd &&
					!params.centeredSlides
				) {
					const slides =
						swiper.virtual && params.virtual.enabled
							? swiper.virtual.slides
							: swiper.slides;
					translated = swiper.slideTo(slides.length - 1, 0, !1, !0);
				} else translated = swiper.slideTo(swiper.activeIndex, 0, !1, !0);
				translated || setTranslate();
			}
			params.watchOverflow &&
				snapGrid !== swiper.snapGrid &&
				swiper.checkOverflow(),
				swiper.emit("update");
		}
		changeDirection(newDirection, needUpdate) {
			void 0 === needUpdate && (needUpdate = !0);
			const swiper = this,
				currentDirection = swiper.params.direction;
			return (
				newDirection ||
					(newDirection =
						"horizontal" === currentDirection ? "vertical" : "horizontal"),
				newDirection === currentDirection ||
				("horizontal" !== newDirection && "vertical" !== newDirection)
					? swiper
					: (swiper.el.classList.remove(
							`${swiper.params.containerModifierClass}${currentDirection}`
					  ),
					  swiper.el.classList.add(
							`${swiper.params.containerModifierClass}${newDirection}`
					  ),
					  swiper.emitContainerClasses(),
					  (swiper.params.direction = newDirection),
					  swiper.slides.forEach((slideEl) => {
							"vertical" === newDirection
								? (slideEl.style.width = "")
								: (slideEl.style.height = "");
					  }),
					  swiper.emit("changeDirection"),
					  needUpdate && swiper.update(),
					  swiper)
			);
		}
		changeLanguageDirection(direction) {
			const swiper = this;
			(swiper.rtl && "rtl" === direction) ||
				(!swiper.rtl && "ltr" === direction) ||
				((swiper.rtl = "rtl" === direction),
				(swiper.rtlTranslate =
					"horizontal" === swiper.params.direction && swiper.rtl),
				swiper.rtl
					? (swiper.el.classList.add(
							`${swiper.params.containerModifierClass}rtl`
					  ),
					  (swiper.el.dir = "rtl"))
					: (swiper.el.classList.remove(
							`${swiper.params.containerModifierClass}rtl`
					  ),
					  (swiper.el.dir = "ltr")),
				swiper.update());
		}
		mount(element) {
			const swiper = this;
			if (swiper.mounted) return !0;
			let el = element || swiper.params.el;
			if (("string" == typeof el && (el = document.querySelector(el)), !el))
				return !1;
			(el.swiper = swiper), el.shadowEl && (swiper.isElement = !0);
			const getWrapperSelector = () =>
					`.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`,
				getWrapper = () => {
					if (el && el.shadowRoot && el.shadowRoot.querySelector) {
						const res = el.shadowRoot.querySelector(getWrapperSelector());
						return res;
					}
					return elementChildren(el, getWrapperSelector())[0];
				};
			let wrapperEl = getWrapper();
			return (
				!wrapperEl &&
					swiper.params.createElements &&
					((wrapperEl = createElement("div", swiper.params.wrapperClass)),
					el.append(wrapperEl),
					elementChildren(el, `.${swiper.params.slideClass}`).forEach(
						(slideEl) => {
							wrapperEl.append(slideEl);
						}
					)),
				Object.assign(swiper, {
					el: el,
					wrapperEl: wrapperEl,
					slidesEl: swiper.isElement ? el : wrapperEl,
					mounted: !0,
					rtl:
						"rtl" === el.dir.toLowerCase() ||
						"rtl" === elementStyle(el, "direction"),
					rtlTranslate:
						"horizontal" === swiper.params.direction &&
						("rtl" === el.dir.toLowerCase() ||
							"rtl" === elementStyle(el, "direction")),
					wrongRTL: "-webkit-box" === elementStyle(wrapperEl, "display"),
				}),
				!0
			);
		}
		init(el) {
			const swiper = this;
			if (swiper.initialized) return swiper;
			const mounted = swiper.mount(el);
			return !1 === mounted
				? swiper
				: (swiper.emit("beforeInit"),
				  swiper.params.breakpoints && swiper.setBreakpoint(),
				  swiper.addClasses(),
				  swiper.updateSize(),
				  swiper.updateSlides(),
				  swiper.params.watchOverflow && swiper.checkOverflow(),
				  swiper.params.grabCursor && swiper.enabled && swiper.setGrabCursor(),
				  swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled
						? swiper.slideTo(
								swiper.params.initialSlide + swiper.virtual.slidesBefore,
								0,
								swiper.params.runCallbacksOnInit,
								!1,
								!0
						  )
						: swiper.slideTo(
								swiper.params.initialSlide,
								0,
								swiper.params.runCallbacksOnInit,
								!1,
								!0
						  ),
				  swiper.params.loop && swiper.loopCreate(),
				  swiper.attachEvents(),
				  [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach(
						(imageEl) => {
							imageEl.complete
								? processLazyPreloader(swiper, imageEl)
								: imageEl.addEventListener("load", (e) => {
										processLazyPreloader(swiper, e.target);
								  });
						}
				  ),
				  preload(swiper),
				  (swiper.initialized = !0),
				  preload(swiper),
				  swiper.emit("init"),
				  swiper.emit("afterInit"),
				  swiper);
		}
		destroy(deleteInstance, cleanStyles) {
			void 0 === deleteInstance && (deleteInstance = !0),
				void 0 === cleanStyles && (cleanStyles = !0);
			const swiper = this,
				{
					params: params,
					el: el,
					wrapperEl: wrapperEl,
					slides: slides,
				} = swiper;
			return void 0 === swiper.params || swiper.destroyed
				? null
				: (swiper.emit("beforeDestroy"),
				  (swiper.initialized = !1),
				  swiper.detachEvents(),
				  params.loop && swiper.loopDestroy(),
				  cleanStyles &&
						(swiper.removeClasses(),
						el.removeAttribute("style"),
						wrapperEl.removeAttribute("style"),
						slides &&
							slides.length &&
							slides.forEach((slideEl) => {
								slideEl.classList.remove(
									params.slideVisibleClass,
									params.slideActiveClass,
									params.slideNextClass,
									params.slidePrevClass
								),
									slideEl.removeAttribute("style"),
									slideEl.removeAttribute("data-swiper-slide-index");
							})),
				  swiper.emit("destroy"),
				  Object.keys(swiper.eventsListeners).forEach((eventName) => {
						swiper.off(eventName);
				  }),
				  !1 !== deleteInstance &&
						((swiper.el.swiper = null), deleteProps(swiper)),
				  (swiper.destroyed = !0),
				  null);
		}
		static extendDefaults(newDefaults) {
			extend(extendedDefaults, newDefaults);
		}
		static get extendedDefaults() {
			return extendedDefaults;
		}
		static get defaults() {
			return defaults;
		}
		static installModule(mod) {
			Swiper.prototype.__modules__ || (Swiper.prototype.__modules__ = []);
			const modules = Swiper.prototype.__modules__;
			"function" == typeof mod && modules.indexOf(mod) < 0 && modules.push(mod);
		}
		static use(module) {
			return Array.isArray(module)
				? (module.forEach((m) => Swiper.installModule(m)), Swiper)
				: (Swiper.installModule(module), Swiper);
		}
	}
	function Virtual(_ref) {
		let {
				swiper: swiper,
				extendParams: extendParams,
				on: on,
				emit: emit,
			} = _ref,
			cssModeTimeout;
		extendParams({
			virtual: {
				enabled: !1,
				slides: [],
				cache: !0,
				renderSlide: null,
				renderExternal: null,
				renderExternalUpdate: !0,
				addSlidesBefore: 0,
				addSlidesAfter: 0,
			},
		});
		const document = getDocument();
		swiper.virtual = {
			cache: {},
			from: void 0,
			to: void 0,
			slides: [],
			offset: 0,
			slidesGrid: [],
		};
		const tempDOM = document.createElement("div");
		function renderSlide(slide, index) {
			const params = swiper.params.virtual;
			if (params.cache && swiper.virtual.cache[index])
				return swiper.virtual.cache[index];
			let slideEl;
			return (
				params.renderSlide
					? ((slideEl = params.renderSlide.call(swiper, slide, index)),
					  "string" == typeof slideEl &&
							((tempDOM.innerHTML = slideEl), (slideEl = tempDOM.children[0])))
					: (slideEl = swiper.isElement
							? createElement("swiper-slide")
							: createElement("div", swiper.params.slideClass)),
				slideEl.setAttribute("data-swiper-slide-index", index),
				params.renderSlide || (slideEl.innerHTML = slide),
				params.cache && (swiper.virtual.cache[index] = slideEl),
				slideEl
			);
		}
		function update(force) {
			const {
					slidesPerView: slidesPerView,
					slidesPerGroup: slidesPerGroup,
					centeredSlides: centeredSlides,
					loop: isLoop,
				} = swiper.params,
				{ addSlidesBefore: addSlidesBefore, addSlidesAfter: addSlidesAfter } =
					swiper.params.virtual,
				{
					from: previousFrom,
					to: previousTo,
					slides: slides,
					slidesGrid: previousSlidesGrid,
					offset: previousOffset,
				} = swiper.virtual;
			swiper.params.cssMode || swiper.updateActiveIndex();
			const activeIndex = swiper.activeIndex || 0;
			let offsetProp, slidesAfter, slidesBefore;
			(offsetProp = swiper.rtlTranslate
				? "right"
				: swiper.isHorizontal()
				? "left"
				: "top"),
				centeredSlides
					? ((slidesAfter =
							Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter),
					  (slidesBefore =
							Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore))
					: ((slidesAfter =
							slidesPerView + (slidesPerGroup - 1) + addSlidesAfter),
					  (slidesBefore =
							(isLoop ? slidesPerView : slidesPerGroup) + addSlidesBefore));
			let from = activeIndex - slidesBefore,
				to = activeIndex + slidesAfter;
			isLoop ||
				((from = Math.max(from, 0)), (to = Math.min(to, slides.length - 1)));
			let offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
			function onRendered() {
				swiper.updateSlides(),
					swiper.updateProgress(),
					swiper.updateSlidesClasses(),
					emit("virtualUpdate");
			}
			if (
				(isLoop && activeIndex >= slidesBefore
					? ((from -= slidesBefore),
					  centeredSlides || (offset += swiper.slidesGrid[0]))
					: isLoop &&
					  activeIndex < slidesBefore &&
					  ((from = -slidesBefore),
					  centeredSlides && (offset += swiper.slidesGrid[0])),
				Object.assign(swiper.virtual, {
					from: from,
					to: to,
					offset: offset,
					slidesGrid: swiper.slidesGrid,
					slidesBefore: slidesBefore,
					slidesAfter: slidesAfter,
				}),
				previousFrom === from && previousTo === to && !force)
			)
				return (
					swiper.slidesGrid !== previousSlidesGrid &&
						offset !== previousOffset &&
						swiper.slides.forEach((slideEl) => {
							slideEl.style[offsetProp] = `${
								offset - Math.abs(swiper.cssOverflowAdjustment())
							}px`;
						}),
					swiper.updateProgress(),
					void emit("virtualUpdate")
				);
			if (swiper.params.virtual.renderExternal)
				return (
					swiper.params.virtual.renderExternal.call(swiper, {
						offset: offset,
						from: from,
						to: to,
						slides: (function getSlides() {
							const slidesToRender = [];
							for (let i = from; i <= to; i += 1)
								slidesToRender.push(slides[i]);
							return slidesToRender;
						})(),
					}),
					void (swiper.params.virtual.renderExternalUpdate
						? onRendered()
						: emit("virtualUpdate"))
				);
			const prependIndexes = [],
				appendIndexes = [],
				getSlideIndex = (index) => {
					let slideIndex = index;
					return (
						index < 0
							? (slideIndex = slides.length + index)
							: slideIndex >= slides.length && (slideIndex -= slides.length),
						slideIndex
					);
				};
			if (force)
				swiper.slidesEl
					.querySelectorAll(`.${swiper.params.slideClass}, swiper-slide`)
					.forEach((slideEl) => {
						slideEl.remove();
					});
			else
				for (let i = previousFrom; i <= previousTo; i += 1)
					if (i < from || i > to) {
						const slideIndex = getSlideIndex(i);
						swiper.slidesEl
							.querySelectorAll(
								`.${swiper.params.slideClass}[data-swiper-slide-index="${slideIndex}"], swiper-slide[data-swiper-slide-index="${slideIndex}"]`
							)
							.forEach((slideEl) => {
								slideEl.remove();
							});
					}
			const loopFrom = isLoop ? -slides.length : 0,
				loopTo = isLoop ? 2 * slides.length : slides.length;
			for (let i = loopFrom; i < loopTo; i += 1)
				if (i >= from && i <= to) {
					const slideIndex = getSlideIndex(i);
					void 0 === previousTo || force
						? appendIndexes.push(slideIndex)
						: (i > previousTo && appendIndexes.push(slideIndex),
						  i < previousFrom && prependIndexes.push(slideIndex));
				}
			if (
				(appendIndexes.forEach((index) => {
					swiper.slidesEl.append(renderSlide(slides[index], index));
				}),
				isLoop)
			)
				for (let i = prependIndexes.length - 1; i >= 0; i -= 1) {
					const index = prependIndexes[i];
					swiper.slidesEl.prepend(renderSlide(slides[index], index));
				}
			else
				prependIndexes.sort((a, b) => b - a),
					prependIndexes.forEach((index) => {
						swiper.slidesEl.prepend(renderSlide(slides[index], index));
					});
			elementChildren(swiper.slidesEl, ".swiper-slide, swiper-slide").forEach(
				(slideEl) => {
					slideEl.style[offsetProp] = `${
						offset - Math.abs(swiper.cssOverflowAdjustment())
					}px`;
				}
			),
				onRendered();
		}
		function appendSlide(slides) {
			if ("object" == typeof slides && "length" in slides)
				for (let i = 0; i < slides.length; i += 1)
					slides[i] && swiper.virtual.slides.push(slides[i]);
			else swiper.virtual.slides.push(slides);
			update(!0);
		}
		function prependSlide(slides) {
			const activeIndex = swiper.activeIndex;
			let newActiveIndex = activeIndex + 1,
				numberOfNewSlides = 1;
			if (Array.isArray(slides)) {
				for (let i = 0; i < slides.length; i += 1)
					slides[i] && swiper.virtual.slides.unshift(slides[i]);
				(newActiveIndex = activeIndex + slides.length),
					(numberOfNewSlides = slides.length);
			} else swiper.virtual.slides.unshift(slides);
			if (swiper.params.virtual.cache) {
				const cache = swiper.virtual.cache,
					newCache = {};
				Object.keys(cache).forEach((cachedIndex) => {
					const cachedEl = cache[cachedIndex],
						cachedElIndex = cachedEl.getAttribute("data-swiper-slide-index");
					cachedElIndex &&
						cachedEl.setAttribute(
							"data-swiper-slide-index",
							parseInt(cachedElIndex, 10) + numberOfNewSlides
						),
						(newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] =
							cachedEl);
				}),
					(swiper.virtual.cache = newCache);
			}
			update(!0), swiper.slideTo(newActiveIndex, 0);
		}
		function removeSlide(slidesIndexes) {
			if (null == slidesIndexes) return;
			let activeIndex = swiper.activeIndex;
			if (Array.isArray(slidesIndexes))
				for (let i = slidesIndexes.length - 1; i >= 0; i -= 1)
					swiper.virtual.slides.splice(slidesIndexes[i], 1),
						swiper.params.virtual.cache &&
							delete swiper.virtual.cache[slidesIndexes[i]],
						slidesIndexes[i] < activeIndex && (activeIndex -= 1),
						(activeIndex = Math.max(activeIndex, 0));
			else
				swiper.virtual.slides.splice(slidesIndexes, 1),
					swiper.params.virtual.cache &&
						delete swiper.virtual.cache[slidesIndexes],
					slidesIndexes < activeIndex && (activeIndex -= 1),
					(activeIndex = Math.max(activeIndex, 0));
			update(!0), swiper.slideTo(activeIndex, 0);
		}
		function removeAllSlides() {
			(swiper.virtual.slides = []),
				swiper.params.virtual.cache && (swiper.virtual.cache = {}),
				update(!0),
				swiper.slideTo(0, 0);
		}
		on("beforeInit", () => {
			if (!swiper.params.virtual.enabled) return;
			let domSlidesAssigned;
			if (void 0 === swiper.passedParams.virtual.slides) {
				const slides = [...swiper.slidesEl.children].filter((el) =>
					el.matches(`.${swiper.params.slideClass}, swiper-slide`)
				);
				slides &&
					slides.length &&
					((swiper.virtual.slides = [...slides]),
					(domSlidesAssigned = !0),
					slides.forEach((slideEl, slideIndex) => {
						slideEl.setAttribute("data-swiper-slide-index", slideIndex),
							(swiper.virtual.cache[slideIndex] = slideEl),
							slideEl.remove();
					}));
			}
			domSlidesAssigned ||
				(swiper.virtual.slides = swiper.params.virtual.slides),
				swiper.classNames.push(
					`${swiper.params.containerModifierClass}virtual`
				),
				(swiper.params.watchSlidesProgress = !0),
				(swiper.originalParams.watchSlidesProgress = !0),
				swiper.params.initialSlide || update();
		}),
			on("setTranslate", () => {
				swiper.params.virtual.enabled &&
					(swiper.params.cssMode && !swiper._immediateVirtual
						? (clearTimeout(cssModeTimeout),
						  (cssModeTimeout = setTimeout(() => {
								update();
						  }, 100)))
						: update());
			}),
			on("init update resize", () => {
				swiper.params.virtual.enabled &&
					swiper.params.cssMode &&
					setCSSProperty(
						swiper.wrapperEl,
						"--swiper-virtual-size",
						`${swiper.virtualSize}px`
					);
			}),
			Object.assign(swiper.virtual, {
				appendSlide: appendSlide,
				prependSlide: prependSlide,
				removeSlide: removeSlide,
				removeAllSlides: removeAllSlides,
				update: update,
			});
	}
	function Keyboard(_ref) {
		let {
			swiper: swiper,
			extendParams: extendParams,
			on: on,
			emit: emit,
		} = _ref;
		const document = getDocument(),
			window = getWindow();
		function handle(event) {
			if (!swiper.enabled) return;
			const { rtlTranslate: rtl } = swiper;
			let e = event;
			e.originalEvent && (e = e.originalEvent);
			const kc = e.keyCode || e.charCode,
				pageUpDown = swiper.params.keyboard.pageUpDown,
				isPageUp = pageUpDown && 33 === kc,
				isPageDown = pageUpDown && 34 === kc,
				isArrowLeft = 37 === kc,
				isArrowRight = 39 === kc,
				isArrowUp = 38 === kc,
				isArrowDown = 40 === kc;
			if (
				!swiper.allowSlideNext &&
				((swiper.isHorizontal() && isArrowRight) ||
					(swiper.isVertical() && isArrowDown) ||
					isPageDown)
			)
				return !1;
			if (
				!swiper.allowSlidePrev &&
				((swiper.isHorizontal() && isArrowLeft) ||
					(swiper.isVertical() && isArrowUp) ||
					isPageUp)
			)
				return !1;
			if (
				!(
					e.shiftKey ||
					e.altKey ||
					e.ctrlKey ||
					e.metaKey ||
					(document.activeElement &&
						document.activeElement.nodeName &&
						("input" === document.activeElement.nodeName.toLowerCase() ||
							"textarea" === document.activeElement.nodeName.toLowerCase()))
				)
			) {
				if (
					swiper.params.keyboard.onlyInViewport &&
					(isPageUp ||
						isPageDown ||
						isArrowLeft ||
						isArrowRight ||
						isArrowUp ||
						isArrowDown)
				) {
					let inView = !1;
					if (
						elementParents(
							swiper.el,
							`.${swiper.params.slideClass}, swiper-slide`
						).length > 0 &&
						0 ===
							elementParents(swiper.el, `.${swiper.params.slideActiveClass}`)
								.length
					)
						return;
					const el = swiper.el,
						swiperWidth = el.clientWidth,
						swiperHeight = el.clientHeight,
						windowWidth = window.innerWidth,
						windowHeight = window.innerHeight,
						swiperOffset = elementOffset(el);
					rtl && (swiperOffset.left -= el.scrollLeft);
					const swiperCoord = [
						[swiperOffset.left, swiperOffset.top],
						[swiperOffset.left + swiperWidth, swiperOffset.top],
						[swiperOffset.left, swiperOffset.top + swiperHeight],
						[swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight],
					];
					for (let i = 0; i < swiperCoord.length; i += 1) {
						const point = swiperCoord[i];
						if (
							point[0] >= 0 &&
							point[0] <= windowWidth &&
							point[1] >= 0 &&
							point[1] <= windowHeight
						) {
							if (0 === point[0] && 0 === point[1]) continue;
							inView = !0;
						}
					}
					if (!inView) return;
				}
				swiper.isHorizontal()
					? ((isPageUp || isPageDown || isArrowLeft || isArrowRight) &&
							(e.preventDefault ? e.preventDefault() : (e.returnValue = !1)),
					  (((isPageDown || isArrowRight) && !rtl) ||
							((isPageUp || isArrowLeft) && rtl)) &&
							swiper.slideNext(),
					  (((isPageUp || isArrowLeft) && !rtl) ||
							((isPageDown || isArrowRight) && rtl)) &&
							swiper.slidePrev())
					: ((isPageUp || isPageDown || isArrowUp || isArrowDown) &&
							(e.preventDefault ? e.preventDefault() : (e.returnValue = !1)),
					  (isPageDown || isArrowDown) && swiper.slideNext(),
					  (isPageUp || isArrowUp) && swiper.slidePrev()),
					emit("keyPress", kc);
			}
		}
		function enable() {
			swiper.keyboard.enabled ||
				(document.addEventListener("keydown", handle),
				(swiper.keyboard.enabled = !0));
		}
		function disable() {
			swiper.keyboard.enabled &&
				(document.removeEventListener("keydown", handle),
				(swiper.keyboard.enabled = !1));
		}
		(swiper.keyboard = { enabled: !1 }),
			extendParams({
				keyboard: { enabled: !1, onlyInViewport: !0, pageUpDown: !0 },
			}),
			on("init", () => {
				swiper.params.keyboard.enabled && enable();
			}),
			on("destroy", () => {
				swiper.keyboard.enabled && disable();
			}),
			Object.assign(swiper.keyboard, { enable: enable, disable: disable });
	}
	function Mousewheel(_ref) {
		let {
			swiper: swiper,
			extendParams: extendParams,
			on: on,
			emit: emit,
		} = _ref;
		const window = getWindow();
		let timeout;
		extendParams({
			mousewheel: {
				enabled: !1,
				releaseOnEdges: !1,
				invert: !1,
				forceToAxis: !1,
				sensitivity: 1,
				eventsTarget: "container",
				thresholdDelta: null,
				thresholdTime: null,
				noMousewheelClass: "swiper-no-mousewheel",
			},
		}),
			(swiper.mousewheel = { enabled: !1 });
		let lastScrollTime = now(),
			lastEventBeforeSnap;
		const recentWheelEvents = [];
		function normalize(e) {
			const PIXEL_STEP = 10,
				LINE_HEIGHT = 40,
				PAGE_HEIGHT = 800;
			let sX = 0,
				sY = 0,
				pX = 0,
				pY = 0;
			return (
				"detail" in e && (sY = e.detail),
				"wheelDelta" in e && (sY = -e.wheelDelta / 120),
				"wheelDeltaY" in e && (sY = -e.wheelDeltaY / 120),
				"wheelDeltaX" in e && (sX = -e.wheelDeltaX / 120),
				"axis" in e && e.axis === e.HORIZONTAL_AXIS && ((sX = sY), (sY = 0)),
				(pX = 10 * sX),
				(pY = 10 * sY),
				"deltaY" in e && (pY = e.deltaY),
				"deltaX" in e && (pX = e.deltaX),
				e.shiftKey && !pX && ((pX = pY), (pY = 0)),
				(pX || pY) &&
					e.deltaMode &&
					(1 === e.deltaMode
						? ((pX *= 40), (pY *= 40))
						: ((pX *= 800), (pY *= 800))),
				pX && !sX && (sX = pX < 1 ? -1 : 1),
				pY && !sY && (sY = pY < 1 ? -1 : 1),
				{ spinX: sX, spinY: sY, pixelX: pX, pixelY: pY }
			);
		}
		function handleMouseEnter() {
			swiper.enabled && (swiper.mouseEntered = !0);
		}
		function handleMouseLeave() {
			swiper.enabled && (swiper.mouseEntered = !1);
		}
		function animateSlider(newEvent) {
			return (
				!(
					swiper.params.mousewheel.thresholdDelta &&
					newEvent.delta < swiper.params.mousewheel.thresholdDelta
				) &&
				!(
					swiper.params.mousewheel.thresholdTime &&
					now() - lastScrollTime < swiper.params.mousewheel.thresholdTime
				) &&
				((newEvent.delta >= 6 && now() - lastScrollTime < 60) ||
					(newEvent.direction < 0
						? (swiper.isEnd && !swiper.params.loop) ||
						  swiper.animating ||
						  (swiper.slideNext(), emit("scroll", newEvent.raw))
						: (swiper.isBeginning && !swiper.params.loop) ||
						  swiper.animating ||
						  (swiper.slidePrev(), emit("scroll", newEvent.raw)),
					(lastScrollTime = new window.Date().getTime()),
					!1))
			);
		}
		function releaseScroll(newEvent) {
			const params = swiper.params.mousewheel;
			if (newEvent.direction < 0) {
				if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges)
					return !0;
			} else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) return !0;
			return !1;
		}
		function handle(event) {
			let e = event,
				disableParentSwiper = !0;
			if (!swiper.enabled) return;
			if (
				event.target.closest(`.${swiper.params.mousewheel.noMousewheelClass}`)
			)
				return;
			const params = swiper.params.mousewheel;
			swiper.params.cssMode && e.preventDefault();
			let targetEl = swiper.el;
			"container" !== swiper.params.mousewheel.eventsTarget &&
				(targetEl = document.querySelector(
					swiper.params.mousewheel.eventsTarget
				));
			const targetElContainsTarget = targetEl && targetEl.contains(e.target);
			if (
				!swiper.mouseEntered &&
				!targetElContainsTarget &&
				!params.releaseOnEdges
			)
				return !0;
			e.originalEvent && (e = e.originalEvent);
			let delta = 0;
			const rtlFactor = swiper.rtlTranslate ? -1 : 1,
				data = normalize(e);
			if (params.forceToAxis)
				if (swiper.isHorizontal()) {
					if (!(Math.abs(data.pixelX) > Math.abs(data.pixelY))) return !0;
					delta = -data.pixelX * rtlFactor;
				} else {
					if (!(Math.abs(data.pixelY) > Math.abs(data.pixelX))) return !0;
					delta = -data.pixelY;
				}
			else
				delta =
					Math.abs(data.pixelX) > Math.abs(data.pixelY)
						? -data.pixelX * rtlFactor
						: -data.pixelY;
			if (0 === delta) return !0;
			params.invert && (delta = -delta);
			let positions = swiper.getTranslate() + delta * params.sensitivity;
			if (
				(positions >= swiper.minTranslate() &&
					(positions = swiper.minTranslate()),
				positions <= swiper.maxTranslate() &&
					(positions = swiper.maxTranslate()),
				(disableParentSwiper =
					!!swiper.params.loop ||
					!(
						positions === swiper.minTranslate() ||
						positions === swiper.maxTranslate()
					)),
				disableParentSwiper && swiper.params.nested && e.stopPropagation(),
				swiper.params.freeMode && swiper.params.freeMode.enabled)
			) {
				const newEvent = {
						time: now(),
						delta: Math.abs(delta),
						direction: Math.sign(delta),
					},
					ignoreWheelEvents =
						lastEventBeforeSnap &&
						newEvent.time < lastEventBeforeSnap.time + 500 &&
						newEvent.delta <= lastEventBeforeSnap.delta &&
						newEvent.direction === lastEventBeforeSnap.direction;
				if (!ignoreWheelEvents) {
					lastEventBeforeSnap = void 0;
					let position = swiper.getTranslate() + delta * params.sensitivity;
					const wasBeginning = swiper.isBeginning,
						wasEnd = swiper.isEnd;
					if (
						(position >= swiper.minTranslate() &&
							(position = swiper.minTranslate()),
						position <= swiper.maxTranslate() &&
							(position = swiper.maxTranslate()),
						swiper.setTransition(0),
						swiper.setTranslate(position),
						swiper.updateProgress(),
						swiper.updateActiveIndex(),
						swiper.updateSlidesClasses(),
						((!wasBeginning && swiper.isBeginning) ||
							(!wasEnd && swiper.isEnd)) &&
							swiper.updateSlidesClasses(),
						swiper.params.loop &&
							swiper.loopFix({
								direction: newEvent.direction < 0 ? "next" : "prev",
								byMousewheel: !0,
							}),
						swiper.params.freeMode.sticky)
					) {
						clearTimeout(timeout),
							(timeout = void 0),
							recentWheelEvents.length >= 15 && recentWheelEvents.shift();
						const prevEvent = recentWheelEvents.length
								? recentWheelEvents[recentWheelEvents.length - 1]
								: void 0,
							firstEvent = recentWheelEvents[0];
						if (
							(recentWheelEvents.push(newEvent),
							prevEvent &&
								(newEvent.delta > prevEvent.delta ||
									newEvent.direction !== prevEvent.direction))
						)
							recentWheelEvents.splice(0);
						else if (
							recentWheelEvents.length >= 15 &&
							newEvent.time - firstEvent.time < 500 &&
							firstEvent.delta - newEvent.delta >= 1 &&
							newEvent.delta <= 6
						) {
							const snapToThreshold = delta > 0 ? 0.8 : 0.2;
							(lastEventBeforeSnap = newEvent),
								recentWheelEvents.splice(0),
								(timeout = nextTick(() => {
									swiper.slideToClosest(
										swiper.params.speed,
										!0,
										void 0,
										snapToThreshold
									);
								}, 0));
						}
						timeout ||
							(timeout = nextTick(() => {
								const snapToThreshold = 0.5;
								(lastEventBeforeSnap = newEvent),
									recentWheelEvents.splice(0),
									swiper.slideToClosest(swiper.params.speed, !0, void 0, 0.5);
							}, 500));
					}
					if (
						(ignoreWheelEvents || emit("scroll", e),
						swiper.params.autoplay &&
							swiper.params.autoplayDisableOnInteraction &&
							swiper.autoplay.stop(),
						position === swiper.minTranslate() ||
							position === swiper.maxTranslate())
					)
						return !0;
				}
			} else {
				const newEvent = {
					time: now(),
					delta: Math.abs(delta),
					direction: Math.sign(delta),
					raw: event,
				};
				recentWheelEvents.length >= 2 && recentWheelEvents.shift();
				const prevEvent = recentWheelEvents.length
					? recentWheelEvents[recentWheelEvents.length - 1]
					: void 0;
				if (
					(recentWheelEvents.push(newEvent),
					prevEvent
						? (newEvent.direction !== prevEvent.direction ||
								newEvent.delta > prevEvent.delta ||
								newEvent.time > prevEvent.time + 150) &&
						  animateSlider(newEvent)
						: animateSlider(newEvent),
					releaseScroll(newEvent))
				)
					return !0;
			}
			return e.preventDefault ? e.preventDefault() : (e.returnValue = !1), !1;
		}
		function events(method) {
			let targetEl = swiper.el;
			"container" !== swiper.params.mousewheel.eventsTarget &&
				(targetEl = document.querySelector(
					swiper.params.mousewheel.eventsTarget
				)),
				targetEl[method]("mouseenter", handleMouseEnter),
				targetEl[method]("mouseleave", handleMouseLeave),
				targetEl[method]("wheel", handle);
		}
		function enable() {
			return swiper.params.cssMode
				? (swiper.wrapperEl.removeEventListener("wheel", handle), !0)
				: !swiper.mousewheel.enabled &&
						(events("addEventListener"), (swiper.mousewheel.enabled = !0), !0);
		}
		function disable() {
			return swiper.params.cssMode
				? (swiper.wrapperEl.addEventListener(event, handle), !0)
				: !!swiper.mousewheel.enabled &&
						(events("removeEventListener"),
						(swiper.mousewheel.enabled = !1),
						!0);
		}
		on("init", () => {
			!swiper.params.mousewheel.enabled && swiper.params.cssMode && disable(),
				swiper.params.mousewheel.enabled && enable();
		}),
			on("destroy", () => {
				swiper.params.cssMode && enable(),
					swiper.mousewheel.enabled && disable();
			}),
			Object.assign(swiper.mousewheel, { enable: enable, disable: disable });
	}
	function createElementIfNotDefined(
		swiper,
		originalParams,
		params,
		checkProps
	) {
		return (
			swiper.params.createElements &&
				Object.keys(checkProps).forEach((key) => {
					if (!params[key] && !0 === params.auto) {
						let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
						element ||
							((element = createElement("div", checkProps[key])),
							(element.className = checkProps[key]),
							swiper.el.append(element)),
							(params[key] = element),
							(originalParams[key] = element);
					}
				}),
			params
		);
	}
	function Navigation(_ref) {
		let {
			swiper: swiper,
			extendParams: extendParams,
			on: on,
			emit: emit,
		} = _ref;
		extendParams({
			navigation: {
				nextEl: null,
				prevEl: null,
				hideOnClick: !1,
				disabledClass: "swiper-button-disabled",
				hiddenClass: "swiper-button-hidden",
				lockClass: "swiper-button-lock",
				navigationDisabledClass: "swiper-navigation-disabled",
			},
		}),
			(swiper.navigation = { nextEl: null, prevEl: null });
		const makeElementsArray = (el) => (
			Array.isArray(el) || (el = [el].filter((e) => !!e)), el
		);
		function getEl(el) {
			let res;
			return el &&
				"string" == typeof el &&
				swiper.isElement &&
				((res = swiper.el.shadowRoot.querySelector(el)), res)
				? res
				: (el &&
						("string" == typeof el &&
							(res = [...document.querySelectorAll(el)]),
						swiper.params.uniqueNavElements &&
							"string" == typeof el &&
							res.length > 1 &&
							1 === swiper.el.querySelectorAll(el).length &&
							(res = swiper.el.querySelector(el))),
				  el && !res ? el : res);
		}
		function toggleEl(el, disabled) {
			const params = swiper.params.navigation;
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl &&
					(subEl.classList[disabled ? "add" : "remove"](
						...params.disabledClass.split(" ")
					),
					"BUTTON" === subEl.tagName && (subEl.disabled = disabled),
					swiper.params.watchOverflow &&
						swiper.enabled &&
						subEl.classList[swiper.isLocked ? "add" : "remove"](
							params.lockClass
						));
			});
		}
		function update() {
			const { nextEl: nextEl, prevEl: prevEl } = swiper.navigation;
			if (swiper.params.loop)
				return toggleEl(prevEl, !1), void toggleEl(nextEl, !1);
			toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind),
				toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
		}
		function onPrevClick(e) {
			e.preventDefault(),
				(!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) &&
					(swiper.slidePrev(), emit("navigationPrev"));
		}
		function onNextClick(e) {
			e.preventDefault(),
				(!swiper.isEnd || swiper.params.loop || swiper.params.rewind) &&
					(swiper.slideNext(), emit("navigationNext"));
		}
		function init() {
			const params = swiper.params.navigation;
			if (
				((swiper.params.navigation = createElementIfNotDefined(
					swiper,
					swiper.originalParams.navigation,
					swiper.params.navigation,
					{ nextEl: "swiper-button-next", prevEl: "swiper-button-prev" }
				)),
				!params.nextEl && !params.prevEl)
			)
				return;
			let nextEl = getEl(params.nextEl),
				prevEl = getEl(params.prevEl);
			Object.assign(swiper.navigation, { nextEl: nextEl, prevEl: prevEl }),
				(nextEl = makeElementsArray(nextEl)),
				(prevEl = makeElementsArray(prevEl));
			const initButton = (el, dir) => {
				el &&
					el.addEventListener(
						"click",
						"next" === dir ? onNextClick : onPrevClick
					),
					!swiper.enabled &&
						el &&
						el.classList.add(...params.lockClass.split(" "));
			};
			nextEl.forEach((el) => initButton(el, "next")),
				prevEl.forEach((el) => initButton(el, "prev"));
		}
		function destroy() {
			let { nextEl: nextEl, prevEl: prevEl } = swiper.navigation;
			(nextEl = makeElementsArray(nextEl)),
				(prevEl = makeElementsArray(prevEl));
			const destroyButton = (el, dir) => {
				el.removeEventListener(
					"click",
					"next" === dir ? onNextClick : onPrevClick
				),
					el.classList.remove(
						...swiper.params.navigation.disabledClass.split(" ")
					);
			};
			nextEl.forEach((el) => destroyButton(el, "next")),
				prevEl.forEach((el) => destroyButton(el, "prev"));
		}
		on("init", () => {
			!1 === swiper.params.navigation.enabled ? disable() : (init(), update());
		}),
			on("toEdge fromEdge lock unlock", () => {
				update();
			}),
			on("destroy", () => {
				destroy();
			}),
			on("enable disable", () => {
				let { nextEl: nextEl, prevEl: prevEl } = swiper.navigation;
				(nextEl = makeElementsArray(nextEl)),
					(prevEl = makeElementsArray(prevEl)),
					[...nextEl, ...prevEl]
						.filter((el) => !!el)
						.forEach((el) =>
							el.classList[swiper.enabled ? "remove" : "add"](
								swiper.params.navigation.lockClass
							)
						);
			}),
			on("click", (_s, e) => {
				let { nextEl: nextEl, prevEl: prevEl } = swiper.navigation;
				(nextEl = makeElementsArray(nextEl)),
					(prevEl = makeElementsArray(prevEl));
				const targetEl = e.target;
				if (
					swiper.params.navigation.hideOnClick &&
					!prevEl.includes(targetEl) &&
					!nextEl.includes(targetEl)
				) {
					if (
						swiper.pagination &&
						swiper.params.pagination &&
						swiper.params.pagination.clickable &&
						(swiper.pagination.el === targetEl ||
							swiper.pagination.el.contains(targetEl))
					)
						return;
					let isHidden;
					nextEl.length
						? (isHidden = nextEl[0].classList.contains(
								swiper.params.navigation.hiddenClass
						  ))
						: prevEl.length &&
						  (isHidden = prevEl[0].classList.contains(
								swiper.params.navigation.hiddenClass
						  )),
						emit(!0 === isHidden ? "navigationShow" : "navigationHide"),
						[...nextEl, ...prevEl]
							.filter((el) => !!el)
							.forEach((el) =>
								el.classList.toggle(swiper.params.navigation.hiddenClass)
							);
				}
			});
		const enable = () => {
				swiper.el.classList.remove(
					...swiper.params.navigation.navigationDisabledClass.split(" ")
				),
					init(),
					update();
			},
			disable = () => {
				swiper.el.classList.add(
					...swiper.params.navigation.navigationDisabledClass.split(" ")
				),
					destroy();
			};
		Object.assign(swiper.navigation, {
			enable: enable,
			disable: disable,
			update: update,
			init: init,
			destroy: destroy,
		});
	}
	function classesToSelector(classes) {
		return (
			void 0 === classes && (classes = ""),
			`.${classes
				.trim()
				.replace(/([\.:!+\/])/g, "\\$1")
				.replace(/ /g, ".")}`
		);
	}
	function Pagination(_ref) {
		let {
			swiper: swiper,
			extendParams: extendParams,
			on: on,
			emit: emit,
		} = _ref;
		const pfx = "swiper-pagination";
		let bulletSize;
		extendParams({
			pagination: {
				el: null,
				bulletElement: "span",
				clickable: !1,
				hideOnClick: !1,
				renderBullet: null,
				renderProgressbar: null,
				renderFraction: null,
				renderCustom: null,
				progressbarOpposite: !1,
				type: "bullets",
				dynamicBullets: !1,
				dynamicMainBullets: 1,
				formatFractionCurrent: (number) => number,
				formatFractionTotal: (number) => number,
				bulletClass: `${pfx}-bullet`,
				bulletActiveClass: `${pfx}-bullet-active`,
				modifierClass: `${pfx}-`,
				currentClass: `${pfx}-current`,
				totalClass: `${pfx}-total`,
				hiddenClass: `${pfx}-hidden`,
				progressbarFillClass: `${pfx}-progressbar-fill`,
				progressbarOppositeClass: `${pfx}-progressbar-opposite`,
				clickableClass: `${pfx}-clickable`,
				lockClass: `${pfx}-lock`,
				horizontalClass: `${pfx}-horizontal`,
				verticalClass: `${pfx}-vertical`,
				paginationDisabledClass: `${pfx}-disabled`,
			},
		}),
			(swiper.pagination = { el: null, bullets: [] });
		let dynamicBulletIndex = 0;
		const makeElementsArray = (el) => (
			Array.isArray(el) || (el = [el].filter((e) => !!e)), el
		);
		function isPaginationDisabled() {
			return (
				!swiper.params.pagination.el ||
				!swiper.pagination.el ||
				(Array.isArray(swiper.pagination.el) &&
					0 === swiper.pagination.el.length)
			);
		}
		function setSideBullets(bulletEl, position) {
			const { bulletActiveClass: bulletActiveClass } = swiper.params.pagination;
			bulletEl &&
				(bulletEl =
					bulletEl[
						`${"prev" === position ? "previous" : "next"}ElementSibling`
					]) &&
				(bulletEl.classList.add(`${bulletActiveClass}-${position}`),
				(bulletEl =
					bulletEl[
						`${"prev" === position ? "previous" : "next"}ElementSibling`
					]) &&
					bulletEl.classList.add(
						`${bulletActiveClass}-${position}-${position}`
					));
		}
		function onBulletClick(e) {
			const bulletEl = e.target.closest(
				classesToSelector(swiper.params.pagination.bulletClass)
			);
			if (!bulletEl) return;
			e.preventDefault();
			const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
			if (swiper.params.loop) {
				if (swiper.realIndex === index) return;
				const newSlideIndex = swiper.getSlideIndexByData(index),
					currentSlideIndex = swiper.getSlideIndexByData(swiper.realIndex);
				newSlideIndex > swiper.slides.length - swiper.loopedSlides &&
					swiper.loopFix({
						direction: newSlideIndex > currentSlideIndex ? "next" : "prev",
						activeSlideIndex: newSlideIndex,
						slideTo: !1,
					}),
					swiper.slideToLoop(index);
			} else swiper.slideTo(index);
		}
		function update() {
			const rtl = swiper.rtl,
				params = swiper.params.pagination;
			if (isPaginationDisabled()) return;
			let el = swiper.pagination.el,
				current,
				previousIndex;
			el = makeElementsArray(el);
			const slidesLength =
					swiper.virtual && swiper.params.virtual.enabled
						? swiper.virtual.slides.length
						: swiper.slides.length,
				total = swiper.params.loop
					? Math.ceil(slidesLength / swiper.params.slidesPerGroup)
					: swiper.snapGrid.length;
			if (
				(swiper.params.loop
					? ((previousIndex = swiper.previousRealIndex || 0),
					  (current =
							swiper.params.slidesPerGroup > 1
								? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup)
								: swiper.realIndex))
					: void 0 !== swiper.snapIndex
					? ((current = swiper.snapIndex),
					  (previousIndex = swiper.previousSnapIndex))
					: ((previousIndex = swiper.previousIndex || 0),
					  (current = swiper.activeIndex || 0)),
				"bullets" === params.type &&
					swiper.pagination.bullets &&
					swiper.pagination.bullets.length > 0)
			) {
				const bullets = swiper.pagination.bullets;
				let firstIndex, lastIndex, midIndex;
				if (
					(params.dynamicBullets &&
						((bulletSize = elementOuterSize(
							bullets[0],
							swiper.isHorizontal() ? "width" : "height",
							!0
						)),
						el.forEach((subEl) => {
							subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${
								bulletSize * (params.dynamicMainBullets + 4)
							}px`;
						}),
						params.dynamicMainBullets > 1 &&
							void 0 !== previousIndex &&
							((dynamicBulletIndex += current - (previousIndex || 0)),
							dynamicBulletIndex > params.dynamicMainBullets - 1
								? (dynamicBulletIndex = params.dynamicMainBullets - 1)
								: dynamicBulletIndex < 0 && (dynamicBulletIndex = 0)),
						(firstIndex = Math.max(current - dynamicBulletIndex, 0)),
						(lastIndex =
							firstIndex +
							(Math.min(bullets.length, params.dynamicMainBullets) - 1)),
						(midIndex = (lastIndex + firstIndex) / 2)),
					bullets.forEach((bulletEl) => {
						const classesToRemove = [
							...[
								"",
								"-next",
								"-next-next",
								"-prev",
								"-prev-prev",
								"-main",
							].map((suffix) => `${params.bulletActiveClass}${suffix}`),
						]
							.map((s) =>
								"string" == typeof s && s.includes(" ") ? s.split(" ") : s
							)
							.flat();
						bulletEl.classList.remove(...classesToRemove);
					}),
					el.length > 1)
				)
					bullets.forEach((bullet) => {
						const bulletIndex = elementIndex(bullet);
						bulletIndex === current
							? bullet.classList.add(...params.bulletActiveClass.split(" "))
							: swiper.isElement && bullet.setAttribute("part", "bullet"),
							params.dynamicBullets &&
								(bulletIndex >= firstIndex &&
									bulletIndex <= lastIndex &&
									bullet.classList.add(
										...`${params.bulletActiveClass}-main`.split(" ")
									),
								bulletIndex === firstIndex && setSideBullets(bullet, "prev"),
								bulletIndex === lastIndex && setSideBullets(bullet, "next"));
					});
				else {
					const bullet = bullets[current];
					if (
						(bullet &&
							bullet.classList.add(...params.bulletActiveClass.split(" ")),
						swiper.isElement &&
							bullets.forEach((bulletEl, bulletIndex) => {
								bulletEl.setAttribute(
									"part",
									bulletIndex === current ? "bullet-active" : "bullet"
								);
							}),
						params.dynamicBullets)
					) {
						const firstDisplayedBullet = bullets[firstIndex],
							lastDisplayedBullet = bullets[lastIndex];
						for (let i = firstIndex; i <= lastIndex; i += 1)
							bullets[i] &&
								bullets[i].classList.add(
									...`${params.bulletActiveClass}-main`.split(" ")
								);
						setSideBullets(firstDisplayedBullet, "prev"),
							setSideBullets(lastDisplayedBullet, "next");
					}
				}
				if (params.dynamicBullets) {
					const dynamicBulletsLength = Math.min(
							bullets.length,
							params.dynamicMainBullets + 4
						),
						bulletsOffset =
							(bulletSize * dynamicBulletsLength - bulletSize) / 2 -
							midIndex * bulletSize,
						offsetProp = rtl ? "right" : "left";
					bullets.forEach((bullet) => {
						bullet.style[
							swiper.isHorizontal() ? offsetProp : "top"
						] = `${bulletsOffset}px`;
					});
				}
			}
			el.forEach((subEl, subElIndex) => {
				if (
					("fraction" === params.type &&
						(subEl
							.querySelectorAll(classesToSelector(params.currentClass))
							.forEach((fractionEl) => {
								fractionEl.textContent = params.formatFractionCurrent(
									current + 1
								);
							}),
						subEl
							.querySelectorAll(classesToSelector(params.totalClass))
							.forEach((totalEl) => {
								totalEl.textContent = params.formatFractionTotal(total);
							})),
					"progressbar" === params.type)
				) {
					let progressbarDirection;
					progressbarDirection = params.progressbarOpposite
						? swiper.isHorizontal()
							? "vertical"
							: "horizontal"
						: swiper.isHorizontal()
						? "horizontal"
						: "vertical";
					const scale = (current + 1) / total;
					let scaleX = 1,
						scaleY = 1;
					"horizontal" === progressbarDirection
						? (scaleX = scale)
						: (scaleY = scale),
						subEl
							.querySelectorAll(classesToSelector(params.progressbarFillClass))
							.forEach((progressEl) => {
								(progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`),
									(progressEl.style.transitionDuration = `${swiper.params.speed}ms`);
							});
				}
				"custom" === params.type && params.renderCustom
					? ((subEl.innerHTML = params.renderCustom(
							swiper,
							current + 1,
							total
					  )),
					  0 === subElIndex && emit("paginationRender", subEl))
					: (0 === subElIndex && emit("paginationRender", subEl),
					  emit("paginationUpdate", subEl)),
					swiper.params.watchOverflow &&
						swiper.enabled &&
						subEl.classList[swiper.isLocked ? "add" : "remove"](
							params.lockClass
						);
			});
		}
		function render() {
			const params = swiper.params.pagination;
			if (isPaginationDisabled()) return;
			const slidesLength =
				swiper.virtual && swiper.params.virtual.enabled
					? swiper.virtual.slides.length
					: swiper.slides.length;
			let el = swiper.pagination.el;
			el = makeElementsArray(el);
			let paginationHTML = "";
			if ("bullets" === params.type) {
				let numberOfBullets = swiper.params.loop
					? Math.ceil(slidesLength / swiper.params.slidesPerGroup)
					: swiper.snapGrid.length;
				swiper.params.freeMode &&
					swiper.params.freeMode.enabled &&
					numberOfBullets > slidesLength &&
					(numberOfBullets = slidesLength);
				for (let i = 0; i < numberOfBullets; i += 1)
					params.renderBullet
						? (paginationHTML += params.renderBullet.call(
								swiper,
								i,
								params.bulletClass
						  ))
						: (paginationHTML += `<${params.bulletElement} ${
								swiper.isElement ? 'part="bullet"' : ""
						  } class="${params.bulletClass}"></${params.bulletElement}>`);
			}
			"fraction" === params.type &&
				(paginationHTML = params.renderFraction
					? params.renderFraction.call(
							swiper,
							params.currentClass,
							params.totalClass
					  )
					: `<span class="${params.currentClass}"></span>` +
					  " / " +
					  `<span class="${params.totalClass}"></span>`),
				"progressbar" === params.type &&
					(paginationHTML = params.renderProgressbar
						? params.renderProgressbar.call(swiper, params.progressbarFillClass)
						: `<span class="${params.progressbarFillClass}"></span>`),
				(swiper.pagination.bullets = []),
				el.forEach((subEl) => {
					"custom" !== params.type && (subEl.innerHTML = paginationHTML || ""),
						"bullets" === params.type &&
							swiper.pagination.bullets.push(
								...subEl.querySelectorAll(classesToSelector(params.bulletClass))
							);
				}),
				"custom" !== params.type && emit("paginationRender", el[0]);
		}
		function init() {
			swiper.params.pagination = createElementIfNotDefined(
				swiper,
				swiper.originalParams.pagination,
				swiper.params.pagination,
				{ el: "swiper-pagination" }
			);
			const params = swiper.params.pagination;
			if (!params.el) return;
			let el;
			"string" == typeof params.el &&
				swiper.isElement &&
				(el = swiper.el.shadowRoot.querySelector(params.el)),
				el ||
					"string" != typeof params.el ||
					(el = [...document.querySelectorAll(params.el)]),
				el || (el = params.el),
				el &&
					0 !== el.length &&
					(swiper.params.uniqueNavElements &&
						"string" == typeof params.el &&
						Array.isArray(el) &&
						el.length > 1 &&
						((el = [...swiper.el.querySelectorAll(params.el)]),
						el.length > 1 &&
							(el = el.filter(
								(subEl) => elementParents(subEl, ".swiper")[0] === swiper.el
							)[0])),
					Array.isArray(el) && 1 === el.length && (el = el[0]),
					Object.assign(swiper.pagination, { el: el }),
					(el = makeElementsArray(el)),
					el.forEach((subEl) => {
						"bullets" === params.type &&
							params.clickable &&
							subEl.classList.add(params.clickableClass),
							subEl.classList.add(params.modifierClass + params.type),
							subEl.classList.add(
								swiper.isHorizontal()
									? params.horizontalClass
									: params.verticalClass
							),
							"bullets" === params.type &&
								params.dynamicBullets &&
								(subEl.classList.add(
									`${params.modifierClass}${params.type}-dynamic`
								),
								(dynamicBulletIndex = 0),
								params.dynamicMainBullets < 1 &&
									(params.dynamicMainBullets = 1)),
							"progressbar" === params.type &&
								params.progressbarOpposite &&
								subEl.classList.add(params.progressbarOppositeClass),
							params.clickable &&
								subEl.addEventListener("click", onBulletClick),
							swiper.enabled || subEl.classList.add(params.lockClass);
					}));
		}
		function destroy() {
			const params = swiper.params.pagination;
			if (isPaginationDisabled()) return;
			let el = swiper.pagination.el;
			el &&
				((el = makeElementsArray(el)),
				el.forEach((subEl) => {
					subEl.classList.remove(params.hiddenClass),
						subEl.classList.remove(params.modifierClass + params.type),
						subEl.classList.remove(
							swiper.isHorizontal()
								? params.horizontalClass
								: params.verticalClass
						),
						params.clickable &&
							subEl.removeEventListener("click", onBulletClick);
				})),
				swiper.pagination.bullets &&
					swiper.pagination.bullets.forEach((subEl) =>
						subEl.classList.remove(...params.bulletActiveClass.split(" "))
					);
		}
		on("changeDirection", () => {
			if (!swiper.pagination || !swiper.pagination.el) return;
			const params = swiper.params.pagination;
			let { el: el } = swiper.pagination;
			(el = makeElementsArray(el)),
				el.forEach((subEl) => {
					subEl.classList.remove(params.horizontalClass, params.verticalClass),
						subEl.classList.add(
							swiper.isHorizontal()
								? params.horizontalClass
								: params.verticalClass
						);
				});
		}),
			on("init", () => {
				!1 === swiper.params.pagination.enabled
					? disable()
					: (init(), render(), update());
			}),
			on("activeIndexChange", () => {
				void 0 === swiper.snapIndex && update();
			}),
			on("snapIndexChange", () => {
				update();
			}),
			on("snapGridLengthChange", () => {
				render(), update();
			}),
			on("destroy", () => {
				destroy();
			}),
			on("enable disable", () => {
				let { el: el } = swiper.pagination;
				el &&
					((el = makeElementsArray(el)),
					el.forEach((subEl) =>
						subEl.classList[swiper.enabled ? "remove" : "add"](
							swiper.params.pagination.lockClass
						)
					));
			}),
			on("lock unlock", () => {
				update();
			}),
			on("click", (_s, e) => {
				const targetEl = e.target;
				let { el: el } = swiper.pagination;
				if (
					(Array.isArray(el) || (el = [el].filter((element) => !!element)),
					swiper.params.pagination.el &&
						swiper.params.pagination.hideOnClick &&
						el &&
						el.length > 0 &&
						!targetEl.classList.contains(swiper.params.pagination.bulletClass))
				) {
					if (
						swiper.navigation &&
						((swiper.navigation.nextEl &&
							targetEl === swiper.navigation.nextEl) ||
							(swiper.navigation.prevEl &&
								targetEl === swiper.navigation.prevEl))
					)
						return;
					const isHidden = el[0].classList.contains(
						swiper.params.pagination.hiddenClass
					);
					emit(!0 === isHidden ? "paginationShow" : "paginationHide"),
						el.forEach((subEl) =>
							subEl.classList.toggle(swiper.params.pagination.hiddenClass)
						);
				}
			});
		const enable = () => {
				swiper.el.classList.remove(
					swiper.params.pagination.paginationDisabledClass
				);
				let { el: el } = swiper.pagination;
				el &&
					((el = makeElementsArray(el)),
					el.forEach((subEl) =>
						subEl.classList.remove(
							swiper.params.pagination.paginationDisabledClass
						)
					)),
					init(),
					render(),
					update();
			},
			disable = () => {
				swiper.el.classList.add(
					swiper.params.pagination.paginationDisabledClass
				);
				let { el: el } = swiper.pagination;
				el &&
					((el = makeElementsArray(el)),
					el.forEach((subEl) =>
						subEl.classList.add(
							swiper.params.pagination.paginationDisabledClass
						)
					)),
					destroy();
			};
		Object.assign(swiper.pagination, {
			enable: enable,
			disable: disable,
			render: render,
			update: update,
			init: init,
			destroy: destroy,
		});
	}
	function Scrollbar(_ref) {
		let {
			swiper: swiper,
			extendParams: extendParams,
			on: on,
			emit: emit,
		} = _ref;
		const document = getDocument();
		let isTouched = !1,
			timeout = null,
			dragTimeout = null,
			dragStartPos,
			dragSize,
			trackSize,
			divider;
		function setTranslate() {
			if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
			const { scrollbar: scrollbar, rtlTranslate: rtl } = swiper,
				{ dragEl: dragEl, el: el } = scrollbar,
				params = swiper.params.scrollbar,
				progress = swiper.params.loop ? swiper.progressLoop : swiper.progress;
			let newSize = dragSize,
				newPos = (trackSize - dragSize) * progress;
			rtl
				? ((newPos = -newPos),
				  newPos > 0
						? ((newSize = dragSize - newPos), (newPos = 0))
						: -newPos + dragSize > trackSize && (newSize = trackSize + newPos))
				: newPos < 0
				? ((newSize = dragSize + newPos), (newPos = 0))
				: newPos + dragSize > trackSize && (newSize = trackSize - newPos),
				swiper.isHorizontal()
					? ((dragEl.style.transform = `translate3d(${newPos}px, 0, 0)`),
					  (dragEl.style.width = `${newSize}px`))
					: ((dragEl.style.transform = `translate3d(0px, ${newPos}px, 0)`),
					  (dragEl.style.height = `${newSize}px`)),
				params.hide &&
					(clearTimeout(timeout),
					(el.style.opacity = 1),
					(timeout = setTimeout(() => {
						(el.style.opacity = 0), (el.style.transitionDuration = "400ms");
					}, 1e3)));
		}
		function setTransition(duration) {
			swiper.params.scrollbar.el &&
				swiper.scrollbar.el &&
				(swiper.scrollbar.dragEl.style.transitionDuration = `${duration}ms`);
		}
		function updateSize() {
			if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
			const { scrollbar: scrollbar } = swiper,
				{ dragEl: dragEl, el: el } = scrollbar;
			(dragEl.style.width = ""),
				(dragEl.style.height = ""),
				(trackSize = swiper.isHorizontal() ? el.offsetWidth : el.offsetHeight),
				(divider =
					swiper.size /
					(swiper.virtualSize +
						swiper.params.slidesOffsetBefore -
						(swiper.params.centeredSlides ? swiper.snapGrid[0] : 0))),
				(dragSize =
					"auto" === swiper.params.scrollbar.dragSize
						? trackSize * divider
						: parseInt(swiper.params.scrollbar.dragSize, 10)),
				swiper.isHorizontal()
					? (dragEl.style.width = `${dragSize}px`)
					: (dragEl.style.height = `${dragSize}px`),
				(el.style.display = divider >= 1 ? "none" : ""),
				swiper.params.scrollbar.hide && (el.style.opacity = 0),
				swiper.params.watchOverflow &&
					swiper.enabled &&
					scrollbar.el.classList[swiper.isLocked ? "add" : "remove"](
						swiper.params.scrollbar.lockClass
					);
		}
		function getPointerPosition(e) {
			return swiper.isHorizontal() ? e.clientX : e.clientY;
		}
		function setDragPosition(e) {
			const { scrollbar: scrollbar, rtlTranslate: rtl } = swiper,
				{ el: el } = scrollbar;
			let positionRatio;
			(positionRatio =
				(getPointerPosition(e) -
					elementOffset(el)[swiper.isHorizontal() ? "left" : "top"] -
					(null !== dragStartPos ? dragStartPos : dragSize / 2)) /
				(trackSize - dragSize)),
				(positionRatio = Math.max(Math.min(positionRatio, 1), 0)),
				rtl && (positionRatio = 1 - positionRatio);
			const position =
				swiper.minTranslate() +
				(swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
			swiper.updateProgress(position),
				swiper.setTranslate(position),
				swiper.updateActiveIndex(),
				swiper.updateSlidesClasses();
		}
		function onDragStart(e) {
			const params = swiper.params.scrollbar,
				{ scrollbar: scrollbar, wrapperEl: wrapperEl } = swiper,
				{ el: el, dragEl: dragEl } = scrollbar;
			(isTouched = !0),
				(dragStartPos =
					e.target === dragEl
						? getPointerPosition(e) -
						  e.target.getBoundingClientRect()[
								swiper.isHorizontal() ? "left" : "top"
						  ]
						: null),
				e.preventDefault(),
				e.stopPropagation(),
				(wrapperEl.style.transitionDuration = "100ms"),
				(dragEl.style.transitionDuration = "100ms"),
				setDragPosition(e),
				clearTimeout(dragTimeout),
				(el.style.transitionDuration = "0ms"),
				params.hide && (el.style.opacity = 1),
				swiper.params.cssMode &&
					(swiper.wrapperEl.style["scroll-snap-type"] = "none"),
				emit("scrollbarDragStart", e);
		}
		function onDragMove(e) {
			const { scrollbar: scrollbar, wrapperEl: wrapperEl } = swiper,
				{ el: el, dragEl: dragEl } = scrollbar;
			isTouched &&
				(e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
				setDragPosition(e),
				(wrapperEl.style.transitionDuration = "0ms"),
				(el.style.transitionDuration = "0ms"),
				(dragEl.style.transitionDuration = "0ms"),
				emit("scrollbarDragMove", e));
		}
		function onDragEnd(e) {
			const params = swiper.params.scrollbar,
				{ scrollbar: scrollbar, wrapperEl: wrapperEl } = swiper,
				{ el: el } = scrollbar;
			isTouched &&
				((isTouched = !1),
				swiper.params.cssMode &&
					((swiper.wrapperEl.style["scroll-snap-type"] = ""),
					(wrapperEl.style.transitionDuration = "")),
				params.hide &&
					(clearTimeout(dragTimeout),
					(dragTimeout = nextTick(() => {
						(el.style.opacity = 0), (el.style.transitionDuration = "400ms");
					}, 1e3))),
				emit("scrollbarDragEnd", e),
				params.snapOnRelease && swiper.slideToClosest());
		}
		function events(method) {
			const { scrollbar: scrollbar, params: params } = swiper,
				el = scrollbar.el;
			if (!el) return;
			const target = el,
				activeListener = !!params.passiveListeners && {
					passive: !1,
					capture: !1,
				},
				passiveListener = !!params.passiveListeners && {
					passive: !0,
					capture: !1,
				};
			if (!target) return;
			const eventMethod =
				"on" === method ? "addEventListener" : "removeEventListener";
			target[eventMethod]("pointerdown", onDragStart, activeListener),
				document[eventMethod]("pointermove", onDragMove, activeListener),
				document[eventMethod]("pointerup", onDragEnd, passiveListener);
		}
		function enableDraggable() {
			swiper.params.scrollbar.el && swiper.scrollbar.el && events("on");
		}
		function disableDraggable() {
			swiper.params.scrollbar.el && swiper.scrollbar.el && events("off");
		}
		function init() {
			const { scrollbar: scrollbar, el: swiperEl } = swiper;
			swiper.params.scrollbar = createElementIfNotDefined(
				swiper,
				swiper.originalParams.scrollbar,
				swiper.params.scrollbar,
				{ el: "swiper-scrollbar" }
			);
			const params = swiper.params.scrollbar;
			if (!params.el) return;
			let el, dragEl;
			"string" == typeof params.el &&
				swiper.isElement &&
				(el = swiper.el.shadowRoot.querySelector(params.el)),
				el || "string" != typeof params.el
					? el || (el = params.el)
					: (el = document.querySelectorAll(params.el)),
				swiper.params.uniqueNavElements &&
					"string" == typeof params.el &&
					el.length > 1 &&
					1 === swiperEl.querySelectorAll(params.el).length &&
					(el = swiperEl.querySelector(params.el)),
				el.length > 0 && (el = el[0]),
				el.classList.add(
					swiper.isHorizontal() ? params.horizontalClass : params.verticalClass
				),
				el &&
					((dragEl = el.querySelector(`.${swiper.params.scrollbar.dragClass}`)),
					dragEl ||
						((dragEl = createElement("div", swiper.params.scrollbar.dragClass)),
						el.append(dragEl))),
				Object.assign(scrollbar, { el: el, dragEl: dragEl }),
				params.draggable && enableDraggable(),
				el &&
					el.classList[swiper.enabled ? "remove" : "add"](
						swiper.params.scrollbar.lockClass
					);
		}
		function destroy() {
			const params = swiper.params.scrollbar,
				el = swiper.scrollbar.el;
			el &&
				el.classList.remove(
					swiper.isHorizontal() ? params.horizontalClass : params.verticalClass
				),
				disableDraggable();
		}
		extendParams({
			scrollbar: {
				el: null,
				dragSize: "auto",
				hide: !1,
				draggable: !1,
				snapOnRelease: !0,
				lockClass: "swiper-scrollbar-lock",
				dragClass: "swiper-scrollbar-drag",
				scrollbarDisabledClass: "swiper-scrollbar-disabled",
				horizontalClass: "swiper-scrollbar-horizontal",
				verticalClass: "swiper-scrollbar-vertical",
			},
		}),
			(swiper.scrollbar = { el: null, dragEl: null }),
			on("init", () => {
				!1 === swiper.params.scrollbar.enabled
					? disable()
					: (init(), updateSize(), setTranslate());
			}),
			on("update resize observerUpdate lock unlock", () => {
				updateSize();
			}),
			on("setTranslate", () => {
				setTranslate();
			}),
			on("setTransition", (_s, duration) => {
				setTransition(duration);
			}),
			on("enable disable", () => {
				const { el: el } = swiper.scrollbar;
				el &&
					el.classList[swiper.enabled ? "remove" : "add"](
						swiper.params.scrollbar.lockClass
					);
			}),
			on("destroy", () => {
				destroy();
			});
		const enable = () => {
				swiper.el.classList.remove(
					swiper.params.scrollbar.scrollbarDisabledClass
				),
					swiper.scrollbar.el &&
						swiper.scrollbar.el.classList.remove(
							swiper.params.scrollbar.scrollbarDisabledClass
						),
					init(),
					updateSize(),
					setTranslate();
			},
			disable = () => {
				swiper.el.classList.add(swiper.params.scrollbar.scrollbarDisabledClass),
					swiper.scrollbar.el &&
						swiper.scrollbar.el.classList.add(
							swiper.params.scrollbar.scrollbarDisabledClass
						),
					destroy();
			};
		Object.assign(swiper.scrollbar, {
			enable: enable,
			disable: disable,
			updateSize: updateSize,
			setTranslate: setTranslate,
			init: init,
			destroy: destroy,
		});
	}
	function Parallax(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({ parallax: { enabled: !1 } });
		const setTransform = (el, progress) => {
				const { rtl: rtl } = swiper,
					rtlFactor = rtl ? -1 : 1,
					p = el.getAttribute("data-swiper-parallax") || "0";
				let x = el.getAttribute("data-swiper-parallax-x"),
					y = el.getAttribute("data-swiper-parallax-y");
				const scale = el.getAttribute("data-swiper-parallax-scale"),
					opacity = el.getAttribute("data-swiper-parallax-opacity"),
					rotate = el.getAttribute("data-swiper-parallax-rotate");
				if (
					(x || y
						? ((x = x || "0"), (y = y || "0"))
						: swiper.isHorizontal()
						? ((x = p), (y = "0"))
						: ((y = p), (x = "0")),
					(x =
						x.indexOf("%") >= 0
							? `${parseInt(x, 10) * progress * rtlFactor}%`
							: `${x * progress * rtlFactor}px`),
					(y =
						y.indexOf("%") >= 0
							? `${parseInt(y, 10) * progress}%`
							: `${y * progress}px`),
					null != opacity)
				) {
					const currentOpacity =
						opacity - (opacity - 1) * (1 - Math.abs(progress));
					el.style.opacity = currentOpacity;
				}
				let transform = `translate3d(${x}, ${y}, 0px)`;
				if (null != scale) {
					const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
					transform += ` scale(${currentScale})`;
				}
				if (rotate && null != rotate) {
					const currentRotate = rotate * progress * -1;
					transform += ` rotate(${currentRotate}deg)`;
				}
				el.style.transform = transform;
			},
			setTranslate = () => {
				const {
					el: el,
					slides: slides,
					progress: progress,
					snapGrid: snapGrid,
				} = swiper;
				elementChildren(
					el,
					"[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
				).forEach((subEl) => {
					setTransform(subEl, progress);
				}),
					slides.forEach((slideEl, slideIndex) => {
						let slideProgress = slideEl.progress;
						swiper.params.slidesPerGroup > 1 &&
							"auto" !== swiper.params.slidesPerView &&
							(slideProgress +=
								Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1)),
							(slideProgress = Math.min(Math.max(slideProgress, -1), 1)),
							slideEl
								.querySelectorAll(
									"[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale], [data-swiper-parallax-rotate]"
								)
								.forEach((subEl) => {
									setTransform(subEl, slideProgress);
								});
					});
			},
			setTransition = function (duration) {
				void 0 === duration && (duration = swiper.params.speed);
				const { el: el } = swiper;
				el.querySelectorAll(
					"[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]"
				).forEach((parallaxEl) => {
					let parallaxDuration =
						parseInt(
							parallaxEl.getAttribute("data-swiper-parallax-duration"),
							10
						) || duration;
					0 === duration && (parallaxDuration = 0),
						(parallaxEl.style.transitionDuration = `${parallaxDuration}ms`);
				});
			};
		on("beforeInit", () => {
			swiper.params.parallax.enabled &&
				((swiper.params.watchSlidesProgress = !0),
				(swiper.originalParams.watchSlidesProgress = !0));
		}),
			on("init", () => {
				swiper.params.parallax.enabled && setTranslate();
			}),
			on("setTranslate", () => {
				swiper.params.parallax.enabled && setTranslate();
			}),
			on("setTransition", (_swiper, duration) => {
				swiper.params.parallax.enabled && setTransition(duration);
			});
	}
	function Zoom(_ref) {
		let {
			swiper: swiper,
			extendParams: extendParams,
			on: on,
			emit: emit,
		} = _ref;
		const window = getWindow();
		extendParams({
			zoom: {
				enabled: !1,
				maxRatio: 3,
				minRatio: 1,
				toggle: !0,
				containerClass: "swiper-zoom-container",
				zoomedSlideClass: "swiper-slide-zoomed",
			},
		}),
			(swiper.zoom = { enabled: !1 });
		let currentScale = 1,
			isScaling = !1,
			fakeGestureTouched,
			fakeGestureMoved;
		const evCache = [],
			gesture = {
				originX: 0,
				originY: 0,
				slideEl: void 0,
				slideWidth: void 0,
				slideHeight: void 0,
				imageEl: void 0,
				imageWrapEl: void 0,
				maxRatio: 3,
			},
			image = {
				isTouched: void 0,
				isMoved: void 0,
				currentX: void 0,
				currentY: void 0,
				minX: void 0,
				minY: void 0,
				maxX: void 0,
				maxY: void 0,
				width: void 0,
				height: void 0,
				startX: void 0,
				startY: void 0,
				touchesStart: {},
				touchesCurrent: {},
			},
			velocity = {
				x: void 0,
				y: void 0,
				prevPositionX: void 0,
				prevPositionY: void 0,
				prevTime: void 0,
			};
		let scale = 1;
		function getDistanceBetweenTouches() {
			if (evCache.length < 2) return 1;
			const x1 = evCache[0].pageX,
				y1 = evCache[0].pageY,
				x2 = evCache[1].pageX,
				y2 = evCache[1].pageY,
				distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
			return distance;
		}
		function getScaleOrigin() {
			if (evCache.length < 2) return { x: null, y: null };
			const box = gesture.imageEl.getBoundingClientRect();
			return [
				(evCache[0].pageX + (evCache[1].pageX - evCache[0].pageX) / 2 - box.x) /
					currentScale,
				(evCache[0].pageY + (evCache[1].pageY - evCache[0].pageY) / 2 - box.y) /
					currentScale,
			];
		}
		function getSlideSelector() {
			return swiper.isElement ? "swiper-slide" : `.${swiper.params.slideClass}`;
		}
		function eventWithinSlide(e) {
			const slideSelector = getSlideSelector();
			return (
				!!e.target.matches(slideSelector) ||
				swiper.slides.filter((slideEl) => slideEl.contains(e.target)).length > 0
			);
		}
		function eventWithinZoomContainer(e) {
			const selector = `.${swiper.params.zoom.containerClass}`;
			return (
				!!e.target.matches(selector) ||
				[...swiper.el.querySelectorAll(selector)].filter((containerEl) =>
					containerEl.contains(e.target)
				).length > 0
			);
		}
		function onGestureStart(e) {
			if (
				("mouse" === e.pointerType && evCache.splice(0, evCache.length),
				!eventWithinSlide(e))
			)
				return;
			const params = swiper.params.zoom;
			if (
				((fakeGestureTouched = !1),
				(fakeGestureMoved = !1),
				evCache.push(e),
				!(evCache.length < 2))
			) {
				if (
					((fakeGestureTouched = !0),
					(gesture.scaleStart = getDistanceBetweenTouches()),
					!gesture.slideEl)
				) {
					(gesture.slideEl = e.target.closest(
						`.${swiper.params.slideClass}, swiper-slide`
					)),
						gesture.slideEl ||
							(gesture.slideEl = swiper.slides[swiper.activeIndex]);
					let imageEl = gesture.slideEl.querySelector(
						`.${params.containerClass}`
					);
					if (
						(imageEl &&
							(imageEl = imageEl.querySelectorAll(
								"picture, img, svg, canvas, .swiper-zoom-target"
							)[0]),
						(gesture.imageEl = imageEl),
						(gesture.imageWrapEl = imageEl
							? elementParents(gesture.imageEl, `.${params.containerClass}`)[0]
							: void 0),
						!gesture.imageWrapEl)
					)
						return void (gesture.imageEl = void 0);
					gesture.maxRatio =
						gesture.imageWrapEl.getAttribute("data-swiper-zoom") ||
						params.maxRatio;
				}
				if (gesture.imageEl) {
					const [originX, originY] = getScaleOrigin();
					(gesture.originX = originX),
						(gesture.originY = originY),
						(gesture.imageEl.style.transitionDuration = "0ms");
				}
				isScaling = !0;
			}
		}
		function onGestureChange(e) {
			if (!eventWithinSlide(e)) return;
			const params = swiper.params.zoom,
				zoom = swiper.zoom,
				pointerIndex = evCache.findIndex(
					(cachedEv) => cachedEv.pointerId === e.pointerId
				);
			pointerIndex >= 0 && (evCache[pointerIndex] = e),
				evCache.length < 2 ||
					((fakeGestureMoved = !0),
					(gesture.scaleMove = getDistanceBetweenTouches()),
					gesture.imageEl &&
						((zoom.scale =
							(gesture.scaleMove / gesture.scaleStart) * currentScale),
						zoom.scale > gesture.maxRatio &&
							(zoom.scale =
								gesture.maxRatio -
								1 +
								(zoom.scale - gesture.maxRatio + 1) ** 0.5),
						zoom.scale < params.minRatio &&
							(zoom.scale =
								params.minRatio +
								1 -
								(params.minRatio - zoom.scale + 1) ** 0.5),
						(gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`)));
		}
		function onGestureEnd(e) {
			if (!eventWithinSlide(e)) return;
			if ("mouse" === e.pointerType && "pointerout" === e.type) return;
			const params = swiper.params.zoom,
				zoom = swiper.zoom,
				pointerIndex = evCache.findIndex(
					(cachedEv) => cachedEv.pointerId === e.pointerId
				);
			pointerIndex >= 0 && evCache.splice(pointerIndex, 1),
				fakeGestureTouched &&
					fakeGestureMoved &&
					((fakeGestureTouched = !1),
					(fakeGestureMoved = !1),
					gesture.imageEl &&
						((zoom.scale = Math.max(
							Math.min(zoom.scale, gesture.maxRatio),
							params.minRatio
						)),
						(gesture.imageEl.style.transitionDuration = `${swiper.params.speed}ms`),
						(gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`),
						(currentScale = zoom.scale),
						(isScaling = !1),
						zoom.scale > 1 && gesture.slideEl
							? gesture.slideEl.classList.add(`${params.zoomedSlideClass}`)
							: zoom.scale <= 1 &&
							  gesture.slideEl &&
							  gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`),
						1 === zoom.scale &&
							((gesture.originX = 0),
							(gesture.originY = 0),
							(gesture.slideEl = void 0))));
		}
		function onTouchStart(e) {
			const device = swiper.device;
			if (!gesture.imageEl) return;
			if (image.isTouched) return;
			device.android && e.cancelable && e.preventDefault(),
				(image.isTouched = !0);
			const event = evCache.length > 0 ? evCache[0] : e;
			(image.touchesStart.x = event.pageX),
				(image.touchesStart.y = event.pageY);
		}
		function onTouchMove(e) {
			if (!eventWithinSlide(e) || !eventWithinZoomContainer(e)) return;
			const zoom = swiper.zoom;
			if (!gesture.imageEl) return;
			if (!image.isTouched || !gesture.slideEl) return;
			image.isMoved ||
				((image.width = gesture.imageEl.offsetWidth),
				(image.height = gesture.imageEl.offsetHeight),
				(image.startX = getTranslate(gesture.imageWrapEl, "x") || 0),
				(image.startY = getTranslate(gesture.imageWrapEl, "y") || 0),
				(gesture.slideWidth = gesture.slideEl.offsetWidth),
				(gesture.slideHeight = gesture.slideEl.offsetHeight),
				(gesture.imageWrapEl.style.transitionDuration = "0ms"));
			const scaledWidth = image.width * zoom.scale,
				scaledHeight = image.height * zoom.scale;
			if (
				scaledWidth < gesture.slideWidth &&
				scaledHeight < gesture.slideHeight
			)
				return;
			(image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0)),
				(image.maxX = -image.minX),
				(image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0)),
				(image.maxY = -image.minY),
				(image.touchesCurrent.x =
					evCache.length > 0 ? evCache[0].pageX : e.pageX),
				(image.touchesCurrent.y =
					evCache.length > 0 ? evCache[0].pageY : e.pageY);
			const touchesDiff = Math.max(
				Math.abs(image.touchesCurrent.x - image.touchesStart.x),
				Math.abs(image.touchesCurrent.y - image.touchesStart.y)
			);
			if (
				(touchesDiff > 5 && (swiper.allowClick = !1),
				!image.isMoved && !isScaling)
			) {
				if (
					swiper.isHorizontal() &&
					((Math.floor(image.minX) === Math.floor(image.startX) &&
						image.touchesCurrent.x < image.touchesStart.x) ||
						(Math.floor(image.maxX) === Math.floor(image.startX) &&
							image.touchesCurrent.x > image.touchesStart.x))
				)
					return void (image.isTouched = !1);
				if (
					!swiper.isHorizontal() &&
					((Math.floor(image.minY) === Math.floor(image.startY) &&
						image.touchesCurrent.y < image.touchesStart.y) ||
						(Math.floor(image.maxY) === Math.floor(image.startY) &&
							image.touchesCurrent.y > image.touchesStart.y))
				)
					return void (image.isTouched = !1);
			}
			e.cancelable && e.preventDefault(),
				e.stopPropagation(),
				(image.isMoved = !0);
			const scaleRatio =
					(zoom.scale - currentScale) /
					(gesture.maxRatio - swiper.params.zoom.minRatio),
				{ originX: originX, originY: originY } = gesture;
			(image.currentX =
				image.touchesCurrent.x -
				image.touchesStart.x +
				image.startX +
				scaleRatio * (image.width - 2 * originX)),
				(image.currentY =
					image.touchesCurrent.y -
					image.touchesStart.y +
					image.startY +
					scaleRatio * (image.height - 2 * originY)),
				image.currentX < image.minX &&
					(image.currentX =
						image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8),
				image.currentX > image.maxX &&
					(image.currentX =
						image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8),
				image.currentY < image.minY &&
					(image.currentY =
						image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8),
				image.currentY > image.maxY &&
					(image.currentY =
						image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8),
				velocity.prevPositionX ||
					(velocity.prevPositionX = image.touchesCurrent.x),
				velocity.prevPositionY ||
					(velocity.prevPositionY = image.touchesCurrent.y),
				velocity.prevTime || (velocity.prevTime = Date.now()),
				(velocity.x =
					(image.touchesCurrent.x - velocity.prevPositionX) /
					(Date.now() - velocity.prevTime) /
					2),
				(velocity.y =
					(image.touchesCurrent.y - velocity.prevPositionY) /
					(Date.now() - velocity.prevTime) /
					2),
				Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2 &&
					(velocity.x = 0),
				Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2 &&
					(velocity.y = 0),
				(velocity.prevPositionX = image.touchesCurrent.x),
				(velocity.prevPositionY = image.touchesCurrent.y),
				(velocity.prevTime = Date.now()),
				(gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`);
		}
		function onTouchEnd() {
			const zoom = swiper.zoom;
			if (!gesture.imageEl) return;
			if (!image.isTouched || !image.isMoved)
				return (image.isTouched = !1), void (image.isMoved = !1);
			(image.isTouched = !1), (image.isMoved = !1);
			let momentumDurationX = 300,
				momentumDurationY = 300;
			const momentumDistanceX = velocity.x * momentumDurationX,
				newPositionX = image.currentX + momentumDistanceX,
				momentumDistanceY = velocity.y * momentumDurationY,
				newPositionY = image.currentY + momentumDistanceY;
			0 !== velocity.x &&
				(momentumDurationX = Math.abs(
					(newPositionX - image.currentX) / velocity.x
				)),
				0 !== velocity.y &&
					(momentumDurationY = Math.abs(
						(newPositionY - image.currentY) / velocity.y
					));
			const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
			(image.currentX = newPositionX), (image.currentY = newPositionY);
			const scaledWidth = image.width * zoom.scale,
				scaledHeight = image.height * zoom.scale;
			(image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0)),
				(image.maxX = -image.minX),
				(image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0)),
				(image.maxY = -image.minY),
				(image.currentX = Math.max(
					Math.min(image.currentX, image.maxX),
					image.minX
				)),
				(image.currentY = Math.max(
					Math.min(image.currentY, image.maxY),
					image.minY
				)),
				(gesture.imageWrapEl.style.transitionDuration = `${momentumDuration}ms`),
				(gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`);
		}
		function onTransitionEnd() {
			const zoom = swiper.zoom;
			gesture.slideEl &&
				swiper.activeIndex !== swiper.slides.indexOf(gesture.slideEl) &&
				(gesture.imageEl &&
					(gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)"),
				gesture.imageWrapEl &&
					(gesture.imageWrapEl.style.transform = "translate3d(0,0,0)"),
				gesture.slideEl.classList.remove(
					`${swiper.params.zoom.zoomedSlideClass}`
				),
				(zoom.scale = 1),
				(currentScale = 1),
				(gesture.slideEl = void 0),
				(gesture.imageEl = void 0),
				(gesture.imageWrapEl = void 0),
				(gesture.originX = 0),
				(gesture.originY = 0));
		}
		function zoomIn(e) {
			const zoom = swiper.zoom,
				params = swiper.params.zoom;
			if (!gesture.slideEl) {
				e &&
					e.target &&
					(gesture.slideEl = e.target.closest(
						`.${swiper.params.slideClass}, swiper-slide`
					)),
					gesture.slideEl ||
						(swiper.params.virtual &&
						swiper.params.virtual.enabled &&
						swiper.virtual
							? (gesture.slideEl = elementChildren(
									swiper.slidesEl,
									`.${swiper.params.slideActiveClass}`
							  )[0])
							: (gesture.slideEl = swiper.slides[swiper.activeIndex]));
				let imageEl = gesture.slideEl.querySelector(
					`.${params.containerClass}`
				);
				imageEl &&
					(imageEl = imageEl.querySelectorAll(
						"picture, img, svg, canvas, .swiper-zoom-target"
					)[0]),
					(gesture.imageEl = imageEl),
					(gesture.imageWrapEl = imageEl
						? elementParents(gesture.imageEl, `.${params.containerClass}`)[0]
						: void 0);
			}
			if (!gesture.imageEl || !gesture.imageWrapEl) return;
			let touchX,
				touchY,
				offsetX,
				offsetY,
				diffX,
				diffY,
				translateX,
				translateY,
				imageWidth,
				imageHeight,
				scaledWidth,
				scaledHeight,
				translateMinX,
				translateMinY,
				translateMaxX,
				translateMaxY,
				slideWidth,
				slideHeight;
			swiper.params.cssMode &&
				((swiper.wrapperEl.style.overflow = "hidden"),
				(swiper.wrapperEl.style.touchAction = "none")),
				gesture.slideEl.classList.add(`${params.zoomedSlideClass}`),
				void 0 === image.touchesStart.x && e
					? ((touchX = e.pageX), (touchY = e.pageY))
					: ((touchX = image.touchesStart.x), (touchY = image.touchesStart.y));
			const forceZoomRatio = "number" == typeof e ? e : null;
			1 === currentScale &&
				forceZoomRatio &&
				((touchX = void 0), (touchY = void 0)),
				(zoom.scale =
					forceZoomRatio ||
					gesture.imageWrapEl.getAttribute("data-swiper-zoom") ||
					params.maxRatio),
				(currentScale =
					forceZoomRatio ||
					gesture.imageWrapEl.getAttribute("data-swiper-zoom") ||
					params.maxRatio),
				!e || (1 === currentScale && forceZoomRatio)
					? ((translateX = 0), (translateY = 0))
					: ((slideWidth = gesture.slideEl.offsetWidth),
					  (slideHeight = gesture.slideEl.offsetHeight),
					  (offsetX = elementOffset(gesture.slideEl).left + window.scrollX),
					  (offsetY = elementOffset(gesture.slideEl).top + window.scrollY),
					  (diffX = offsetX + slideWidth / 2 - touchX),
					  (diffY = offsetY + slideHeight / 2 - touchY),
					  (imageWidth = gesture.imageEl.offsetWidth),
					  (imageHeight = gesture.imageEl.offsetHeight),
					  (scaledWidth = imageWidth * zoom.scale),
					  (scaledHeight = imageHeight * zoom.scale),
					  (translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0)),
					  (translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0)),
					  (translateMaxX = -translateMinX),
					  (translateMaxY = -translateMinY),
					  (translateX = diffX * zoom.scale),
					  (translateY = diffY * zoom.scale),
					  translateX < translateMinX && (translateX = translateMinX),
					  translateX > translateMaxX && (translateX = translateMaxX),
					  translateY < translateMinY && (translateY = translateMinY),
					  translateY > translateMaxY && (translateY = translateMaxY)),
				forceZoomRatio &&
					1 === zoom.scale &&
					((gesture.originX = 0), (gesture.originY = 0)),
				(gesture.imageWrapEl.style.transitionDuration = "300ms"),
				(gesture.imageWrapEl.style.transform = `translate3d(${translateX}px, ${translateY}px,0)`),
				(gesture.imageEl.style.transitionDuration = "300ms"),
				(gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`);
		}
		function zoomOut() {
			const zoom = swiper.zoom,
				params = swiper.params.zoom;
			if (!gesture.slideEl) {
				swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual
					? (gesture.slideEl = elementChildren(
							swiper.slidesEl,
							`.${swiper.params.slideActiveClass}`
					  )[0])
					: (gesture.slideEl = swiper.slides[swiper.activeIndex]);
				let imageEl = gesture.slideEl.querySelector(
					`.${params.containerClass}`
				);
				imageEl &&
					(imageEl = imageEl.querySelectorAll(
						"picture, img, svg, canvas, .swiper-zoom-target"
					)[0]),
					(gesture.imageEl = imageEl),
					(gesture.imageWrapEl = imageEl
						? elementParents(gesture.imageEl, `.${params.containerClass}`)[0]
						: void 0);
			}
			gesture.imageEl &&
				gesture.imageWrapEl &&
				(swiper.params.cssMode &&
					((swiper.wrapperEl.style.overflow = ""),
					(swiper.wrapperEl.style.touchAction = "")),
				(zoom.scale = 1),
				(currentScale = 1),
				(gesture.imageWrapEl.style.transitionDuration = "300ms"),
				(gesture.imageWrapEl.style.transform = "translate3d(0,0,0)"),
				(gesture.imageEl.style.transitionDuration = "300ms"),
				(gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)"),
				gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`),
				(gesture.slideEl = void 0),
				(gesture.originX = 0),
				(gesture.originY = 0));
		}
		function zoomToggle(e) {
			const zoom = swiper.zoom;
			zoom.scale && 1 !== zoom.scale ? zoomOut() : zoomIn(e);
		}
		function getListeners() {
			const passiveListener = !!swiper.params.passiveListeners && {
					passive: !0,
					capture: !1,
				},
				activeListenerWithCapture = !swiper.params.passiveListeners || {
					passive: !1,
					capture: !0,
				};
			return {
				passiveListener: passiveListener,
				activeListenerWithCapture: activeListenerWithCapture,
			};
		}
		function enable() {
			const zoom = swiper.zoom;
			if (zoom.enabled) return;
			zoom.enabled = !0;
			const {
				passiveListener: passiveListener,
				activeListenerWithCapture: activeListenerWithCapture,
			} = getListeners();
			swiper.wrapperEl.addEventListener(
				"pointerdown",
				onGestureStart,
				passiveListener
			),
				swiper.wrapperEl.addEventListener(
					"pointermove",
					onGestureChange,
					activeListenerWithCapture
				),
				["pointerup", "pointercancel", "pointerout"].forEach((eventName) => {
					swiper.wrapperEl.addEventListener(
						eventName,
						onGestureEnd,
						passiveListener
					);
				}),
				swiper.wrapperEl.addEventListener(
					"pointermove",
					onTouchMove,
					activeListenerWithCapture
				);
		}
		function disable() {
			const zoom = swiper.zoom;
			if (!zoom.enabled) return;
			zoom.enabled = !1;
			const {
				passiveListener: passiveListener,
				activeListenerWithCapture: activeListenerWithCapture,
			} = getListeners();
			swiper.wrapperEl.removeEventListener(
				"pointerdown",
				onGestureStart,
				passiveListener
			),
				swiper.wrapperEl.removeEventListener(
					"pointermove",
					onGestureChange,
					activeListenerWithCapture
				),
				["pointerup", "pointercancel", "pointerout"].forEach((eventName) => {
					swiper.wrapperEl.removeEventListener(
						eventName,
						onGestureEnd,
						passiveListener
					);
				}),
				swiper.wrapperEl.removeEventListener(
					"pointermove",
					onTouchMove,
					activeListenerWithCapture
				);
		}
		Object.defineProperty(swiper.zoom, "scale", {
			get: () => scale,
			set(value) {
				if (scale !== value) {
					const imageEl = gesture.imageEl,
						slideEl = gesture.slideEl;
					emit("zoomChange", value, imageEl, slideEl);
				}
				scale = value;
			},
		}),
			on("init", () => {
				swiper.params.zoom.enabled && enable();
			}),
			on("destroy", () => {
				disable();
			}),
			on("touchStart", (_s, e) => {
				swiper.zoom.enabled && onTouchStart(e);
			}),
			on("touchEnd", (_s, e) => {
				swiper.zoom.enabled && onTouchEnd();
			}),
			on("doubleTap", (_s, e) => {
				!swiper.animating &&
					swiper.params.zoom.enabled &&
					swiper.zoom.enabled &&
					swiper.params.zoom.toggle &&
					zoomToggle(e);
			}),
			on("transitionEnd", () => {
				swiper.zoom.enabled && swiper.params.zoom.enabled && onTransitionEnd();
			}),
			on("slideChange", () => {
				swiper.zoom.enabled &&
					swiper.params.zoom.enabled &&
					swiper.params.cssMode &&
					onTransitionEnd();
			}),
			Object.assign(swiper.zoom, {
				enable: enable,
				disable: disable,
				in: zoomIn,
				out: zoomOut,
				toggle: zoomToggle,
			});
	}
	function Controller(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		function LinearSpline(x, y) {
			const binarySearch = (function search() {
				let maxIndex, minIndex, guess;
				return (array, val) => {
					for (
						minIndex = -1, maxIndex = array.length;
						maxIndex - minIndex > 1;

					)
						(guess = (maxIndex + minIndex) >> 1),
							array[guess] <= val ? (minIndex = guess) : (maxIndex = guess);
					return maxIndex;
				};
			})();
			let i1, i3;
			return (
				(this.x = x),
				(this.y = y),
				(this.lastIndex = x.length - 1),
				(this.interpolate = function interpolate(x2) {
					return x2
						? ((i3 = binarySearch(this.x, x2)),
						  (i1 = i3 - 1),
						  ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) /
								(this.x[i3] - this.x[i1]) +
								this.y[i1])
						: 0;
				}),
				this
			);
		}
		function getInterpolateFunction(c) {
			swiper.controller.spline = swiper.params.loop
				? new LinearSpline(swiper.slidesGrid, c.slidesGrid)
				: new LinearSpline(swiper.snapGrid, c.snapGrid);
		}
		function setTranslate(_t, byController) {
			const controlled = swiper.controller.control;
			let multiplier, controlledTranslate;
			const Swiper = swiper.constructor;
			function setControlledTranslate(c) {
				if (c.destroyed) return;
				const translate = swiper.rtlTranslate
					? -swiper.translate
					: swiper.translate;
				"slide" === swiper.params.controller.by &&
					(getInterpolateFunction(c),
					(controlledTranslate = -swiper.controller.spline.interpolate(
						-translate
					))),
					(controlledTranslate &&
						"container" !== swiper.params.controller.by) ||
						((multiplier =
							(c.maxTranslate() - c.minTranslate()) /
							(swiper.maxTranslate() - swiper.minTranslate())),
						(!Number.isNaN(multiplier) && Number.isFinite(multiplier)) ||
							(multiplier = 1),
						(controlledTranslate =
							(translate - swiper.minTranslate()) * multiplier +
							c.minTranslate())),
					swiper.params.controller.inverse &&
						(controlledTranslate = c.maxTranslate() - controlledTranslate),
					c.updateProgress(controlledTranslate),
					c.setTranslate(controlledTranslate, swiper),
					c.updateActiveIndex(),
					c.updateSlidesClasses();
			}
			if (Array.isArray(controlled))
				for (let i = 0; i < controlled.length; i += 1)
					controlled[i] !== byController &&
						controlled[i] instanceof Swiper &&
						setControlledTranslate(controlled[i]);
			else
				controlled instanceof Swiper &&
					byController !== controlled &&
					setControlledTranslate(controlled);
		}
		function setTransition(duration, byController) {
			const Swiper = swiper.constructor,
				controlled = swiper.controller.control;
			let i;
			function setControlledTransition(c) {
				c.destroyed ||
					(c.setTransition(duration, swiper),
					0 !== duration &&
						(c.transitionStart(),
						c.params.autoHeight &&
							nextTick(() => {
								c.updateAutoHeight();
							}),
						elementTransitionEnd(c.wrapperEl, () => {
							controlled && c.transitionEnd();
						})));
			}
			if (Array.isArray(controlled))
				for (i = 0; i < controlled.length; i += 1)
					controlled[i] !== byController &&
						controlled[i] instanceof Swiper &&
						setControlledTransition(controlled[i]);
			else
				controlled instanceof Swiper &&
					byController !== controlled &&
					setControlledTransition(controlled);
		}
		function removeSpline() {
			swiper.controller.control &&
				swiper.controller.spline &&
				((swiper.controller.spline = void 0), delete swiper.controller.spline);
		}
		extendParams({ controller: { control: void 0, inverse: !1, by: "slide" } }),
			(swiper.controller = { control: void 0 }),
			on("beforeInit", () => {
				if (
					"undefined" != typeof window &&
					("string" == typeof swiper.params.controller.control ||
						swiper.params.controller.control instanceof HTMLElement)
				) {
					const controlElement = document.querySelector(
						swiper.params.controller.control
					);
					if (controlElement && controlElement.swiper)
						swiper.controller.control = controlElement.swiper;
					else if (controlElement) {
						const onControllerSwiper = (e) => {
							(swiper.controller.control = e.detail[0]),
								swiper.update(),
								controlElement.removeEventListener("init", onControllerSwiper);
						};
						controlElement.addEventListener("init", onControllerSwiper);
					}
				} else swiper.controller.control = swiper.params.controller.control;
			}),
			on("update", () => {
				removeSpline();
			}),
			on("resize", () => {
				removeSpline();
			}),
			on("observerUpdate", () => {
				removeSpline();
			}),
			on("setTranslate", (_s, translate, byController) => {
				swiper.controller.control &&
					!swiper.controller.control.destroyed &&
					swiper.controller.setTranslate(translate, byController);
			}),
			on("setTransition", (_s, duration, byController) => {
				swiper.controller.control &&
					!swiper.controller.control.destroyed &&
					swiper.controller.setTransition(duration, byController);
			}),
			Object.assign(swiper.controller, {
				setTranslate: setTranslate,
				setTransition: setTransition,
			});
	}
	function A11y(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({
			a11y: {
				enabled: !0,
				notificationClass: "swiper-notification",
				prevSlideMessage: "Previous slide",
				nextSlideMessage: "Next slide",
				firstSlideMessage: "This is the first slide",
				lastSlideMessage: "This is the last slide",
				paginationBulletMessage: "Go to slide {{index}}",
				slideLabelMessage: "{{index}} / {{slidesLength}}",
				containerMessage: null,
				containerRoleDescriptionMessage: null,
				itemRoleDescriptionMessage: null,
				slideRole: "group",
				id: null,
			},
		}),
			(swiper.a11y = { clicked: !1 });
		let liveRegion = null;
		function notify(message) {
			const notification = liveRegion;
			0 !== notification.length &&
				((notification.innerHTML = ""), (notification.innerHTML = message));
		}
		const makeElementsArray = (el) => (
			Array.isArray(el) || (el = [el].filter((e) => !!e)), el
		);
		function getRandomNumber(size) {
			void 0 === size && (size = 16);
			const randomChar = () => Math.round(16 * Math.random()).toString(16);
			return "x".repeat(size).replace(/x/g, randomChar);
		}
		function makeElFocusable(el) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("tabIndex", "0");
			});
		}
		function makeElNotFocusable(el) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("tabIndex", "-1");
			});
		}
		function addElRole(el, role) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("role", role);
			});
		}
		function addElRoleDescription(el, description) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("aria-roledescription", description);
			});
		}
		function addElControls(el, controls) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("aria-controls", controls);
			});
		}
		function addElLabel(el, label) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("aria-label", label);
			});
		}
		function addElId(el, id) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("id", id);
			});
		}
		function addElLive(el, live) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("aria-live", live);
			});
		}
		function disableEl(el) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("aria-disabled", !0);
			});
		}
		function enableEl(el) {
			(el = makeElementsArray(el)).forEach((subEl) => {
				subEl.setAttribute("aria-disabled", !1);
			});
		}
		function onEnterOrSpaceKey(e) {
			if (13 !== e.keyCode && 32 !== e.keyCode) return;
			const params = swiper.params.a11y,
				targetEl = e.target;
			(swiper.pagination &&
				swiper.pagination.el &&
				(targetEl === swiper.pagination.el ||
					swiper.pagination.el.contains(e.target)) &&
				!e.target.matches(
					classesToSelector(swiper.params.pagination.bulletClass)
				)) ||
				(swiper.navigation &&
					swiper.navigation.nextEl &&
					targetEl === swiper.navigation.nextEl &&
					((swiper.isEnd && !swiper.params.loop) || swiper.slideNext(),
					swiper.isEnd
						? notify(params.lastSlideMessage)
						: notify(params.nextSlideMessage)),
				swiper.navigation &&
					swiper.navigation.prevEl &&
					targetEl === swiper.navigation.prevEl &&
					((swiper.isBeginning && !swiper.params.loop) || swiper.slidePrev(),
					swiper.isBeginning
						? notify(params.firstSlideMessage)
						: notify(params.prevSlideMessage)),
				swiper.pagination &&
					targetEl.matches(
						classesToSelector(swiper.params.pagination.bulletClass)
					) &&
					targetEl.click());
		}
		function updateNavigation() {
			if (swiper.params.loop || swiper.params.rewind || !swiper.navigation)
				return;
			const { nextEl: nextEl, prevEl: prevEl } = swiper.navigation;
			prevEl &&
				(swiper.isBeginning
					? (disableEl(prevEl), makeElNotFocusable(prevEl))
					: (enableEl(prevEl), makeElFocusable(prevEl))),
				nextEl &&
					(swiper.isEnd
						? (disableEl(nextEl), makeElNotFocusable(nextEl))
						: (enableEl(nextEl), makeElFocusable(nextEl)));
		}
		function hasPagination() {
			return (
				swiper.pagination &&
				swiper.pagination.bullets &&
				swiper.pagination.bullets.length
			);
		}
		function hasClickablePagination() {
			return hasPagination() && swiper.params.pagination.clickable;
		}
		function updatePagination() {
			const params = swiper.params.a11y;
			hasPagination() &&
				swiper.pagination.bullets.forEach((bulletEl) => {
					swiper.params.pagination.clickable &&
						(makeElFocusable(bulletEl),
						swiper.params.pagination.renderBullet ||
							(addElRole(bulletEl, "button"),
							addElLabel(
								bulletEl,
								params.paginationBulletMessage.replace(
									/\{\{index\}\}/,
									elementIndex(bulletEl) + 1
								)
							))),
						bulletEl.matches(
							classesToSelector(swiper.params.pagination.bulletActiveClass)
						)
							? bulletEl.setAttribute("aria-current", "true")
							: bulletEl.removeAttribute("aria-current");
				});
		}
		const initNavEl = (el, wrapperId, message) => {
				makeElFocusable(el),
					"BUTTON" !== el.tagName &&
						(addElRole(el, "button"),
						el.addEventListener("keydown", onEnterOrSpaceKey)),
					addElLabel(el, message),
					addElControls(el, wrapperId);
			},
			handlePointerDown = () => {
				swiper.a11y.clicked = !0;
			},
			handlePointerUp = () => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						swiper.destroyed || (swiper.a11y.clicked = !1);
					});
				});
			},
			handleFocus = (e) => {
				if (swiper.a11y.clicked) return;
				const slideEl = e.target.closest(
					`.${swiper.params.slideClass}, swiper-slide`
				);
				if (!slideEl || !swiper.slides.includes(slideEl)) return;
				const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex,
					isVisible =
						swiper.params.watchSlidesProgress &&
						swiper.visibleSlides &&
						swiper.visibleSlides.includes(slideEl);
				isActive ||
					isVisible ||
					(e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) ||
					(swiper.isHorizontal()
						? (swiper.el.scrollLeft = 0)
						: (swiper.el.scrollTop = 0),
					swiper.slideTo(swiper.slides.indexOf(slideEl), 0));
			},
			initSlides = () => {
				const params = swiper.params.a11y;
				params.itemRoleDescriptionMessage &&
					addElRoleDescription(
						swiper.slides,
						params.itemRoleDescriptionMessage
					),
					params.slideRole && addElRole(swiper.slides, params.slideRole);
				const slidesLength = swiper.slides.length;
				params.slideLabelMessage &&
					swiper.slides.forEach((slideEl, index) => {
						const slideIndex = swiper.params.loop
								? parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10)
								: index,
							ariaLabelMessage = params.slideLabelMessage
								.replace(/\{\{index\}\}/, slideIndex + 1)
								.replace(/\{\{slidesLength\}\}/, slidesLength);
						addElLabel(slideEl, ariaLabelMessage);
					});
			},
			init = () => {
				const params = swiper.params.a11y;
				swiper.isElement
					? swiper.el.shadowEl.append(liveRegion)
					: swiper.el.append(liveRegion);
				const containerEl = swiper.el;
				params.containerRoleDescriptionMessage &&
					addElRoleDescription(
						containerEl,
						params.containerRoleDescriptionMessage
					),
					params.containerMessage &&
						addElLabel(containerEl, params.containerMessage);
				const wrapperEl = swiper.wrapperEl,
					wrapperId =
						params.id ||
						wrapperEl.getAttribute("id") ||
						`swiper-wrapper-${getRandomNumber(16)}`,
					live =
						swiper.params.autoplay && swiper.params.autoplay.enabled
							? "off"
							: "polite";
				addElId(wrapperEl, wrapperId), addElLive(wrapperEl, live), initSlides();
				let { nextEl: nextEl, prevEl: prevEl } = swiper.navigation
					? swiper.navigation
					: {};
				if (
					((nextEl = makeElementsArray(nextEl)),
					(prevEl = makeElementsArray(prevEl)),
					nextEl &&
						nextEl.forEach((el) =>
							initNavEl(el, wrapperId, params.nextSlideMessage)
						),
					prevEl &&
						prevEl.forEach((el) =>
							initNavEl(el, wrapperId, params.prevSlideMessage)
						),
					hasClickablePagination())
				) {
					const paginationEl = Array.isArray(swiper.pagination.el)
						? swiper.pagination.el
						: [swiper.pagination.el];
					paginationEl.forEach((el) => {
						el.addEventListener("keydown", onEnterOrSpaceKey);
					});
				}
				swiper.el.addEventListener("focus", handleFocus, !0),
					swiper.el.addEventListener("pointerdown", handlePointerDown, !0),
					swiper.el.addEventListener("pointerup", handlePointerUp, !0);
			};
		function destroy() {
			liveRegion && liveRegion.remove();
			let { nextEl: nextEl, prevEl: prevEl } = swiper.navigation
				? swiper.navigation
				: {};
			if (
				((nextEl = makeElementsArray(nextEl)),
				(prevEl = makeElementsArray(prevEl)),
				nextEl &&
					nextEl.forEach((el) =>
						el.removeEventListener("keydown", onEnterOrSpaceKey)
					),
				prevEl &&
					prevEl.forEach((el) =>
						el.removeEventListener("keydown", onEnterOrSpaceKey)
					),
				hasClickablePagination())
			) {
				const paginationEl = Array.isArray(swiper.pagination.el)
					? swiper.pagination.el
					: [swiper.pagination.el];
				paginationEl.forEach((el) => {
					el.removeEventListener("keydown", onEnterOrSpaceKey);
				});
			}
			swiper.el.removeEventListener("focus", handleFocus, !0),
				swiper.el.removeEventListener("pointerdown", handlePointerDown, !0),
				swiper.el.removeEventListener("pointerup", handlePointerUp, !0);
		}
		on("beforeInit", () => {
			(liveRegion = createElement(
				"span",
				swiper.params.a11y.notificationClass
			)),
				liveRegion.setAttribute("aria-live", "assertive"),
				liveRegion.setAttribute("aria-atomic", "true");
		}),
			on("afterInit", () => {
				swiper.params.a11y.enabled && init();
			}),
			on(
				"slidesLengthChange snapGridLengthChange slidesGridLengthChange",
				() => {
					swiper.params.a11y.enabled && initSlides();
				}
			),
			on("fromEdge toEdge afterInit lock unlock", () => {
				swiper.params.a11y.enabled && updateNavigation();
			}),
			on("paginationUpdate", () => {
				swiper.params.a11y.enabled && updatePagination();
			}),
			on("destroy", () => {
				swiper.params.a11y.enabled && destroy();
			});
	}
	function History(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({
			history: {
				enabled: !1,
				root: "",
				replaceState: !1,
				key: "slides",
				keepQuery: !1,
			},
		});
		let initialized = !1,
			paths = {};
		const slugify = (text) =>
				text
					.toString()
					.replace(/\s+/g, "-")
					.replace(/[^\w-]+/g, "")
					.replace(/--+/g, "-")
					.replace(/^-+/, "")
					.replace(/-+$/, ""),
			getPathValues = (urlOverride) => {
				const window = getWindow();
				let location;
				location = urlOverride ? new URL(urlOverride) : window.location;
				const pathArray = location.pathname
						.slice(1)
						.split("/")
						.filter((part) => "" !== part),
					total = pathArray.length,
					key = pathArray[total - 2],
					value = pathArray[total - 1];
				return { key: key, value: value };
			},
			setHistory = (key, index) => {
				const window = getWindow();
				if (!initialized || !swiper.params.history.enabled) return;
				let location;
				location = swiper.params.url
					? new URL(swiper.params.url)
					: window.location;
				const slide = swiper.slides[index];
				let value = slugify(slide.getAttribute("data-history"));
				if (swiper.params.history.root.length > 0) {
					let root = swiper.params.history.root;
					"/" === root[root.length - 1] &&
						(root = root.slice(0, root.length - 1)),
						(value = `${root}/${key ? `${key}/` : ""}${value}`);
				} else
					location.pathname.includes(key) ||
						(value = `${key ? `${key}/` : ""}${value}`);
				swiper.params.history.keepQuery && (value += location.search);
				const currentState = window.history.state;
				(currentState && currentState.value === value) ||
					(swiper.params.history.replaceState
						? window.history.replaceState({ value: value }, null, value)
						: window.history.pushState({ value: value }, null, value));
			},
			scrollToSlide = (speed, value, runCallbacks) => {
				if (value)
					for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
						const slide = swiper.slides[i],
							slideHistory = slugify(slide.getAttribute("data-history"));
						if (slideHistory === value) {
							const index = swiper.getSlideIndex(slide);
							swiper.slideTo(index, speed, runCallbacks);
						}
					}
				else swiper.slideTo(0, speed, runCallbacks);
			},
			setHistoryPopState = () => {
				(paths = getPathValues(swiper.params.url)),
					scrollToSlide(swiper.params.speed, paths.value, !1);
			},
			init = () => {
				const window = getWindow();
				if (swiper.params.history) {
					if (!window.history || !window.history.pushState)
						return (
							(swiper.params.history.enabled = !1),
							void (swiper.params.hashNavigation.enabled = !0)
						);
					(initialized = !0),
						(paths = getPathValues(swiper.params.url)),
						paths.key || paths.value
							? (scrollToSlide(
									0,
									paths.value,
									swiper.params.runCallbacksOnInit
							  ),
							  swiper.params.history.replaceState ||
									window.addEventListener("popstate", setHistoryPopState))
							: swiper.params.history.replaceState ||
							  window.addEventListener("popstate", setHistoryPopState);
				}
			},
			destroy = () => {
				const window = getWindow();
				swiper.params.history.replaceState ||
					window.removeEventListener("popstate", setHistoryPopState);
			};
		on("init", () => {
			swiper.params.history.enabled && init();
		}),
			on("destroy", () => {
				swiper.params.history.enabled && destroy();
			}),
			on("transitionEnd _freeModeNoMomentumRelease", () => {
				initialized &&
					setHistory(swiper.params.history.key, swiper.activeIndex);
			}),
			on("slideChange", () => {
				initialized &&
					swiper.params.cssMode &&
					setHistory(swiper.params.history.key, swiper.activeIndex);
			});
	}
	function HashNavigation(_ref) {
		let {
				swiper: swiper,
				extendParams: extendParams,
				emit: emit,
				on: on,
			} = _ref,
			initialized = !1;
		const document = getDocument(),
			window = getWindow();
		extendParams({
			hashNavigation: {
				enabled: !1,
				replaceState: !1,
				watchState: !1,
				getSlideIndex(_s, hash) {
					if (swiper.virtual && swiper.params.virtual.enabled) {
						const slideWithHash = swiper.slides.filter(
							(slideEl) => slideEl.getAttribute("data-hash") === hash
						)[0];
						if (!slideWithHash) return 0;
						const index = parseInt(
							slideWithHash.getAttribute("data-swiper-slide-index"),
							10
						);
						return index;
					}
					return swiper.getSlideIndex(
						elementChildren(
							swiper.slidesEl,
							`.${swiper.params.slideClass}[data-hash="${hash}"], swiper-slide[data-hash="${hash}"]`
						)[0]
					);
				},
			},
		});
		const onHashChange = () => {
				emit("hashChange");
				const newHash = document.location.hash.replace("#", ""),
					activeSlideEl =
						swiper.virtual && swiper.params.virtual.enabled
							? swiper.slidesEl.querySelector(
									`[data-swiper-slide-index="${swiper.activeIndex}"]`
							  )
							: swiper.slides[swiper.activeIndex],
					activeSlideHash = activeSlideEl
						? activeSlideEl.getAttribute("data-hash")
						: "";
				if (newHash !== activeSlideHash) {
					const newIndex = swiper.params.hashNavigation.getSlideIndex(
						swiper,
						newHash
					);
					if (void 0 === newIndex || Number.isNaN(newIndex)) return;
					swiper.slideTo(newIndex);
				}
			},
			setHash = () => {
				if (!initialized || !swiper.params.hashNavigation.enabled) return;
				const activeSlideEl =
						swiper.virtual && swiper.params.virtual.enabled
							? swiper.slidesEl.querySelector(
									`[data-swiper-slide-index="${swiper.activeIndex}"]`
							  )
							: swiper.slides[swiper.activeIndex],
					activeSlideHash = activeSlideEl
						? activeSlideEl.getAttribute("data-hash") ||
						  activeSlideEl.getAttribute("data-history")
						: "";
				swiper.params.hashNavigation.replaceState &&
				window.history &&
				window.history.replaceState
					? (window.history.replaceState(
							null,
							null,
							`#${activeSlideHash}` || ""
					  ),
					  emit("hashSet"))
					: ((document.location.hash = activeSlideHash || ""), emit("hashSet"));
			},
			init = () => {
				if (
					!swiper.params.hashNavigation.enabled ||
					(swiper.params.history && swiper.params.history.enabled)
				)
					return;
				initialized = !0;
				const hash = document.location.hash.replace("#", "");
				if (hash) {
					const speed = 0,
						index = swiper.params.hashNavigation.getSlideIndex(swiper, hash);
					swiper.slideTo(
						index || 0,
						speed,
						swiper.params.runCallbacksOnInit,
						!0
					);
				}
				swiper.params.hashNavigation.watchState &&
					window.addEventListener("hashchange", onHashChange);
			},
			destroy = () => {
				swiper.params.hashNavigation.watchState &&
					window.removeEventListener("hashchange", onHashChange);
			};
		on("init", () => {
			swiper.params.hashNavigation.enabled && init();
		}),
			on("destroy", () => {
				swiper.params.hashNavigation.enabled && destroy();
			}),
			on("transitionEnd _freeModeNoMomentumRelease", () => {
				initialized && setHash();
			}),
			on("slideChange", () => {
				initialized && swiper.params.cssMode && setHash();
			});
	}
	function Autoplay(_ref) {
		let {
				swiper: swiper,
				extendParams: extendParams,
				on: on,
				emit: emit,
				params: params,
			} = _ref,
			timeout,
			raf;
		(swiper.autoplay = { running: !1, paused: !1, timeLeft: 0 }),
			extendParams({
				autoplay: {
					enabled: !1,
					delay: 3e3,
					waitForTransition: !0,
					disableOnInteraction: !0,
					stopOnLastSlide: !1,
					reverseDirection: !1,
					pauseOnMouseEnter: !1,
				},
			});
		let autoplayDelayTotal =
				params && params.autoplay ? params.autoplay.delay : 3e3,
			autoplayDelayCurrent =
				params && params.autoplay ? params.autoplay.delay : 3e3,
			autoplayTimeLeft,
			autoplayStartTime = new Date().getTime,
			wasPaused,
			isTouched,
			pausedByTouch,
			touchStartTimeout,
			slideChanged,
			pausedByInteraction;
		function onTransitionEnd(e) {
			swiper &&
				!swiper.destroyed &&
				swiper.wrapperEl &&
				e.target === swiper.wrapperEl &&
				(swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd),
				resume());
		}
		const calcTimeLeft = () => {
				if (swiper.destroyed || !swiper.autoplay.running) return;
				swiper.autoplay.paused
					? (wasPaused = !0)
					: wasPaused &&
					  ((autoplayDelayCurrent = autoplayTimeLeft), (wasPaused = !1));
				const timeLeft = swiper.autoplay.paused
					? autoplayTimeLeft
					: autoplayStartTime + autoplayDelayCurrent - new Date().getTime();
				(swiper.autoplay.timeLeft = timeLeft),
					emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal),
					(raf = requestAnimationFrame(() => {
						calcTimeLeft();
					}));
			},
			getSlideDelay = () => {
				let activeSlideEl;
				if (
					((activeSlideEl =
						swiper.virtual && swiper.params.virtual.enabled
							? swiper.slides.filter((slideEl) =>
									slideEl.classList.contains("swiper-slide-active")
							  )[0]
							: swiper.slides[swiper.activeIndex]),
					!activeSlideEl)
				)
					return;
				const currentSlideDelay = parseInt(
					activeSlideEl.getAttribute("data-swiper-autoplay"),
					10
				);
				return currentSlideDelay;
			},
			run = (delayForce) => {
				if (swiper.destroyed || !swiper.autoplay.running) return;
				cancelAnimationFrame(raf), calcTimeLeft();
				let delay =
					void 0 === delayForce ? swiper.params.autoplay.delay : delayForce;
				(autoplayDelayTotal = swiper.params.autoplay.delay),
					(autoplayDelayCurrent = swiper.params.autoplay.delay);
				const currentSlideDelay = getSlideDelay();
				!Number.isNaN(currentSlideDelay) &&
					currentSlideDelay > 0 &&
					void 0 === delayForce &&
					((delay = currentSlideDelay),
					(autoplayDelayTotal = currentSlideDelay),
					(autoplayDelayCurrent = currentSlideDelay)),
					(autoplayTimeLeft = delay);
				const speed = swiper.params.speed,
					proceed = () => {
						swiper &&
							!swiper.destroyed &&
							(swiper.params.autoplay.reverseDirection
								? !swiper.isBeginning ||
								  swiper.params.loop ||
								  swiper.params.rewind
									? (swiper.slidePrev(speed, !0, !0), emit("autoplay"))
									: swiper.params.autoplay.stopOnLastSlide ||
									  (swiper.slideTo(swiper.slides.length - 1, speed, !0, !0),
									  emit("autoplay"))
								: !swiper.isEnd || swiper.params.loop || swiper.params.rewind
								? (swiper.slideNext(speed, !0, !0), emit("autoplay"))
								: swiper.params.autoplay.stopOnLastSlide ||
								  (swiper.slideTo(0, speed, !0, !0), emit("autoplay")),
							swiper.params.cssMode &&
								((autoplayStartTime = new Date().getTime()),
								requestAnimationFrame(() => {
									run();
								})));
					};
				return (
					delay > 0
						? (clearTimeout(timeout),
						  (timeout = setTimeout(() => {
								proceed();
						  }, delay)))
						: requestAnimationFrame(() => {
								proceed();
						  }),
					delay
				);
			},
			start = () => {
				(swiper.autoplay.running = !0), run(), emit("autoplayStart");
			},
			stop = () => {
				(swiper.autoplay.running = !1),
					clearTimeout(timeout),
					cancelAnimationFrame(raf),
					emit("autoplayStop");
			},
			pause = (internal, reset) => {
				if (swiper.destroyed || !swiper.autoplay.running) return;
				clearTimeout(timeout), internal || (pausedByInteraction = !0);
				const proceed = () => {
					emit("autoplayPause"),
						swiper.params.autoplay.waitForTransition
							? swiper.wrapperEl.addEventListener(
									"transitionend",
									onTransitionEnd
							  )
							: resume();
				};
				if (((swiper.autoplay.paused = !0), reset))
					return (
						slideChanged && (autoplayTimeLeft = swiper.params.autoplay.delay),
						(slideChanged = !1),
						void proceed()
					);
				const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
				(autoplayTimeLeft = delay - (new Date().getTime() - autoplayStartTime)),
					(swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) ||
						(autoplayTimeLeft < 0 && (autoplayTimeLeft = 0), proceed());
			},
			resume = () => {
				(swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) ||
					swiper.destroyed ||
					!swiper.autoplay.running ||
					((autoplayStartTime = new Date().getTime()),
					pausedByInteraction
						? ((pausedByInteraction = !1), run(autoplayTimeLeft))
						: run(),
					(swiper.autoplay.paused = !1),
					emit("autoplayResume"));
			},
			onVisibilityChange = () => {
				if (swiper.destroyed || !swiper.autoplay.running) return;
				const document = getDocument();
				"hidden" === document.visibilityState &&
					((pausedByInteraction = !0), pause(!0)),
					"visible" === document.visibilityState && resume();
			},
			onPointerEnter = (e) => {
				"mouse" === e.pointerType && ((pausedByInteraction = !0), pause(!0));
			},
			onPointerLeave = (e) => {
				"mouse" === e.pointerType && swiper.autoplay.paused && resume();
			},
			attachMouseEvents = () => {
				swiper.params.autoplay.pauseOnMouseEnter &&
					(swiper.el.addEventListener("pointerenter", onPointerEnter),
					swiper.el.addEventListener("pointerleave", onPointerLeave));
			},
			detachMouseEvents = () => {
				swiper.el.removeEventListener("pointerenter", onPointerEnter),
					swiper.el.removeEventListener("pointerleave", onPointerLeave);
			},
			attachDocumentEvents = () => {
				const document = getDocument();
				document.addEventListener("visibilitychange", onVisibilityChange);
			},
			detachDocumentEvents = () => {
				const document = getDocument();
				document.removeEventListener("visibilitychange", onVisibilityChange);
			};
		on("init", () => {
			swiper.params.autoplay.enabled &&
				(attachMouseEvents(),
				attachDocumentEvents(),
				(autoplayStartTime = new Date().getTime()),
				start());
		}),
			on("destroy", () => {
				detachMouseEvents(),
					detachDocumentEvents(),
					swiper.autoplay.running && stop();
			}),
			on("beforeTransitionStart", (_s, speed, internal) => {
				!swiper.destroyed &&
					swiper.autoplay.running &&
					(internal || !swiper.params.autoplay.disableOnInteraction
						? pause(!0, !0)
						: stop());
			}),
			on("sliderFirstMove", () => {
				!swiper.destroyed &&
					swiper.autoplay.running &&
					(swiper.params.autoplay.disableOnInteraction
						? stop()
						: ((isTouched = !0),
						  (pausedByTouch = !1),
						  (pausedByInteraction = !1),
						  (touchStartTimeout = setTimeout(() => {
								(pausedByInteraction = !0), (pausedByTouch = !0), pause(!0);
						  }, 200))));
			}),
			on("touchEnd", () => {
				if (!swiper.destroyed && swiper.autoplay.running && isTouched) {
					if (
						(clearTimeout(touchStartTimeout),
						clearTimeout(timeout),
						swiper.params.autoplay.disableOnInteraction)
					)
						return (pausedByTouch = !1), void (isTouched = !1);
					pausedByTouch && swiper.params.cssMode && resume(),
						(pausedByTouch = !1),
						(isTouched = !1);
				}
			}),
			on("slideChange", () => {
				!swiper.destroyed && swiper.autoplay.running && (slideChanged = !0);
			}),
			Object.assign(swiper.autoplay, {
				start: start,
				stop: stop,
				pause: pause,
				resume: resume,
			});
	}
	function Thumb(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({
			thumbs: {
				swiper: null,
				multipleActiveThumbs: !0,
				autoScrollOffset: 0,
				slideThumbActiveClass: "swiper-slide-thumb-active",
				thumbsContainerClass: "swiper-thumbs",
			},
		});
		let initialized = !1,
			swiperCreated = !1;
		function onThumbClick() {
			const thumbsSwiper = swiper.thumbs.swiper;
			if (!thumbsSwiper || thumbsSwiper.destroyed) return;
			const clickedIndex = thumbsSwiper.clickedIndex,
				clickedSlide = thumbsSwiper.clickedSlide;
			if (
				clickedSlide &&
				clickedSlide.classList.contains(
					swiper.params.thumbs.slideThumbActiveClass
				)
			)
				return;
			if (null == clickedIndex) return;
			let slideToIndex;
			(slideToIndex = thumbsSwiper.params.loop
				? parseInt(
						thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"),
						10
				  )
				: clickedIndex),
				swiper.params.loop
					? swiper.slideToLoop(slideToIndex)
					: swiper.slideTo(slideToIndex);
		}
		function init() {
			const { thumbs: thumbsParams } = swiper.params;
			if (initialized) return !1;
			initialized = !0;
			const SwiperClass = swiper.constructor;
			if (thumbsParams.swiper instanceof SwiperClass)
				(swiper.thumbs.swiper = thumbsParams.swiper),
					Object.assign(swiper.thumbs.swiper.originalParams, {
						watchSlidesProgress: !0,
						slideToClickedSlide: !1,
					}),
					Object.assign(swiper.thumbs.swiper.params, {
						watchSlidesProgress: !0,
						slideToClickedSlide: !1,
					}),
					swiper.thumbs.swiper.update();
			else if (isObject(thumbsParams.swiper)) {
				const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
				Object.assign(thumbsSwiperParams, {
					watchSlidesProgress: !0,
					slideToClickedSlide: !1,
				}),
					(swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams)),
					(swiperCreated = !0);
			}
			return (
				swiper.thumbs.swiper.el.classList.add(
					swiper.params.thumbs.thumbsContainerClass
				),
				swiper.thumbs.swiper.on("tap", onThumbClick),
				!0
			);
		}
		function update(initial) {
			const thumbsSwiper = swiper.thumbs.swiper;
			if (!thumbsSwiper || thumbsSwiper.destroyed) return;
			const slidesPerView =
				"auto" === thumbsSwiper.params.slidesPerView
					? thumbsSwiper.slidesPerViewDynamic()
					: thumbsSwiper.params.slidesPerView;
			let thumbsToActivate = 1;
			const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
			if (
				(swiper.params.slidesPerView > 1 &&
					!swiper.params.centeredSlides &&
					(thumbsToActivate = swiper.params.slidesPerView),
				swiper.params.thumbs.multipleActiveThumbs || (thumbsToActivate = 1),
				(thumbsToActivate = Math.floor(thumbsToActivate)),
				thumbsSwiper.slides.forEach((slideEl) =>
					slideEl.classList.remove(thumbActiveClass)
				),
				thumbsSwiper.params.loop ||
					(thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled))
			)
				for (let i = 0; i < thumbsToActivate; i += 1)
					elementChildren(
						thumbsSwiper.slidesEl,
						`[data-swiper-slide-index="${swiper.realIndex + i}"]`
					).forEach((slideEl) => {
						slideEl.classList.add(thumbActiveClass);
					});
			else
				for (let i = 0; i < thumbsToActivate; i += 1)
					thumbsSwiper.slides[swiper.realIndex + i] &&
						thumbsSwiper.slides[swiper.realIndex + i].classList.add(
							thumbActiveClass
						);
			const autoScrollOffset = swiper.params.thumbs.autoScrollOffset,
				useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
			if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
				const currentThumbsIndex = thumbsSwiper.activeIndex;
				let newThumbsIndex, direction;
				if (thumbsSwiper.params.loop) {
					const newThumbsSlide = thumbsSwiper.slides.filter(
						(slideEl) =>
							slideEl.getAttribute("data-swiper-slide-index") ===
							`${swiper.realIndex}`
					)[0];
					(newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide)),
						(direction =
							swiper.activeIndex > swiper.previousIndex ? "next" : "prev");
				} else
					(newThumbsIndex = swiper.realIndex),
						(direction =
							newThumbsIndex > swiper.previousIndex ? "next" : "prev");
				useOffset &&
					(newThumbsIndex +=
						"next" === direction ? autoScrollOffset : -1 * autoScrollOffset),
					thumbsSwiper.visibleSlidesIndexes &&
						thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0 &&
						(thumbsSwiper.params.centeredSlides
							? (newThumbsIndex =
									newThumbsIndex > currentThumbsIndex
										? newThumbsIndex - Math.floor(slidesPerView / 2) + 1
										: newThumbsIndex + Math.floor(slidesPerView / 2) - 1)
							: newThumbsIndex > currentThumbsIndex &&
							  thumbsSwiper.params.slidesPerGroup,
						thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0));
			}
		}
		(swiper.thumbs = { swiper: null }),
			on("beforeInit", () => {
				const { thumbs: thumbs } = swiper.params;
				if (thumbs && thumbs.swiper)
					if (
						"string" == typeof thumbs.swiper ||
						thumbs.swiper instanceof HTMLElement
					) {
						const document = getDocument(),
							getThumbsElementAndInit = () => {
								const thumbsElement =
									"string" == typeof thumbs.swiper
										? document.querySelector(thumbs.swiper)
										: thumbs.swiper;
								if (thumbsElement && thumbsElement.swiper)
									(thumbs.swiper = thumbsElement.swiper), init(), update(!0);
								else if (thumbsElement) {
									const onThumbsSwiper = (e) => {
										(thumbs.swiper = e.detail[0]),
											thumbsElement.removeEventListener("init", onThumbsSwiper),
											init(),
											update(!0),
											thumbs.swiper.update(),
											swiper.update();
									};
									thumbsElement.addEventListener("init", onThumbsSwiper);
								}
								return thumbsElement;
							},
							watchForThumbsToAppear = () => {
								if (swiper.destroyed) return;
								const thumbsElement = getThumbsElementAndInit();
								thumbsElement || requestAnimationFrame(watchForThumbsToAppear);
							};
						requestAnimationFrame(watchForThumbsToAppear);
					} else init(), update(!0);
			}),
			on("slideChange update resize observerUpdate", () => {
				update();
			}),
			on("setTransition", (_s, duration) => {
				const thumbsSwiper = swiper.thumbs.swiper;
				thumbsSwiper &&
					!thumbsSwiper.destroyed &&
					thumbsSwiper.setTransition(duration);
			}),
			on("beforeDestroy", () => {
				const thumbsSwiper = swiper.thumbs.swiper;
				thumbsSwiper &&
					!thumbsSwiper.destroyed &&
					swiperCreated &&
					thumbsSwiper.destroy();
			}),
			Object.assign(swiper.thumbs, { init: init, update: update });
	}
	function freeMode(_ref) {
		let {
			swiper: swiper,
			extendParams: extendParams,
			emit: emit,
			once: once,
		} = _ref;
		function onTouchStart() {
			if (swiper.params.cssMode) return;
			const translate = swiper.getTranslate();
			swiper.setTranslate(translate),
				swiper.setTransition(0),
				(swiper.touchEventsData.velocities.length = 0),
				swiper.freeMode.onTouchEnd({
					currentPos: swiper.rtl ? swiper.translate : -swiper.translate,
				});
		}
		function onTouchMove() {
			if (swiper.params.cssMode) return;
			const { touchEventsData: data, touches: touches } = swiper;
			0 === data.velocities.length &&
				data.velocities.push({
					position: touches[swiper.isHorizontal() ? "startX" : "startY"],
					time: data.touchStartTime,
				}),
				data.velocities.push({
					position: touches[swiper.isHorizontal() ? "currentX" : "currentY"],
					time: now(),
				});
		}
		function onTouchEnd(_ref2) {
			let { currentPos: currentPos } = _ref2;
			if (swiper.params.cssMode) return;
			const {
					params: params,
					wrapperEl: wrapperEl,
					rtlTranslate: rtl,
					snapGrid: snapGrid,
					touchEventsData: data,
				} = swiper,
				touchEndTime = now(),
				timeDiff = touchEndTime - data.touchStartTime;
			if (currentPos < -swiper.minTranslate())
				swiper.slideTo(swiper.activeIndex);
			else if (currentPos > -swiper.maxTranslate())
				swiper.slides.length < snapGrid.length
					? swiper.slideTo(snapGrid.length - 1)
					: swiper.slideTo(swiper.slides.length - 1);
			else {
				if (params.freeMode.momentum) {
					if (data.velocities.length > 1) {
						const lastMoveEvent = data.velocities.pop(),
							velocityEvent = data.velocities.pop(),
							distance = lastMoveEvent.position - velocityEvent.position,
							time = lastMoveEvent.time - velocityEvent.time;
						(swiper.velocity = distance / time),
							(swiper.velocity /= 2),
							Math.abs(swiper.velocity) < params.freeMode.minimumVelocity &&
								(swiper.velocity = 0),
							(time > 150 || now() - lastMoveEvent.time > 300) &&
								(swiper.velocity = 0);
					} else swiper.velocity = 0;
					(swiper.velocity *= params.freeMode.momentumVelocityRatio),
						(data.velocities.length = 0);
					let momentumDuration = 1e3 * params.freeMode.momentumRatio;
					const momentumDistance = swiper.velocity * momentumDuration;
					let newPosition = swiper.translate + momentumDistance;
					rtl && (newPosition = -newPosition);
					let doBounce = !1,
						afterBouncePosition;
					const bounceAmount =
						20 *
						Math.abs(swiper.velocity) *
						params.freeMode.momentumBounceRatio;
					let needsLoopFix;
					if (newPosition < swiper.maxTranslate())
						params.freeMode.momentumBounce
							? (newPosition + swiper.maxTranslate() < -bounceAmount &&
									(newPosition = swiper.maxTranslate() - bounceAmount),
							  (afterBouncePosition = swiper.maxTranslate()),
							  (doBounce = !0),
							  (data.allowMomentumBounce = !0))
							: (newPosition = swiper.maxTranslate()),
							params.loop && params.centeredSlides && (needsLoopFix = !0);
					else if (newPosition > swiper.minTranslate())
						params.freeMode.momentumBounce
							? (newPosition - swiper.minTranslate() > bounceAmount &&
									(newPosition = swiper.minTranslate() + bounceAmount),
							  (afterBouncePosition = swiper.minTranslate()),
							  (doBounce = !0),
							  (data.allowMomentumBounce = !0))
							: (newPosition = swiper.minTranslate()),
							params.loop && params.centeredSlides && (needsLoopFix = !0);
					else if (params.freeMode.sticky) {
						let nextSlide;
						for (let j = 0; j < snapGrid.length; j += 1)
							if (snapGrid[j] > -newPosition) {
								nextSlide = j;
								break;
							}
						(newPosition =
							Math.abs(snapGrid[nextSlide] - newPosition) <
								Math.abs(snapGrid[nextSlide - 1] - newPosition) ||
							"next" === swiper.swipeDirection
								? snapGrid[nextSlide]
								: snapGrid[nextSlide - 1]),
							(newPosition = -newPosition);
					}
					if (
						(needsLoopFix &&
							once("transitionEnd", () => {
								swiper.loopFix();
							}),
						0 !== swiper.velocity)
					) {
						if (
							((momentumDuration = rtl
								? Math.abs((-newPosition - swiper.translate) / swiper.velocity)
								: Math.abs((newPosition - swiper.translate) / swiper.velocity)),
							params.freeMode.sticky)
						) {
							const moveDistance = Math.abs(
									(rtl ? -newPosition : newPosition) - swiper.translate
								),
								currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
							momentumDuration =
								moveDistance < currentSlideSize
									? params.speed
									: moveDistance < 2 * currentSlideSize
									? 1.5 * params.speed
									: 2.5 * params.speed;
						}
					} else if (params.freeMode.sticky)
						return void swiper.slideToClosest();
					params.freeMode.momentumBounce && doBounce
						? (swiper.updateProgress(afterBouncePosition),
						  swiper.setTransition(momentumDuration),
						  swiper.setTranslate(newPosition),
						  swiper.transitionStart(!0, swiper.swipeDirection),
						  (swiper.animating = !0),
						  elementTransitionEnd(wrapperEl, () => {
								swiper &&
									!swiper.destroyed &&
									data.allowMomentumBounce &&
									(emit("momentumBounce"),
									swiper.setTransition(params.speed),
									setTimeout(() => {
										swiper.setTranslate(afterBouncePosition),
											elementTransitionEnd(wrapperEl, () => {
												swiper && !swiper.destroyed && swiper.transitionEnd();
											});
									}, 0));
						  }))
						: swiper.velocity
						? (emit("_freeModeNoMomentumRelease"),
						  swiper.updateProgress(newPosition),
						  swiper.setTransition(momentumDuration),
						  swiper.setTranslate(newPosition),
						  swiper.transitionStart(!0, swiper.swipeDirection),
						  swiper.animating ||
								((swiper.animating = !0),
								elementTransitionEnd(wrapperEl, () => {
									swiper && !swiper.destroyed && swiper.transitionEnd();
								})))
						: swiper.updateProgress(newPosition),
						swiper.updateActiveIndex(),
						swiper.updateSlidesClasses();
				} else {
					if (params.freeMode.sticky) return void swiper.slideToClosest();
					params.freeMode && emit("_freeModeNoMomentumRelease");
				}
				(!params.freeMode.momentum || timeDiff >= params.longSwipesMs) &&
					(swiper.updateProgress(),
					swiper.updateActiveIndex(),
					swiper.updateSlidesClasses());
			}
		}
		extendParams({
			freeMode: {
				enabled: !1,
				momentum: !0,
				momentumRatio: 1,
				momentumBounce: !0,
				momentumBounceRatio: 1,
				momentumVelocityRatio: 1,
				sticky: !1,
				minimumVelocity: 0.02,
			},
		}),
			Object.assign(swiper, {
				freeMode: {
					onTouchStart: onTouchStart,
					onTouchMove: onTouchMove,
					onTouchEnd: onTouchEnd,
				},
			});
	}
	function Grid(_ref) {
		let { swiper: swiper, extendParams: extendParams } = _ref,
			slidesNumberEvenToRows,
			slidesPerRow,
			numFullColumns;
		extendParams({ grid: { rows: 1, fill: "column" } });
		const getSpaceBetween = () => {
				let spaceBetween = swiper.params.spaceBetween;
				return (
					"string" == typeof spaceBetween && spaceBetween.indexOf("%") >= 0
						? (spaceBetween =
								(parseFloat(spaceBetween.replace("%", "")) / 100) * swiper.size)
						: "string" == typeof spaceBetween &&
						  (spaceBetween = parseFloat(spaceBetween)),
					spaceBetween
				);
			},
			initSlides = (slidesLength) => {
				const { slidesPerView: slidesPerView } = swiper.params,
					{ rows: rows, fill: fill } = swiper.params.grid;
				(numFullColumns = Math.floor(slidesLength / rows)),
					(slidesNumberEvenToRows =
						Math.floor(slidesLength / rows) === slidesLength / rows
							? slidesLength
							: Math.ceil(slidesLength / rows) * rows),
					"auto" !== slidesPerView &&
						"row" === fill &&
						(slidesNumberEvenToRows = Math.max(
							slidesNumberEvenToRows,
							slidesPerView * rows
						)),
					(slidesPerRow = slidesNumberEvenToRows / rows);
			},
			updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
				const { slidesPerGroup: slidesPerGroup } = swiper.params,
					spaceBetween = getSpaceBetween(),
					{ rows: rows, fill: fill } = swiper.params.grid;
				let newSlideOrderIndex, column, row;
				if ("row" === fill && slidesPerGroup > 1) {
					const groupIndex = Math.floor(i / (slidesPerGroup * rows)),
						slideIndexInGroup = i - rows * slidesPerGroup * groupIndex,
						columnsInGroup =
							0 === groupIndex
								? slidesPerGroup
								: Math.min(
										Math.ceil(
											(slidesLength - groupIndex * rows * slidesPerGroup) / rows
										),
										slidesPerGroup
								  );
					(row = Math.floor(slideIndexInGroup / columnsInGroup)),
						(column =
							slideIndexInGroup -
							row * columnsInGroup +
							groupIndex * slidesPerGroup),
						(newSlideOrderIndex =
							column + (row * slidesNumberEvenToRows) / rows),
						(slide.style.order = newSlideOrderIndex);
				} else
					"column" === fill
						? ((column = Math.floor(i / rows)),
						  (row = i - column * rows),
						  (column > numFullColumns ||
								(column === numFullColumns && row === rows - 1)) &&
								((row += 1), row >= rows && ((row = 0), (column += 1))))
						: ((row = Math.floor(i / slidesPerRow)),
						  (column = i - row * slidesPerRow));
				(slide.row = row),
					(slide.column = column),
					(slide.style[getDirectionLabel("margin-top")] =
						0 !== row ? spaceBetween && `${spaceBetween}px` : "");
			},
			updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
				const { centeredSlides: centeredSlides, roundLengths: roundLengths } =
						swiper.params,
					spaceBetween = getSpaceBetween(),
					{ rows: rows } = swiper.params.grid;
				if (
					((swiper.virtualSize =
						(slideSize + spaceBetween) * slidesNumberEvenToRows),
					(swiper.virtualSize =
						Math.ceil(swiper.virtualSize / rows) - spaceBetween),
					(swiper.wrapperEl.style[getDirectionLabel("width")] = `${
						swiper.virtualSize + spaceBetween
					}px`),
					centeredSlides)
				) {
					const newSlidesGrid = [];
					for (let i = 0; i < snapGrid.length; i += 1) {
						let slidesGridItem = snapGrid[i];
						roundLengths && (slidesGridItem = Math.floor(slidesGridItem)),
							snapGrid[i] < swiper.virtualSize + snapGrid[0] &&
								newSlidesGrid.push(slidesGridItem);
					}
					snapGrid.splice(0, snapGrid.length), snapGrid.push(...newSlidesGrid);
				}
			};
		swiper.grid = {
			initSlides: initSlides,
			updateSlide: updateSlide,
			updateWrapperSize: updateWrapperSize,
		};
	}
	function appendSlide(slides) {
		const swiper = this,
			{ params: params, slidesEl: slidesEl } = swiper;
		params.loop && swiper.loopDestroy();
		const appendElement = (slideEl) => {
			if ("string" == typeof slideEl) {
				const tempDOM = document.createElement("div");
				(tempDOM.innerHTML = slideEl),
					slidesEl.append(tempDOM.children[0]),
					(tempDOM.innerHTML = "");
			} else slidesEl.append(slideEl);
		};
		if ("object" == typeof slides && "length" in slides)
			for (let i = 0; i < slides.length; i += 1)
				slides[i] && appendElement(slides[i]);
		else appendElement(slides);
		swiper.recalcSlides(),
			params.loop && swiper.loopCreate(),
			(params.observer && !swiper.isElement) || swiper.update();
	}
	function prependSlide(slides) {
		const swiper = this,
			{ params: params, activeIndex: activeIndex, slidesEl: slidesEl } = swiper;
		params.loop && swiper.loopDestroy();
		let newActiveIndex = activeIndex + 1;
		const prependElement = (slideEl) => {
			if ("string" == typeof slideEl) {
				const tempDOM = document.createElement("div");
				(tempDOM.innerHTML = slideEl),
					slidesEl.prepend(tempDOM.children[0]),
					(tempDOM.innerHTML = "");
			} else slidesEl.prepend(slideEl);
		};
		if ("object" == typeof slides && "length" in slides) {
			for (let i = 0; i < slides.length; i += 1)
				slides[i] && prependElement(slides[i]);
			newActiveIndex = activeIndex + slides.length;
		} else prependElement(slides);
		swiper.recalcSlides(),
			params.loop && swiper.loopCreate(),
			(params.observer && !swiper.isElement) || swiper.update(),
			swiper.slideTo(newActiveIndex, 0, !1);
	}
	function addSlide(index, slides) {
		const swiper = this,
			{ params: params, activeIndex: activeIndex, slidesEl: slidesEl } = swiper;
		let activeIndexBuffer = activeIndex;
		params.loop &&
			((activeIndexBuffer -= swiper.loopedSlides),
			swiper.loopDestroy(),
			swiper.recalcSlides());
		const baseLength = swiper.slides.length;
		if (index <= 0) return void swiper.prependSlide(slides);
		if (index >= baseLength) return void swiper.appendSlide(slides);
		let newActiveIndex =
			activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
		const slidesBuffer = [];
		for (let i = baseLength - 1; i >= index; i -= 1) {
			const currentSlide = swiper.slides[i];
			currentSlide.remove(), slidesBuffer.unshift(currentSlide);
		}
		if ("object" == typeof slides && "length" in slides) {
			for (let i = 0; i < slides.length; i += 1)
				slides[i] && slidesEl.append(slides[i]);
			newActiveIndex =
				activeIndexBuffer > index
					? activeIndexBuffer + slides.length
					: activeIndexBuffer;
		} else slidesEl.append(slides);
		for (let i = 0; i < slidesBuffer.length; i += 1)
			slidesEl.append(slidesBuffer[i]);
		swiper.recalcSlides(),
			params.loop && swiper.loopCreate(),
			(params.observer && !swiper.isElement) || swiper.update(),
			params.loop
				? swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, !1)
				: swiper.slideTo(newActiveIndex, 0, !1);
	}
	function removeSlide(slidesIndexes) {
		const swiper = this,
			{ params: params, activeIndex: activeIndex } = swiper;
		let activeIndexBuffer = activeIndex;
		params.loop &&
			((activeIndexBuffer -= swiper.loopedSlides), swiper.loopDestroy());
		let newActiveIndex = activeIndexBuffer,
			indexToRemove;
		if ("object" == typeof slidesIndexes && "length" in slidesIndexes) {
			for (let i = 0; i < slidesIndexes.length; i += 1)
				(indexToRemove = slidesIndexes[i]),
					swiper.slides[indexToRemove] && swiper.slides[indexToRemove].remove(),
					indexToRemove < newActiveIndex && (newActiveIndex -= 1);
			newActiveIndex = Math.max(newActiveIndex, 0);
		} else (indexToRemove = slidesIndexes), swiper.slides[indexToRemove] && swiper.slides[indexToRemove].remove(), indexToRemove < newActiveIndex && (newActiveIndex -= 1), (newActiveIndex = Math.max(newActiveIndex, 0));
		swiper.recalcSlides(),
			params.loop && swiper.loopCreate(),
			(params.observer && !swiper.isElement) || swiper.update(),
			params.loop
				? swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, !1)
				: swiper.slideTo(newActiveIndex, 0, !1);
	}
	function removeAllSlides() {
		const swiper = this,
			slidesIndexes = [];
		for (let i = 0; i < swiper.slides.length; i += 1) slidesIndexes.push(i);
		swiper.removeSlide(slidesIndexes);
	}
	function Manipulation(_ref) {
		let { swiper: swiper } = _ref;
		Object.assign(swiper, {
			appendSlide: appendSlide.bind(swiper),
			prependSlide: prependSlide.bind(swiper),
			addSlide: addSlide.bind(swiper),
			removeSlide: removeSlide.bind(swiper),
			removeAllSlides: removeAllSlides.bind(swiper),
		});
	}
	function effectInit(params) {
		const {
			effect: effect,
			swiper: swiper,
			on: on,
			setTranslate: setTranslate,
			setTransition: setTransition,
			overwriteParams: overwriteParams,
			perspective: perspective,
			recreateShadows: recreateShadows,
			getEffectParams: getEffectParams,
		} = params;
		let requireUpdateOnVirtual;
		on("beforeInit", () => {
			if (swiper.params.effect !== effect) return;
			swiper.classNames.push(
				`${swiper.params.containerModifierClass}${effect}`
			),
				perspective &&
					perspective() &&
					swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
			const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
			Object.assign(swiper.params, overwriteParamsResult),
				Object.assign(swiper.originalParams, overwriteParamsResult);
		}),
			on("setTranslate", () => {
				swiper.params.effect === effect && setTranslate();
			}),
			on("setTransition", (_s, duration) => {
				swiper.params.effect === effect && setTransition(duration);
			}),
			on("transitionEnd", () => {
				if (swiper.params.effect === effect && recreateShadows) {
					if (!getEffectParams || !getEffectParams().slideShadows) return;
					swiper.slides.forEach((slideEl) => {
						slideEl
							.querySelectorAll(
								".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
							)
							.forEach((shadowEl) => shadowEl.remove());
					}),
						recreateShadows();
				}
			}),
			on("virtualUpdate", () => {
				swiper.params.effect === effect &&
					(swiper.slides.length || (requireUpdateOnVirtual = !0),
					requestAnimationFrame(() => {
						requireUpdateOnVirtual &&
							swiper.slides &&
							swiper.slides.length &&
							(setTranslate(), (requireUpdateOnVirtual = !1));
					}));
			});
	}
	function effectTarget(effectParams, slideEl) {
		const transformEl = getSlideTransformEl(slideEl);
		return (
			transformEl !== slideEl &&
				((transformEl.style.backfaceVisibility = "hidden"),
				(transformEl.style["-webkit-backface-visibility"] = "hidden")),
			transformEl
		);
	}
	function effectVirtualTransitionEnd(_ref) {
		let {
			swiper: swiper,
			duration: duration,
			transformElements: transformElements,
			allSlides: allSlides,
		} = _ref;
		const { activeIndex: activeIndex } = swiper,
			getSlide = (el) => {
				if (!el.parentElement) {
					const slide = swiper.slides.filter(
						(slideEl) => slideEl.shadowEl && slideEl.shadowEl === el.parentNode
					)[0];
					return slide;
				}
				return el.parentElement;
			};
		if (swiper.params.virtualTranslate && 0 !== duration) {
			let eventTriggered = !1,
				transitionEndTarget;
			(transitionEndTarget = allSlides
				? transformElements
				: transformElements.filter((transformEl) => {
						const el = transformEl.classList.contains("swiper-slide-transform")
							? getSlide(transformEl)
							: transformEl;
						return swiper.getSlideIndex(el) === activeIndex;
				  })),
				transitionEndTarget.forEach((el) => {
					elementTransitionEnd(el, () => {
						if (eventTriggered) return;
						if (!swiper || swiper.destroyed) return;
						(eventTriggered = !0), (swiper.animating = !1);
						const evt = new window.CustomEvent("transitionend", {
							bubbles: !0,
							cancelable: !0,
						});
						swiper.wrapperEl.dispatchEvent(evt);
					});
				});
		}
	}
	function EffectFade(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({ fadeEffect: { crossFade: !1 } });
		const setTranslate = () => {
				const { slides: slides } = swiper,
					params = swiper.params.fadeEffect;
				for (let i = 0; i < slides.length; i += 1) {
					const slideEl = swiper.slides[i],
						offset = slideEl.swiperSlideOffset;
					let tx = -offset;
					swiper.params.virtualTranslate || (tx -= swiper.translate);
					let ty = 0;
					swiper.isHorizontal() || ((ty = tx), (tx = 0));
					const slideOpacity = swiper.params.fadeEffect.crossFade
							? Math.max(1 - Math.abs(slideEl.progress), 0)
							: 1 + Math.min(Math.max(slideEl.progress, -1), 0),
						targetEl = effectTarget(params, slideEl);
					(targetEl.style.opacity = slideOpacity),
						(targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`);
				}
			},
			setTransition = (duration) => {
				const transformElements = swiper.slides.map((slideEl) =>
					getSlideTransformEl(slideEl)
				);
				transformElements.forEach((el) => {
					el.style.transitionDuration = `${duration}ms`;
				}),
					effectVirtualTransitionEnd({
						swiper: swiper,
						duration: duration,
						transformElements: transformElements,
						allSlides: !0,
					});
			};
		effectInit({
			effect: "fade",
			swiper: swiper,
			on: on,
			setTranslate: setTranslate,
			setTransition: setTransition,
			overwriteParams: () => ({
				slidesPerView: 1,
				slidesPerGroup: 1,
				watchSlidesProgress: !0,
				spaceBetween: 0,
				virtualTranslate: !swiper.params.cssMode,
			}),
		});
	}
	function EffectCube(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({
			cubeEffect: {
				slideShadows: !0,
				shadow: !0,
				shadowOffset: 20,
				shadowScale: 0.94,
			},
		});
		const createSlideShadows = (slideEl, progress, isHorizontal) => {
				let shadowBefore = isHorizontal
						? slideEl.querySelector(".swiper-slide-shadow-left")
						: slideEl.querySelector(".swiper-slide-shadow-top"),
					shadowAfter = isHorizontal
						? slideEl.querySelector(".swiper-slide-shadow-right")
						: slideEl.querySelector(".swiper-slide-shadow-bottom");
				shadowBefore ||
					((shadowBefore = createElement(
						"div",
						`swiper-slide-shadow-${isHorizontal ? "left" : "top"}`
					)),
					slideEl.append(shadowBefore)),
					shadowAfter ||
						((shadowAfter = createElement(
							"div",
							`swiper-slide-shadow-${isHorizontal ? "right" : "bottom"}`
						)),
						slideEl.append(shadowAfter)),
					shadowBefore && (shadowBefore.style.opacity = Math.max(-progress, 0)),
					shadowAfter && (shadowAfter.style.opacity = Math.max(progress, 0));
			},
			recreateShadows = () => {
				const isHorizontal = swiper.isHorizontal();
				swiper.slides.forEach((slideEl) => {
					const progress = Math.max(Math.min(slideEl.progress, 1), -1);
					createSlideShadows(slideEl, progress, isHorizontal);
				});
			},
			setTranslate = () => {
				const {
						el: el,
						wrapperEl: wrapperEl,
						slides: slides,
						width: swiperWidth,
						height: swiperHeight,
						rtlTranslate: rtl,
						size: swiperSize,
						browser: browser,
					} = swiper,
					params = swiper.params.cubeEffect,
					isHorizontal = swiper.isHorizontal(),
					isVirtual = swiper.virtual && swiper.params.virtual.enabled;
				let wrapperRotate = 0,
					cubeShadowEl;
				params.shadow &&
					(isHorizontal
						? ((cubeShadowEl = swiper.slidesEl.querySelector(
								".swiper-cube-shadow"
						  )),
						  cubeShadowEl ||
								((cubeShadowEl = createElement("div", "swiper-cube-shadow")),
								swiper.slidesEl.append(cubeShadowEl)),
						  (cubeShadowEl.style.height = `${swiperWidth}px`))
						: ((cubeShadowEl = el.querySelector(".swiper-cube-shadow")),
						  cubeShadowEl ||
								((cubeShadowEl = createElement("div", "swiper-cube-shadow")),
								el.append(cubeShadowEl))));
				for (let i = 0; i < slides.length; i += 1) {
					const slideEl = slides[i];
					let slideIndex = i;
					isVirtual &&
						(slideIndex = parseInt(
							slideEl.getAttribute("data-swiper-slide-index"),
							10
						));
					let slideAngle = 90 * slideIndex,
						round = Math.floor(slideAngle / 360);
					rtl &&
						((slideAngle = -slideAngle),
						(round = Math.floor(-slideAngle / 360)));
					const progress = Math.max(Math.min(slideEl.progress, 1), -1);
					let tx = 0,
						ty = 0,
						tz = 0;
					slideIndex % 4 == 0
						? ((tx = 4 * -round * swiperSize), (tz = 0))
						: (slideIndex - 1) % 4 == 0
						? ((tx = 0), (tz = 4 * -round * swiperSize))
						: (slideIndex - 2) % 4 == 0
						? ((tx = swiperSize + 4 * round * swiperSize), (tz = swiperSize))
						: (slideIndex - 3) % 4 == 0 &&
						  ((tx = -swiperSize),
						  (tz = 3 * swiperSize + 4 * swiperSize * round)),
						rtl && (tx = -tx),
						isHorizontal || ((ty = tx), (tx = 0));
					const transform = `rotateX(${
						isHorizontal ? 0 : -slideAngle
					}deg) rotateY(${
						isHorizontal ? slideAngle : 0
					}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
					progress <= 1 &&
						progress > -1 &&
						((wrapperRotate = 90 * slideIndex + 90 * progress),
						rtl && (wrapperRotate = 90 * -slideIndex - 90 * progress)),
						(slideEl.style.transform = transform),
						params.slideShadows &&
							createSlideShadows(slideEl, progress, isHorizontal);
				}
				if (
					((wrapperEl.style.transformOrigin = `50% 50% -${swiperSize / 2}px`),
					(wrapperEl.style["-webkit-transform-origin"] = `50% 50% -${
						swiperSize / 2
					}px`),
					params.shadow)
				)
					if (isHorizontal)
						cubeShadowEl.style.transform = `translate3d(0px, ${
							swiperWidth / 2 + params.shadowOffset
						}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${
							params.shadowScale
						})`;
					else {
						const shadowAngle =
								Math.abs(wrapperRotate) -
								90 * Math.floor(Math.abs(wrapperRotate) / 90),
							multiplier =
								1.5 -
								(Math.sin((2 * shadowAngle * Math.PI) / 360) / 2 +
									Math.cos((2 * shadowAngle * Math.PI) / 360) / 2),
							scale1 = params.shadowScale,
							scale2 = params.shadowScale / multiplier,
							offset = params.shadowOffset;
						cubeShadowEl.style.transform = `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${
							swiperHeight / 2 + offset
						}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`;
					}
				const zFactor =
					(browser.isSafari || browser.isWebView) && browser.needPerspectiveFix
						? -swiperSize / 2
						: 0;
				(wrapperEl.style.transform = `translate3d(0px,0,${zFactor}px) rotateX(${
					swiper.isHorizontal() ? 0 : wrapperRotate
				}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`),
					wrapperEl.style.setProperty(
						"--swiper-cube-translate-z",
						`${zFactor}px`
					);
			},
			setTransition = (duration) => {
				const { el: el, slides: slides } = swiper;
				if (
					(slides.forEach((slideEl) => {
						(slideEl.style.transitionDuration = `${duration}ms`),
							slideEl
								.querySelectorAll(
									".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
								)
								.forEach((subEl) => {
									subEl.style.transitionDuration = `${duration}ms`;
								});
					}),
					swiper.params.cubeEffect.shadow && !swiper.isHorizontal())
				) {
					const shadowEl = el.querySelector(".swiper-cube-shadow");
					shadowEl && (shadowEl.style.transitionDuration = `${duration}ms`);
				}
			};
		effectInit({
			effect: "cube",
			swiper: swiper,
			on: on,
			setTranslate: setTranslate,
			setTransition: setTransition,
			recreateShadows: recreateShadows,
			getEffectParams: () => swiper.params.cubeEffect,
			perspective: () => !0,
			overwriteParams: () => ({
				slidesPerView: 1,
				slidesPerGroup: 1,
				watchSlidesProgress: !0,
				resistanceRatio: 0,
				spaceBetween: 0,
				centeredSlides: !1,
				virtualTranslate: !0,
			}),
		});
	}
	function createShadow(params, slideEl, side) {
		const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ""}`,
			shadowContainer = getSlideTransformEl(slideEl);
		let shadowEl = shadowContainer.querySelector(`.${shadowClass}`);
		return (
			shadowEl ||
				((shadowEl = createElement(
					"div",
					`swiper-slide-shadow${side ? `-${side}` : ""}`
				)),
				shadowContainer.append(shadowEl)),
			shadowEl
		);
	}
	function EffectFlip(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({ flipEffect: { slideShadows: !0, limitRotation: !0 } });
		const createSlideShadows = (slideEl, progress, params) => {
				let shadowBefore = swiper.isHorizontal()
						? slideEl.querySelector(".swiper-slide-shadow-left")
						: slideEl.querySelector(".swiper-slide-shadow-top"),
					shadowAfter = swiper.isHorizontal()
						? slideEl.querySelector(".swiper-slide-shadow-right")
						: slideEl.querySelector(".swiper-slide-shadow-bottom");
				shadowBefore ||
					(shadowBefore = createShadow(
						params,
						slideEl,
						swiper.isHorizontal() ? "left" : "top"
					)),
					shadowAfter ||
						(shadowAfter = createShadow(
							params,
							slideEl,
							swiper.isHorizontal() ? "right" : "bottom"
						)),
					shadowBefore && (shadowBefore.style.opacity = Math.max(-progress, 0)),
					shadowAfter && (shadowAfter.style.opacity = Math.max(progress, 0));
			},
			recreateShadows = () => {
				const params = swiper.params.flipEffect;
				swiper.slides.forEach((slideEl) => {
					let progress = slideEl.progress;
					swiper.params.flipEffect.limitRotation &&
						(progress = Math.max(Math.min(slideEl.progress, 1), -1)),
						createSlideShadows(slideEl, progress, params);
				});
			},
			setTranslate = () => {
				const { slides: slides, rtlTranslate: rtl } = swiper,
					params = swiper.params.flipEffect;
				for (let i = 0; i < slides.length; i += 1) {
					const slideEl = slides[i];
					let progress = slideEl.progress;
					swiper.params.flipEffect.limitRotation &&
						(progress = Math.max(Math.min(slideEl.progress, 1), -1));
					const offset = slideEl.swiperSlideOffset,
						rotate = -180 * progress;
					let rotateY = rotate,
						rotateX = 0,
						tx = swiper.params.cssMode ? -offset - swiper.translate : -offset,
						ty = 0;
					swiper.isHorizontal()
						? rtl && (rotateY = -rotateY)
						: ((ty = tx), (tx = 0), (rotateX = -rotateY), (rotateY = 0)),
						(slideEl.style.zIndex =
							-Math.abs(Math.round(progress)) + slides.length),
						params.slideShadows &&
							createSlideShadows(slideEl, progress, params);
					const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
						targetEl = effectTarget(params, slideEl);
					targetEl.style.transform = transform;
				}
			},
			setTransition = (duration) => {
				const transformElements = swiper.slides.map((slideEl) =>
					getSlideTransformEl(slideEl)
				);
				transformElements.forEach((el) => {
					(el.style.transitionDuration = `${duration}ms`),
						el
							.querySelectorAll(
								".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
							)
							.forEach((shadowEl) => {
								shadowEl.style.transitionDuration = `${duration}ms`;
							});
				}),
					effectVirtualTransitionEnd({
						swiper: swiper,
						duration: duration,
						transformElements: transformElements,
					});
			};
		effectInit({
			effect: "flip",
			swiper: swiper,
			on: on,
			setTranslate: setTranslate,
			setTransition: setTransition,
			recreateShadows: recreateShadows,
			getEffectParams: () => swiper.params.flipEffect,
			perspective: () => !0,
			overwriteParams: () => ({
				slidesPerView: 1,
				slidesPerGroup: 1,
				watchSlidesProgress: !0,
				spaceBetween: 0,
				virtualTranslate: !swiper.params.cssMode,
			}),
		});
	}
	function EffectCoverflow(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({
			coverflowEffect: {
				rotate: 50,
				stretch: 0,
				depth: 100,
				scale: 1,
				modifier: 1,
				slideShadows: !0,
			},
		});
		const setTranslate = () => {
				const {
						width: swiperWidth,
						height: swiperHeight,
						slides: slides,
						slidesSizesGrid: slidesSizesGrid,
					} = swiper,
					params = swiper.params.coverflowEffect,
					isHorizontal = swiper.isHorizontal(),
					transform = swiper.translate,
					center = isHorizontal
						? swiperWidth / 2 - transform
						: swiperHeight / 2 - transform,
					rotate = isHorizontal ? params.rotate : -params.rotate,
					translate = params.depth;
				for (let i = 0, length = slides.length; i < length; i += 1) {
					const slideEl = slides[i],
						slideSize = slidesSizesGrid[i],
						slideOffset = slideEl.swiperSlideOffset,
						centerOffset = (center - slideOffset - slideSize / 2) / slideSize,
						offsetMultiplier =
							"function" == typeof params.modifier
								? params.modifier(centerOffset)
								: centerOffset * params.modifier;
					let rotateY = isHorizontal ? rotate * offsetMultiplier : 0,
						rotateX = isHorizontal ? 0 : rotate * offsetMultiplier,
						translateZ = -translate * Math.abs(offsetMultiplier),
						stretch = params.stretch;
					"string" == typeof stretch &&
						-1 !== stretch.indexOf("%") &&
						(stretch = (parseFloat(params.stretch) / 100) * slideSize);
					let translateY = isHorizontal ? 0 : stretch * offsetMultiplier,
						translateX = isHorizontal ? stretch * offsetMultiplier : 0,
						scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);
					Math.abs(translateX) < 0.001 && (translateX = 0),
						Math.abs(translateY) < 0.001 && (translateY = 0),
						Math.abs(translateZ) < 0.001 && (translateZ = 0),
						Math.abs(rotateY) < 0.001 && (rotateY = 0),
						Math.abs(rotateX) < 0.001 && (rotateX = 0),
						Math.abs(scale) < 0.001 && (scale = 0);
					const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
						targetEl = effectTarget(params, slideEl);
					if (
						((targetEl.style.transform = slideTransform),
						(slideEl.style.zIndex = 1 - Math.abs(Math.round(offsetMultiplier))),
						params.slideShadows)
					) {
						let shadowBeforeEl = isHorizontal
								? slideEl.querySelector(".swiper-slide-shadow-left")
								: slideEl.querySelector(".swiper-slide-shadow-top"),
							shadowAfterEl = isHorizontal
								? slideEl.querySelector(".swiper-slide-shadow-right")
								: slideEl.querySelector(".swiper-slide-shadow-bottom");
						shadowBeforeEl ||
							(shadowBeforeEl = createShadow(
								params,
								slideEl,
								isHorizontal ? "left" : "top"
							)),
							shadowAfterEl ||
								(shadowAfterEl = createShadow(
									params,
									slideEl,
									isHorizontal ? "right" : "bottom"
								)),
							shadowBeforeEl &&
								(shadowBeforeEl.style.opacity =
									offsetMultiplier > 0 ? offsetMultiplier : 0),
							shadowAfterEl &&
								(shadowAfterEl.style.opacity =
									-offsetMultiplier > 0 ? -offsetMultiplier : 0);
					}
				}
			},
			setTransition = (duration) => {
				const transformElements = swiper.slides.map((slideEl) =>
					getSlideTransformEl(slideEl)
				);
				transformElements.forEach((el) => {
					(el.style.transitionDuration = `${duration}ms`),
						el
							.querySelectorAll(
								".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
							)
							.forEach((shadowEl) => {
								shadowEl.style.transitionDuration = `${duration}ms`;
							});
				});
			};
		effectInit({
			effect: "coverflow",
			swiper: swiper,
			on: on,
			setTranslate: setTranslate,
			setTransition: setTransition,
			perspective: () => !0,
			overwriteParams: () => ({ watchSlidesProgress: !0 }),
		});
	}
	function EffectCreative(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({
			creativeEffect: {
				limitProgress: 1,
				shadowPerProgress: !1,
				progressMultiplier: 1,
				perspective: !0,
				prev: { translate: [0, 0, 0], rotate: [0, 0, 0], opacity: 1, scale: 1 },
				next: { translate: [0, 0, 0], rotate: [0, 0, 0], opacity: 1, scale: 1 },
			},
		});
		const getTranslateValue = (value) =>
				"string" == typeof value ? value : `${value}px`,
			setTranslate = () => {
				const {
						slides: slides,
						wrapperEl: wrapperEl,
						slidesSizesGrid: slidesSizesGrid,
					} = swiper,
					params = swiper.params.creativeEffect,
					{ progressMultiplier: multiplier } = params,
					isCenteredSlides = swiper.params.centeredSlides;
				if (isCenteredSlides) {
					const margin =
						slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
					wrapperEl.style.transform = `translateX(calc(50% - ${margin}px))`;
				}
				for (let i = 0; i < slides.length; i += 1) {
					const slideEl = slides[i],
						slideProgress = slideEl.progress,
						progress = Math.min(
							Math.max(slideEl.progress, -params.limitProgress),
							params.limitProgress
						);
					let originalProgress = progress;
					isCenteredSlides ||
						(originalProgress = Math.min(
							Math.max(slideEl.originalProgress, -params.limitProgress),
							params.limitProgress
						));
					const offset = slideEl.swiperSlideOffset,
						t = [
							swiper.params.cssMode ? -offset - swiper.translate : -offset,
							0,
							0,
						],
						r = [0, 0, 0];
					let custom = !1;
					swiper.isHorizontal() || ((t[1] = t[0]), (t[0] = 0));
					let data = {
						translate: [0, 0, 0],
						rotate: [0, 0, 0],
						scale: 1,
						opacity: 1,
					};
					progress < 0
						? ((data = params.next), (custom = !0))
						: progress > 0 && ((data = params.prev), (custom = !0)),
						t.forEach((value, index) => {
							t[index] = `calc(${value}px + (${getTranslateValue(
								data.translate[index]
							)} * ${Math.abs(progress * multiplier)}))`;
						}),
						r.forEach((value, index) => {
							r[index] = data.rotate[index] * Math.abs(progress * multiplier);
						}),
						(slideEl.style.zIndex =
							-Math.abs(Math.round(slideProgress)) + slides.length);
					const translateString = t.join(", "),
						rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`,
						scaleString =
							originalProgress < 0
								? `scale(${
										1 + (1 - data.scale) * originalProgress * multiplier
								  })`
								: `scale(${
										1 - (1 - data.scale) * originalProgress * multiplier
								  })`,
						opacityString =
							originalProgress < 0
								? 1 + (1 - data.opacity) * originalProgress * multiplier
								: 1 - (1 - data.opacity) * originalProgress * multiplier,
						transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`;
					if ((custom && data.shadow) || !custom) {
						let shadowEl = slideEl.querySelector(".swiper-slide-shadow");
						if (
							(!shadowEl &&
								data.shadow &&
								(shadowEl = createShadow(params, slideEl)),
							shadowEl)
						) {
							const shadowOpacity = params.shadowPerProgress
								? progress * (1 / params.limitProgress)
								: progress;
							shadowEl.style.opacity = Math.min(
								Math.max(Math.abs(shadowOpacity), 0),
								1
							);
						}
					}
					const targetEl = effectTarget(params, slideEl);
					(targetEl.style.transform = transform),
						(targetEl.style.opacity = opacityString),
						data.origin && (targetEl.style.transformOrigin = data.origin);
				}
			},
			setTransition = (duration) => {
				const transformElements = swiper.slides.map((slideEl) =>
					getSlideTransformEl(slideEl)
				);
				transformElements.forEach((el) => {
					(el.style.transitionDuration = `${duration}ms`),
						el.querySelectorAll(".swiper-slide-shadow").forEach((shadowEl) => {
							shadowEl.style.transitionDuration = `${duration}ms`;
						});
				}),
					effectVirtualTransitionEnd({
						swiper: swiper,
						duration: duration,
						transformElements: transformElements,
						allSlides: !0,
					});
			};
		effectInit({
			effect: "creative",
			swiper: swiper,
			on: on,
			setTranslate: setTranslate,
			setTransition: setTransition,
			perspective: () => swiper.params.creativeEffect.perspective,
			overwriteParams: () => ({
				watchSlidesProgress: !0,
				virtualTranslate: !swiper.params.cssMode,
			}),
		});
	}
	function EffectCards(_ref) {
		let { swiper: swiper, extendParams: extendParams, on: on } = _ref;
		extendParams({
			cardsEffect: {
				slideShadows: !0,
				rotate: !0,
				perSlideRotate: 2,
				perSlideOffset: 8,
			},
		});
		const setTranslate = () => {
				const {
						slides: slides,
						activeIndex: activeIndex,
						rtlTranslate: rtl,
					} = swiper,
					params = swiper.params.cardsEffect,
					{ startTranslate: startTranslate, isTouched: isTouched } =
						swiper.touchEventsData,
					currentTranslate = rtl ? -swiper.translate : swiper.translate;
				for (let i = 0; i < slides.length; i += 1) {
					const slideEl = slides[i],
						slideProgress = slideEl.progress,
						progress = Math.min(Math.max(slideProgress, -4), 4);
					let offset = slideEl.swiperSlideOffset;
					swiper.params.centeredSlides &&
						!swiper.params.cssMode &&
						(swiper.wrapperEl.style.transform = `translateX(${swiper.minTranslate()}px)`),
						swiper.params.centeredSlides &&
							swiper.params.cssMode &&
							(offset -= slides[0].swiperSlideOffset);
					let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset,
						tY = 0;
					const tZ = -100 * Math.abs(progress);
					let scale = 1,
						rotate = -params.perSlideRotate * progress,
						tXAdd = params.perSlideOffset - 0.75 * Math.abs(progress);
					const slideIndex =
							swiper.virtual && swiper.params.virtual.enabled
								? swiper.virtual.from + i
								: i,
						isSwipeToNext =
							(slideIndex === activeIndex || slideIndex === activeIndex - 1) &&
							progress > 0 &&
							progress < 1 &&
							(isTouched || swiper.params.cssMode) &&
							currentTranslate < startTranslate,
						isSwipeToPrev =
							(slideIndex === activeIndex || slideIndex === activeIndex + 1) &&
							progress < 0 &&
							progress > -1 &&
							(isTouched || swiper.params.cssMode) &&
							currentTranslate > startTranslate;
					if (isSwipeToNext || isSwipeToPrev) {
						const subProgress =
							(1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
						(rotate += -28 * progress * subProgress),
							(scale += -0.5 * subProgress),
							(tXAdd += 96 * subProgress),
							(tY = `${-25 * subProgress * Math.abs(progress)}%`);
					}
					if (
						((tX =
							progress < 0
								? `calc(${tX}px ${rtl ? "-" : "+"} (${
										tXAdd * Math.abs(progress)
								  }%))`
								: progress > 0
								? `calc(${tX}px ${rtl ? "-" : "+"} (-${
										tXAdd * Math.abs(progress)
								  }%))`
								: `${tX}px`),
						!swiper.isHorizontal())
					) {
						const prevY = tY;
						(tY = tX), (tX = prevY);
					}
					const scaleString =
							progress < 0
								? `${1 + (1 - scale) * progress}`
								: `${1 - (1 - scale) * progress}`,
						transform = `\n        translate3d(${tX}, ${tY}, ${tZ}px)\n        rotateZ(${
							params.rotate ? (rtl ? -rotate : rotate) : 0
						}deg)\n        scale(${scaleString})\n      `;
					if (params.slideShadows) {
						let shadowEl = slideEl.querySelector(".swiper-slide-shadow");
						shadowEl || (shadowEl = createShadow(params, slideEl)),
							shadowEl &&
								(shadowEl.style.opacity = Math.min(
									Math.max((Math.abs(progress) - 0.5) / 0.5, 0),
									1
								));
					}
					slideEl.style.zIndex =
						-Math.abs(Math.round(slideProgress)) + slides.length;
					const targetEl = effectTarget(params, slideEl);
					targetEl.style.transform = transform;
				}
			},
			setTransition = (duration) => {
				const transformElements = swiper.slides.map((slideEl) =>
					getSlideTransformEl(slideEl)
				);
				transformElements.forEach((el) => {
					(el.style.transitionDuration = `${duration}ms`),
						el.querySelectorAll(".swiper-slide-shadow").forEach((shadowEl) => {
							shadowEl.style.transitionDuration = `${duration}ms`;
						});
				}),
					effectVirtualTransitionEnd({
						swiper: swiper,
						duration: duration,
						transformElements: transformElements,
					});
			};
		effectInit({
			effect: "cards",
			swiper: swiper,
			on: on,
			setTranslate: setTranslate,
			setTransition: setTransition,
			perspective: () => !0,
			overwriteParams: () => ({
				watchSlidesProgress: !0,
				virtualTranslate: !swiper.params.cssMode,
			}),
		});
	}
	Object.keys(prototypes).forEach((prototypeGroup) => {
		Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
			Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
		});
	}),
		Swiper.use([Resize, Observer]);
	const modules = [
		Virtual,
		Keyboard,
		Mousewheel,
		Navigation,
		Pagination,
		Scrollbar,
		Parallax,
		Zoom,
		Controller,
		A11y,
		History,
		HashNavigation,
		Autoplay,
		Thumb,
		freeMode,
		Grid,
		Manipulation,
		EffectFade,
		EffectCube,
		EffectFlip,
		EffectCoverflow,
		EffectCreative,
		EffectCards,
	];
	return Swiper.use(modules), Swiper;
});
