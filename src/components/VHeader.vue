<template>
    <div>
        <h1>Header</h1>
        <nav>
            <RouterLink :to="{ name: 'main' }">Main</RouterLink>
            <span> | </span>
            <RouterLink :to="{ name: 'major-list' }">Majors</RouterLink>
            <span> | </span>
            <RouterLink :to="{ name: 'member-list' }">Members</RouterLink>
        </nav>
        <hr>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

</script>

<style lang="scss" scoped></style>