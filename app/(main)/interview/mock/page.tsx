import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";

export default function MockInterviewPage(){
    
return(
    <div className="container group mx-auto space-y-4  -mt-20">
      <div className="flex flex-col space-y-2 mx-2 ">
        <Link href="/interview" >
          <Button variant="link" className="gap-2 scroll-pl-2 cursor-pointer ">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          <h1 className="text-6xl font-bold gradient-title">Mock Interview</h1>
            <div
          className="
            h-[3px] w-0 group-hover:w-full
            mt-2 sm:mt-3
            bg-gradient-to-r from-neutral-400 via-neutral-200 to-white
            dark:from-neutral-500 dark:via-neutral-300 dark:to-white
            transition-all duration-700 rounded-full
          "
        />
          <p className="text-muted-foreground">
            Test your knowledge with industry-specific questions
          </p>
        </div>
      </div>
  <Quiz/>

    </div>
)

}