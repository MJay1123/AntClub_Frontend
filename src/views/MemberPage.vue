<template>
    <div>
        <h1>Member List Page</h1>
        <ul v-for="member in members" :key="member.id">
            <li>이름 : {{ member.name }}</li>
            <li>학교 : {{ member.school }}</li>
            <li>생일 : {{ member.birthday }}</li>
            <li>학번 : {{ member.student_number }}</li>
            <li>성별 : {{ member.gender }}</li>
            <li>전화번호 : {{ member.phone_number }}</li>
            <li>등록일 : {{ member.created_at }}</li>
            <li>가입일 : {{ member.joined_at }}</li>
            <li>전공 : {{ member.major }}</li>
            <li>상태 : {{ member.status }}</li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const members = ref([
    {
        id: 1,
        name: '서민종',
        school: '한양대학교',
        birthday: '1997-02-26',
        student_number: '2017027229',
        gender: '남',
        phone_number: '010-2643-7581',
        created_at: '2026-06-04',
        joined_at: '2017-09-01',
        major: '자원환경공학과',
        status: '졸업'
    },
    {
        id: 2,
        name: '이원석',
        school: '한양대학교',
        birthday: '1998-02-05',
        student_number: '2017027292',
        gender: '남',
        phone_number: '010-9915-7609',
        created_at: '2026-06-04',
        joined_at: '2017-09-01',
        major: '자원환경공학과',
        status: '졸업'
    },
])
</script>

<style lang="scss" scoped>

</style>