## Goal

删除 Follow-ups 独立页面,将 follow-up 功能整合到 Meetings 页面。每个 meeting 卡片下方展示一封 AI 自动总结的 follow-up 邮件(会议纪要 + to-do list),自动发送给所有参会人。

## Changes

### 1. 删除 Follow-ups 页面
- 删除 `src/routes/_app.follow-ups.tsx`
- `AppSidebar.tsx` 移除 "Follow-ups" 菜单项(同时移除未使用的 `MessageSquareReply`/`ListChecks` 图标 import 如无其他引用)
- 检查并清理 Home 页(`_app.home.tsx`) 里可能存在的 Follow-ups 跳转/引用,若仅是文案则保留

### 2. Mock data 扩展 (`src/lib/mock-data.ts`)
在每个 meeting 上新增 `followUp` 字段:
```
followUp: {
  status: "draft" | "sent",           // 默认 "draft"
  generatedAt: string,                 // "2 min after meeting"
  recipients: string[],                // = attendees
  subject: string,                     // "Recap & next steps — <meeting title>"
  summary: string,                     // 2-3 句 AI 会议摘要
  todos: { owner: string; task: string; due?: string }[],
}
```
为 3 个 mock meetings 各写一封贴合 SuperIntern 场景的 follow-up(Maya 视频、Rina 合作、Ana 定位视频)。

### 3. Meetings 页面重构 (`src/routes/_app.meetings.tsx`)
把每个会议卡片拆成两块视觉层次:

**上半部分(保留):** meeting title、时间、参会人、Prep notes / Suggested questions / Action items 三栏。

**下半部分(新增)——AI Follow-up email 卡片:**
- 顶部一行:`Sparkles` 图标 + 标题 "AI follow-up email"、右侧状态 badge(Draft / Sent)、"Generated 2 min after meeting" 小字
- 收件人行:`To: <所有参会人>` chips
- Subject 行:粗体主题
- **Summary 区块:** 段落文字,`bg-cream/60` rounded 卡片,标签 "Meeting summary"
- **To-do list 区块:** 每条一行,checkbox + `owner` 小徽章 + task 文本 + optional due 日期灰字
- 底部按钮行:
  - Primary: "Send to all attendees" (Draft 状态时可点,点击后本地 state 切到 Sent,toast 提示;Sent 状态显示 "Sent to N people ·  time")
  - Secondary: "Edit" / "Regenerate"(仅 toast placeholder)

样式复用现有 `bg-card` / border / `shadow-soft` 与 cream tokens,不引入新颜色。整个 follow-up 区块用 `border-t border-dashed` 与上半部分分隔,或独立子卡片(inner `bg-background/60` rounded-xl)。

### 4. 状态管理
- 用组件内 `useState<Record<meetingId, "draft"|"sent">>` 追踪发送状态(重载后重置,足够 mock 演示)
- 不引入 zustand persist(follow-ups 不需要持久化)
- 使用现有 `sonner` toast 提示 "Follow-up sent to N attendees"

### 5. Head metadata
更新 meetings 页 description: "Meeting prep, notes, and AI-generated follow-up emails ready to send to attendees."

## Out of scope
- 不接入真实 AI(纯 mock 静态文本)
- 不新增页面路由
- 不改动 People / Inbox / Home 的其他部分
