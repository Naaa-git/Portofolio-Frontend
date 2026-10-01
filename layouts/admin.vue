<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <AdminSidebar />
    <main class="flex-1 min-w-0">
      <div class="max-w-4xl mx-auto px-6 py-8 md:px-10 md:py-10">
        <slot />
      </div>
    </main>
  </div>
</template>
