"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
  Clock,
  Truck,
  Shield,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AboutPage() {
  // Company timeline data
  const timelineEvents = [
    {
      year: "2008",
      title: "Small Beginning",
      description:
        "MODRN was founded in a small studio apartment with a vision to make modern design accessible.",
    },
    {
      year: "2012",
      title: "First Showroom",
      description:
        "Opened our first physical location in downtown, showcasing our curated collections.",
    },
    {
      year: "2014",
      title: "Going Digital",
      description:
        "Launched our e-commerce platform to reach customers nationwide.",
    },
    {
      year: "2017",
      title: "International Expansion",
      description:
        "Began offering international shipping and opened our second showroom.",
    },
    {
      year: "2022",
      title: "Today",
      description:
        "Growing team of 50+ design enthusiasts serving customers worldwide.",
    },
  ];

  // Team members data
  const teamMembers = [
    {
      name: "Alex Wan",
      position: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
      bio: "Former architect with a passion for accessible design",
    },
    {
      name: "Sarah Johnson",
      position: "Design Director",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      bio: "Award-winning designer with 10+ years of experience",
    },
    {
      name: "Miguel Rodriguez",
      position: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      bio: "Supply chain expert ensuring quality manufacturing",
    },
    {
      name: "Leila Patel",
      position: "Customer Experience",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      bio: "Dedicated to creating exceptional customer journeys",
    },
  ];

  // FAQ data
  const faqItems = [
    {
      question: "What makes MODRN different from other furniture retailers?",
      answer:
        "We prioritize sustainable materials, ethical manufacturing, and timeless design that lasts. Every piece is carefully curated or designed in-house with a focus on quality craftsmanship.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! We currently ship to over 30 countries worldwide. Shipping rates and delivery times vary by location. You can view specific details during checkout.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy on most items. Custom pieces and final sale items cannot be returned. All returned items must be in original condition with original packaging.",
    },
    {
      question: "Do you offer assembly services?",
      answer:
        "Yes, we offer professional assembly services in select locations. You can add this service during checkout if it's available in your area.",
    },
    {
      question: "How do I care for my MODRN furniture?",
      answer:
        "Each piece comes with specific care instructions. Generally, we recommend regular dusting, avoiding direct sunlight for extended periods, and using coasters for drinks.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Header - About Us Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-48 bg-amber-50/40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-zinc-100 rounded-full"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-200">
                Established 2011
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Our story and mission
              </h1>
              <p className="text-xl text-zinc-600 mb-8">
                We believe that beautiful, functional design should be accessible
                to everyone. Our journey is about bringing thoughtfully crafted
                pieces into your everyday life.
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-black hover:bg-zinc-800"
                >
                  Meet Our Team
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-zinc-300"
                >
                  Our Collections
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section with Image */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <Image
                  src="https://images.unsplash.com/photo-1577128172214-5ee8be4427e7?q=80&w=1974&auto=format&fit=crop"
                  alt="MODRN Showroom"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/2">
              <span className="text-amber-600 font-medium">Our Vision</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                Transforming spaces into expressions of your unique style
              </h2>
              <p className="text-zinc-600 mb-6">
                At MODRN, we believe that the spaces where we live, work, and
                gather should reflect our personalities and aspirations. Our
                carefully curated collections blend functionality with aesthetic
                beauty, allowing you to create environments that inspire.
              </p>
              <p className="text-zinc-600 mb-8">
                Each piece in our collection is thoughtfully designed and crafted
                to stand the test of time, both in durability and style. We
                partner with skilled artisans and ethical manufacturers who share
                our commitment to quality and sustainability.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Timeless Design</h3>
                    <p className="text-sm text-zinc-600">
                      Pieces that transcend trends and remain relevant for years
                      to come
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Quality Craftsmanship</h3>
                    <p className="text-sm text-zinc-600">
                      Durable materials and expert craftsmanship for lasting
                      enjoyment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">
              What We Stand For
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Core Values
            </h2>
            <p className="text-zinc-600">
              These principles guide every decision we make, from design to
              delivery, and shape how we interact with our customers, partners,
              and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sustainability",
                description:
                  "We're committed to reducing our environmental footprint through responsible sourcing and plastic-free packaging.",
                icon: <Users className="h-8 w-8 text-amber-500" />,
              },
              {
                title: "Accessibility",
                description:
                  "Beautiful design shouldn't be exclusive. We strive to make thoughtful pieces accessible at fair prices.",
                icon: <Shield className="h-8 w-8 text-amber-500" />,
              },
              {
                title: "Innovation",
                description:
                  "We continuously explore new materials, production techniques, and designs to push boundaries.",
                icon: <Truck className="h-8 w-8 text-amber-500" />,
              },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-zinc-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-zinc-50/70">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">
              The People Behind MODRN
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Meet Our Team
            </h2>
            <p className="text-zinc-600">
              Our diverse team brings together expertise from design, crafting,
              and customer experience to create the perfect MODRN experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-amber-600 text-sm mb-3">
                      {member.position}
                    </p>
                    <p className="text-zinc-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-amber-200 to-amber-100 text-amber-800">
              Our Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The MODRN Timeline
            </h2>
            <p className="text-zinc-600">
              From humble beginnings to where we are today, our journey has been
              guided by a passion for beautiful, accessible design.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto pt-8">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-zinc-200"></div>

            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative mb-16 ${
                  index % 2 === 0
                    ? "md:ml-auto md:mr-[50%] md:pl-8 md:pr-0"
                    : "md:mr-auto md:ml-[50%] md:pr-8 md:pl-0"
                } w-full md:w-[45%]`}
              >
                <div className="absolute top-5 left-1/2 md:left-auto md:right-0 transform translate-x-[-50%] md:translate-x-[50%] w-4 h-4 rounded-full bg-amber-500 border-4 border-amber-100"></div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-3">
                    {event.year}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-zinc-600">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Frequently Asked Questions</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Common Questions
              </h2>
              <p className="text-zinc-600">
                Get answers to some of the questions we hear most often from our
                customers.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-white/20 text-white mb-4 backdrop-blur-sm">
                  Get In Touch
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Have questions? We're here to help.
                </h2>
                <p className="text-white/90 mb-8 max-w-md">
                  Our team of design experts is available to answer your questions,
                  provide styling advice, or help with custom orders.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white">support@modrn.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white">
                      123 Design Street, New York, NY 10001
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-medium text-white mb-6">
                  Send us a message
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  ></textarea>
                  <Button
                    size="lg"
                    className="w-full bg-white text-amber-600 hover:bg-white/90"
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white pt-16 pb-8">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">MODRN.</h3>
              <p className="text-zinc-600 mb-6 max-w-md">
                Curated home decor and furniture collections that blend modern
                aesthetics with timeless craftsmanship.
              </p>
              <div className="flex gap-4">
                {["facebook", "instagram", "pinterest", "twitter"].map(
                  (social) => (
                    <Link
                      href={`#${social}`}
                      key={social}
                      className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200"
                    >
                      <span className="sr-only">{social}</span>
                      <i className={`icon-${social}`}></i>
                    </Link>
                  )
                )}
              </div>
            </div>

            {["Shop", "Company", "Support"].map((category) => (
              <div key={category}>
                <h3 className="font-medium mb-4">{category}</h3>
                <ul className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                      <Link
                        href="#"
                        className="text-zinc-600 hover:text-black transition-colors"
                      >
                        {
                          [
                            "New Arrivals",
                            "Best Sellers",
                            "Sale",
                            "Collections",
                            "About Us",
                            "Contact",
                            "FAQ",
                            "Shipping",
                          ][i + (category === "Company" ? 4 : 0)]
                        }
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-500 text-sm mb-4 md:mb-0">
              © 2023 MODRN. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-zinc-500 text-sm hover:text-black">
                Privacy Policy
              </Link>
              <Link href="#" className="text-zinc-500 text-sm hover:text-black">
                Terms of Service
              </Link>
              <Link href="#" className="text-zinc-500 text-sm hover:text-black">
                Cookies Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
