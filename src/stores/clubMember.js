import { defineStore } from "pinia"
import { clubMemberApi } from "@/api/restApi"
import { ref } from "vue"

export const useClubMemberStore = defineStore('club-member', () => {
    const clubMembers = ref([])
    const approvedMembers = ref([])
    const pendingMembers = ref([])
    const clubMember = ref(null)
    const myClubMember = ref(null)
    const presidentMember = ref(null)
    const executiveMembers = ref([])

    const fetchClubMembers = async(clubId) => {
        console.log('clubMember.js - fetchClubMembers')
        try {
            const response = await clubMemberApi.getClubMembers(clubId)
            console.log('response', response)
            clubMembers.value = response.data
            approvedMembers.value = response.data.filter(m => m.status === 'APPROVED')
            pendingMembers.value = response.data.filter(m => m.status === 'PENDING')

            presidentMember.value = response.data.find(m => m.clubRole === 'PRESIDENT')
            console.log('presidentMember', presidentMember)
            executiveMembers.value = response.data.filter(m => m.clubRole === 'EXECUTIVE')
            console.log('executiveMembers', executiveMembers)
        } catch (error) {
            console.log('error', error)
        }
    }

    const fetchClubMemberByClubIdAndMemberId = async (clubId, memberId) => {
        console.log('clubMember.js - fetchClubMemberByClubIdAndMemberId')
        clubMember.value = null
        try {
            const response = await clubMemberApi.getClubMember(clubId, memberId)
            console.log('response', response)
            clubMember.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }

    const fecthClubMemberByClubMemberId = async (clubMemberId) => {
        console.log('clubMember.js - fecthClubMemberByClubMemberId')
        clubMember.value = null
        try {
            const response = await clubMemberApi.getClubMemberByClubMemberId(clubMemberId)
            console.log('response', response)
            clubMember.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }

    const fetchMe = async (clubId) => {
        console.log('clubMember.js - fetchMe')
        const memberId = localStorage.getItem('memberId')
        try {
            myClubMember.value = null
            const response = await clubMemberApi.getClubMember(clubId, memberId)
            console.log('response', response)
            myClubMember.value = response.data
        } catch (error) {
            console.log('error', error)
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