"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Mail, MapPin, MessageSquare, Phone, Send, User } from "lucide-react"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import axios from "axios"

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Enter a valid email address."),
    message: z.string().min(10, "Message must be at least 10 characters.").max(1000, "Message is too long"),
})

type ContactFormType = z.infer<typeof contactFormSchema>

const ContactUsPage = () => {
    const [loading, setLoading] = useState(false)

    const form = useForm<ContactFormType>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    })

    const onSubmit = async (data: ContactFormType) => {
        setLoading(true)
        try {
            const results = await axios.post(`/api/contact-us`, data)

            if (results.data.success) {
                toast.success("Message Sent", {
                    description: "We’ve received your message and will get back to you shortly.",
                })

                form.reset()
                return
            }

            toast.error("Something went wrong!", {
                description: results.data.message
            })

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Something went wrong", {
                description: "Please try again later.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-10">
            <div className="space-y-6 text-left">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-light-100 mb-3">Get in Touch</h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
                    <p className="text-light-300 mt-4 leading-relaxed">
                        Ready to start your next project? We&apos;re here to help bring your ideas to life.

                    </p>
                </div>

                <div className="space-y-4">
                    <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                                <Mail className="text-primary w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-light-100 mb-1">Email Address</p>
                                <p className="text-light-300 text-sm">contact@devamit.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                                <Phone className="text-primary w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-light-100 mb-1">Phone Number</p>
                                <p className="text-light-300 text-sm">+91 12345 67890</p>
                            </div>
                        </div>
                    </div>

                    <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                                <MapPin className="text-primary w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-light-100 mb-1">Office Location</p>
                                <p className="text-light-300 text-sm">Dev University, Hazaribagh, Jharkhand</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-xl border border-primary/20">
                    <h3 className="text-lg font-semibold text-light-100 mb-2">Quick Response</h3>
                    <p className="text-light-300 text-sm leading-relaxed">
                        We typically respond to all inquiries within 24 hours. For urgent matters,
                        please call us directly.
                    </p>
                </div>
            </div>

            <div className="w-full mt-5 md:mt-0">
                <div className="mb-8 text-left">
                    <h2 className="text-3xl font-bold text-light-100 mb-3">Send us a Message</h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
                    <p className="text-light-300 mt-4 leading-relaxed">
                        Fill out the form below and we&apos;ll get back to you as soon as possible.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 shadow-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                            <div className="flex gap-5 justify-between">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-light-100 mb-2 font-medium flex items-center gap-2">
                                                <User className="w-4 h-4 text-primary" />
                                                Name
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <Input
                                                        {...field}
                                                        placeholder="Your full name"
                                                        className="form-input min-h-12 bg-gray-900/50 border-gray-600/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-gray-500/50"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-light-100 mb-2 font-medium flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-primary" />
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="form-input min-h-12 bg-gray-900/50 border-gray-600/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-gray-500/50"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-light-100 mb-2 font-medium flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                            Message
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Textarea
                                                    {...field}
                                                    rows={5}
                                                    placeholder="Tell us about your project or ask any questions..."
                                                    className="form-input min-h-32 resize-none bg-gray-900/50 border-gray-600/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-gray-500/50"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full min-h-12 bg-gradient-to-r from-primary to-primary-admin hover:from-primary/90 hover:to-primary-admin/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            <span>Sending Message...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-light-400 text-sm mt-4">
                                    We respect your privacy and will never share your information.
                                </p>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ContactUsPage;
