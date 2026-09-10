<script setup lang="ts">
import {
  BrainCircuit,
  Database,
  MessageSquareText,
  Route,
  ShieldCheck,
  Wrench,
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { ref } from 'vue'

const stages = [
  {
    icon: MessageSquareText,
    label: '理解意图',
    detail: '识别本轮语言、任务领域和是否涉及危险操作。',
  },
  {
    icon: Database,
    label: '读取上下文',
    detail: '从 Store、选中节点、页面 Schema 与真实 DOM 获取最小必要快照。',
  },
  {
    icon: Route,
    label: '开放工具',
    detail: '首步仅暴露发现工具，读取对应领域后才解锁写入工具。',
  },
  {
    icon: BrainCircuit,
    label: 'Agent 循环',
    detail: '模型在文本生成、工具调用和工具结果之间迭代，直到完成或达到步数上限。',
  },
  {
    icon: Wrench,
    label: '执行事务',
    detail: '验证参数、修改 Schema 或业务资源，并保留撤销与重绘所需快照。',
  },
  {
    icon: ShieldCheck,
    label: '验证与反馈',
    detail: '恢复选中状态、标记未保存，并把工具结果作为结构化 UI 返回。',
  },
] as const

const activeIndexRef = ref(0)
</script>

<template>
  <section class="my-10 overflow-hidden rounded-3xl bg-slate-950 p-3 shadow-2xl shadow-sky-950/20 sm:p-5" aria-labelledby="agent-loop-title">
    <div class="rounded-[1.25rem] bg-slate-900/80 p-4 ring-1 ring-white/10 sm:p-6">
      <p class="m-0 text-xs font-semibold tracking-[0.18em] text-sky-300 uppercase">
        Runtime walkthrough
      </p>
      <h2 id="agent-loop-title" class="mt-2 text-balance text-xl font-semibold text-white sm:text-2xl">
        一条用户消息，如何变成一次可审计的修改
      </h2>

      <div class="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-6" role="group" aria-label="Agent 运行阶段">
        <button
          v-for="(stage, index) in stages"
          :key="stage.label"
          type="button"
          class="group min-h-24 cursor-pointer rounded-2xl p-3 text-left ring-1 transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
          :class="activeIndexRef === index
            ? 'bg-sky-400/15 text-white ring-sky-300/55 shadow-lg shadow-sky-950/25'
            : 'bg-white/[0.035] text-slate-300 ring-white/10 hover:bg-white/[0.07] hover:text-white'"
          :aria-current="activeIndexRef === index ? 'step' : undefined"
          @click="activeIndexRef = index"
        >
          <component :is="stage.icon" :size="20" :stroke-width="1.8" aria-hidden="true" />
          <span class="mt-3 block text-xs font-semibold tabular-nums text-sky-300">0{{ index + 1 }}</span>
          <span class="mt-0.5 block text-sm font-medium">{{ stage.label }}</span>
        </button>
      </div>

      <div class="relative mt-4 min-h-20 overflow-hidden rounded-2xl bg-white/[0.045] p-4 ring-1 ring-white/10" aria-live="polite">
        <motion.div
          :key="stages[activeIndexRef].label"
          :initial="{ opacity: 0, y: 8, filter: 'blur(4px)' }"
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :transition="{ type: 'spring', duration: 0.3, bounce: 0 }"
        >
          <p class="m-0 text-sm font-semibold text-white">
            {{ stages[activeIndexRef].label }}
          </p>
          <p class="mt-1 text-pretty text-sm leading-6 text-slate-300">
            {{ stages[activeIndexRef].detail }}
          </p>
        </motion.div>
      </div>
    </div>
  </section>
</template>
