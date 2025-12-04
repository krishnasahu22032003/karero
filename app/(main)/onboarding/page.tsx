import {industries} from "../../../data/industry-data"
import OnboardingForm from "./_components/onboarding-form"
export default function OnBoarding(){
    return (
        <main>
            <OnboardingForm industries={industries}/>
        </main>
    )
}