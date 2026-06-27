<template>
    <div>
        <h1>Major List Page</h1>
        <ul v-for="major in majors" :key="major.id">
            <li>{{ major.name }}</li>
            <li>{{ major.school }}</li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const majors = ref([
    {
        id: 1,
        name: '자원환경공학과',
        school: '한양대학교'
    },
    {
        id: 2,
        name: 'major1',
        school: '한양대학교'
    },
    {
        id: 3,
        name: 'major2',
        school: '한양대학교'
    },
    {
        id: 4,
        name: 'major3',
        school: '한양대학교'
    },
    {
        id: 5,
        name: 'major4',
        school: '한양대학교'
    },
    {
        id: 6,
        name: 'major5',
        school: '한양대학교'
    },
])
</script>

<style lang="scss" scoped>

</style>