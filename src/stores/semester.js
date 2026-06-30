import { defineStore } from "pinia"
import { semesterApi } from "@/api/restApi"
import { ref } from "vue"

export const useSemesterStore = defineStore('semester', () => {
    const semesters = ref([])
    const currentSemester = ref(null)
    const semester = ref(null)

    const fetchSemesters = async (clubId) => {
        console.log('semester.js - fetchSemesters')
        try {
            const response = await semesterApi.getSemesters(clubId)
            console.log('response', response)
            semesters.value = response.data
            currentSemester.value = response.data.find(s => s.isCurrent)
            console.log('currentSemester', currentSemester.value)
        } catch (error) {
            console.log('error', error)
        }
    }

    const fetchSemester = async (semesterId) => {
        console.log('semester.js - fetchSemester')
        try {
            const response = semesterApi.getSemester(semesterId)
            console.log('response', response)
            semester.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }

    return {
        semesters, currentSemester, semester,
        fetchSemesters, fetchSemester
    }
})