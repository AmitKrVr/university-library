"use client"

import AuthForm from "@/components/AuthForm"
import { signInWithCrendentials } from "@/lib/actions/auth"
import { signInSchema } from "@/lib/validations"

const SignInPage = () => (
    <AuthForm
        type="SIGN_IN"
        schema={signInSchema}
        defaultValues={{
            email: "",
            password: "",
        }}
        onSubmit={signInWithCrendentials}
    />
)
export default SignInPage