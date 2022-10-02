<script setup lang="ts">
import Logo from '../components/Logo.vue';
import AppVersion from '../components/AppVersion.vue';
</script>

<template>
    <div class="home-container">
        <Logo />

        <slot />

        <AppVersion />
    </div>
</template>