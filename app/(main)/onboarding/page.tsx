import {industries} from "../../../data/industry-data"
import OnboardingForm from "./_components/onboarding-form"
import { getUserOnboardingStatus } from "@/actions/user"
import { redirect } from "next/navigation";

export default async function OnBoarding(){

    const {isOnboarded} =await getUserOnboardingStatus()

 
  if (isOnboarded) redirect("/dashboard");
    return (
        <main>
            <OnboardingForm industries={industries}/>
         
        </main>
    )
}