import { defineStore } from "pinia"
import { clubMemberApi } from "@/api/restApi"
import { ref } from "vue"
import { useUiStore } from "./ui"

const uiStore = useUiStore()

export const useClubMemberStore = defineStore('club-member', () => {
    const clubMembers = ref([])
    const approvedMembers = ref([])
    const pendingMembers = ref([])
    const presidentMember = ref(null)
    const executiveMembers = ref([])

    const clubMember = ref(null)
    const myClubMember = ref(null)

    const fetchClubMembers = async(clubId) => {
        console.log('clubMember.js - fetchClubMembers')
        uiStore.isLoading = true
        clubMembers.value = []
        approvedMembers.value = []
        pendingMembers.value = []
        try {
            const response = await clubMemberApi.getClubMembers(clubId)
            console.log('response', response)
            clubMembers.value = response.data
            approvedMembers.value = response.data.filter(m => m.status === 'APPROVED')
            pendingMembers.value = response.data.filter(m => m.status === 'PENDING')
            presidentMember.value = response.data.find(m => m.clubRole === 'PRESIDENT')
            executiveMembers.value = response.data.filter(m => m.clubRole === 'EXECUTIVE')
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    const fetchClubMemberByClubIdAndMemberId = async (clubId, memberId) => {
        console.log('clubMember.js - fetchClubMemberByClubIdAndMemberId')
        uiStore.isLoading = true
        clubMember.value = null
        try {
            const response = await clubMemberApi.getClubMember(clubId, memberId)
            console.log('response', response)
            clubMember.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    const fecthClubMemberByClubMemberId = async (clubMemberId) => {
        console.log('clubMember.js - fecthClubMemberByClubMemberId')
        uiStore.isLoading = true
        clubMember.value = null
        try {
            const response = await clubMemberApi.getClubMemberByClubMemberId(clubMemberId)
            console.log('response', response)
            clubMember.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    const fetchMe = async (clubId) => {
        console.log('clubMember.js - fetchMe')
        uiStore.isLoading = true
        myClubMember.value = null
        const memberId = localStorage.getItem('memberId')
        try {
            const response = await clubMemberApi.getClubMember(clubId, memberId)
            console.log('response', response)
            myClubMember.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    return {
        clubMembers, approvedMembers, pendingMembers,
        presidentMember, executiveMembers,
        clubMember, myClubMember,
        fetchClubMembers,
        fetchClubMemberByClubIdAndMemberId, fecthClubMemberByClubMemberId,
        fetchMe
    }
})