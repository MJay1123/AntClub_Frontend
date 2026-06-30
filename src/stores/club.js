import { defineStore } from "pinia";
import { ref } from "vue";
import { clubApi } from "@/api/restApi";

export const useClubStore = defineStore("club", () => {
    const allClubs = ref([])
    const myClubs = ref([])
    const joinedClubs = ref([])
    const pendingClubs = ref([])
    const memberClubs = ref([])
    const club = ref(null)
    
    const fetchAllClubs = async () => {
        console.log('club.js - fetchAllClubs')
        try {
            const response = await clubApi.getClubListAll()
            console.log('response', response)
            allClubs.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }

    const fetchMyClubs = async() => {
        console.log('club.js - fetchMyClubs')
        try {
            const memberId = localStorage.getItem('memberId')
            const response = await clubApi.getMemberClubs(memberId)
            console.log('response', response)

            myClubs.value = response.data

            joinedClubs.value = myClubs.value.filter(
                club => club.joinedStatus === 'APPROVED'
            )

            pendingClubs.value = myClubs.value.filter(
                club => club.joinedStatus === 'PENDING'
            )

        } catch (error) {
            console.log('error', error)
        }
    }
    
    const fetchMemberClubs = async(memberId) => {
        console.log('club.js - fetchMemberClubs')
        try {
            const response = await clubApi.getMemberClubs(memberId)
            console.log('response', response)
            memberClubs.value = response.data
        } catch (error) {
            console.log('error', error)
        }   
    }

    const fetchClub = async(clubId) => {
        console.log('club.js - fetchClub')
        try {
            const response = await clubApi.getClub(clubId)
            console.log('response', response)
            club.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }
    return {
        allClubs, myClubs, joinedClubs, pendingClubs, memberClubs, club,
        fetchAllClubs, fetchMyClubs, fetchMemberClubs, fetchClub
    }
});
