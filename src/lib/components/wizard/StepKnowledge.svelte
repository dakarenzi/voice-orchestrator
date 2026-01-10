<script lang="ts">
    import { wizardStore } from "$lib/stores/wizardStore.svelte";
    import { Upload, FileText } from "lucide-svelte";
</script>

<div class="space-y-6">
    <div class="text-center space-y-2 mb-8">
        <h2 class="text-2xl font-bold">Add Knowledge</h2>
        <p class="text-muted-foreground">
            Upload documents or paste text to ground your agent.
        </p>
    </div>

    <div
        class="border-2 border-dashed rounded-xl p-12 text-center space-y-4 hover:bg-muted/50 cursor-pointer transition-colors"
    >
        <div
            class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary"
        >
            <Upload size={32} />
        </div>
        <div>
            <p class="font-medium">Click to upload files</p>
            <p class="text-xs text-muted-foreground">
                PDF, TXT, DOCX up to 10MB
            </p>
        </div>
    </div>

    <div class="relative">
        <div
            class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border"
        ></div>
        <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground"
                >Or paste text</span
            >
        </div>
    </div>

    <textarea
        class="w-full min-h-[150px] rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm"
        placeholder="Paste knowledge base content here..."
        bind:value={wizardStore.data.knowledgeBase}
    ></textarea>
</div>
