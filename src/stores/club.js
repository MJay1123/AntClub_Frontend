import { defineStore } from "pinia";
import { ref } from "vue";
import { clubApi } from "@/api/restApi";
import { useUiStore } from "./ui";

export const useClubStore = defineStore("club", () => {
    const uiStore = useUiStore()

    const allClubs = ref([])

    const myClubs = ref([])
    const joinedClubs = ref([])
    const pendingClubs = ref([])

    const memberClubs = ref([])
    const club = ref(null)
    
    const fetchAllClubs = async () => {
        console.log('club.js - fetchAllClubs')
        uiStore.isLoading = true
        allClubs.value = []
        try {
            const response = await clubApi.getClubListAll()
            console.log('response', response)
            allClubs.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    const fetchMyClubs = async() => {
        console.log('club.js - fetchMyClubs')
        uiStore.isLoading = true
        myClubs.value = []
        joinedClubs.value = []
        pendingClubs.value = []
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
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }
    
    const fetchMemberClubs = async(memberId) => {
        console.log('club.js - fetchMemberClubs')
        uiStore.isLoading = true
        memberClubs.value = []
        try {
            const response = await clubApi.getMemberClubs(memberId)
            console.log('response', response)
            memberClubs.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    const fetchClub = async(clubId) => {
        console.log('club.js - fetchClub')
        uiStore.isLoading = true
        club.value = null
        try {
            const response = await clubApi.getClub(clubId)
            console.log('response', response)
            club.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }
    return {
        allClubs,
        myClubs, joinedClubs, pendingClubs,
        memberClubs, club,
        fetchAllClubs, fetchMyClubs, fetchMemberClubs, fetchClub
    }
});
