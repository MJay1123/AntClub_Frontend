import { defineStore } from "pinia";
import { ref } from "vue";
import { schoolApi } from "@/api/restApi";

export const useSchoolStore = defineStore("school", () => {
    const schools = ref([])
    
    const fetchSchools = async () => {
        try {
            const response = await schoolApi.getSchoolList()
            console.log('fetchSchools - response', response)
            schools.value = response.data
        } catch (error) {
            console.log('school.js - fetchSchools :', error)
        }
    }
    return {
        schools,
        fetchSchools,
    }
});
