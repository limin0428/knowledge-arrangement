const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");
 let hook = new SyncHook()
 // 发布
 hook.tap('something', () => {
   console.log('lm0428')
 })

 // 订阅
 hook.call('something')