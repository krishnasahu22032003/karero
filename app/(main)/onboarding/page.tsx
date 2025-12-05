import {industries} from "../../../data/industry-data"
import OnboardingForm from "./_components/onboarding-form"
import { getUserOnboardingStatus } from "@/actions/user"


export default async function OnBoarding(){

    const {isOnboarded} =await getUserOnboardingStatus()

    if(isOnboarded){
        
    }

    return (
        <main>
            <OnboardingForm industries={industries}/>
            <div>Onboarded</div>
        </main>
    )
}