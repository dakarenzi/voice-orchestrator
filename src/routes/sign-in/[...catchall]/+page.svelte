<script lang="ts">
    import { SignIn } from "svelte-clerk";
</script>

<div
    class="flex items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-950"
>
    <SignIn path="/sign-in" fallbackRedirectUrl="/app" signUpUrl="/sign-up" />
</div>
