<script lang="ts">
    import { SignUp } from "svelte-clerk";
</script>

<div
    class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950"
>
    <SignUp path="/sign-up" fallbackRedirectUrl="/app" signInUrl="/sign-in" />
</div>
