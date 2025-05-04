"use client"

import AuthForm from "@/components/AuthForm"
import { signUP } from "@/lib/actions/auth"
import { signUpSchema } from "@/lib/validations"

const SignUpPage = () => (
    <AuthForm
        type="SIGN_UP"
        schema={signUpSchema}
        defaultValues={{
            email: "",
            password: "",
            fullName: "",
            universityId: 0,
            universityCard: "",
        }}
        onSubmit={signUP}
    />
)
export default SignUpPage